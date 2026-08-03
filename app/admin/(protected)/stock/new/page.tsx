import { createClient } from '@/lib/supabase/server';
import NewStockForm from './NewStockForm';

export default async function NewStockPage() {
  const supabase = await createClient();

  // Fetch all active products, their variants, and delivery fields
  const { data, error } = await supabase
    .from('products')
    .select(`
      id, name,
      variants:product_variants (id, name, stock_type, status),
      delivery_fields:product_delivery_fields (id, field_key, label, field_type, placeholder, description, is_required)
    `)
    .eq('status', 'active')
    .order('name');

  if (error) {
    console.error('Error fetching data for new stock form:', error);
    return <div>Error memuat data produk.</div>;
  }

  // Filter variants that are active and map correctly
  const products = data.map((p: any) => ({
    ...p,
    variants: p.variants.filter((v: any) => v.status === 'active')
  }));

  return <NewStockForm products={products} />;
}
