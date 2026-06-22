-- Restore Data API grants for orders / order_items.
-- Service role needs ALL so the checkout edge function can insert.
-- Authenticated users need SELECT so /account can read their own orders (RLS still enforces ownership).
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.order_items TO service_role;
GRANT SELECT ON public.orders TO authenticated;
GRANT SELECT ON public.order_items TO authenticated;