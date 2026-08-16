DROP POLICY IF EXISTS "Users create own orders" ON public.orders;

CREATE POLICY "Users create own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND status = 'pending'
  AND paid_at IS NULL
  AND razorpay_payment_id IS NULL
  AND razorpay_signature IS NULL
  AND razorpay_order_id IS NULL
  AND shipped_at IS NULL
  AND delivered_at IS NULL
  AND tracking_number IS NULL
);