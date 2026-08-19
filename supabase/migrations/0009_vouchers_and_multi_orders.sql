-- Migration 0009: Vouchers and Voucher Usages

-- 1. Create Enums
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'discount_type') THEN
        CREATE TYPE public.discount_type AS ENUM ('percentage', 'fixed');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'voucher_status') THEN
        CREATE TYPE public.voucher_status AS ENUM ('active', 'inactive', 'expired');
    END IF;
END $$;

-- 2. Create Vouchers Table
CREATE TABLE IF NOT EXISTS public.vouchers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type public.discount_type NOT NULL,
    discount_value INTEGER NOT NULL CHECK (discount_value > 0),
    min_transaction INTEGER NOT NULL DEFAULT 0,
    max_discount INTEGER,
    usage_limit INTEGER,
    current_usage INTEGER NOT NULL DEFAULT 0,
    status public.voucher_status NOT NULL DEFAULT 'active',
    valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraint: Percentage max 100
    CONSTRAINT check_percentage_max CHECK (
        discount_type != 'percentage' OR discount_value <= 100
    )
);

CREATE INDEX IF NOT EXISTS idx_vouchers_code ON public.vouchers(code);
CREATE INDEX IF NOT EXISTS idx_vouchers_status ON public.vouchers(status);

-- 3. Create Voucher Usages Table
CREATE TABLE IF NOT EXISTS public.voucher_usages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    voucher_id UUID NOT NULL REFERENCES public.vouchers(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    discount_applied INTEGER NOT NULL CHECK (discount_applied >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Prevent duplicate usage per order
    CONSTRAINT uq_voucher_order UNIQUE(voucher_id, order_id)
);

CREATE INDEX IF NOT EXISTS idx_voucher_usages_order_id ON public.voucher_usages(order_id);
CREATE INDEX IF NOT EXISTS idx_voucher_usages_customer_id ON public.voucher_usages(customer_id);

-- 4. Add voucher_id to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS voucher_id UUID REFERENCES public.vouchers(id) ON DELETE SET NULL;

-- 5. Trigger for updated_at
DROP TRIGGER IF EXISTS trg_vouchers_updated_at ON public.vouchers;
CREATE TRIGGER trg_vouchers_updated_at
BEFORE UPDATE ON public.vouchers
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 6. Row Level Security
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voucher_usages ENABLE ROW LEVEL SECURITY;

-- Public can read active vouchers
DROP POLICY IF EXISTS "Public read active vouchers" ON public.vouchers;
CREATE POLICY "Public read active vouchers" ON public.vouchers
FOR SELECT USING (status = 'active');

-- Admins can do everything
DROP POLICY IF EXISTS "Admin full access vouchers" ON public.vouchers;
CREATE POLICY "Admin full access vouchers" ON public.vouchers
FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admin full access voucher_usages" ON public.voucher_usages;
CREATE POLICY "Admin full access voucher_usages" ON public.voucher_usages
FOR ALL USING (is_admin());

-- 7. Multi-Item Order RPC Updates
-- We will create a new function `create_multi_item_order` in the next migration or keep it in the backend code if possible.
-- For now, the database schema is ready.
