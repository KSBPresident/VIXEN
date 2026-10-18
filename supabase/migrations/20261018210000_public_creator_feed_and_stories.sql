-- Public creator updates: stories expire within 24 hours; public feed entries
-- remain accessible to everyone. Paid and member-only publishing is not enabled.
-- The previous profile migration added bio and cover_url; expose only those
-- approved public profile fields through the existing creator discovery policy.
grant select (username, display_name, avatar_url, is_creator, cover_url, bio)
  on table public.profiles to anon;

create table if not exists public.creator_posts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('post', 'story')),
  caption text not null default '',
  media_path text,
  media_type text,
  visibility text not null default 'public' check (visibility = 'public'),
  creator_attested_consent boolean not null default false check (creator_attested_consent is true),
  published_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  constraint creator_posts_caption_max_length check (char_length(caption) <= 2000),
  constraint creator_posts_media_pair check ((media_path is null) = (media_type is null)),
  constraint creator_posts_media_type check (
    media_type is null or media_type in ('image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm')
  ),
  constraint creator_posts_media_owner_path check (
    media_path is null or split_part(media_path, '/', 1) = creator_id::text
  ),
  constraint creator_posts_kind_expiration check (
    (kind = 'post' and expires_at is null)
    or
    (kind = 'story' and expires_at > published_at and expires_at <= published_at + interval '24 hours')
  ),
  constraint creator_posts_has_content check (
    char_length(btrim(caption)) > 0 or media_path is not null
  ),
  constraint creator_posts_story_has_media check (
    kind <> 'story' or media_path is not null
  )
);

create index if not exists creator_posts_creator_published_idx
  on public.creator_posts (creator_id, published_at desc);
create index if not exists creator_posts_story_expiration_idx
  on public.creator_posts (expires_at)
  where kind = 'story';

alter table public.creator_posts enable row level security;
revoke all on table public.creator_posts from anon, authenticated;
grant select, insert, delete on table public.creator_posts to authenticated;

drop policy if exists "creators read own publications" on public.creator_posts;
create policy "creators read own publications"
  on public.creator_posts for select to authenticated
  using (
    creator_id = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.is_creator is true
    )
  );

drop policy if exists "approved creators publish public updates" on public.creator_posts;
create policy "approved creators publish public updates"
  on public.creator_posts for insert to authenticated
  with check (
    creator_id = (select auth.uid())
    and visibility = 'public'
    and creator_attested_consent is true
    and published_at <= now()
    and (
      (kind = 'post' and expires_at is null)
      or
      (kind = 'story' and expires_at > now() and expires_at <= now() + interval '24 hours')
    )
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.is_creator is true
    )
  );

drop policy if exists "creators delete own publications" on public.creator_posts;
create policy "creators delete own publications"
  on public.creator_posts for delete to authenticated
  using (
    creator_id = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.is_creator is true
    )
  );

-- Public RPC returns only approved public profile fields and published public
-- posts or non-expired stories. It never returns account IDs or private rows.
create or replace function public.get_public_creator_feed(
  p_creator_username text default null,
  p_query text default null
)
returns table (
  id uuid,
  username text,
  display_name text,
  avatar_url text,
  cover_url text,
  bio text,
  kind text,
  caption text,
  media_path text,
  media_type text,
  published_at timestamptz,
  expires_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $function$
  select cp.id, p.username, p.display_name, p.avatar_url, p.cover_url, p.bio,
         cp.kind, cp.caption, cp.media_path, cp.media_type, cp.published_at, cp.expires_at
  from public.creator_posts cp
  join public.profiles p on p.id = cp.creator_id
  where p.is_creator is true
    and p.username is not null
    and cp.visibility = 'public'
    and cp.published_at <= pg_catalog.now()
    and (cp.kind = 'post' or (cp.kind = 'story' and cp.expires_at > pg_catalog.now()))
    and (
      p_creator_username is null
      or (
        pg_catalog.char_length(p_creator_username) <= 30
        and pg_catalog.lower(p.username) = pg_catalog.lower(pg_catalog.btrim(p_creator_username))
      )
    )
    and (
      p_query is null
      or (
        pg_catalog.char_length(p_query) <= 80
        and (
          pg_catalog.btrim(p_query) = ''
          or pg_catalog.strpos(
            pg_catalog.lower(pg_catalog.concat_ws(' ', p.username, p.display_name, cp.caption)),
            pg_catalog.lower(pg_catalog.btrim(p_query))
          ) > 0
        )
      )
    )
  order by cp.published_at desc
  limit 60;
$function$;

revoke all on function public.get_public_creator_feed(text, text) from public;
grant execute on function public.get_public_creator_feed(text, text) to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'creator-post-media',
  'creator-post-media',
  true,
  47185920,
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
)
on conflict (id) do update
set name = excluded.name,
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "approved creators upload public post media" on storage.objects;
create policy "approved creators upload public post media"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'creator-post-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.is_creator is true
    )
  );

drop policy if exists "approved creators delete own post media" on storage.objects;
create policy "approved creators delete own post media"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'creator-post-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.is_creator is true
    )
  );
