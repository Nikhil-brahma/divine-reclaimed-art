CREATE TABLE public.custom_order_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 6 AND 20),
  design text NOT NULL CHECK (char_length(design) BETWEEN 1 AND 1000),
  quantity integer NOT NULL CHECK (quantity BETWEEN 1 AND 100000),
  occasion text NOT NULL CHECK (char_length(occasion) BETWEEN 1 AND 100),
  needed_by date,
  notes text CHECK (notes IS NULL OR char_length(notes) <= 1000),
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.custom_order_requests TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.custom_order_requests TO authenticated;
GRANT ALL ON public.custom_order_requests TO service_role;
ALTER TABLE public.custom_order_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit custom orders" ON public.custom_order_requests FOR INSERT TO anon, authenticated WITH CHECK (status = 'new');
CREATE POLICY "Editors view custom orders" ON public.custom_order_requests FOR SELECT TO authenticated USING (public.is_editor(auth.uid()));
CREATE POLICY "Editors update custom orders" ON public.custom_order_requests FOR UPDATE TO authenticated USING (public.is_editor(auth.uid()));
CREATE POLICY "Editors delete custom orders" ON public.custom_order_requests FOR DELETE TO authenticated USING (public.is_editor(auth.uid()));