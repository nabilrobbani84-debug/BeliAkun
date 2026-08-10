-- ==============================================================================
-- BELIAKUN.COM - MASTER DATABASE SCHEMA (MIGRATIONS 0001 TO 0007)
-- Database Engine: Supabase (PostgreSQL)
-- Safe / Idempotent Execution Script
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- MIGRATION 0001: CATALOG FOUNDATION
-- ------------------------------------------------------------------------------

-- Enums
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'category_status') THEN
        CREATE TYPE category_status AS ENUM ('active', 'inactive', 'archived');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_status') THEN
        CREATE TYPE product_status AS ENUM ('draft', 'active', 'inactive', 'archived');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_badge') THEN
        CREATE TYPE product_badge AS ENUM ('none', 'bestseller', 'saving', 'new', 'limited_stock');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'delivery_method') THEN
        CREATE TYPE delivery_method AS ENUM ('instant', 'manual');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'variant_status') THEN
        CREATE TYPE variant_status AS ENUM ('active', 'inactive', 'archived');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stock_type') THEN
        CREATE TYPE stock_type AS ENUM ('limited', 'unlimited');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_type') THEN
        CREATE TYPE account_type AS ENUM ('invite', 'sharing', 'private', 'license', 'link_access', 'custom');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'duration_unit') THEN
        CREATE TYPE duration_unit AS ENUM ('day', 'week', 'month', 'year', 'lifetime', 'custom');
    END IF;
END $$;

-- Updated At Function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    status category_status NOT NULL DEFAULT 'active',
    icon_key VARCHAR(255),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_status ON categories(status);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

DROP TRIGGER IF EXISTS trg_categories_updated_at ON categories;
CREATE TRIGGER trg_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    short_description TEXT,
    description TEXT,
    features JSONB,
    badge product_badge NOT NULL DEFAULT 'none',
    delivery_method delivery_method NOT NULL DEFAULT 'manual',
    warranty_enabled BOOLEAN NOT NULL DEFAULT false,
    warranty_duration INTEGER,
    warranty_unit duration_unit,
    warranty_label VARCHAR(100),
    thumbnail_key VARCHAR(255),
    status product_status NOT NULL DEFAULT 'draft',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON products(sort_order);

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Product Variants Table
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    price INTEGER NOT NULL CHECK (price >= 0),
    compare_at_price INTEGER CHECK (compare_at_price IS NULL OR compare_at_price >= 0),
    duration_value INTEGER CHECK (duration_value IS NULL OR duration_value >= 0),
    duration_unit duration_unit NOT NULL DEFAULT 'custom',
    duration_label VARCHAR(100),
    package_label VARCHAR(100),
    stock_type stock_type NOT NULL DEFAULT 'unlimited',
    account_type account_type NOT NULL DEFAULT 'custom',
    status variant_status NOT NULL DEFAULT 'active',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_variants_status ON product_variants(status);
CREATE INDEX IF NOT EXISTS idx_product_variants_sort_order ON product_variants(sort_order);

DROP TRIGGER IF EXISTS trg_product_variants_updated_at ON product_variants;
CREATE TRIGGER trg_product_variants_updated_at
BEFORE UPDATE ON product_variants
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active categories" ON categories;
CREATE POLICY "Public read active categories" ON categories FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Public read active products" ON products;
CREATE POLICY "Public read active products" ON products FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Public read active variants" ON product_variants;
CREATE POLICY "Public read active variants" ON product_variants FOR SELECT USING (status = 'active');


-- ------------------------------------------------------------------------------
-- MIGRATION 0002: ADMIN AUTH & CATALOG MANAGEMENT
-- ------------------------------------------------------------------------------

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('customer', 'admin', 'super_admin');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'profile_status') THEN
        CREATE TYPE profile_status AS ENUM ('active', 'suspended');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'field_type') THEN
        CREATE TYPE field_type AS ENUM ('text', 'email', 'password', 'url', 'code', 'pin', 'textarea', 'number');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    role user_role NOT NULL DEFAULT 'customer',
    status profile_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    'customer',
    'active'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TABLE IF NOT EXISTS product_delivery_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    field_key VARCHAR(100) NOT NULL,
    label VARCHAR(255) NOT NULL,
    field_type field_type NOT NULL DEFAULT 'text',
    placeholder VARCHAR(255),
    description TEXT,
    is_required BOOLEAN NOT NULL DEFAULT true,
    is_secret BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (product_id, field_key)
);

