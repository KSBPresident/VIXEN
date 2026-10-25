-- Match database policy checks to the server-side admin allowlist:
-- only the current, email-confirmed account for either configured address is an admin.
CREATE OR REPLACE FUNCTION public.is_vixen_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users AS account
    WHERE account.id = (SELECT auth.uid())
      AND account.email_confirmed_at IS NOT NULL
      AND lower(btrim(coalesce(account.email, ''))) IN (
        'ishmealreyes@proton.me',
        'garvinfrancis@proton.me'
      )
  );
$function$;

REVOKE ALL ON FUNCTION public.is_vixen_admin() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.is_vixen_admin() TO authenticated;
