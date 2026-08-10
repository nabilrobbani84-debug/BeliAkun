import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function getWarrantyByOrderId(orderId: string) {
  const adminDb = createAdminClient();
  
  const { data, error } = await adminDb
    .from('warranties')
    .select(`
      *,
      warranty_claims (
        id,
        status,
        reason,
        admin_notes,
        created_at,
        warranty_replacements (
          id,
          credential_snapshot,
          delivery_notes,
          created_at
        )
      )
    `)
    .eq('order_id', orderId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching warranty by order id:', error);
  }

  return data;
}

export async function createWarrantyClaim(
  warrantyId: string, 
  reason: string,
  proofImageUrl?: string
) {
  const adminDb = createAdminClient();
  
  // Create claim
  const { data, error } = await adminDb
    .from('warranty_claims')
    .insert({
      warranty_id: warrantyId,
      reason,
      proof_image_url: proofImageUrl || null,
      status: 'pending'
    })
    .select()
    .single();
    
  if (error) {
    console.error('Failed to create warranty claim:', error);
    throw new Error('Gagal mengajukan klaim garansi');
  }
  
  // Update warranty status to claimed
  await adminDb
    .from('warranties')
    .update({ status: 'claimed' })
    .eq('id', warrantyId);

  return data;
}

export async function getAdminWarrantyClaims(
  page: number = 1,
  limit: number = 20,
  search?: string,
  status?: string
) {
  const supabase = await createClient();
  
  let query = supabase
    .from('warranty_claims')
    .select(`
      *,
      warranties (
        id,
        status,
        valid_until,
        orders (
          order_number,
          recipient_email
        ),
        order_items (
          product_name,
          variant_name
        )
      )
    `, { count: 'exact' });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  query = query
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching warranty claims:', error);
    throw new Error('Gagal mengambil data klaim garansi');
  }

  let filteredData = data;
  if (search) {
    const s = search.toLowerCase();
    filteredData = data.filter((c: any) => 
      c.warranties?.orders?.order_number?.toLowerCase().includes(s) || 
      c.warranties?.orders?.recipient_email?.toLowerCase().includes(s)
    );
  }

  return {
    data: filteredData,
    count: search ? filteredData.length : (count || 0)
  };
}

export async function getAdminWarrantyClaimDetails(claimId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('warranty_claims')
    .select(`
      *,
      warranty_replacements (*),
      warranties (
        id,
        status,
        valid_until,
        terms,
        orders (
          id,
          order_number,
          recipient_email,
          grand_total,
          status,
          created_at
        ),
        order_items (
          id,
          product_name,
          variant_name,
          stock_type,
          quantity,
          price
        )
      )
    `)
    .eq('id', claimId)
    .single();

  if (error) {
    console.error('Error fetching claim details:', error);
    return null;
  }

  return data;
}

export async function processWarrantyClaim(
  claimId: string, 
  status: string,
  adminNotes: string,
  replacementCredential?: any
) {
  const adminDb = createAdminClient();
  
  // Update claim
  const { error: claimError } = await adminDb
    .from('warranty_claims')
    .update({ 
      status,
      admin_notes: adminNotes,
      updated_at: new Date().toISOString()
    })
    .eq('id', claimId);
    
  if (claimError) throw new Error('Failed to update claim status');

  // If replaced, we need to create a replacement and update warranty status
  if (status === 'resolved' && replacementCredential) {
    const { data: claim } = await adminDb
      .from('warranty_claims')
      .select('warranty_id')
      .eq('id', claimId)
      .single();
      
    if (claim) {
      // Create replacement
      await adminDb
        .from('warranty_replacements')
        .insert({
          claim_id: claimId,
          credential_snapshot: replacementCredential,
          delivery_notes: adminNotes
        });
        
      // Update warranty status
      await adminDb
        .from('warranties')
        .update({ status: 'replaced', updated_at: new Date().toISOString() })
        .eq('id', claim.warranty_id);
    }
  } else if (status === 'rejected') {
    // Revert warranty status to active (or leave it as rejected?)
    // Usually rejected means warranty is still active until expired, or totally void. We'll set it to active again so they can claim again if needed, or void. 
    // Let's set it to 'active' or 'rejected'. Let's keep it 'active' but they have a rejected claim.
    const { data: claim } = await adminDb
      .from('warranty_claims')
      .select('warranty_id')
      .eq('id', claimId)
      .single();
      
    if (claim) {
      await adminDb
        .from('warranties')
        .update({ status: 'active', updated_at: new Date().toISOString() })
        .eq('id', claim.warranty_id);
    }
  }

  return true;
}
