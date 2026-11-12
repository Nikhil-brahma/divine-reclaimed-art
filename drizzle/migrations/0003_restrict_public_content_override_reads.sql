DROP POLICY IF EXISTS "Anyone can read overrides" ON public.content_overrides;
CREATE POLICY "Public can read public page overrides"
ON public.content_overrides
FOR SELECT
TO anon, authenticated
USING (page_path !~ '^/(admin|seo-dashboard)(/|$)');
CREATE POLICY "Editors can read all overrides"
ON public.content_overrides
FOR SELECT
TO authenticated
USING (private.is_editor(auth.uid()));