-- Keep legacy creator approval and the creator role in one transaction.
create or replace function public.review_creator_application(
  p_user_id uuid,
  p_decision text,
  p_identity_verified boolean
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user_id uuid;
begin
  if (select auth.uid()) is null or not public.is_vixen_admin() then
    raise exception 'Administrator access is required'
      using errcode = '42501';
  end if;

  if p_decision not in ('approved', 'rejected') then
    raise exception 'Invalid creator application decision'
      using errcode = '22023';
  end if;

  if p_decision = 'approved' and coalesce(p_identity_verified, false) is not true then
    raise exception 'Age and identity review must be confirmed before approval'
      using errcode = '42501';
  end if;

  update public.creator_applications
  set status = p_decision,
      reviewed_at = now()
  where user_id = p_user_id
    and status = 'pending'
  returning user_id into v_user_id;

  if v_user_id is null then
    return false;
  end if;

  update public.profiles
  set is_creator = (p_decision = 'approved')
  where id = p_user_id;

  if not found then
    raise exception 'Creator profile is missing; approval was not saved'
      using errcode = '23503';
  end if;

  return true;
end;
$function$;

revoke all on function public.review_creator_application(uuid, text, boolean) from public, anon;
grant execute on function public.review_creator_application(uuid, text, boolean) to authenticated;

-- Repair any legacy application previously approved before its profile role saved.
update public.profiles as p
set is_creator = true
from public.creator_applications as application
where application.user_id = p.id
  and application.status = 'approved'
  and p.is_creator is distinct from true;
