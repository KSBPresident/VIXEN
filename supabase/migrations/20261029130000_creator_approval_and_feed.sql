-- Pre-account creator review and approved creator feed publishing.
create table if not exists public.creator_preapplications (
  id uuid primary key default gen_random_uuid(),
  email text not null check (email = lower(btrim(email)) and length(email) <= 320),
  display_name text not null check (length(btrim(display_name)) between 1 and 80),
  bio text not null default '' check (length(bio) <= 500),
  applicant_is_adult_woman boolean not null check (applicant_is_adult_woman),
  accepts_creator_terms boolean not null check (accepts_creator_terms),
  status text not null default 'pending' check (status in ('pending','approved','rejected','claimed')),
  review_note text check (review_note is null or length(review_note) <= 500),
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  invite_token_hash text,
  created_at timestamptz not null default now()
);

create unique index if not exists creator_preapplications_active_email_uidx
  on public.creator_preapplications (email) where status in ('pending','approved');
create index if not exists creator_preapplications_queue_idx
  on public.creator_preapplications (created_at desc) where status = 'pending';

alter table public.creator_preapplications enable row level security;
revoke all on public.creator_preapplications from public, anon, authenticated;
grant insert on public.creator_preapplications to anon, authenticated;
grant select, update on public.creator_preapplications to authenticated;

create policy "creator applicants may submit applications"
  on public.creator_preapplications for insert to anon, authenticated
  with check (
    status = 'pending'
    and reviewed_by is null
    and reviewed_at is null
    and invite_token_hash is null
    and applicant_is_adult_woman
    and accepts_creator_terms
  );

create policy "vixen admins review creator applications"
  on public.creator_preapplications for all to authenticated
  using (public.is_vixen_admin())
  with check (public.is_vixen_admin());

create table if not exists public.creator_posts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  caption text not null default '' check (length(caption) <= 2000),
  media_path text,
  media_type text check (media_type is null or media_type in ('image/jpeg','image/png','image/webp','video/mp4','video/webm')),
  status text not null default 'published' check (status in ('published','hidden')),
  created_at timestamptz not null default now(),
  constraint creator_posts_have_content check (length(btrim(caption)) > 0 or media_path is not null),
  constraint creator_posts_media_pair check ((media_path is null) = (media_type is null)),
  constraint creator_posts_owned_path check (media_path is null or media_path like creator_id::text || '/post-%')
);
create index if not exists creator_posts_public_feed_idx
  on public.creator_posts (creator_id, created_at desc) where status = 'published';

alter table public.creator_posts enable row level security;
revoke all on public.creator_posts from public, anon, authenticated;
grant select on public.creator_posts to anon, authenticated;
grant insert, update, delete on public.creator_posts to authenticated;

create policy "published creator posts are public"
  on public.creator_posts for select to anon, authenticated
  using (status = 'published');
create policy "approved creators manage own posts"
  on public.creator_posts for all to authenticated
  using (creator_id = (select auth.uid()) and exists (
    select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_creator = true
  ))
  with check (creator_id = (select auth.uid()) and exists (
    select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_creator = true
  ));
create policy "vixen admins manage creator posts"
  on public.creator_posts for all to authenticated
  using (public.is_vixen_admin())
  with check (public.is_vixen_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('creator-feed-media','creator-feed-media',true,47185920,
  array['image/jpeg','image/png','image/webp','video/mp4','video/webm'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "approved creators upload own feed media"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'creator-feed-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (storage.foldername(name))[2] like 'post-%'
    and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_creator = true)
  );
create policy "approved creators replace own feed media"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'creator-feed-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_creator = true)
  )
  with check (
    bucket_id = 'creator-feed-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_creator = true)
  );
create policy "approved creators delete own feed media"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'creator-feed-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_creator = true)
  );

create or replace function public.claim_creator_invitation(p_application_id uuid, p_token text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  app public.creator_preapplications%rowtype;
  account_email text;
begin
  if auth.uid() is null or p_token is null or length(p_token) < 32 or length(p_token) > 200 then
    return false;
  end if;
  select lower(btrim(u.email)) into account_email
  from auth.users u
  where u.id = auth.uid() and u.email_confirmed_at is not null;

  if account_email is null then
    return false;
  end if;

  select * into app
  from public.creator_preapplications a
  where a.id = p_application_id
    and a.email = account_email
    and a.status = 'approved'
    and a.invite_token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex')
  for update;

  if not found then
    return false;
  end if;

  update public.profiles
    set is_creator = true,
        display_name = app.display_name,
        bio = app.bio
  where id = auth.uid();

  insert into public.creator_applications (user_id, status, reviewed_at)
  values (auth.uid(), 'approved', app.reviewed_at)
  on conflict (user_id) do update
    set status = 'approved', reviewed_at = excluded.reviewed_at;

  update public.creator_preapplications
    set status = 'claimed', invite_token_hash = null
  where id = app.id;

  return true;
end;
$$;
revoke all on function public.claim_creator_invitation(uuid,text) from public, anon;
grant execute on function public.claim_creator_invitation(uuid,text) to authenticated;
