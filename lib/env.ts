export const env = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  // Server-only variable, should not be exposed to the client
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  INVENTORY_MASTER_KEY_V1: process.env.INVENTORY_MASTER_KEY_V1,
  
  // Checkout & Orders
  CHECKOUT_ENABLED: process.env.CHECKOUT_ENABLED === 'true',
  ORDER_RESERVATION_MINUTES: parseInt(process.env.ORDER_RESERVATION_MINUTES || '30', 10),
  ORDER_ACCESS_TOKEN_TTL_DAYS: parseInt(process.env.ORDER_ACCESS_TOKEN_TTL_DAYS || '90', 10),

  // KlikQRIS Config
  KLIKQRIS_ENABLED: process.env.KLIKQRIS_ENABLED === 'true',
  KLIKQRIS_DRIVER: (process.env.KLIKQRIS_DRIVER || 'sandbox') as 'sandbox' | 'inhouse' | 'my_pg',
  KLIKQRIS_API_KEY: process.env.KLIKQRIS_API_KEY,
  KLIKQRIS_MERCHANT_ID: process.env.KLIKQRIS_MERCHANT_ID,
  KLIKQRIS_WEBHOOK_URL: process.env.KLIKQRIS_WEBHOOK_URL || 'http://localhost:3000/api/webhooks/klikqris',
  KLIKQRIS_REQUEST_TIMEOUT_MS: parseInt(process.env.KLIKQRIS_REQUEST_TIMEOUT_MS || '10000', 10),
  PAYMENT_STATUS_SYNC_INTERVAL_SECONDS: parseInt(process.env.PAYMENT_STATUS_SYNC_INTERVAL_SECONDS || '15', 10),
} as const;

export function validateEnv() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }
  if (!env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
  }
  
  // Validation for server-only secrets must only run on the server
  if (typeof window === 'undefined') {
    if (!env.INVENTORY_MASTER_KEY_V1) {
      throw new Error('Missing INVENTORY_MASTER_KEY_V1 environment variable for server-side encryption.');
    }

    if (env.KLIKQRIS_ENABLED) {
      if (!env.KLIKQRIS_API_KEY) {
        throw new Error('Missing KLIKQRIS_API_KEY environment variable while KlikQRIS is enabled.');
      }
      if (!env.KLIKQRIS_MERCHANT_ID) {
        throw new Error('Missing KLIKQRIS_MERCHANT_ID environment variable while KlikQRIS is enabled.');
      }
      if (!['sandbox', 'inhouse', 'my_pg'].includes(env.KLIKQRIS_DRIVER)) {
        throw new Error(`Invalid KLIKQRIS_DRIVER value: ${env.KLIKQRIS_DRIVER}. Supported values: sandbox, inhouse, my_pg`);
      }
      if (isNaN(env.KLIKQRIS_REQUEST_TIMEOUT_MS) || env.KLIKQRIS_REQUEST_TIMEOUT_MS <= 0) {
        throw new Error('KLIKQRIS_REQUEST_TIMEOUT_MS must be a positive number');
      }
      if (isNaN(env.PAYMENT_STATUS_SYNC_INTERVAL_SECONDS) || env.PAYMENT_STATUS_SYNC_INTERVAL_SECONDS <= 0) {
        throw new Error('PAYMENT_STATUS_SYNC_INTERVAL_SECONDS must be a positive number');
      }
    }
  }
}
