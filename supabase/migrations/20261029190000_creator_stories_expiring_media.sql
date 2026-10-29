-- Private, expiring creator stories. Story media is never placed in the public feed bucket.
create table if not exists public.creator_stories (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  caption text not null default '' check (char_length(caption) <= 500),
  media_path text not null,
  media_type text not null check (media_type in ('image/jpeg','image/png','image/webp','video/mp4','video/webm')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint creator_stories_path check (
    media_path like creator_id::text || '/story-%'
  ),
  constraint creator_stories_expiry check (
    expires_at > created_at and expires_at <= created_at + interval '24 hours'
  )
);

create index if not exists creator_stories_active_creator_idx
  on public.creator_stories (creator_id, expires_at desc);

alter table public.creator_stories enable row level security;
revoke all on public.creator_stories from public, anon, authenticated;
grant select on public.creator_stories to authenticated;
grant insert, delete on public.creator_stories to authenticated;

create policy "members view active creator stories"
  on public.creator_stories for select to authenticated
  using (expires_at > now());

create policy "creators read their stories"
  on public.creator_stories for select to authenticated
  using (
    creator_id = (select auth.uid())
    and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_creator is true)
  );

create policy "approved creators publish their stories"
  on public.creator_stories for insert to authenticated
  with check (
    creator_id = (select auth.uid())
    and expires_at > now()
    and expires_at <= now() + interval '24 hours'
    and media_path like (select auth.uid())::text || '/story-%'
    and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_creator is true)
  );

create policy "creators delete their stories"
  on public.creator_stories for delete to authenticated
  using (
    creator_id = (select auth.uid())
    and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_creator is true)
  );

create policy "vixen admins manage creator stories"
  on public.creator_stories for all to authenticated
  using (public.is_vixen_admin())
  with check (public.is_vixen_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('creator-story-media','creator-story-media',false,47185920,
  array['image/jpeg','image/png','image/webp','video/mp4','video/webm'])
on conflict (id) do update
  set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "approved creators upload own story media"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'creator-story-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and storage.filename(name) like 'story-%'
    and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_creator is true)
  );

create policy "approved creators replace own story media"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'creator-story-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_creator is true)
  )
  with check (
    bucket_id = 'creator-story-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and storage.filename(name) like 'story-%'
    and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_creator is true)
  );

create policy "creators delete own story media"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'creator-story-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_creator is true)
  );

create policy "members sign active story media"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'creator-story-media'
    and exists (
      select 1 from public.creator_stories s
      where s.media_path = storage.objects.name
        and s.expires_at > now()
    )
  );

create policy "vixen admins review story media"
  on storage.objects for select to authenticated
  using (bucket_id = 'creator-story-media' and public.is_vixen_admin());

create policy "vixen admins delete story media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'creator-story-media' and public.is_vixen_admin());
