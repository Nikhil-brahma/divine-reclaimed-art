
-- Restrict writes on blog-images bucket to editors/admins
DROP POLICY IF EXISTS "blog_images_editor_insert" ON storage.objects;
DROP POLICY IF EXISTS "blog_images_editor_update" ON storage.objects;
DROP POLICY IF EXISTS "blog_images_editor_delete" ON storage.objects;

CREATE POLICY "blog_images_editor_insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'blog-images' AND public.is_editor(auth.uid()));

CREATE POLICY "blog_images_editor_update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'blog-images' AND public.is_editor(auth.uid()))
WITH CHECK (bucket_id = 'blog-images' AND public.is_editor(auth.uid()));

CREATE POLICY "blog_images_editor_delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'blog-images' AND public.is_editor(auth.uid()));
