-- Migration Step 4: Guest Checkout dan Sistem Pesanan

-- 1. Enums
CREATE TYPE public.order_status AS ENUM (
  'pending_payment',
  'paid',
  'processing',
  'delivered',
  'completed',
  'expired',
  'cancelled',
  'failed',
  'refunded'
);

CREATE TYPE public.payment_status AS ENUM (
  'pending',
  'paid',
  'expired',
  'failed',
  'refunded'
);

-- 2. Fungsi Generator Nomor Pesanan (BA-YYYYMMDD-XXXXXX)
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 100000;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
  date_part TEXT;
  seq_part TEXT;
BEGIN
  date_part := to_char(now() AT TIME ZONE 'UTC', 'YYYYMMDD');
  seq_part := lpad(nextval('order_number_seq')::text, 6, '0');
  RETURN 'BA-' || date_part || '-' || seq_part;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- 3. Tabel Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL DEFAULT public.generate_order_number(),
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  recipient_email TEXT NOT NULL,
  status public.order_status NOT NULL DEFAULT 'pending_payment',
  payment_status public.payment_status NOT NULL DEFAULT 'pending',
  currency TEXT NOT NULL DEFAULT 'IDR',
  subtotal INTEGER NOT NULL DEFAULT 0,
  discount_total INTEGER NOT NULL DEFAULT 0,
  grand_total INTEGER NOT NULL DEFAULT 0,
  idempotency_key TEXT UNIQUE NOT NULL,
  source TEXT NOT NULL DEFAULT 'storefront',
  reservation_expires_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  expired_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT check_totals CHECK (subtotal >= 0 AND discount_total >= 0 AND grand_total >= 0)
);

CREATE INDEX idx_orders_email ON public.orders (recipient_email);
CREATE INDEX idx_orders_status ON public.orders (status);
CREATE INDEX idx_orders_idempotency ON public.orders (idempotency_key);
CREATE INDEX idx_orders_created_at ON public.orders (created_at DESC);

-- Trigger updated_at
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 4. Tabel Order Items
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  variant_name TEXT NOT NULL,
  sku TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL DEFAULT 0,
  compare_at_price INTEGER,
  subtotal INTEGER NOT NULL DEFAULT 0,
  delivery_method TEXT,
  stock_type TEXT,
  account_type TEXT,
  duration_value INTEGER,
  duration_unit TEXT,
  duration_label TEXT,
  package_label TEXT,
  warranty_enabled BOOLEAN DEFAULT false,
  warranty_duration INTEGER,
  warranty_unit TEXT,
  warranty_label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT check_quantity_is_one CHECK (quantity = 1)
);

CREATE INDEX idx_order_items_order_id ON public.order_items (order_id);

-- 5. Tabel Order Access Tokens
CREATE TABLE public.order_access_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  last_used_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_order_access_tokens_hash ON public.order_access_tokens (token_hash);
CREATE INDEX idx_order_access_tokens_order_id ON public.order_access_tokens (order_id);

-- 6. Tabel Order Events
CREATE TABLE public.order_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  previous_status TEXT,
  new_status TEXT,
  summary TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_order_events_order_id ON public.order_events (order_id);

-- 7. Relasi Inventory ke Order
ALTER TABLE public.inventory_items
ADD COLUMN reserved_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
ADD COLUMN reserved_order_item_id UUID REFERENCES public.order_items(id) ON DELETE SET NULL;

CREATE INDEX idx_inventory_items_reserved_order ON public.inventory_items (reserved_order_id);

-- 8. RLS Policies
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_access_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;

-- Admins can do anything on orders
CREATE POLICY "Admins can manage orders" ON public.orders FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can manage order items" ON public.order_items FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can manage order access tokens" ON public.order_access_tokens FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can manage order events" ON public.order_events FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Note: No policies for anon/public. Service role bypasses RLS automatically.

