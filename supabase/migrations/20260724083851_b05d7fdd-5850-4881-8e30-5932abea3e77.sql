CREATE OR REPLACE FUNCTION public.is_editor(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT private.is_editor(_user_id);
$$;

REVOKE ALL ON FUNCTION public.is_editor(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_editor(uuid) TO service_role;