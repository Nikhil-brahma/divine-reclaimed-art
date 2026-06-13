GRANT EXECUTE ON FUNCTION public.is_editor(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
DELETE FROM auth.users WHERE email = 'dhruvbhatia05@gmail.com';