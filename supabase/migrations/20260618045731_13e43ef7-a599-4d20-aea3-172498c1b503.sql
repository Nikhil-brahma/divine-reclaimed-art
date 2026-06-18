GRANT INSERT ON public.orders TO anon;
GRANT INSERT ON public.order_items TO anon;

DROP POLICY IF EXISTS "Guests create guest orders" ON public.orders;
CREATE POLICY "Guests create guest orders"
ON public.orders
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL AND status = 'pending');

DROP POLICY IF EXISTS "Guests insert guest order items" ON public.order_items;
CREATE POLICY "Guests insert guest order items"
ON public.order_items
FOR INSERT
TO anon
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND o.user_id IS NULL
      AND o.status = 'pending'
  )
);