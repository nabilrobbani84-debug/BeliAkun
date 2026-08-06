'use server';

import { cancelPendingOrder, expirePendingOrder, releaseExpiredReservations } from '@/lib/data/orders';
import { revalidatePath } from 'next/cache';

export async function adminCancelOrder(orderId: string) {
  try {
    await cancelPendingOrder(orderId);
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath(`/admin/orders`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal membatalkan pesanan.' };
  }
}

export async function adminExpireOrder(orderId: string) {
  try {
    const success = await expirePendingOrder(orderId);
    if (!success) {
      return { success: false, error: 'Pesanan tidak dalam status yang dapat dikedaluwarsakan.' };
    }
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath(`/admin/orders`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal mengubah status.' };
  }
}

export async function adminReleaseExpiredReservations() {
  try {
    const count = await releaseExpiredReservations();
    revalidatePath(`/admin/orders`);
    return { success: true, count };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal membersihkan reservasi.' };
  }
}

