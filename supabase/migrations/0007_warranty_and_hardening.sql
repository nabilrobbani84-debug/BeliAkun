-- Migration 0007: Warranty System, Monitoring, and Hardening

-- 1. Create Enums
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'warranty_status') THEN
        CREATE TYPE public.warranty_status AS ENUM (
            'active',
            'claimed',
            'replaced',
            'rejected',
            'expired'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'claim_status') THEN
        CREATE TYPE public.claim_status AS ENUM (
            'pending',
            'processing',
            'resolved',
            'rejected'
        );
    END IF;
END $$;

-- 2. Create Warranties Table
CREATE TABLE IF NOT EXISTS public.warranties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
    status public.warranty_status NOT NULL DEFAULT 'active',
    valid_until TIMESTAMPTZ NOT NULL,
    terms TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_warranties_order_id ON public.warranties(order_id);
CREATE INDEX IF NOT EXISTS idx_warranties_status ON public.warranties(status);

-- 3. Create Warranty Claims Table
CREATE TABLE IF NOT EXISTS public.warranty_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warranty_id UUID NOT NULL REFERENCES public.warranties(id) ON DELETE CASCADE,
    status public.claim_status NOT NULL DEFAULT 'pending',
    reason TEXT NOT NULL,
    proof_image_url TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_warranty_claims_warranty_id ON public.warranty_claims(warranty_id);
CREATE INDEX IF NOT EXISTS idx_warranty_claims_status ON public.warranty_claims(status);

-- 4. Create Warranty Replacements Table
CREATE TABLE IF NOT EXISTS public.warranty_replacements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_id UUID NOT NULL REFERENCES public.warranty_claims(id) ON DELETE CASCADE,
    inventory_item_id UUID REFERENCES public.inventory_items(id) ON DELETE SET NULL,
    credential_snapshot JSONB NOT NULL,
    delivery_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Create Rate Limits Table for Hardening
CREATE TABLE IF NOT EXISTS public.rate_limits (
    ip_address TEXT PRIMARY KEY,
    endpoint TEXT NOT NULL,
    request_count INTEGER NOT NULL DEFAULT 1,
    last_request_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    blocked_until TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_endpoint ON public.rate_limits(endpoint);

-- 6. Updated_at Triggers
CREATE TRIGGER update_warranties_updated_at
BEFORE UPDATE ON public.warranties
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_warranty_claims_updated_at
BEFORE UPDATE ON public.warranty_claims
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 7. RLS Policies
ALTER TABLE public.warranties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warranty_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warranty_replacements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage warranties" ON public.warranties FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can manage warranty claims" ON public.warranty_claims FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can manage warranty replacements" ON public.warranty_replacements FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can manage rate limits" ON public.rate_limits FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Guests logic handled via Service Role / Backend endpoints

-- 8. Trigger to Auto-Create Warranty on Fulfillment
-- Modify fulfillments table to trigger warranty creation if it's completed
CREATE OR REPLACE FUNCTION public.handle_fulfillment_completion()
RETURNS TRIGGER AS $$
DECLARE
    v_order_item RECORD;
    v_duration_days INTEGER := 30; -- Default warranty 30 days
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        -- Get order item duration info if exists, else default 30 days
        -- Simplified logic: assume 30 days for now, this can be enhanced based on product attributes
        SELECT * INTO v_order_item 
        FROM public.order_items 
        WHERE order_id = NEW.order_id 
        LIMIT 1;

        -- We only insert if not exists
        IF NOT EXISTS (SELECT 1 FROM public.warranties WHERE order_item_id = v_order_item.id) THEN
            INSERT INTO public.warranties (order_id, order_item_id, status, valid_until, terms)
            VALUES (
                NEW.order_id, 
                v_order_item.id, 
                'active', 
                now() + (v_duration_days || ' days')::interval,
                'Garansi berlaku ' || v_duration_days || ' hari sejak produk dikirim.'
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_fulfillment_completion ON public.fulfillments;
CREATE TRIGGER trigger_fulfillment_completion
AFTER UPDATE ON public.fulfillments
FOR EACH ROW EXECUTE FUNCTION public.handle_fulfillment_completion();
