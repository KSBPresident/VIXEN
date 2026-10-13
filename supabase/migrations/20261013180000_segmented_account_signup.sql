-- Public signup may request a creator application, but never grants creator privileges.
-- Active creator access remains a separate review and verification decision.

create table if not exists public.creator_applications (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

alter table public.creator_applications enable row level security;
revoke all on table public.creator_applications from public, anon, authenticated;
grant select on table public.creator_applications to authenticated;

drop policy if exists "creator applicants read own status" on public.creator_applications;
create policy "creator applicants read own status"
  on public.creator_applications
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;

  -- User-editable metadata creates only a pending application. It is not
  -- consulted by policies and never sets profiles.is_creator or another role.
  if new.raw_user_meta_data ->> 'vixen_account_type' = 'creator' then
    insert into public.creator_applications (user_id)
    values (new.id)
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$function$;

create or replace function public.prevent_unprivileged_creator_role_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if new.is_creator is distinct from old.is_creator
     and coalesce(auth.role(), '') in ('anon', 'authenticated') then
    raise exception 'Creator access must be granted through the trusted review process'
      using errcode = '42501';
  end if;

  return new;
end;
$function$;

drop trigger if exists protect_creator_role_changes on public.profiles;
create trigger protect_creator_role_changes
  before update of is_creator on public.profiles
  for each row execute function public.prevent_unprivileged_creator_role_change();
