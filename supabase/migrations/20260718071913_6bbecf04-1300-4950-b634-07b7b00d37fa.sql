
-- Create a private schema hidden from the public API
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

-- Recreate role helpers inside the private schema
CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION private.is_editor(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin','editor')
  )
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.is_editor(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_editor(uuid) TO authenticated, service_role;

-- Rewrite all policies that previously referenced public.has_role / public.is_editor

-- user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING ((auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

-- orders
DROP POLICY IF EXISTS "Editors view all orders" ON public.orders;
DROP POLICY IF EXISTS "Editors update all orders" ON public.orders;
CREATE POLICY "Editors view all orders" ON public.orders
  FOR SELECT TO authenticated USING (private.is_editor(auth.uid()));
CREATE POLICY "Editors update all orders" ON public.orders
  FOR UPDATE TO authenticated USING (private.is_editor(auth.uid()));

-- content_overrides
DROP POLICY IF EXISTS "Editors can insert overrides" ON public.content_overrides;
DROP POLICY IF EXISTS "Editors can update overrides" ON public.content_overrides;
DROP POLICY IF EXISTS "Editors can delete overrides" ON public.content_overrides;
CREATE POLICY "Editors can insert overrides" ON public.content_overrides
  FOR INSERT TO authenticated WITH CHECK (private.is_editor(auth.uid()));
CREATE POLICY "Editors can update overrides" ON public.content_overrides
  FOR UPDATE TO authenticated USING (private.is_editor(auth.uid())) WITH CHECK (private.is_editor(auth.uid()));
CREATE POLICY "Editors can delete overrides" ON public.content_overrides
  FOR DELETE TO authenticated USING (private.is_editor(auth.uid()));

-- contact_messages
DROP POLICY IF EXISTS "Admins can read messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can update messages" ON public.contact_messages;
CREATE POLICY "Admins can read messages" ON public.contact_messages
  FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update messages" ON public.contact_messages
  FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

-- product_media
DROP POLICY IF EXISTS "Editors can insert product media" ON public.product_media;
DROP POLICY IF EXISTS "Editors can update product media" ON public.product_media;
DROP POLICY IF EXISTS "Editors can delete product media" ON public.product_media;
CREATE POLICY "Editors can insert product media" ON public.product_media
  FOR INSERT TO authenticated WITH CHECK (private.is_editor(auth.uid()));
CREATE POLICY "Editors can update product media" ON public.product_media
  FOR UPDATE TO authenticated USING (private.is_editor(auth.uid())) WITH CHECK (private.is_editor(auth.uid()));
CREATE POLICY "Editors can delete product media" ON public.product_media
  FOR DELETE TO authenticated USING (private.is_editor(auth.uid()));

-- scheduled_blog_posts
DROP POLICY IF EXISTS "Editors view scheduled" ON public.scheduled_blog_posts;
DROP POLICY IF EXISTS "Editors insert scheduled" ON public.scheduled_blog_posts;
DROP POLICY IF EXISTS "Editors update scheduled" ON public.scheduled_blog_posts;
DROP POLICY IF EXISTS "Editors delete scheduled" ON public.scheduled_blog_posts;
CREATE POLICY "Editors view scheduled" ON public.scheduled_blog_posts
  FOR SELECT TO authenticated USING (private.is_editor(auth.uid()));
CREATE POLICY "Editors insert scheduled" ON public.scheduled_blog_posts
  FOR INSERT TO authenticated WITH CHECK (private.is_editor(auth.uid()));
CREATE POLICY "Editors update scheduled" ON public.scheduled_blog_posts
  FOR UPDATE TO authenticated USING (private.is_editor(auth.uid())) WITH CHECK (private.is_editor(auth.uid()));
CREATE POLICY "Editors delete scheduled" ON public.scheduled_blog_posts
  FOR DELETE TO authenticated USING (private.is_editor(auth.uid()));

-- products
DROP POLICY IF EXISTS "Editors can view all products" ON public.products;
DROP POLICY IF EXISTS "Editors can insert products" ON public.products;
DROP POLICY IF EXISTS "Editors can update products" ON public.products;
DROP POLICY IF EXISTS "Editors can delete products" ON public.products;
CREATE POLICY "Editors can view all products" ON public.products
  FOR SELECT TO authenticated USING (private.is_editor(auth.uid()));
CREATE POLICY "Editors can insert products" ON public.products
  FOR INSERT TO authenticated WITH CHECK (private.is_editor(auth.uid()));
CREATE POLICY "Editors can update products" ON public.products
  FOR UPDATE TO authenticated USING (private.is_editor(auth.uid())) WITH CHECK (private.is_editor(auth.uid()));
CREATE POLICY "Editors can delete products" ON public.products
  FOR DELETE TO authenticated USING (private.is_editor(auth.uid()));

-- profiles
DROP POLICY IF EXISTS "Editors view all profiles" ON public.profiles;
CREATE POLICY "Editors view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (private.is_editor(auth.uid()));

-- order_items
DROP POLICY IF EXISTS "Editors view all order items" ON public.order_items;
CREATE POLICY "Editors view all order items" ON public.order_items
  FOR SELECT TO authenticated USING (private.is_editor(auth.uid()));

-- blog_topic_queue
DROP POLICY IF EXISTS "Editors manage topic queue" ON public.blog_topic_queue;
CREATE POLICY "Editors manage topic queue" ON public.blog_topic_queue
  FOR ALL TO authenticated USING (private.is_editor(auth.uid())) WITH CHECK (private.is_editor(auth.uid()));

-- storage.objects policies
DROP POLICY IF EXISTS "Editors can upload site-content" ON storage.objects;
DROP POLICY IF EXISTS "Editors can update site-content" ON storage.objects;
DROP POLICY IF EXISTS "Editors can delete site-content" ON storage.objects;
DROP POLICY IF EXISTS "Editors can list site-content" ON storage.objects;
CREATE POLICY "Editors can upload site-content" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-content' AND private.is_editor(auth.uid()));
CREATE POLICY "Editors can update site-content" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'site-content' AND private.is_editor(auth.uid()))
  WITH CHECK (bucket_id = 'site-content' AND private.is_editor(auth.uid()));
CREATE POLICY "Editors can delete site-content" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'site-content' AND private.is_editor(auth.uid()));
CREATE POLICY "Editors can list site-content" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'site-content' AND private.is_editor(auth.uid()));

DROP POLICY IF EXISTS "blog_images_editor_insert" ON storage.objects;
DROP POLICY IF EXISTS "blog_images_editor_update" ON storage.objects;
DROP POLICY IF EXISTS "blog_images_editor_delete" ON storage.objects;
DROP POLICY IF EXISTS "Editors can list blog-images" ON storage.objects;
CREATE POLICY "blog_images_editor_insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'blog-images' AND private.is_editor(auth.uid()));
CREATE POLICY "blog_images_editor_update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'blog-images' AND private.is_editor(auth.uid()))
  WITH CHECK (bucket_id = 'blog-images' AND private.is_editor(auth.uid()));
CREATE POLICY "blog_images_editor_delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'blog-images' AND private.is_editor(auth.uid()));
CREATE POLICY "Editors can list blog-images" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'blog-images' AND private.is_editor(auth.uid()));

-- Now safe to drop the public wrappers that were exposed to the API
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
DROP FUNCTION IF EXISTS public.is_editor(uuid);
