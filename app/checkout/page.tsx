import React from 'react';
import { env } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';
import { CheckoutClient } from './CheckoutClient';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Selesaikan Pesanan - Beliakun.com',
};

// Disable caching for checkout page to ensure accurate stock
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ variant?: string }>;
}) {
  const resolvedParams = await searchParams;
  const variantId = resolvedParams.variant;
  
  if (!variantId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Akses Tidak Valid</h2>
          <p className="text-slate-600 mb-4">Silakan pilih produk dari halaman utama terlebih dahulu.</p>
          <a href="/" className="text-blue-600 font-bold hover:underline">Kembali ke Beranda</a>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  
  // Ambil data variant & product
  // Supabase public client bisa baca karena product active (RLS allow for active products)
  const { data: variant, error: variantError } = await supabase
    .from('product_variants')
    .select(`
      *,
      products (
        id, name, slug, logo_key, is_active
      )
    `)
    .eq('id', variantId)
    .eq('is_active', true)
    .single();

  if (variantError || !variant || !variant.products?.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Produk Tidak Ditemukan</h2>
          <p className="text-slate-600 mb-4">Paket yang Anda pilih sudah tidak tersedia atau tidak aktif.</p>
          <a href="/" className="text-blue-600 font-bold hover:underline">Kembali ke Beranda</a>
        </div>
      </div>
    );
  }

  // Cek ketersediaan untuk stok limited (menggunakan admin client agar bisa cek ketersediaan yang valid)
  // Aturan RLS kita: public tidak bisa select inventory_items
  // Kita harus panggil Supabase function atau hit API route, atau cukup dari client? 
  // Wait, server component can use adminClient to check stock.
  let isAvailable = true;
  if (variant.stock_type === 'limited') {
    const { createAdminClient } = await import('@/lib/supabase/admin');
    const adminClient = createAdminClient();
    const { count, error: invError } = await adminClient
      .from('inventory_items')
      .select('*', { count: 'exact', head: true })
      .eq('variant_id', variantId)
      .eq('status', 'available')
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);
      
    if (!invError && count !== null && count === 0) {
      isAvailable = false;
    }
  }

  // Tambahkan status is_available ke variant
  const variantData = {
    ...variant,
    is_available: isAvailable
  };

  const productData = {
    ...variant.products,
    // Provide some mock UI defaults if missing from db
    logoBg: 'bg-blue-600'
  };

  return (
    <CheckoutClient 
      variant={variantData}
      product={productData}
      checkoutEnabled={env.CHECKOUT_ENABLED}
    />
  );
}
