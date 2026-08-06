import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { queueTransactionalEmail } from '@/lib/data/fulfillments';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
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

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.session?.user) {
      const user = data.session.user;
      const email = user.email;

      if (email) {
        // Queue login notification email
        try {
          const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h2 style="color: #4F46E5;">🔒 Notifikasi Keamanan Login</h2>
              <p>Halo <strong>${user.user_metadata?.full_name || email.split('@')[0]}</strong>,</p>
              <p>Akun Beliakun Anda baru saja berhasil masuk (login) menggunakan akun Google pada:</p>
              <p style="background: #F3F4F6; padding: 10px; border-radius: 6px; font-size: 14px;">
                <strong>Waktu:</strong> ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB<br/>
                <strong>Metode:</strong> Google OAuth
              </p>
              <p>Jika ini adalah Anda, tidak ada tindakan lebih lanjut yang diperlukan.</p>
              <p style="color: #EF4444; font-size: 12px;">Jika Anda merasa tidak melakukan aktivitas login ini, segera amankan akun Google Anda.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #6B7280;">Beliakun.com - Layanan Jual Beli Akun Digital Terpercaya</p>
            </div>
          `;

          await queueTransactionalEmail(
            user.id,
            email,
            'Notifikasi Keamanan: Login Akun Berhasil - Beliakun',
            emailHtml
          );
        } catch (e) {
          console.error('Failed to queue login notification email:', e);
        }
      }

      return NextResponse.redirect(`${origin}${next}?login=success`);
    }
  }

  return NextResponse.redirect(`${origin}/?login=failed`);
}
