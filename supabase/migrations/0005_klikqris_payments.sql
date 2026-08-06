-- Migration 0005: KlikQRIS Payments and Webhooks

-- 1. Create Enums if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_provider') THEN
        CREATE TYPE public.payment_provider AS ENUM ('klikqris');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE public.payment_status AS ENUM (
            'initializing',
            'pending',
            'paid',
            'expired',
            'failed',
            'unknown',
            'review',
            'refunded'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_event_source') THEN
        CREATE TYPE public.payment_event_source AS ENUM (
            'create',
            'webhook',
            'status_sync',
            'admin_sync',
            'system'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_processing_status') THEN
        CREATE TYPE public.event_processing_status AS ENUM (
            'received',
            'processed',
            'ignored',
            'rejected',
            'failed'
        );
    END IF;
END $$;

-- 2. Alter existing tables to add columns
-- Alter orders
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS requires_payment_review BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS payment_review_reason TEXT DEFAULT NULL;

-- Alter inventory_items
ALTER TABLE public.inventory_items
ADD COLUMN IF NOT EXISTS sold_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS sold_order_item_id UUID REFERENCES public.order_items(id) ON DELETE SET NULL;

-- 3. Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
    provider public.payment_provider NOT NULL DEFAULT 'klikqris',
    provider_mode TEXT NOT NULL, -- 'sandbox' | 'inhouse' | 'my_pg'
    provider_order_id TEXT NOT NULL UNIQUE,
    status public.payment_status NOT NULL DEFAULT 'initializing',
    currency TEXT NOT NULL DEFAULT 'IDR',
    amount_requested INTEGER NOT NULL,
    amount_payable INTEGER NOT NULL,
    unique_amount INTEGER NOT NULL DEFAULT 0,
    provider_signature_hash TEXT NOT NULL,
    qris_url TEXT NOT NULL,
    direct_url TEXT,
    provider_expires_at TIMESTAMPTZ,
    provider_paid_at TIMESTAMPTZ,
    last_synced_at TIMESTAMPTZ,
    create_attempts INTEGER NOT NULL DEFAULT 1,
    last_error_code TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for orders query
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider_order_id ON public.payments(provider_order_id);

-- 4. Create payment_events table
CREATE TABLE IF NOT EXISTS public.payment_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    provider public.payment_provider NOT NULL DEFAULT 'klikqris',
    provider_order_id TEXT NOT NULL,
    source public.payment_event_source NOT NULL,
    event_type TEXT NOT NULL, -- e.g. 'qris.paid', 'qris.expired', etc.
    event_fingerprint TEXT NOT NULL,
    processing_status public.event_processing_status NOT NULL DEFAULT 'received',
    provider_status TEXT,
    sanitized_payload JSONB DEFAULT '{}'::jsonb,
    error_code TEXT,
    received_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_payment_event_fingerprint UNIQUE (provider, event_fingerprint)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payment_events_payment_id ON public.payment_events(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_order_id ON public.payment_events(order_id);

-- 5. Updated_at Triggers
CREATE OR REPLACE TRIGGER trg_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 6. RLS Policies
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

-- Payments policies
-- Admin can view payments
CREATE POLICY admin_select_payments ON public.payments
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- Guest can view own payment via backend/service_role only. No direct client select to avoid security leaks.
-- However, we don't declare any select policies for public/anon.
-- Admin can view payment events
CREATE POLICY admin_select_payment_events ON public.payment_events
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- Grants
GRANT SELECT ON public.payments TO authenticated;
GRANT SELECT ON public.payment_events TO authenticated;

-- 7. Atomic Database Functions for Payment Processing

-- settle_paid_payment: Handles transition of order and payments to paid
CREATE OR REPLACE FUNCTION public.settle_paid_payment(
    p_payment_id UUID,
    p_event_fingerprint TEXT,
    p_actor_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- Runs as DB owner to bypass RLS for inventory/orders updates
AS $$
DECLARE
    v_payment RECORD;
    v_order RECORD;
    v_order_item RECORD;
    v_event_exists BOOLEAN;
    v_inv_count INTEGER;
    v_inv_available_count INTEGER;
BEGIN
    -- 1. Check if event fingerprint already processed
    SELECT EXISTS(
        SELECT 1 FROM public.payment_events 
        WHERE event_fingerprint = p_event_fingerprint AND processing_status = 'processed'
    ) INTO v_event_exists;
    
    IF v_event_exists THEN
        RETURN TRUE; -- Idempotent success
    END IF;

    -- 2. Lock payment row
    SELECT * FROM public.payments WHERE id = p_payment_id FOR UPDATE INTO v_payment;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Payment record not found';
    END IF;

    -- If already paid, do nothing
    IF v_payment.status = 'paid' THEN
        RETURN TRUE;
    END IF;

    -- 3. Lock order row
    SELECT * FROM public.orders WHERE id = v_payment.order_id FOR UPDATE INTO v_order;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order record not found';
    END IF;

    -- 4. Audit checks: Payment review triggers
    -- Check if order is already expired/cancelled
    IF v_order.status IN ('expired', 'cancelled') THEN
        UPDATE public.payments 
        SET status = 'review', provider_paid_at = now(), updated_at = now() 
        WHERE id = p_payment_id;
        
        UPDATE public.orders 
        SET status = 'payment_review', requires_payment_review = TRUE, payment_review_reason = 'Pembayaran sukses diterima setelah pesanan dibatalkan/kedaluwarsa.', updated_at = now() 
        WHERE id = v_payment.order_id;

        INSERT INTO public.order_events (order_id, actor_id, event_type, previous_status, new_status, summary)
        VALUES (v_payment.order_id, p_actor_id, 'payment_review_triggered', v_order.status, 'payment_review', 'Pembayaran masuk setelah order tidak aktif.');
        
        RETURN FALSE;
    END IF;

    -- Check if order already paid
    IF v_order.status = 'paid' THEN
        -- Weird case: order paid but payment row not? Mark for review.
        UPDATE public.payments SET status = 'paid', provider_paid_at = now(), updated_at = now() WHERE id = p_payment_id;
        RETURN TRUE;
    END IF;

    -- Get order item
    SELECT * FROM public.order_items WHERE order_id = v_order.id LIMIT 1 INTO v_order_item;

    -- Check if inventory reservation exists and is valid for limited stock
    IF v_order_item.stock_type = 'limited' THEN
        -- Count how many reserved items for this order
        SELECT COUNT(*) FROM public.inventory_items 
        WHERE reserved_order_id = v_order.id INTO v_inv_count;

        -- If reservation lost, we must mark as payment_review
        IF v_inv_count = 0 THEN
            UPDATE public.payments 
            SET status = 'review', provider_paid_at = now(), updated_at = now() 
            WHERE id = p_payment_id;
            
            UPDATE public.orders 
            SET status = 'payment_review', requires_payment_review = TRUE, payment_review_reason = 'Stok terreservasi tidak ditemukan saat pembayaran diterima.', updated_at = now() 
            WHERE id = v_payment.order_id;

            INSERT INTO public.order_events (order_id, actor_id, event_type, previous_status, new_status, summary)
            VALUES (v_payment.order_id, p_actor_id, 'payment_review_triggered', v_order.status, 'payment_review', 'Gagal memproses pembayaran: reservasi stok hilang.');
            
            RETURN FALSE;
        END IF;

        -- Convert reserved inventory to sold
        UPDATE public.inventory_items
        SET 
            status = 'sold',
            sold_order_id = v_order.id,
            sold_order_item_id = v_order_item.id,
            sold_at = now(),
            reserved_order_id = NULL,
            reserved_order_item_id = NULL,
            reserved_at = NULL,
            reserved_until = NULL,
            updated_at = now()
        WHERE reserved_order_id = v_order.id;

        -- Insert inventory events
        INSERT INTO public.inventory_events (inventory_item_id, actor_id, event_type, previous_status, new_status, summary)
        SELECT id, p_actor_id, 'sold', 'reserved', 'sold', 'Stok terjual melalui pembayaran KlikQRIS'
        FROM public.inventory_items
        WHERE sold_order_id = v_order.id;
    END IF;

    -- 5. Complete transition
    UPDATE public.payments 
    SET status = 'paid', provider_paid_at = now(), updated_at = now() 
    WHERE id = p_payment_id;

    UPDATE public.orders 
    SET 
        status = 'paid',
        payment_status = 'paid',
        paid_at = now(),
        updated_at = now() 
    WHERE id = v_payment.order_id;

    INSERT INTO public.order_events (order_id, actor_id, event_type, previous_status, new_status, summary)
    VALUES (v_payment.order_id, p_actor_id, 'payment_received', v_order.status, 'paid', 'Pembayaran berhasil tervalidasi oleh sistem.');

    RETURN TRUE;
END;
$$;

-- settle_expired_payment: Handles payment expiration and releases inventory reservation
CREATE OR REPLACE FUNCTION public.settle_expired_payment(
    p_payment_id UUID,
    p_actor_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_payment RECORD;
    v_order RECORD;
    v_order_item RECORD;
    v_inv RECORD;
BEGIN
    -- 1. Lock payment
    SELECT * FROM public.payments WHERE id = p_payment_id FOR UPDATE INTO v_payment;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Payment record not found';
    END IF;

    -- If already paid or expired, do nothing
    IF v_payment.status IN ('paid', 'expired') THEN
        RETURN TRUE;
    END IF;

    -- 2. Lock order
    SELECT * FROM public.orders WHERE id = v_payment.order_id FOR UPDATE INTO v_order;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order record not found';
    END IF;

    -- If order paid, ignore expiration
    IF v_order.status = 'paid' THEN
        RETURN TRUE;
    END IF;

    -- 3. Update payment status to expired
    UPDATE public.payments 
    SET status = 'expired', updated_at = now() 
    WHERE id = p_payment_id;

    -- 4. Update order status to expired
    UPDATE public.orders 
    SET 
        status = 'expired',
        payment_status = 'expired',
        expired_at = now(),
        updated_at = now() 
    WHERE id = v_payment.order_id;

    INSERT INTO public.order_events (order_id, actor_id, event_type, previous_status, new_status, summary)
    VALUES (v_payment.order_id, p_actor_id, 'expired', v_order.status, 'expired', 'Batas waktu pembayaran telah kedaluwarsa.');

    -- 5. Release inventory reservations
    SELECT * FROM public.order_items WHERE order_id = v_order.id LIMIT 1 INTO v_order_item;
    IF v_order_item.stock_type = 'limited' THEN
        FOR v_inv IN 
            SELECT id, expires_at, status FROM public.inventory_items 
            WHERE reserved_order_id = v_order.id
        LOOP
            -- Check if inventory item itself is expired
            IF v_inv.expires_at IS NOT NULL AND v_inv.expires_at <= now() THEN
                UPDATE public.inventory_items 
                SET 
                    status = 'expired',
                    reserved_order_id = NULL,
                    reserved_order_item_id = NULL,
                    reserved_at = NULL,
                    reserved_until = NULL,
                    updated_at = now()
                WHERE id = v_inv.id;

                INSERT INTO public.inventory_events (inventory_item_id, actor_id, event_type, previous_status, new_status, summary)
                VALUES (v_inv.id, p_actor_id, 'expired', 'reserved', 'expired', 'Reservasi dilepas dan stok kedaluwarsa.');
            ELSE
                UPDATE public.inventory_items 
                SET 
                    status = 'available',
                    reserved_order_id = NULL,
                    reserved_order_item_id = NULL,
                    reserved_at = NULL,
                    reserved_until = NULL,
                    updated_at = now()
                WHERE id = v_inv.id;

                INSERT INTO public.inventory_events (inventory_item_id, actor_id, event_type, previous_status, new_status, summary)
                VALUES (v_inv.id, p_actor_id, 'reservation_released', 'reserved', 'available', 'Reservasi dilepas karena pembayaran kedaluwarsa.');
            END IF;
        END LOOP;
    END IF;

    RETURN TRUE;
END;
$$;

-- Revoke direct execution from public
REVOKE EXECUTE ON FUNCTION public.settle_paid_payment(UUID, TEXT, UUID) FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.settle_expired_payment(UUID, UUID) FROM public, anon, authenticated;
