# Cloudflare Email Routing Setup

Beliakun.com menggunakan Cloudflare Email Routing Workers untuk mengirimkan email transaksional kepada pembeli secara gratis. Cloudflare menawarkan layanan Email Routing yang memungkinkan kita menggunakan Worker untuk mengirim pesan email dari domain kustom kita.

## Prasyarat
1. Domain Anda dikelola oleh Cloudflare (Nameservers di Cloudflare).
2. Email Routing diaktifkan untuk domain Anda di Cloudflare Dashboard.
3. Anda memiliki Cloudflare API Token atau Global API Key untuk mengakses fitur dari Workers atau HTTP requests jika diperlukan.

## Cara Mengirim Email (Send Email via Cloudflare)
Cloudflare saat ini tidak memiliki API "Kirim Email" biasa yang dapat diakses langsung oleh backend tanpa Worker khusus, kecuali Anda menggunakan layanan pihak ketiga seperti Resend atau Mailgun yang dihubungkan ke Worker. 
Namun, Anda dapat menggunakan [Cloudflare Email Workers (Send Email)](https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/) untuk mengirim email.

### Langkah-langkah Setup Cloudflare Worker:
1. Buka Cloudflare Dashboard -> **Workers & Pages**.
2. Buat aplikasi Worker baru, beri nama `beliakun-mailer`.
3. Dalam kode Worker, tulis logika untuk menerima HTTP POST request dari backend Next.js (Supabase outbox/cron), dan Worker ini akan menggunakan API `sendEmail` bawaan dari modul `cloudflare:email` untuk mengirim email tersebut.

Contoh kode Cloudflare Worker (`worker.js`):
```javascript
import { EmailMessage } from "cloudflare:email";

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const { to, subject, html, secret } = await request.json();
      
      // Keamanan sederhana
      if (secret !== env.MAIL_SECRET) {
        return new Response("Unauthorized", { status: 401 });
      }

      const msg = new EmailMessage(
        "noreply@beliakun.com", // Ganti dengan domain aktif Anda
        to,
        subject,
        html // Catatan: Cloudflare Email Workers awalnya mendukung plain text, dan sekarang sudah mendukung HTML / Raw MIME. Pastikan format sesuai.
      );

      await env.SEB.send(msg); // SEB adalah binding Send Email

      return new Response("Email sent successfully", { status: 200 });
    } catch (e) {
      return new Response(e.message, { status: 500 });
    }
  }
};
```

4. Di tab **Settings -> Bindings** untuk Worker tersebut:
   - Tambahkan **Send Email** binding.
   - Variable name: `SEB`
   - Sender address: `noreply@beliakun.com` (Harus sudah diverifikasi di Email Routing).
5. Tambahkan **Environment Variable**:
   - `MAIL_SECRET`: Rahasia yang harus sama dengan yang ada di `.env` aplikasi Next.js Anda (untuk mengamankan endpoint Worker).
6. Deploy Worker dan dapatkan URL-nya (contoh: `https://beliakun-mailer.your-username.workers.dev`).

### Konfigurasi di Next.js (Beliakun.com):
Tambahkan URL Worker tersebut di file `.env` aplikasi Anda:
```env
# Email configuration
CLOUDFLARE_WORKER_MAIL_URL=https://beliakun-mailer.your-username.workers.dev
CLOUDFLARE_WORKER_MAIL_SECRET=your-secret-here
```

### Sinkronisasi Email Outbox
Di Step 6 ini, kita sudah mengimplementasikan tabel `email_outbox`. Worker/Cron Job (bisa dijalankan via Vercel Cron atau Supabase pg_cron) dapat mengambil antrean dengan status `pending` dan mem-POST ke Cloudflare Worker Mailer tersebut.
