import { createAdminClient } from '@/lib/supabase/admin';

export async function checkRateLimit(ip: string, endpoint: string, maxRequests: number, windowSeconds: number) {
  const adminDb = createAdminClient();
  const now = new Date();
  
  // 1. Get current rate limit record
  const { data: record } = await adminDb
    .from('rate_limits')
    .select('*')
    .eq('ip_address', ip)
    .eq('endpoint', endpoint)
    .single();

  if (!record) {
    // Insert first request
    await adminDb.from('rate_limits').insert({
      ip_address: ip,
      endpoint,
      request_count: 1,
      last_request_at: now.toISOString()
    });
    return true; // Allowed
  }

  // Check if currently blocked
  if (record.blocked_until && new Date(record.blocked_until) > now) {
    return false; // Blocked
  }

  const secondsSinceLastRequest = (now.getTime() - new Date(record.last_request_at).getTime()) / 1000;

  if (secondsSinceLastRequest > windowSeconds) {
    // Reset window
    await adminDb.from('rate_limits')
      .update({
        request_count: 1,
        last_request_at: now.toISOString(),
        blocked_until: null
      })
      .eq('ip_address', ip)
      .eq('endpoint', endpoint);
    return true;
  }

  // Still within window
  if (record.request_count >= maxRequests) {
    // Block for 5 minutes
    const blockedUntil = new Date(now.getTime() + 5 * 60000);
    await adminDb.from('rate_limits')
      .update({
        request_count: record.request_count + 1,
        last_request_at: now.toISOString(),
        blocked_until: blockedUntil.toISOString()
      })
      .eq('ip_address', ip)
      .eq('endpoint', endpoint);
    return false; // Blocked
  }

  // Increment
  await adminDb.from('rate_limits')
    .update({
      request_count: record.request_count + 1,
      last_request_at: now.toISOString()
    })
    .eq('ip_address', ip)
    .eq('endpoint', endpoint);

  return true; // Allowed
}
