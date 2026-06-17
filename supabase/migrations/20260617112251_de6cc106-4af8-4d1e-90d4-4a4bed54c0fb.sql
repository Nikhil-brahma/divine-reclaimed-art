CREATE TABLE public.product_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  hero_url TEXT,
  angle_urls TEXT[] NOT NULL DEFAULT '{}',
  spin_urls TEXT[] NOT NULL DEFAULT '{}',
  source_image_url TEXT,
  style_preset TEXT NOT NULL DEFAULT 'regal-ivory',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX product_media_product_id_idx ON public.product_media(product_id);

GRANT SELECT ON public.product_media TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_media TO authenticated;
GRANT ALL ON public.product_media TO service_role;

ALTER TABLE public.product_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product media"
  ON public.product_media FOR SELECT
  USING (true);

CREATE POLICY "Editors can insert product media"
  ON public.product_media FOR INSERT
  TO authenticated
  WITH CHECK (public.is_editor(auth.uid()));

CREATE POLICY "Editors can update product media"
  ON public.product_media FOR UPDATE
  TO authenticated
  USING (public.is_editor(auth.uid()))
  WITH CHECK (public.is_editor(auth.uid()));

CREATE POLICY "Editors can delete product media"
  ON public.product_media FOR DELETE
  TO authenticated
  USING (public.is_editor(auth.uid()));

CREATE TRIGGER product_media_touch_updated_at
  BEFORE UPDATE ON public.product_media
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();