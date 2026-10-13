-- Public discovery exposes only approved creator rows and public-profile columns.
-- The existing signed-in profile policy and all write policies remain unchanged.
grant select (username, display_name, avatar_url, is_creator)
  on table public.profiles to anon;

drop policy if exists "public approved creators are discoverable"
  on public.profiles;

create policy "public approved creators are discoverable"
  on public.profiles
  for select
  to anon
  using (
    is_creator is true
    and username is not null
    and btrim(username) <> ''
  );
