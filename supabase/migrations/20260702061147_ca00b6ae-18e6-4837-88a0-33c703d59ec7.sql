
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS parent_product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS variant_label text;

CREATE INDEX IF NOT EXISTS products_parent_product_id_idx ON public.products(parent_product_id);
