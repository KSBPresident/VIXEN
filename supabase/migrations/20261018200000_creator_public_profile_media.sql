-- Editable public profile fields for approved creators.
alter table public.profiles
  add column if not exists bio text,
  add column if not exists cover_url text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_bio_max_length'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_bio_max_length
      check (bio is null or char_length(bio) <= 500);
  end if;
end;
$$;

-- Preserve column-level control: members cannot update is_creator, while approved
-- creators may edit only their public profile fields through the existing RLS row policy.
grant update (bio, cover_url) on table public.profiles to authenticated;
revoke update (is_creator, id, created_at) on table public.profiles from authenticated;

-- Profile photos and cover images are public assets. Uploads/deletes still require
-- an authenticated, approved creator and a path rooted in that creator's auth user ID.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'creator-profile-media',
  'creator-profile-media',
  true,
  47185920,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set name = excluded.name,
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "approved creators upload own profile media" on storage.objects;
create policy "approved creators upload own profile media"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'creator-profile-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (
      select 1
      from public.profiles p
      where p.id = (select auth.uid())
        and p.is_creator is true
    )
  );

drop policy if exists "approved creators delete own profile media" on storage.objects;
create policy "approved creators delete own profile media"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'creator-profile-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (
      select 1
      from public.profiles p
      where p.id = (select auth.uid())
        and p.is_creator is true
    )
  );
