-- Migration Step 3: Sistem Stok dan Inventory
-- Fokus pada penyimpanan kredensial digital secara terenkripsi

-- 1. Buat Enum Status Inventory
CREATE TYPE public.inventory_status AS ENUM (
  'available',
  'reserved',
  'sold',
  'expired',
  'invalid',
  'replaced'
);

-- 2. Buat Tabel Inventory Items
CREATE TABLE public.inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
  status public.inventory_status NOT NULL DEFAULT 'available',
  
  -- Kriptografi
  encrypted_payload JSONB NOT NULL,
  payload_fingerprint TEXT NOT NULL,
  encryption_version INTEGER NOT NULL DEFAULT 1,
  
  -- Metadata
  internal_note TEXT,
  usage_instructions TEXT,
  delivery_note TEXT,
  
  -- Waktu
  expires_at TIMESTAMPTZ,
  
  -- Reservasi (Disiapkan untuk Step 4)
  reservation_reference TEXT,
  reserved_at TIMESTAMPTZ,
  reserved_until TIMESTAMPTZ,
  sold_at TIMESTAMPTZ,
  
  -- Aktor & Timestamp
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraint Validasi
  CONSTRAINT check_encryption_version CHECK (encryption_version > 0),
  CONSTRAINT check_reservation_time CHECK (reserved_until > reserved_at)
);

-- Index Unique untuk mencegah duplicate data stok berdasarkan fingerprint
CREATE UNIQUE INDEX idx_inventory_items_fingerprint ON public.inventory_items (payload_fingerprint);
CREATE INDEX idx_inventory_items_variant_id ON public.inventory_items (variant_id);
CREATE INDEX idx_inventory_items_status ON public.inventory_items (status);

-- 3. Buat Tabel Inventory Events
CREATE TABLE public.inventory_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventory_item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  previous_status public.inventory_status,
  new_status public.inventory_status,
  summary TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_inventory_events_item_id ON public.inventory_events (inventory_item_id);

-- 4. Aktifkan Triggers Updated At
CREATE TRIGGER update_inventory_items_updated_at
BEFORE UPDATE ON public.inventory_items
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 5. Aktifkan Row Level Security (RLS)
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_events ENABLE ROW LEVEL SECURITY;

-- 6. Kebijakan RLS (Hanya Admin yang dapat mengakses)

-- Policies untuk inventory_items
CREATE POLICY "Admins can select inventory items"
ON public.inventory_items
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can insert inventory items"
ON public.inventory_items
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update inventory items"
ON public.inventory_items
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete inventory items"
ON public.inventory_items
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Policies untuk inventory_events
CREATE POLICY "Admins can select inventory events"
ON public.inventory_events
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can insert inventory events"
ON public.inventory_events
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- Publik (Anonymous) sama sekali tidak memiliki policy, sehingga data inventory akan kosong jika diakses publik.
