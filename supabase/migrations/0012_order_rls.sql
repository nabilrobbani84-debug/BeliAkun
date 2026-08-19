-- Allow users to view their own orders
CREATE POLICY "Users can view their own orders" ON public.orders
FOR SELECT TO authenticated
USING (
  user_id = auth.uid() OR recipient_email = (auth.jwt() ->> 'email')
);

-- Allow users to view order items for their orders
CREATE POLICY "Users can view their own order items" ON public.order_items
FOR SELECT TO authenticated
USING (
  order_id IN (
    SELECT id FROM public.orders 
    WHERE user_id = auth.uid() OR recipient_email = (auth.jwt() ->> 'email')
  )
);
