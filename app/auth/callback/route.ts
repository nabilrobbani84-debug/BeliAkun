import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { queueTransactionalEmail } from '@/lib/data/fulfillments';
import { processEmailOutbox } from '@/lib/email';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/?login=success';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
            }
          },
        },
      }
    );

    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && session?.user) {
      const user = session.user;
      const userEmail = user.email;
      const userName = user.user_metadata?.full_name || user.user_metadata?.name || userEmail?.split('@')[0] || 'Pengguna';

      // Antre email notifikasi login berhasil jika email tersedia
      if (userEmail) {
        try {
          const emailHtml = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h2 style="color: #2563eb; margin-top: 0;">Aktivitas Masuk Terdeteksi 🔐</h2>
              <p>Halo <strong>${userName}</strong>,</p>
              <p>Akun Anda baru saja berhasil masuk ke platform <strong>Beliakun.com</strong> menggunakan <strong>Akun Google (${userEmail})</strong>.</p>
              <div style="background-color: #f8fafc; padding: 12px; border-left: 4px solid #2563eb; margin: 15px 0;">
                <p style="margin: 0; font-size: 14px;"><strong>Waktu Masuk:</strong> ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB</p>
                <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Metode:</strong> Supabase Google OAuth</p>
              </div>
              <p>Jika ini adalah Anda, tidak ada tindakan lebih lanjut yang diperlukan.</p>
              <p style="font-size: 12px; color: #64748b; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
                Email notifikasi otomatis dari Beliakun.com. Mohon tidak membalas email ini.
              </p>
            </div>
          `;

          await queueTransactionalEmail(
            '',
            userEmail,
            `Notifikasi Keamanan: Akun Masuk Beliakun.com (${userEmail})`,
            emailHtml
          );
          
          // Coba proses outbox langsung jika worker URL aktif
          await processEmailOutbox().catch(() => {});
        } catch (e) {
          console.error('Error sending login email notification:', e);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page or home page with instructions
  return NextResponse.redirect(`${origin}/?auth_error=could_not_authenticate`);
}