CREATE INDEX IF NOT EXISTS idx_product_delivery_fields_product_id ON product_delivery_fields(product_id);

DROP TRIGGER IF EXISTS trg_product_delivery_fields_updated_at ON product_delivery_fields;
CREATE TRIGGER trg_product_delivery_fields_updated_at BEFORE UPDATE ON product_delivery_fields FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_delivery_fields ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin can perform all actions on profiles" ON profiles;
CREATE POLICY "Admin can perform all actions on profiles" ON profiles FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Public read active product delivery fields" ON product_delivery_fields;
CREATE POLICY "Public read active product delivery fields" ON product_delivery_fields FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE products.id = product_delivery_fields.product_id AND products.status = 'active')
);

DROP POLICY IF EXISTS "Admin can perform all actions on delivery fields" ON product_delivery_fields;
CREATE POLICY "Admin can perform all actions on delivery fields" ON product_delivery_fields FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admin select categories" ON categories;
CREATE POLICY "Admin select categories" ON categories FOR SELECT USING (is_admin());
DROP POLICY IF EXISTS "Admin insert categories" ON categories;
CREATE POLICY "Admin insert categories" ON categories FOR INSERT WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Admin update categories" ON categories;
CREATE POLICY "Admin update categories" ON categories FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Admin delete categories" ON categories;
CREATE POLICY "Admin delete categories" ON categories FOR DELETE USING (is_admin());

DROP POLICY IF EXISTS "Admin select products" ON products;
CREATE POLICY "Admin select products" ON products FOR SELECT USING (is_admin());
DROP POLICY IF EXISTS "Admin insert products" ON products;
CREATE POLICY "Admin insert products" ON products FOR INSERT WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Admin update products" ON products;
CREATE POLICY "Admin update products" ON products FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Admin delete products" ON products;
CREATE POLICY "Admin delete products" ON products FOR DELETE USING (is_admin());

DROP POLICY IF EXISTS "Admin select variants" ON product_variants;
CREATE POLICY "Admin select variants" ON product_variants FOR SELECT USING (is_admin());
DROP POLICY IF EXISTS "Admin insert variants" ON product_variants;
CREATE POLICY "Admin insert variants" ON product_variants FOR INSERT WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Admin update variants" ON product_variants;
CREATE POLICY "Admin update variants" ON product_variants FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Admin delete variants" ON product_variants;
CREATE POLICY "Admin delete variants" ON product_variants FOR DELETE USING (is_admin());


