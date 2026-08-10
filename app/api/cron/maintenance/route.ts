import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Allow longer execution for cron

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  
  // Basic security check (Bearer token from Cron service)
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adminDb = createAdminClient();
  const startTime = Date.now();
  const results = {
    releasedInventory: 0,
    expiredWarranties: 0,
    emailsProcessed: 0,
    emailsFailed: 0,
  };

  try {
    // 1. Release Expired Inventory Reservations
    // Any inventory reserved where reserved_until < now()
    const { data: expiredInventory, error: invError } = await adminDb
      .from('inventory_items')
      .select('id')
      .eq('status', 'reserved')
      .lt('reserved_until', new Date().toISOString());

    if (!invError && expiredInventory && expiredInventory.length > 0) {
      for (const item of expiredInventory) {
        await adminDb
          .from('inventory_items')
          .update({
            status: 'available',
            reserved_order_id: null,
            reserved_order_item_id: null,
            reserved_at: null,
            reserved_until: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.id);
          
        results.releasedInventory++;
      }
    }

    // 2. Mark Warranties as Expired
    // Any active warranty where valid_until < now()
    const { data: expiredWarranties, error: warrError } = await adminDb
      .from('warranties')
      .select('id')
      .eq('status', 'active')
      .lt('valid_until', new Date().toISOString());

    if (!warrError && expiredWarranties && expiredWarranties.length > 0) {
      const ids = expiredWarranties.map(w => w.id);
      await adminDb
        .from('warranties')
        .update({ status: 'expired', updated_at: new Date().toISOString() })
        .in('id', ids);
        
      results.expiredWarranties = ids.length;
    }

    // 3. Process Pending Email Outbox
    // Fetch emails pending or sending (that might be stuck)
    const { data: pendingEmails, error: emailError } = await adminDb
      .from('email_outbox')
      .select('*')
      .in('status', ['pending', 'sending'])
      .lt('attempts', 3) // Max retry 3 times
      .limit(20); // Process max 20 per run to avoid timeout

    if (!emailError && pendingEmails && pendingEmails.length > 0) {
      for (const email of pendingEmails) {
        // Mark as sending
        await adminDb
          .from('email_outbox')
          .update({ status: 'sending', attempts: email.attempts + 1, updated_at: new Date().toISOString() })
          .eq('id', email.id);

        try {
          if (!env.CLOUDFLARE_WORKER_MAIL_URL) {
            throw new Error('Cloudflare mail worker URL not configured');
          }

          // Call Cloudflare Worker
          const res = await fetch(env.CLOUDFLARE_WORKER_MAIL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: email.to_email,
              subject: email.subject,
              html: email.body_html,
              secret: process.env.CLOUDFLARE_WORKER_MAIL_SECRET
            })
          });

          if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Worker responded with ${res.status}: ${errText}`);
          }

          // Success
          await adminDb
            .from('email_outbox')
            .update({ 
              status: 'sent', 
              sent_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              last_error: null 
            })
            .eq('id', email.id);
            
          results.emailsProcessed++;
        } catch (err: any) {
          // Failed
          await adminDb
            .from('email_outbox')
            .update({ 
              status: email.attempts + 1 >= 3 ? 'failed' : 'pending', 
              last_error: err.message,
              updated_at: new Date().toISOString()
            })
            .eq('id', email.id);
            
          results.emailsFailed++;
        }
      }
    }

    const durationMs = Date.now() - startTime;
    return NextResponse.json({ 
      success: true, 
      message: 'Maintenance completed successfully',
      results,
      durationMs 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Maintenance cron error:', error);
    return NextResponse.json({ 
      error: 'Internal server error during maintenance',
      details: error.message 
    }, { status: 500 });
  }
}
