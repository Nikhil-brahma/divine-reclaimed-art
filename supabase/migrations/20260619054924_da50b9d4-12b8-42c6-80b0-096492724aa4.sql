
-- Ensure Data API grants exist (these were missing)
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT SELECT, INSERT ON public.orders TO anon;
GRANT ALL ON public.orders TO service_role;

GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT SELECT, INSERT ON public.order_items TO anon;
GRANT ALL ON public.order_items TO service_role;

-- Allow guests to SELECT the pending guest order they just inserted (needed by .select() after insert)
DROP POLICY IF EXISTS "Guests view pending guest orders" ON public.orders;
CREATE POLICY "Guests view pending guest orders"
ON public.orders
FOR SELECT
TO anon
USING (user_id IS NULL AND status = 'pending');

-- Allow guests to SELECT their pending guest order items
DROP POLICY IF EXISTS "Guests view pending guest order items" ON public.order_items;
CREATE POLICY "Guests view pending guest order items"
ON public.order_items
FOR SELECT
TO anon
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND o.user_id IS NULL
      AND o.status = 'pending'
  )
);

-- Allow signed-in shoppers to UPDATE their own pending order (to attach razorpay_order_id)
DROP POLICY IF EXISTS "Users update own pending orders" ON public.orders;
CREATE POLICY "Users update own pending orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (auth.uid() = user_id);

-- Allow guests to UPDATE their pending guest order (to attach razorpay_order_id)
DROP POLICY IF EXISTS "Guests update pending guest orders" ON public.orders;
CREATE POLICY "Guests update pending guest orders"
ON public.orders
FOR UPDATE
TO anon
USING (user_id IS NULL AND status = 'pending')
WITH CHECK (user_id IS NULL AND status = 'pending');

GRANT UPDATE ON public.orders TO anon;
