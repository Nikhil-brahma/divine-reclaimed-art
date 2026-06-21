
-- Remove all anon access to orders and order_items.
-- Guest checkout will now go through the razorpay-create-order edge function (service role),
-- which validates product prices server-side, preventing both data leakage and price manipulation.

DROP POLICY IF EXISTS "Guests view pending guest orders" ON public.orders;
DROP POLICY IF EXISTS "Guests update pending guest orders" ON public.orders;
DROP POLICY IF EXISTS "Guests create guest orders" ON public.orders;

DROP POLICY IF EXISTS "Guests view pending guest order items" ON public.order_items;
DROP POLICY IF EXISTS "Guests insert guest order items" ON public.order_items;

-- Revoke anon table privileges as well (RLS + GRANT are independent layers)
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.orders FROM anon;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.order_items FROM anon;
