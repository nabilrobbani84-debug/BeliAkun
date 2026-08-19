-- Migration 0010: Multi-item Order RPC

CREATE OR REPLACE FUNCTION public.create_multi_item_order(p_payload JSONB)
RETURNS JSONB AS $$
DECLARE
  v_idempotency_key TEXT;
  v_customer_id UUID;
  v_recipient_email TEXT;
  v_reservation_minutes INTEGER;
  v_voucher_code TEXT;
  
  v_order_id UUID;
  v_order_number TEXT;
  
  v_items JSONB;
  v_item JSONB;
  
  v_variant_id UUID;
  v_qty INTEGER;
  
  v_subtotal INTEGER := 0;
  v_discount_total INTEGER := 0;
  v_grand_total INTEGER := 0;
  
  v_voucher RECORD;
  v_variant RECORD;
  
  v_inventory_ids UUID[] := '{}';
  v_inv_id UUID;
  
  v_now TIMESTAMPTZ := now();
  v_reservation_expires_at TIMESTAMPTZ;
  
  v_idx INTEGER;
BEGIN
  -- 1. Extract payload
  v_idempotency_key := p_payload->>'idempotency_key';
  v_customer_id := (p_payload->>'customer_id')::UUID;
  v_recipient_email := p_payload->>'recipient_email';
  v_reservation_minutes := COALESCE((p_payload->>'reservation_minutes')::INTEGER, 30);
  v_voucher_code := p_payload->>'voucher_code';
  v_items := p_payload->'items';
  
  IF v_idempotency_key IS NULL OR v_recipient_email IS NULL OR v_items IS NULL OR jsonb_array_length(v_items) = 0 THEN
    RAISE EXCEPTION 'Invalid payload: idempotency_key, recipient_email, and items are required';
  END IF;

  -- 2. Idempotency Check
  SELECT id, order_number INTO v_order_id, v_order_number
  FROM public.orders
  WHERE idempotency_key = v_idempotency_key;
  
  IF FOUND THEN
    RETURN jsonb_build_object(
      'success', true,
      'order_id', v_order_id,
      'order_number', v_order_number,
      'is_existing', true
    );
  END IF;
  
  -- 3. Calculate Totals & Validate Variants
  FOR v_item IN SELECT * FROM jsonb_array_elements(v_items) LOOP
    v_variant_id := (v_item->>'variant_id')::UUID;
    v_qty := (v_item->>'quantity')::INTEGER;
    
    IF v_qty <= 0 THEN
      RAISE EXCEPTION 'Quantity must be greater than 0';
    END IF;
    
    SELECT pv.*, p.name as product_name, p.slug as product_slug, p.delivery_method, 
           p.warranty_enabled, p.warranty_duration, p.warranty_unit, p.warranty_label
    INTO v_variant
    FROM public.product_variants pv
    JOIN public.products p ON p.id = pv.product_id
    WHERE pv.id = v_variant_id AND pv.status = 'active' AND p.status = 'active';
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Variant not found or inactive: %', v_variant_id;
    END IF;
    
    v_subtotal := v_subtotal + (v_variant.price * v_qty);
    
    -- Reserve Inventory if limited stock
    IF v_variant.stock_type = 'limited' THEN
      FOR v_idx IN 1..v_qty LOOP
        SELECT id INTO v_inv_id
        FROM public.inventory_items
        WHERE variant_id = v_variant_id 
          AND status = 'available'
          AND (expires_at IS NULL OR expires_at > v_now)
        ORDER BY created_at ASC
        FOR UPDATE SKIP LOCKED
        LIMIT 1;
        
        IF NOT FOUND THEN
          RAISE EXCEPTION 'Out of stock for variant: %', v_variant_id;
        END IF;
        
        v_inventory_ids := array_append(v_inventory_ids, v_inv_id);
        
        -- Temporarily mark as reserved to avoid picking it again in the same loop
        UPDATE public.inventory_items
        SET status = 'reserved', updated_at = v_now
        WHERE id = v_inv_id;
      END LOOP;
    END IF;
  END LOOP;
  
  -- 4. Apply Voucher
  IF v_voucher_code IS NOT NULL THEN
    SELECT * INTO v_voucher
    FROM public.vouchers
    WHERE code = upper(v_voucher_code) AND status = 'active'
      AND valid_from <= v_now AND (valid_until IS NULL OR valid_until > v_now)
      AND (usage_limit IS NULL OR current_usage < usage_limit);
      
    IF FOUND THEN
      IF v_subtotal >= v_voucher.min_transaction THEN
        IF v_voucher.discount_type = 'percentage' THEN
          v_discount_total := (v_subtotal * v_voucher.discount_value) / 100;
        ELSE
          v_discount_total := v_voucher.discount_value;
        END IF;
        
        IF v_voucher.max_discount IS NOT NULL AND v_discount_total > v_voucher.max_discount THEN
          v_discount_total := v_voucher.max_discount;
        END IF;
      END IF;
    END IF;
  END IF;
  
  -- Prevent negative total
  IF v_discount_total > v_subtotal THEN
    v_discount_total := v_subtotal;
  END IF;
  
  v_grand_total := v_subtotal - v_discount_total;
  
  -- 5. Create Order
  v_reservation_expires_at := v_now + (v_reservation_minutes || ' minutes')::INTERVAL;
  
  INSERT INTO public.orders (
    customer_id, recipient_email, subtotal, discount_total, grand_total, 
    idempotency_key, reservation_expires_at, voucher_id
  ) VALUES (
    v_customer_id, v_recipient_email, v_subtotal, v_discount_total, v_grand_total, 
    v_idempotency_key, v_reservation_expires_at, v_voucher.id
  ) RETURNING id, order_number INTO v_order_id, v_order_number;
  
  -- 6. Update Voucher Usage
  IF v_voucher.id IS NOT NULL AND v_discount_total > 0 THEN
    INSERT INTO public.voucher_usages (voucher_id, order_id, customer_id, discount_applied)
    VALUES (v_voucher.id, v_order_id, v_customer_id, v_discount_total);
    
    UPDATE public.vouchers 
    SET current_usage = current_usage + 1, updated_at = v_now
    WHERE id = v_voucher.id;
  END IF;
  
  -- 7. Insert Order Items and Update Inventory
  FOR v_item IN SELECT * FROM jsonb_array_elements(v_items) LOOP
    v_variant_id := (v_item->>'variant_id')::UUID;
    v_qty := (v_item->>'quantity')::INTEGER;
    
    SELECT pv.*, p.name as product_name, p.slug as product_slug, p.delivery_method, 
           p.warranty_enabled, p.warranty_duration, p.warranty_unit, p.warranty_label
    INTO v_variant
    FROM public.product_variants pv
    JOIN public.products p ON p.id = pv.product_id
    WHERE pv.id = v_variant_id;
    
    -- Insert into order_items
    INSERT INTO public.order_items (
      order_id, product_id, variant_id, product_name, product_slug, variant_name, 
      sku, quantity, unit_price, compare_at_price, subtotal, delivery_method, 
      stock_type, account_type, duration_value, duration_unit, duration_label, 
      package_label, warranty_enabled, warranty_duration, warranty_unit, warranty_label
    ) VALUES (
      v_order_id, v_variant.product_id, v_variant_id, v_variant.product_name, v_variant.product_slug, v_variant.name,
      v_variant.sku, v_qty, v_variant.price, v_variant.compare_at_price, (v_variant.price * v_qty), v_variant.delivery_method,
      v_variant.stock_type, v_variant.account_type, v_variant.duration_value, v_variant.duration_unit, v_variant.duration_label,
      v_variant.package_label, v_variant.warranty_enabled, v_variant.warranty_duration, v_variant.warranty_unit, v_variant.warranty_label
    );
  END LOOP;
  
  -- Update Inventory records with order_id
  IF array_length(v_inventory_ids, 1) > 0 THEN
    UPDATE public.inventory_items
    SET reserved_order_id = v_order_id,
        reserved_at = v_now,
        reserved_until = v_reservation_expires_at
    WHERE id = ANY(v_inventory_ids);
    
    FOR i IN 1..array_length(v_inventory_ids, 1) LOOP
      INSERT INTO public.inventory_events (
        inventory_item_id, actor_id, event_type, previous_status, new_status, summary
      ) VALUES (
        v_inventory_ids[i], v_customer_id, 'reserved', 'available', 'reserved', 'Reserved for order ' || v_order_number
      );
    END LOOP;
  END IF;
  
  -- 8. Order Event
  INSERT INTO public.order_events (
    order_id, actor_id, event_type, previous_status, new_status, summary
  ) VALUES (
    v_order_id, v_customer_id, 'created', NULL, 'pending_payment', 'Order created via storefront'
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'order_number', v_order_number,
    'is_existing', false
  );
EXCEPTION
  WHEN OTHERS THEN
    -- Rollback automatically happens
    RAISE;
END;
$$ LANGUAGE plpgsql;
