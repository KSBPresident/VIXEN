-- Public signup may request a creator application, but never grants creator privileges.
-- Active creator access remains a separate review and verification decision.
begin;

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

  -- raw_user_meta_data is only used to create a pending application.
  -- It is never used to set profiles.is_creator or any authorization role.
  if new.raw_user_meta_data ->> 'vixen_account_type' = 'creator' then
    insert into public.creator_applications (user_id)
    values (new.id)
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$function$;

commit;
