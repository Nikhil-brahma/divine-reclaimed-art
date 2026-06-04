
-- content_overrides: restrict writes to editors only
DROP POLICY IF EXISTS "Anyone can insert overrides" ON public.content_overrides;
DROP POLICY IF EXISTS "Anyone can update overrides" ON public.content_overrides;
DROP POLICY IF EXISTS "Anyone can delete overrides" ON public.content_overrides;

CREATE POLICY "Editors can insert overrides" ON public.content_overrides
  FOR INSERT TO authenticated
  WITH CHECK (public.is_editor(auth.uid()));

CREATE POLICY "Editors can update overrides" ON public.content_overrides
  FOR UPDATE TO authenticated
  USING (public.is_editor(auth.uid()))
  WITH CHECK (public.is_editor(auth.uid()));

CREATE POLICY "Editors can delete overrides" ON public.content_overrides
  FOR DELETE TO authenticated
  USING (public.is_editor(auth.uid()));

-- contact_messages: restrict reads/updates to admins only
DROP POLICY IF EXISTS "Only authenticated users can read messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Only authenticated users can update messages" ON public.contact_messages;

CREATE POLICY "Admins can read messages" ON public.contact_messages
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update messages" ON public.contact_messages
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
