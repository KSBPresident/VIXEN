-- Trigger functions are invoked by PostgreSQL, not by the browser Data API.
-- They must not be exposed as callable SECURITY DEFINER RPCs.
revoke execute on function public.prevent_unprivileged_creator_role_change()
  from public, anon, authenticated, service_role;
