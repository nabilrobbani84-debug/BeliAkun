import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import type { Database } from './types';

/**
 * Membuat instance Supabase Client menggunakan SERVICE_ROLE_KEY.
 *
 * PERINGATAN: Client ini BYPASS Row Level Security (RLS) di database.
 * 
 * ATURAN PENGGUNAAN:
 * 1. HANYA gunakan di dalam Server Components, Route Handlers, atau Server Actions.
 * 2. JANGAN PERNAH di-import ke Client Components (`"use client"`).
 * 3. JANGAN PERNAH mengirim instance ini ke browser.
 * 4. JANGAN gunakan untuk query biasa yang bisa dilakukan dengan RLS (seperti fetch products).
 * 5. Gunakan hanya untuk operasi kritis yang diotorisasi oleh backend (misalnya: membuat Guest Order).
 */
export function createAdminClient() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }
  
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY environment variable. ' +
      'Admin client cannot be initialized without it.'
    );
  }

  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
