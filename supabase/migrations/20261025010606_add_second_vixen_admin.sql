CREATE OR REPLACE FUNCTION public.is_vixen_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path TO ''
AS $function$
  SELECT lower(btrim(coalesce(auth.jwt() ->> 'email', ''))) IN (
    'ishmealreyes@proton.me',
    'garvinfrancis@proton.me'
  );
$function$;
