-- Keep the DDL event trigger active while preventing direct execution through the Data API.
-- Event triggers invoke their bound function for database DDL; browser/API roles do not need EXECUTE.
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated, service_role;
