
DROP POLICY IF EXISTS "Public can read site-content" ON storage.objects;
CREATE POLICY "Editors can list site-content" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'site-content' AND public.is_editor(auth.uid()));
