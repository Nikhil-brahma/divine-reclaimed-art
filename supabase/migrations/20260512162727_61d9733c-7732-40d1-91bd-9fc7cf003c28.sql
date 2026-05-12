
DROP POLICY IF EXISTS "Editors can insert overrides" ON public.content_overrides;
DROP POLICY IF EXISTS "Editors can update overrides" ON public.content_overrides;
DROP POLICY IF EXISTS "Editors can delete overrides" ON public.content_overrides;

CREATE POLICY "Anyone can insert overrides" ON public.content_overrides
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update overrides" ON public.content_overrides
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete overrides" ON public.content_overrides
  FOR DELETE TO anon, authenticated USING (true);
