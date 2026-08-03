export const env = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  // Server-only variable, should not be exposed to the client
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  INVENTORY_MASTER_KEY_V1: process.env.INVENTORY_MASTER_KEY_V1,
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
  }
}
