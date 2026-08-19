import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { HistoryClient } from './HistoryClient';

export const metadata = {
  title: 'Riwayat Pesanan - Beliakun.com',
};

export const dynamic = 'force-dynamic';

export default async function RiwayatPesananPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/?auth_error=Silakan+login+terlebih+dahulu');
  }

  // Use regular client, requires RLS policy for users to view their own orders
  // Alternatively, if RLS is not set yet, we must fallback or add the RLS policy.
  
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*)
    `)
    .eq('recipient_email', user.email)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
  }

  return (
    <HistoryClient 
      initialOrders={orders || []}
      userEmail={user.email!}
      userName={user.user_metadata?.full_name || user.email?.split('@')[0] || 'Pengguna'}
    />
  );
}
