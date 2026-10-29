alter table public.creator_applications
  add column if not exists adult_creator_attestation boolean not null default false;

revoke insert on table public.creator_applications from authenticated;
grant insert (user_id, adult_creator_attestation) on public.creator_applications to authenticated;

drop policy if exists "members submit own creator application" on public.creator_applications;
create policy "members submit own creator application"
  on public.creator_applications
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and status = 'pending'
    and reviewed_at is null
    and adult_creator_attestation is true
  );

create or replace function public.prevent_unprivileged_creator_role_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if new.is_creator is distinct from old.is_creator
     and coalesce(auth.role(), '') in ('anon', 'authenticated')
     and not public.is_vixen_admin() then
    raise exception 'Creator access must be granted through the trusted review process'
      using errcode = '42501';
  end if;

  return new;
end;
$function$;