import React from 'react';
import { env } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';
import { CheckoutClient } from './CheckoutClient';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Selesaikan Pesanan - Beliakun.com',
};

// Disable caching for checkout page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CheckoutPage() {
  const supabase = await createClient();
  
  // Try to get user, but don't force redirect if guest checkout is allowed
  const { data: { user } } = await supabase.auth.getUser();
  
  return (
    <CheckoutClient 
      checkoutEnabled={env.CHECKOUT_ENABLED}
      userEmail={user?.email || ''}
    />
  );
}
