import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/lib/env'

export function createClient() {
  const url = env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  return createBrowserClient(url, anonKey)
}
