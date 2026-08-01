-- Migration 0002: Admin Auth & Catalog Management

-- 1. Create Role and Status Enums
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'super_admin');
CREATE TYPE profile_status AS ENUM ('active', 'suspended');
CREATE TYPE field_type AS ENUM ('text', 'email', 'password', 'url', 'code', 'pin', 'textarea', 'number');

-- 2. Create Profiles Table (Linked to auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    role user_role NOT NULL DEFAULT 'customer',
    status profile_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_status ON profiles(status);

-- Trigger updated_at on profiles
CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 3. Trigger Function: Sync auth.users to profiles
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
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 4. Helper Function: Check Admin Authorization
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

-- 5. Create Product Delivery Fields Table
CREATE TABLE product_delivery_fields (
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

CREATE INDEX idx_product_delivery_fields_product_id ON product_delivery_fields(product_id);

-- Trigger updated_at on product_delivery_fields
CREATE TRIGGER trg_product_delivery_fields_updated_at
BEFORE UPDATE ON product_delivery_fields
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 6. Row Level Security Configuration

-- Enable RLS on new tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_delivery_fields ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can read own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own non-sensitive profile" ON profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id 
        AND role = (SELECT role FROM profiles WHERE id = auth.uid()) -- Prevents role escalation
        AND status = (SELECT status FROM profiles WHERE id = auth.uid()) -- Prevents status change
    );

CREATE POLICY "Admin can perform all actions on profiles" ON profiles
    FOR ALL USING (is_admin());

-- Product Delivery Fields Policies
CREATE POLICY "Public read active product delivery fields" ON product_delivery_fields
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM products 
            WHERE products.id = product_delivery_fields.product_id 
              AND products.status = 'active'
        )
    );

CREATE POLICY "Admin can perform all actions on delivery fields" ON product_delivery_fields
    FOR ALL USING (is_admin());

-- 7. Add Admin Policies to Catalog Tables (From Step 1)
-- Categories admin policies
CREATE POLICY "Admin select categories" ON categories FOR SELECT USING (is_admin());
CREATE POLICY "Admin insert categories" ON categories FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update categories" ON categories FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete categories" ON categories FOR DELETE USING (is_admin());

-- Products admin policies
CREATE POLICY "Admin select products" ON products FOR SELECT USING (is_admin());
CREATE POLICY "Admin insert products" ON products FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update products" ON products FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete products" ON products FOR DELETE USING (is_admin());

-- Product Variants admin policies
CREATE POLICY "Admin select variants" ON product_variants FOR SELECT USING (is_admin());
CREATE POLICY "Admin insert variants" ON product_variants FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update variants" ON product_variants FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete variants" ON product_variants FOR DELETE USING (is_admin());