-- ------------------------------------------------------------------------------
-- MIGRATION 0003: INVENTORY SYSTEM
-- ------------------------------------------------------------------------------

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'inventory_status') THEN
        CREATE TYPE public.inventory_status AS ENUM (
          'available', 'reserved', 'sold', 'expired', 'invalid', 'replaced'
        );
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
  status public.inventory_status NOT NULL DEFAULT 'available',
  encrypted_payload JSONB NOT NULL,
  payload_fingerprint TEXT NOT NULL,
  encryption_version INTEGER NOT NULL DEFAULT 1,
  internal_note TEXT,
  usage_instructions TEXT,
  delivery_note TEXT,
  expires_at TIMESTAMPTZ,
  reservation_reference TEXT,
  reserved_at TIMESTAMPTZ,
  reserved_until TIMESTAMPTZ,
  sold_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT check_encryption_version CHECK (encryption_version > 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_inventory_items_fingerprint ON public.inventory_items (payload_fingerprint);
CREATE INDEX IF NOT EXISTS idx_inventory_items_variant_id ON public.inventory_items (variant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_status ON public.inventory_items (status);

CREATE TABLE IF NOT EXISTS public.inventory_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  previous_status public.inventory_status,
  new_status public.inventory_status,
  summary TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inventory_events_item_id ON public.inventory_events (inventory_item_id);

DROP TRIGGER IF EXISTS update_inventory_items_updated_at ON public.inventory_items;
CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON public.inventory_items FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can select inventory items" ON public.inventory_items;
CREATE POLICY "Admins can select inventory items" ON public.inventory_items FOR SELECT TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS "Admins can insert inventory items" ON public.inventory_items;
CREATE POLICY "Admins can insert inventory items" ON public.inventory_items FOR INSERT TO authenticated WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Admins can update inventory items" ON public.inventory_items;
CREATE POLICY "Admins can update inventory items" ON public.inventory_items FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Admins can delete inventory items" ON public.inventory_items;
CREATE POLICY "Admins can delete inventory items" ON public.inventory_items FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can select inventory events" ON public.inventory_events;
CREATE POLICY "Admins can select inventory events" ON public.inventory_events FOR SELECT TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS "Admins can insert inventory events" ON public.inventory_events;
CREATE POLICY "Admins can insert inventory events" ON public.inventory_events FOR INSERT TO authenticated WITH CHECK (public.is_admin());


-- ------------------------------------------------------------------------------
-- MIGRATION 0004: GUEST CHECKOUT AND ORDERS
-- ------------------------------------------------------------------------------

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE public.order_status AS ENUM (
          'pending_payment', 'paid', 'processing', 'delivered', 'completed', 'expired', 'cancelled', 'failed', 'refunded', 'payment_review'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE public.payment_status AS ENUM (
          'initializing', 'pending', 'paid', 'expired', 'failed', 'unknown', 'review', 'refunded'
        );
    END IF;
END $$;

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

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  requires_payment_review BOOLEAN DEFAULT FALSE,
  payment_review_reason TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders (recipient_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_idempotency ON public.orders (idempotency_key);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items (order_id);

CREATE TABLE IF NOT EXISTS public.order_access_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  last_used_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_access_tokens_hash ON public.order_access_tokens (token_hash);
CREATE INDEX IF NOT EXISTS idx_order_access_tokens_order_id ON public.order_access_tokens (order_id);

CREATE TABLE IF NOT EXISTS public.order_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  previous_status TEXT,
  new_status TEXT,
  summary TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_events_order_id ON public.order_events (order_id);

ALTER TABLE public.inventory_items
ADD COLUMN IF NOT EXISTS reserved_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS reserved_order_item_id UUID REFERENCES public.order_items(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS sold_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS sold_order_item_id UUID REFERENCES public.order_items(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_inventory_items_reserved_order ON public.inventory_items (reserved_order_id);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_access_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage orders" ON public.orders;
CREATE POLICY "Admins can manage orders" ON public.orders FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Admins can manage order items" ON public.order_items;
CREATE POLICY "Admins can manage order items" ON public.order_items FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Admins can manage order access tokens" ON public.order_access_tokens;
CREATE POLICY "Admins can manage order access tokens" ON public.order_access_tokens FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Admins can manage order events" ON public.order_events;
CREATE POLICY "Admins can manage order events" ON public.order_events FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ------------------------------------------------------------------------------
-- MIGRATION 0005: KLIKQRIS PAYMENTS
-- ------------------------------------------------------------------------------

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_provider') THEN
        CREATE TYPE public.payment_provider AS ENUM ('klikqris');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_event_source') THEN
        CREATE TYPE public.payment_event_source AS ENUM ('create', 'webhook', 'status_sync', 'admin_sync', 'system');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_processing_status') THEN
        CREATE TYPE public.event_processing_status AS ENUM ('received', 'processed', 'ignored', 'rejected', 'failed');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
    provider public.payment_provider NOT NULL DEFAULT 'klikqris',
    provider_mode TEXT NOT NULL,
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

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider_order_id ON public.payments(provider_order_id);

CREATE TABLE IF NOT EXISTS public.payment_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    provider public.payment_provider NOT NULL DEFAULT 'klikqris',
    provider_order_id TEXT NOT NULL,
    source public.payment_event_source NOT NULL,
    event_type TEXT NOT NULL,
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

CREATE INDEX IF NOT EXISTS idx_payment_events_payment_id ON public.payment_events(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_order_id ON public.payment_events(order_id);

DROP TRIGGER IF EXISTS trg_payments_updated_at ON public.payments;
CREATE TRIGGER trg_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS admin_select_payments ON public.payments;
CREATE POLICY admin_select_payments ON public.payments FOR SELECT TO authenticated USING (is_admin());

DROP POLICY IF EXISTS admin_select_payment_events ON public.payment_events;
CREATE POLICY admin_select_payment_events ON public.payment_events FOR SELECT TO authenticated USING (is_admin());


-- ------------------------------------------------------------------------------
-- MIGRATION 0006: FULFILLMENTS AND EMAIL OUTBOX
-- ------------------------------------------------------------------------------

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fulfillment_status') THEN
        CREATE TYPE public.fulfillment_status AS ENUM ('pending', 'processing', 'completed', 'failed');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'email_status') THEN
        CREATE TYPE public.email_status AS ENUM ('pending', 'sending', 'sent', 'failed');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.fulfillments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
    status public.fulfillment_status NOT NULL DEFAULT 'pending',
    tracking_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fulfillments_order_id ON public.fulfillments(order_id);
CREATE INDEX IF NOT EXISTS idx_fulfillments_status ON public.fulfillments(status);

CREATE TABLE IF NOT EXISTS public.fulfillment_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fulfillment_id UUID NOT NULL REFERENCES public.fulfillments(id) ON DELETE CASCADE,
    order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE RESTRICT,
    inventory_item_id UUID REFERENCES public.inventory_items(id) ON DELETE SET NULL,
    credential_snapshot JSONB,
    is_delivered BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fulfillment_items_fulfillment_id ON public.fulfillment_items(fulfillment_id);

CREATE TABLE IF NOT EXISTS public.email_outbox (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

DROP TRIGGER IF EXISTS update_fulfillments_updated_at ON public.fulfillments;
CREATE TRIGGER update_fulfillments_updated_at BEFORE UPDATE ON public.fulfillments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS update_email_outbox_updated_at ON public.email_outbox;
CREATE TRIGGER update_email_outbox_updated_at BEFORE UPDATE ON public.email_outbox FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.fulfillments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fulfillment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_outbox ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage fulfillments" ON public.fulfillments;
CREATE POLICY "Admins can manage fulfillments" ON public.fulfillments FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage fulfillment items" ON public.fulfillment_items;
CREATE POLICY "Admins can manage fulfillment items" ON public.fulfillment_items FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage email outbox" ON public.email_outbox;
CREATE POLICY "Admins can manage email outbox" ON public.email_outbox FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ------------------------------------------------------------------------------
-- MIGRATION 0007: WARRANTY SYSTEM AND HARDENING
-- ------------------------------------------------------------------------------

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'warranty_status') THEN
        CREATE TYPE public.warranty_status AS ENUM ('active', 'claimed', 'replaced', 'rejected', 'expired');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'claim_status') THEN
        CREATE TYPE public.claim_status AS ENUM ('pending', 'processing', 'resolved', 'rejected');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.warranties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TABLE IF NOT EXISTS public.warranty_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TABLE IF NOT EXISTS public.warranty_replacements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id UUID NOT NULL REFERENCES public.warranty_claims(id) ON DELETE CASCADE,
    inventory_item_id UUID REFERENCES public.inventory_items(id) ON DELETE SET NULL,
    credential_snapshot JSONB NOT NULL,
    delivery_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.rate_limits (
    ip_address TEXT PRIMARY KEY,
    endpoint TEXT NOT NULL,
    request_count INTEGER NOT NULL DEFAULT 1,
    last_request_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    blocked_until TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_endpoint ON public.rate_limits(endpoint);

DROP TRIGGER IF EXISTS update_warranties_updated_at ON public.warranties;
CREATE TRIGGER update_warranties_updated_at BEFORE UPDATE ON public.warranties FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS update_warranty_claims_updated_at ON public.warranty_claims;
CREATE TRIGGER update_warranty_claims_updated_at BEFORE UPDATE ON public.warranty_claims FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE public.warranties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warranty_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warranty_replacements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage warranties" ON public.warranties;
CREATE POLICY "Admins can manage warranties" ON public.warranties FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage warranty claims" ON public.warranty_claims;
CREATE POLICY "Admins can manage warranty claims" ON public.warranty_claims FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage warranty replacements" ON public.warranty_replacements;
CREATE POLICY "Admins can manage warranty replacements" ON public.warranty_replacements FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage rate limits" ON public.rate_limits;
CREATE POLICY "Admins can manage rate limits" ON public.rate_limits FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ------------------------------------------------------------------------------
-- SYSTEM PROCEDURES & TRIGGERS (SETTLE PAYMENTS & FULFILLMENT COMPLETION)
-- ------------------------------------------------------------------------------

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
    SELECT EXISTS(
        SELECT 1 FROM public.payment_events 
        WHERE event_fingerprint = p_event_fingerprint AND processing_status = 'processed'
    ) INTO v_event_exists;
    
    IF v_event_exists THEN
        RETURN TRUE;
    END IF;

    SELECT * FROM public.payments WHERE id = p_payment_id FOR UPDATE INTO v_payment;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Payment record not found';
    END IF;

    IF v_payment.status = 'paid' THEN
        RETURN TRUE;
    END IF;

    SELECT * FROM public.orders WHERE id = v_payment.order_id FOR UPDATE INTO v_order;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order record not found';
    END IF;

    IF v_order.status IN ('expired', 'cancelled') THEN
        UPDATE public.payments SET status = 'review', provider_paid_at = now(), updated_at = now() WHERE id = p_payment_id;
        UPDATE public.orders SET status = 'payment_review', requires_payment_review = TRUE, payment_review_reason = 'Pembayaran sukses diterima setelah pesanan dibatalkan/kedaluwarsa.', updated_at = now() WHERE id = v_payment.order_id;
        INSERT INTO public.order_events (order_id, actor_id, event_type, previous_status, new_status, summary) VALUES (v_payment.order_id, p_actor_id, 'payment_review_triggered', v_order.status, 'payment_review', 'Pembayaran masuk setelah order tidak aktif.');
        RETURN FALSE;
    END IF;

    IF v_order.status = 'paid' THEN
        UPDATE public.payments SET status = 'paid', provider_paid_at = now(), updated_at = now() WHERE id = p_payment_id;
        RETURN TRUE;
    END IF;

    SELECT * FROM public.order_items WHERE order_id = v_order.id LIMIT 1 INTO v_order_item;

    IF v_order_item.stock_type = 'limited' THEN
        SELECT COUNT(*) FROM public.inventory_items WHERE reserved_order_id = v_order.id INTO v_inv_count;
        IF v_inv_count = 0 THEN
            UPDATE public.payments SET status = 'review', provider_paid_at = now(), updated_at = now() WHERE id = p_payment_id;
            UPDATE public.orders SET status = 'payment_review', requires_payment_review = TRUE, payment_review_reason = 'Stok terreservasi tidak ditemukan saat pembayaran diterima.', updated_at = now() WHERE id = v_payment.order_id;
            INSERT INTO public.order_events (order_id, actor_id, event_type, previous_status, new_status, summary) VALUES (v_payment.order_id, p_actor_id, 'payment_review_triggered', v_order.status, 'payment_review', 'Gagal memproses pembayaran: reservasi stok hilang.');
            RETURN FALSE;
        END IF;

        UPDATE public.inventory_items
        SET status = 'sold', sold_order_id = v_order.id, sold_order_item_id = v_order_item.id, sold_at = now(), reserved_order_id = NULL, reserved_order_item_id = NULL, reserved_at = NULL, reserved_until = NULL, updated_at = now()
        WHERE reserved_order_id = v_order.id;

        INSERT INTO public.inventory_events (inventory_item_id, actor_id, event_type, previous_status, new_status, summary)
        SELECT id, p_actor_id, 'sold', 'reserved', 'sold', 'Stok terjual melalui pembayaran KlikQRIS' FROM public.inventory_items WHERE sold_order_id = v_order.id;
    END IF;

    UPDATE public.payments SET status = 'paid', provider_paid_at = now(), updated_at = now() WHERE id = p_payment_id;

    INSERT INTO public.fulfillments (order_id, status) VALUES (v_payment.order_id, 'pending') RETURNING id INTO v_fulfillment_id;

    UPDATE public.orders SET status = 'paid', payment_status = 'paid', paid_at = now(), updated_at = now() WHERE id = v_payment.order_id;

    INSERT INTO public.order_events (order_id, actor_id, event_type, previous_status, new_status, summary) VALUES (v_payment.order_id, p_actor_id, 'payment_received', v_order.status, 'paid', 'Pembayaran berhasil tervalidasi oleh sistem.');
    INSERT INTO public.order_events (order_id, actor_id, event_type, previous_status, new_status, summary) VALUES (v_payment.order_id, p_actor_id, 'fulfillment_pending', 'paid', 'paid', 'Menunggu proses pengiriman produk.');

    RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_fulfillment_completion()
RETURNS TRIGGER AS $$
DECLARE
    v_order_item RECORD;
    v_duration_days INTEGER := 30;
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        SELECT * INTO v_order_item FROM public.order_items WHERE order_id = NEW.order_id LIMIT 1;
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
CREATE TRIGGER trigger_fulfillment_completion AFTER UPDATE ON public.fulfillments FOR EACH ROW EXECUTE FUNCTION public.handle_fulfillment_completion();
