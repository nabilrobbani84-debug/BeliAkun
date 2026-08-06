import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';

export async function processEmailOutbox() {
  const adminDb = createAdminClient();
  
  // Ambil maksimal 10 email pending/failed dengan attempts < 3
  const { data: emails, error } = await adminDb
    .from('email_outbox')
    .select('*')
    .in('status', ['pending', 'failed'])
    .lt('attempts', 3)
    .order('created_at', { ascending: true })
    .limit(10);
    
  if (error || !emails || emails.length === 0) {
    return 0;
  }
  
  let sentCount = 0;
  
  for (const email of emails) {
    try {
      // Tandai sedang dikirim
      await adminDb.from('email_outbox').update({ status: 'sending', attempts: email.attempts + 1 }).eq('id', email.id);
      
      // Kirim email menggunakan Cloudflare Workers atau Resend
      // Karena implementasi Cloudflare Workers memerlukan endpoint eksternal,
      // kita asumsikan ada environment variable untuk endpoint tersebut:
      const workerUrl = process.env.EMAIL_WORKER_URL;
      const workerKey = process.env.EMAIL_WORKER_KEY;
      
      if (!workerUrl) {
        throw new Error('EMAIL_WORKER_URL tidak diatur');
      }
      
      const response = await fetch(workerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${workerKey}`
        },
        body: JSON.stringify({
          to: email.to_email,
          subject: email.subject,
          html: email.body_html
        })
      });
      
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gagal mengirim email: ${response.status} ${errText}`);
      }
      
      // Berhasil
      await adminDb.from('email_outbox').update({ 
        status: 'sent', 
        sent_at: new Date().toISOString(),
        last_error: null
      }).eq('id', email.id);
      
      sentCount++;
    } catch (err: any) {
      // Gagal
      await adminDb.from('email_outbox').update({ 
        status: 'failed', 
        last_error: err.message 
      }).eq('id', email.id);
    }
  }
  
  return sentCount;
}
