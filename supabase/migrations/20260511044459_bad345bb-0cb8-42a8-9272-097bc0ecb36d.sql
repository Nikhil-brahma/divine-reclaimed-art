
-- Roles
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_editor(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin','editor')
  )
$$;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Content overrides
CREATE TABLE IF NOT EXISTS public.content_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  key text NOT NULL,
  text_value text,
  image_url text,
  alt_text text,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (page_path, key)
);

CREATE INDEX IF NOT EXISTS idx_content_overrides_page ON public.content_overrides(page_path);

ALTER TABLE public.content_overrides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read overrides" ON public.content_overrides;
CREATE POLICY "Anyone can read overrides" ON public.content_overrides
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Editors can insert overrides" ON public.content_overrides;
CREATE POLICY "Editors can insert overrides" ON public.content_overrides
  FOR INSERT TO authenticated
  WITH CHECK (public.is_editor(auth.uid()));

DROP POLICY IF EXISTS "Editors can update overrides" ON public.content_overrides;
CREATE POLICY "Editors can update overrides" ON public.content_overrides
  FOR UPDATE TO authenticated
  USING (public.is_editor(auth.uid()))
  WITH CHECK (public.is_editor(auth.uid()));

DROP POLICY IF EXISTS "Editors can delete overrides" ON public.content_overrides;
CREATE POLICY "Editors can delete overrides" ON public.content_overrides
  FOR DELETE TO authenticated
  USING (public.is_editor(auth.uid()));

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

DROP TRIGGER IF EXISTS trg_content_overrides_updated ON public.content_overrides;
CREATE TRIGGER trg_content_overrides_updated
  BEFORE UPDATE ON public.content_overrides
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Storage bucket for editable site images
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-content', 'site-content', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can read site-content" ON storage.objects;
CREATE POLICY "Public can read site-content" ON storage.objects
  FOR SELECT USING (bucket_id = 'site-content');

DROP POLICY IF EXISTS "Editors can upload site-content" ON storage.objects;
CREATE POLICY "Editors can upload site-content" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-content' AND public.is_editor(auth.uid()));

DROP POLICY IF EXISTS "Editors can update site-content" ON storage.objects;
CREATE POLICY "Editors can update site-content" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'site-content' AND public.is_editor(auth.uid()))
  WITH CHECK (bucket_id = 'site-content' AND public.is_editor(auth.uid()));

DROP POLICY IF EXISTS "Editors can delete site-content" ON storage.objects;
CREATE POLICY "Editors can delete site-content" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'site-content' AND public.is_editor(auth.uid()));