-- 9. Database Function: create_guest_order
-- Menggunakan Security Definer agar bisa diakses oleh backend (service role) yang tepercaya, namun kita revoke access dari public.
CREATE OR REPLACE FUNCTION public.create_guest_order(p_payload JSONB)
RETURNS JSONB AS $$
DECLARE
  v_variant_id UUID;
  v_product_id UUID;
  v_recipient_email TEXT;
  v_idempotency_key TEXT;
  v_reservation_minutes INTEGER;
  
  v_product RECORD;
  v_variant RECORD;
  v_inventory_id UUID;
  
  v_order_id UUID;
  v_order_number TEXT;
  v_order_item_id UUID;
  
  v_now TIMESTAMPTZ := now();
  v_expires_at TIMESTAMPTZ;
BEGIN
  -- Extract from payload
  v_variant_id := (p_payload->>'variantId')::UUID;
  v_recipient_email := p_payload->>'recipientEmail';
  v_idempotency_key := p_payload->>'idempotencyKey';
  v_reservation_minutes := COALESCE((p_payload->>'reservationMinutes')::INTEGER, 30);
  
  v_expires_at := v_now + (v_reservation_minutes || ' minutes')::INTERVAL;
  
  -- Check idempotency
  SELECT id, order_number INTO v_order_id, v_order_number 
  FROM public.orders 
  WHERE idempotency_key = v_idempotency_key LIMIT 1;
  
  IF FOUND THEN
    RETURN jsonb_build_object('success', true, 'order_id', v_order_id, 'order_number', v_order_number, 'is_existing', true);
  END IF;

  -- Lock variant and check active
  SELECT v.*, p.name as product_name, p.slug as product_slug, p.is_active as product_is_active 
  INTO v_variant
  FROM public.product_variants v
  JOIN public.products p ON v.product_id = p.id
  WHERE v.id = v_variant_id AND v.is_active = true AND p.is_active = true
  FOR SHARE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Variant not found or inactive';
  END IF;

  -- Create Order
  INSERT INTO public.orders (
    recipient_email, subtotal, discount_total, grand_total, idempotency_key, source, reservation_expires_at
  ) VALUES (
    v_recipient_email, v_variant.price, 0, v_variant.price, v_idempotency_key, 'storefront', v_expires_at
  ) RETURNING id, order_number INTO v_order_id, v_order_number;

  -- Create Order Item
  INSERT INTO public.order_items (
    order_id, product_id, variant_id, product_name, product_slug, variant_name, sku,
    quantity, unit_price, compare_at_price, subtotal, delivery_method, stock_type, account_type,
    duration_value, duration_unit, duration_label, package_label,
    warranty_enabled, warranty_duration, warranty_unit, warranty_label
  ) VALUES (
    v_order_id, v_variant.product_id, v_variant.id, v_variant.product_name, v_variant.product_slug, v_variant.name, v_variant.sku,
    1, v_variant.price, v_variant.original_price, v_variant.price, v_variant.delivery_method, v_variant.stock_type, v_variant.account_type,
    v_variant.duration_value, v_variant.duration_unit, v_variant.duration_label, v_variant.package_label,
    v_variant.warranty_enabled, v_variant.warranty_duration, v_variant.warranty_unit, v_variant.warranty_label
  ) RETURNING id INTO v_order_item_id;

  -- Reserve Inventory if limited
  IF v_variant.stock_type = 'limited' THEN
    SELECT id INTO v_inventory_id
    FROM public.inventory_items
    WHERE variant_id = v_variant_id 
      AND status = 'available' 
      AND (expires_at IS NULL OR expires_at > v_now)
    ORDER BY created_at ASC
    FOR UPDATE SKIP LOCKED
    LIMIT 1;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Out of stock';
    END IF;
    
    UPDATE public.inventory_items
    SET status = 'reserved',
        reserved_order_id = v_order_id,
        reserved_order_item_id = v_order_item_id,
        reserved_at = v_now,
        reserved_until = v_expires_at,
        updated_at = v_now
    WHERE id = v_inventory_id;
    
    INSERT INTO public.inventory_events (inventory_item_id, event_type, previous_status, new_status, summary)
    VALUES (v_inventory_id, 'reservation_created', 'available', 'reserved', 'Inventory reserved for order ' || v_order_number);
  END IF;

  -- Create Order Event
  INSERT INTO public.order_events (order_id, event_type, new_status, summary)
  VALUES (v_order_id, 'created', 'pending_payment', 'Order created by guest');
  
  IF v_variant.stock_type = 'limited' THEN
    INSERT INTO public.order_events (order_id, event_type, summary)
    VALUES (v_order_id, 'inventory_reserved', 'Inventory reserved for order');
  END IF;

  RETURN jsonb_build_object(
    'success', true, 
    'order_id', v_order_id, 
    'order_number', v_order_number, 
    'is_existing', false,
    'total', v_variant.price,
    'expires_at', v_expires_at
  );
