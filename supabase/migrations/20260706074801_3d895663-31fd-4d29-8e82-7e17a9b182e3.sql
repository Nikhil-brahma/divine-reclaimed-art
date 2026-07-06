DROP POLICY IF EXISTS "Public can read site-content" ON storage.objects;
CREATE POLICY "Public can read site-content"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'site-content');