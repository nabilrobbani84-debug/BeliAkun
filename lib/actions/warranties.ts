'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createWarrantyClaim, processWarrantyClaim } from '@/lib/data/warranties';
import { checkRateLimit } from '@/lib/security/rate-limit';

export async function submitWarrantyClaim(
  warrantyId: string,
  reason: string,
  orderNumber: string
) {
  try {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || '127.0.0.1';
    
    // Rate limit: 3 claims per hour per IP
    const allowed = await checkRateLimit(ip, 'submit_warranty_claim', 3, 3600);
    if (!allowed) {
      return { success: false, error: 'Terlalu banyak pengajuan. Silakan coba lagi nanti.' };
    }

    await createWarrantyClaim(warrantyId, reason);
    revalidatePath(`/pesanan/${orderNumber}`);
    return { success: true };
  } catch (error: any) {
    console.error('Failed to submit warranty claim:', error);
    return { success: false, error: error.message };
  }
}

export async function adminProcessWarrantyClaim(
  claimId: string,
  status: string,
  adminNotes: string,
  replacementCredential?: any
) {
  try {
    await processWarrantyClaim(claimId, status, adminNotes, replacementCredential);
    revalidatePath(`/admin/warranties/${claimId}`);
    revalidatePath('/admin/warranties');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to process warranty claim:', error);
    return { success: false, error: error.message };
  }
}
