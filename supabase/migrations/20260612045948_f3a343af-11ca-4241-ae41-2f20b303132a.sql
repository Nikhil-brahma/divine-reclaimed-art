
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handle TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  price INTEGER NOT NULL DEFAULT 0,
  compare_at_price INTEGER,
  currency TEXT NOT NULL DEFAULT 'INR',
  sku TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft',
  seo_title TEXT,
  seo_description TEXT,
  weight_grams INTEGER,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active products"
ON public.products FOR SELECT
USING (status = 'active');

CREATE POLICY "Editors can view all products"
ON public.products FOR SELECT
TO authenticated
USING (public.is_editor(auth.uid()));

CREATE POLICY "Editors can insert products"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (public.is_editor(auth.uid()));

CREATE POLICY "Editors can update products"
ON public.products FOR UPDATE
TO authenticated
USING (public.is_editor(auth.uid()))
WITH CHECK (public.is_editor(auth.uid()));

CREATE POLICY "Editors can delete products"
ON public.products FOR DELETE
TO authenticated
USING (public.is_editor(auth.uid()));

CREATE TRIGGER products_touch_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX IF NOT EXISTS products_status_idx ON public.products(status);
CREATE INDEX IF NOT EXISTS products_handle_idx ON public.products(handle);
