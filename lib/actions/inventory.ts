'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { encryptInventoryPayload, createInventoryFingerprint, decryptInventoryPayload } from '@/lib/security/inventory-crypto';
import { InventoryStatus } from '@/lib/supabase/types';
import { validateEnv } from '@/lib/env';

/**
 * Server Action: Menambahkan Stok Baru
 */
export async function createInventoryItemAction(
  variantId: string,
  credentialPayload: Record<string, string>,
  metadata: {
    internalNote?: string;
    usageInstructions?: string;
    deliveryNote?: string;
    expiresAt?: string;
  }
) {
  try {
    validateEnv(); // Ensure master key is available on server
    const supabase = await createClient();

    // 1. Verifikasi Admin Session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    // 2. Validasi varian dan pastikan tipe stoknya limited
    const { data: variant } = await supabase
      .from('product_variants')
      .select('stock_type, status')
      .eq('id', variantId)
      .single();

    if (!variant || variant.status === 'archived') {
      return { success: false, error: 'Varian tidak ditemukan atau tidak aktif.' };
    }

    if (variant.stock_type === 'unlimited') {
      return { success: false, error: 'Varian tipe unlimited tidak membutuhkan data inventory fisik.' };
    }

    // 3. Normalisasi & Generate Fingerprint
    const fingerprint = await createInventoryFingerprint(credentialPayload);

    // 4. Periksa Duplikasi
    const { data: existing } = await supabase
      .from('inventory_items')
      .select('id')
      .eq('payload_fingerprint', fingerprint)
      .single();

    if (existing) {
      return { success: false, error: 'Data stok ini sudah pernah ditambahkan sebelumnya (duplikat credential).' };
    }

    // 5. Enkripsi Credential Payload
    const encryptedPayload = await encryptInventoryPayload(credentialPayload);

    // 6. Simpan ke Database
    const { data: newItem, error: insertError } = await supabase
      .from('inventory_items')
      .insert({
        variant_id: variantId,
        status: 'available',
        encrypted_payload: encryptedPayload,
        payload_fingerprint: fingerprint,
        encryption_version: encryptedPayload.version,
        internal_note: metadata.internalNote || null,
        usage_instructions: metadata.usageInstructions || null,
        delivery_note: metadata.deliveryNote || null,
        expires_at: metadata.expiresAt ? new Date(metadata.expiresAt).toISOString() : null,
      })
      .select('id')
      .single();

    if (insertError || !newItem) {
      console.error('Error inserting inventory:', insertError);
      return { success: false, error: 'Gagal menyimpan data stok ke database.' };
    }

    // 7. Catat Event Log
    await supabase.from('inventory_events').insert({
      inventory_item_id: newItem.id,
      event_type: 'created',
      new_status: 'available',
      summary: 'Stok baru berhasil ditambahkan.',
    });

    revalidatePath('/admin/stock');
    return { success: true };
  } catch (error: any) {
    console.error('Create inventory error:', error);
    return { success: false, error: 'Terjadi kesalahan internal pada server.' };
  }
}

/**
 * Server Action: Melihat Credential (Reveal)
 * Menggunakan Header no-store dan tidak dikembalikan ke cache.
 */
export async function revealInventoryCredentialAction(inventoryId: string) {
  try {
    validateEnv();
    const supabase = await createClient();

    // 1. Verifikasi Admin
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    // 2. Ambil Encrypted Payload dari DB
    const { data, error } = await supabase
      .from('inventory_items')
      .select('encrypted_payload')
      .eq('id', inventoryId)
      .single();

    if (error || !data || !data.encrypted_payload) {
      return { success: false, error: 'Stok tidak ditemukan atau payload rusak.' };
    }

    // 3. Dekripsi
    const plaintext = await decryptInventoryPayload(data.encrypted_payload);

    // 4. Catat Audit Log
    await supabase.from('inventory_events').insert({
      inventory_item_id: inventoryId,
      event_type: 'revealed',
      summary: 'Data credential dilihat oleh admin.',
    });

    return { success: true, data: plaintext };
  } catch (error: any) {
    console.error('Reveal credential error:', error);
    return { success: false, error: 'Data stok tidak dapat dibuka. Hubungi pengelola sistem.' };
  }
}

/**
 * Server Action: Mengubah Status
 */
export async function changeInventoryStatusAction(inventoryId: string, newStatus: InventoryStatus, reason: string) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { success: false, error: 'Unauthorized' };

    const { data: current } = await supabase
      .from('inventory_items')
      .select('status')
      .eq('id', inventoryId)
      .single();

    if (!current) return { success: false, error: 'Item not found' };

    const { error } = await supabase
      .from('inventory_items')
      .update({ status: newStatus })
      .eq('id', inventoryId);

    if (error) return { success: false, error: 'Failed to update status' };

    await supabase.from('inventory_events').insert({
      inventory_item_id: inventoryId,
      event_type: 'status_changed',
      previous_status: current.status,
      new_status: newStatus,
      summary: `Status diubah menjadi ${newStatus}: ${reason}`,
    });

    revalidatePath(`/admin/stock/${inventoryId}`);
    revalidatePath('/admin/stock');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Internal server error' };
  }
}