END;
$$ LANGUAGE plpgsql;

-- Secure the function
REVOKE ALL ON FUNCTION public.create_guest_order(JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.create_guest_order(JSONB) FROM anon;

-- 10. Database Function: expire_order_and_release_inventory
CREATE OR REPLACE FUNCTION public.expire_order_and_release_inventory(p_order_id UUID, p_actor_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  v_order RECORD;
  v_inventory RECORD;
  v_now TIMESTAMPTZ := now();
  v_new_inv_status public.inventory_status;
BEGIN
  -- Lock order
  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Can only expire pending_payment
  IF v_order.status != 'pending_payment' THEN
    RETURN false;
  END IF;
  
  -- Update order
  UPDATE public.orders
  SET status = 'expired',
      payment_status = 'expired',
      expired_at = v_now,
      updated_at = v_now
  WHERE id = p_order_id;
  
  INSERT INTO public.order_events (order_id, actor_id, event_type, previous_status, new_status, summary)
  VALUES (p_order_id, p_actor_id, 'expired', 'pending_payment', 'expired', 'Order has expired');
  
  -- Release inventory if exists
  FOR v_inventory IN 
    SELECT * FROM public.inventory_items WHERE reserved_order_id = p_order_id FOR UPDATE
  LOOP
    IF v_inventory.expires_at IS NOT NULL AND v_inventory.expires_at <= v_now THEN
      v_new_inv_status := 'expired';
    ELSE
      v_new_inv_status := 'available';
    END IF;
    
    UPDATE public.inventory_items
    SET status = v_new_inv_status,
        reserved_order_id = NULL,
        reserved_order_item_id = NULL,
        reserved_at = NULL,
        reserved_until = NULL,
        updated_at = v_now
    WHERE id = v_inventory.id;
    
    INSERT INTO public.inventory_events (inventory_item_id, actor_id, event_type, previous_status, new_status, summary)
    VALUES (v_inventory.id, p_actor_id, 'reservation_released', 'reserved', v_new_inv_status, 'Reservation released due to order expiration');
    
    INSERT INTO public.order_events (order_id, actor_id, event_type, summary)
    VALUES (p_order_id, p_actor_id, 'reservation_released', 'Inventory released');
  END LOOP;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

REVOKE ALL ON FUNCTION public.expire_order_and_release_inventory(UUID, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.expire_order_and_release_inventory(UUID, UUID) FROM anon;

-- 11. Database Function: release_expired_order_reservations
CREATE OR REPLACE FUNCTION public.release_expired_order_reservations(p_limit INTEGER DEFAULT 50)
RETURNS INTEGER AS $$
DECLARE
  v_order RECORD;
  v_count INTEGER := 0;
BEGIN
  FOR v_order IN 
    SELECT id FROM public.orders 
    WHERE status = 'pending_payment' AND reservation_expires_at <= now() 
    LIMIT p_limit 
  LOOP
    PERFORM public.expire_order_and_release_inventory(v_order.id);
    v_count := v_count + 1;
  END LOOP;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

REVOKE ALL ON FUNCTION public.release_expired_order_reservations(INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.release_expired_order_reservations(INTEGER) FROM anon;
