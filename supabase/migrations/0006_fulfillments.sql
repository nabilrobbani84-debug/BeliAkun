-- Migration 0006: Fulfillments and Email Outbox

-- 1. Create Enums
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fulfillment_status') THEN
        CREATE TYPE public.fulfillment_status AS ENUM (
            'pending',
            'processing',
            'completed',
            'failed'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'email_status') THEN
        CREATE TYPE public.email_status AS ENUM (
            'pending',
            'sending',
            'sent',
            'failed'
        );
    END IF;
END $$;

-- 2. Create Fulfillments Table
CREATE TABLE IF NOT EXISTS public.fulfillments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
    status public.fulfillment_status NOT NULL DEFAULT 'pending',
    tracking_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fulfillments_order_id ON public.fulfillments(order_id);
CREATE INDEX IF NOT EXISTS idx_fulfillments_status ON public.fulfillments(status);

-- 3. Create Fulfillment Items Table
CREATE TABLE IF NOT EXISTS public.fulfillment_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fulfillment_id UUID NOT NULL REFERENCES public.fulfillments(id) ON DELETE CASCADE,
    order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE RESTRICT,
    inventory_item_id UUID REFERENCES public.inventory_items(id) ON DELETE SET NULL,
    credential_snapshot JSONB,
    is_delivered BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fulfillment_items_fulfillment_id ON public.fulfillment_items(fulfillment_id);

-- 4. Create Email Outbox Table
CREATE TABLE IF NOT EXISTS public.email_outbox (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    to_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    body_html TEXT NOT NULL,
    status public.email_status NOT NULL DEFAULT 'pending',
    attempts INTEGER NOT NULL DEFAULT 0,
    last_error TEXT,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_outbox_status ON public.email_outbox(status);
CREATE INDEX IF NOT EXISTS idx_email_outbox_order_id ON public.email_outbox(order_id);

-- 5. Updated_at Triggers
CREATE TRIGGER update_fulfillments_updated_at
BEFORE UPDATE ON public.fulfillments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_email_outbox_updated_at
BEFORE UPDATE ON public.email_outbox
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 6. RLS Policies
ALTER TABLE public.fulfillments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fulfillment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_outbox ENABLE ROW LEVEL SECURITY;

-- Admins can do everything on fulfillments and emails
CREATE POLICY "Admins can manage fulfillments" ON public.fulfillments FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can manage fulfillment items" ON public.fulfillment_items FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can manage email outbox" ON public.email_outbox FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Guests can view their own fulfillments via order access token (if needed, but usually we just fetch via service_role in backend)
-- No public RLS policies, access handled via backend.

-- 7. Modify settle_paid_payment to create fulfillment
-- We need to drop the old one and recreate it to append logic
CREATE OR REPLACE FUNCTION public.settle_paid_payment(
    p_payment_id UUID,
    p_event_fingerprint TEXT,
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
    v_event_exists BOOLEAN;
    v_inv_count INTEGER;
    v_fulfillment_id UUID;
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

    IF v_order.status = 'paid' THEN
        UPDATE public.payments SET status = 'paid', provider_paid_at = now(), updated_at = now() WHERE id = p_payment_id;
        RETURN TRUE;
    END IF;

    -- Get order item
    SELECT * FROM public.order_items WHERE order_id = v_order.id LIMIT 1 INTO v_order_item;

    -- Check if inventory reservation exists and is valid for limited stock
    IF v_order_item.stock_type = 'limited' THEN
        SELECT COUNT(*) FROM public.inventory_items 
        WHERE reserved_order_id = v_order.id INTO v_inv_count;

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

        INSERT INTO public.inventory_events (inventory_item_id, actor_id, event_type, previous_status, new_status, summary)
        SELECT id, p_actor_id, 'sold', 'reserved', 'sold', 'Stok terjual melalui pembayaran KlikQRIS'
        FROM public.inventory_items
        WHERE sold_order_id = v_order.id;
    END IF;

    -- 5. Complete transition
    UPDATE public.payments 
    SET status = 'paid', provider_paid_at = now(), updated_at = now() 
    WHERE id = p_payment_id;

    -- Auto-create fulfillment record
    INSERT INTO public.fulfillments (order_id, status)
    VALUES (v_payment.order_id, 'pending')
    RETURNING id INTO v_fulfillment_id;

    UPDATE public.orders 
    SET 
        status = 'paid',
        payment_status = 'paid',
        paid_at = now(),
        updated_at = now() 
    WHERE id = v_payment.order_id;

    INSERT INTO public.order_events (order_id, actor_id, event_type, previous_status, new_status, summary)
    VALUES (v_payment.order_id, p_actor_id, 'payment_received', v_order.status, 'paid', 'Pembayaran berhasil tervalidasi oleh sistem.');

    INSERT INTO public.order_events (order_id, actor_id, event_type, previous_status, new_status, summary)
    VALUES (v_payment.order_id, p_actor_id, 'fulfillment_pending', 'paid', 'paid', 'Menunggu proses pengiriman produk.');

    RETURN TRUE;
END;
$$;
