import { createClient } from '@/lib/supabase/server';
import { InventoryItem, InventoryEvent, InventoryStatus } from '@/lib/supabase/types';

export interface InventoryKPIs {
  available: number;
  reserved: number;
  sold: number;
  other: number;
  total: number;
}

export interface InventoryListItem extends Omit<InventoryItem, 'encrypted_payload' | 'payload_fingerprint'> {
  variant_sku: string;
  variant_name: string;
  product_name: string;
  product_id: string;
}

export async function getInventoryKPIs(): Promise<InventoryKPIs> {
  const supabase = await createClient();

  // Supabase postgREST doesn't support complex aggregate in a single query easily without RPC,
  // so we'll do a few count queries which are fast enough, or just fetch status counts.
  
  // Actually, we can fetch just the status column and group in JS, or do count queries.
  // Given we are avoiding heavy queries, doing count queries with head=true is fast.
  const getCount = async (statusIn: string[]) => {
    const { count } = await supabase
      .from('inventory_items')
      .select('id', { count: 'exact', head: true })
      .in('status', statusIn);
    return count || 0;
  };

  const [available, reserved, sold, other] = await Promise.all([
    getCount(['available']),
    getCount(['reserved']),
    getCount(['sold']),
    getCount(['expired', 'invalid', 'replaced']),
  ]);

  return {
    available,
    reserved,
    sold,
    other,
    total: available + reserved + sold + other,
  };
}

export async function getInventoryItems(
  page = 1,
  pageSize = 20,
  filters?: {
    status?: InventoryStatus;
    search?: string;
  }
): Promise<{ data: InventoryListItem[]; count: number }> {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('inventory_items')
    .select(`
      id, variant_id, status, encryption_version, internal_note, usage_instructions, delivery_note, expires_at, created_at, updated_at,
      variant:product_variants!inner (
        id, name, sku,
        product:products!inner (id, name)
      )
    `, { count: 'exact' });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  // For search, we might want to search by SKU or Product Name. 
  // Supabase allows filtering on nested relations.
  if (filters?.search) {
    query = query.or(`sku.ilike.%${filters.search}%,product.name.ilike.%${filters.search}%`, { foreignTable: 'variant' });
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching inventory items:', error);
    return { data: [], count: 0 };
  }

  const formattedData: InventoryListItem[] = data.map((item: any) => ({
    ...item,
    variant_sku: item.variant.sku,
    variant_name: item.variant.name,
    product_name: item.variant.product.name,
    product_id: item.variant.product.id,
    variant: undefined, // remove nested object
  }));

  return { data: formattedData, count: count || 0 };
}

export async function getInventoryItemById(id: string): Promise<InventoryListItem | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('inventory_items')
    .select(`
      id, variant_id, status, encryption_version, internal_note, usage_instructions, delivery_note, expires_at, created_at, updated_at,
      variant:product_variants (
        id, name, sku,
        product:products (id, name)
      )
    `)
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  const item = data as any;
  return {
    ...item,
    variant_sku: item.variant.sku,
    variant_name: item.variant.name,
    product_name: item.variant.product.name,
    product_id: item.variant.product.id,
    variant: undefined,
  };
}

export async function getInventoryEvents(inventoryId: string): Promise<InventoryEvent[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('inventory_events')
    .select('*')
    .eq('inventory_item_id', inventoryId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching inventory events:', error);
    return [];
  }

  return data as InventoryEvent[];
}
