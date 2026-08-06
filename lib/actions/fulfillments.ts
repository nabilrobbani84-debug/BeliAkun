'use server';

import { revalidatePath } from 'next/cache';
import { processManualFulfillment, queueTransactionalEmail } from '@/lib/data/fulfillments';
import { createAdminClient } from '@/lib/supabase/admin';

export async function adminProcessFulfillment(
  fulfillmentId: string,
  credentialData: any,
  notes?: string
) {
  try {
    await processManualFulfillment(fulfillmentId, credentialData, notes);
    
    // Antre email pengiriman kredensial
    const adminDb = createAdminClient();
    const { data: fulfillment } = await adminDb
      .from('fulfillments')
      .select('orders(id, order_number, recipient_email)')
      .eq('id', fulfillmentId)
      .single();
      
    if (fulfillment?.orders) {
      const order: any = Array.isArray(fulfillment.orders) ? fulfillment.orders[0] : fulfillment.orders;
      if (order) {
        const orderUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pesanan/${order.order_number}`;
      
      const emailHtml = `
        <h2>Pesanan Anda Telah Dikirim!</h2>
        <p>Halo, pesanan Anda dengan nomor <strong>${order.order_number}</strong> telah berhasil diproses.</p>
        <p>Silakan klik tautan di bawah ini untuk melihat detail kredensial produk Anda:</p>
        <a href="${orderUrl}" style="display:inline-block;padding:10px 20px;background-color:#0070f3;color:#ffffff;text-decoration:none;border-radius:5px;">Lihat Pesanan & Kredensial</a>
        <br/><br/>
        <p>Terima kasih telah berbelanja di Beliakun!</p>
      `;
      
      await queueTransactionalEmail(
        order.id, 
        order.recipient_email, 
        `Pesanan ${order.order_number} Selesai - Beliakun`, 
        emailHtml
      );
      }
    }

    revalidatePath('/admin/fulfillments');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to process fulfillment:', error);
    return { success: false, error: error.message };
  }
}
