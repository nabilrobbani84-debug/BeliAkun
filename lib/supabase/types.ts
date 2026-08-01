export type CategoryStatus = 'active' | 'inactive' | 'archived';
export type ProductStatus = 'draft' | 'active' | 'inactive' | 'archived';
export type ProductBadge = 'none' | 'bestseller' | 'saving' | 'new' | 'limited_stock';
export type DeliveryMethod = 'instant' | 'manual';
export type VariantStatus = 'active' | 'inactive' | 'archived';
export type StockType = 'limited' | 'unlimited';
export type AccountType = 'invite' | 'sharing' | 'private' | 'license' | 'link_access' | 'custom';
export type DurationUnit = 'day' | 'week' | 'month' | 'year' | 'lifetime' | 'custom';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: CategoryStatus;
  icon_key: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  features: string[] | null;
  badge: ProductBadge;
  delivery_method: DeliveryMethod;
  warranty_enabled: boolean;
  warranty_duration: number | null;
  warranty_unit: DurationUnit | null;
  warranty_label: string | null;
  thumbnail_key: string | null;
  status: ProductStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  price: number;
  compare_at_price: number | null;
  duration_value: number | null;
  duration_unit: DurationUnit;
  duration_label: string | null;
  package_label: string | null;
  stock_type: StockType;
  account_type: AccountType;
  status: VariantStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductWithVariants extends Product {
  variants: ProductVariant[];
}
