DROP POLICY IF EXISTS "Public read blog images" ON storage.objects;
CREATE POLICY "Editors can list blog-images"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'blog-images' AND public.is_editor(auth.uid()));