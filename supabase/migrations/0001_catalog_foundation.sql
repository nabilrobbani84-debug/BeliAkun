-- Migration 0001: Catalog Foundation

-- 1. Custom Types / Enums
CREATE TYPE category_status AS ENUM ('active', 'inactive', 'archived');
CREATE TYPE product_status AS ENUM ('draft', 'active', 'inactive', 'archived');
CREATE TYPE product_badge AS ENUM ('none', 'bestseller', 'saving', 'new', 'limited_stock');
CREATE TYPE delivery_method AS ENUM ('instant', 'manual');
CREATE TYPE variant_status AS ENUM ('active', 'inactive', 'archived');
CREATE TYPE stock_type AS ENUM ('limited', 'unlimited');
CREATE TYPE account_type AS ENUM ('invite', 'sharing', 'private', 'license', 'link_access', 'custom');
CREATE TYPE duration_unit AS ENUM ('day', 'week', 'month', 'year', 'lifetime', 'custom');

-- 2. Updated At Trigger Function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Categories Table
CREATE TABLE categories (
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

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_status ON categories(status);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);

CREATE TRIGGER trg_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 4. Products Table
CREATE TABLE products (
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

CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_sort_order ON products(sort_order);

CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 5. Product Variants Table
CREATE TABLE product_variants (
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

CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);
CREATE INDEX idx_product_variants_status ON product_variants(status);
CREATE INDEX idx_product_variants_sort_order ON product_variants(sort_order);

CREATE TRIGGER trg_product_variants_updated_at
BEFORE UPDATE ON product_variants
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 6. Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Public read-only policies
CREATE POLICY "Public read active categories" ON categories
FOR SELECT USING (status = 'active');

CREATE POLICY "Public read active products" ON products
FOR SELECT USING (status = 'active');

CREATE POLICY "Public read active variants" ON product_variants
FOR SELECT USING (status = 'active');
