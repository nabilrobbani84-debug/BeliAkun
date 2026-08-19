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

export type InventoryStatus = 'available' | 'reserved' | 'sold' | 'expired' | 'invalid' | 'replaced';

export interface InventoryItem {
  id: string;
  variant_id: string;
  status: InventoryStatus;
  encrypted_payload: any; // jsonb
  payload_fingerprint: string;
  encryption_version: number;
  internal_note: string | null;
  usage_instructions: string | null;
  delivery_note: string | null;
  expires_at: string | null;
  reservation_reference: string | null;
  reserved_at: string | null;
  reserved_until: string | null;
  sold_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface InventoryEvent {
  id: string;
  inventory_item_id: string;
  actor_id: string | null;
  event_type: string;
  previous_status: InventoryStatus | null;
  new_status: InventoryStatus | null;
  summary: string;
  metadata: any | null; // jsonb
  created_at: string;
}

export type OrderStatus = 'pending_payment' | 'paid' | 'processing' | 'delivered' | 'completed' | 'expired' | 'cancelled' | 'failed' | 'refunded' | 'payment_review';
export type PaymentStatus = 'pending' | 'paid' | 'expired' | 'failed' | 'refunded';

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  recipient_email: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  currency: string;
  subtotal: number;
  discount_total: number;
  grand_total: number;
  idempotency_key: string;
  source: string;
  reservation_expires_at: string | null;
  cancelled_at: string | null;
  expired_at: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  product_slug: string;
  variant_name: string;
  sku: string | null;
  quantity: number;
  unit_price: number;
  compare_at_price: number | null;
  subtotal: number;
  delivery_method: string | null;
  stock_type: string | null;
  account_type: string | null;
  duration_value: number | null;
  duration_unit: string | null;
  duration_label: string | null;
  package_label: string | null;
  warranty_enabled: boolean | null;
  warranty_duration: number | null;
  warranty_unit: string | null;
  warranty_label: string | null;
  created_at: string;
}

export interface OrderAccessToken {
  id: string;
  order_id: string;
  token_hash: string;
  expires_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
  created_at: string;
}

export interface OrderEvent {
  id: string;
  order_id: string;
  actor_id: string | null;
  event_type: string;
  previous_status: string | null;
  new_status: string | null;
  summary: string;
  metadata: any | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  related_order_id: string | null;
  created_at: string;
  updated_at: string;
}

export type PaymentProvider = 'klikqris';
export type PaymentEventSource = 'create' | 'webhook' | 'status_sync' | 'admin_sync' | 'system';
export type EventProcessingStatus = 'received' | 'processed' | 'ignored' | 'rejected' | 'failed';
export type ExtendedPaymentStatus = PaymentStatus | 'initializing' | 'unknown' | 'review';

export interface Payment {
  id: string;
  order_id: string;
  provider: PaymentProvider;
  provider_mode: string;
  provider_order_id: string | null;
  status: ExtendedPaymentStatus;
  currency: string;
  amount_requested: number;
  amount_payable: number;
  unique_amount: number;
  provider_signature_hash: string | null;
  qris_url: string;
  direct_url: string | null;
  provider_expires_at: string | null;
  provider_paid_at: string | null;
  last_synced_at: string | null;
  create_attempts: number;
  last_error_code: string | null;
  metadata: any | null;
}

export interface PaymentEvent {
  id: string;
  payment_id: string;
  order_id: string;
  provider: PaymentProvider;
  provider_order_id: string | null;
  source: PaymentEventSource;
  event_type: string;
  event_fingerprint: string;
  processing_status: EventProcessingStatus;
  provider_status: string | null;
  sanitized_payload: any | null;
  error_code: string | null;
  received_at: string;
  processed_at: string | null;
  created_at: string;
}

export type VoucherStatus = 'active' | 'inactive' | 'expired';
export type DiscountType = 'percentage' | 'fixed';

export interface Voucher {
  id: string;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  min_transaction: number;
  max_discount: number | null;
  usage_limit: number | null;
  current_usage: number;
  status: VoucherStatus;
  valid_from: string;
  valid_until: string | null;
  created_at: string;
  updated_at: string;
}

export interface VoucherUsage {
  id: string;
  voucher_id: string;
  order_id: string;
  customer_id: string | null;
  discount_applied: number;
  created_at: string;
}

export type Database = any;
