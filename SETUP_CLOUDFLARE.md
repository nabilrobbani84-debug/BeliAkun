# Panduan Pengaturan Cloudflare (Manual)

Panduan ini berisi langkah-langkah untuk menyiapkan Beliakun.com di Cloudflare Workers.

## A. Membuat atau Memilih Account Cloudflare
1. Login ke [Dashboard Cloudflare](https://dash.cloudflare.com).
2. Pastikan domain `beliakun.com` telah ditambahkan di akun Anda.
3. Pastikan *nameserver* domain Anda telah mengarah ke Cloudflare. 
   *(Peringatan: Jangan mengubah DNS production tanpa pemeriksaan terlebih dahulu).*

## B. Konfigurasi Workers & Pages
Beliakun.com menggunakan Next.js yang kompatibel dengan Cloudflare Workers (OpenNext).
1. Buka menu **Workers & Pages**.
2. Pilih **Create Application** lalu pilih tab **Pages** -> **Connect to Git** (atau sesuai metode *deployment* Anda jika menggunakan GitHub).
3. Pilih *repository* Beliakun.com.
4. Sesuaikan **Build command** dan **Build output directory** sesuai dengan konfigurasi proyek Anda (seperti `npm run build` atau panduan OpenNext Cloudflare).

## C. Environment Variables
Setelah *project* berhasil dihubungkan, atur *Environment Variables*:
1. Buka menu **Settings** -> **Environment variables** di halaman *project* Anda.
2. Tambahkan variable berikut sebagai teks biasa (*plain text*):
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Tambahkan variable rahasia (*secret*) jika diperlukan (contoh: `SUPABASE_SERVICE_ROLE_KEY`) dan pastikan mencentang tombol **Encrypt** agar nilainya tersembunyi.

## D. Preview & Testing Lokal
Untuk menjalankan *preview runtime* Cloudflare secara lokal (memastikan kompatibilitas Node.js *runtime*):
1. Pastikan Anda memiliki *package script* untuk mempratinjau build (misalnya `npm run preview` jika menggunakan Wrangler).
2. Jalankan skrip tersebut di terminal dan buka URL lokal (mis. `http://localhost:8787`).
3. Periksa apakah tidak ada *error* kompatibilitas Node.js.

## E. Deployment Verification
Setelah *deploy*, periksa:
1. *Homepage* dapat dibuka tanpa kendala.
2. Kategori dan produk tampil dengan sempurna.
3. Tidak ada peringatan *hydration* di *console browser*.
4. Tidak ada kredensial *secret* yang bocor di halaman (periksa sumber halaman atau *Network tab*).
5. Kunjungi `https://beliakun.com/api/health` untuk memastikan API berfungsi dan koneksi *database* aktif (harus mengembalikan `"status": "ok"`).

---

# Step 2 — Authentication & Admin Panel Verification

Untuk memastikan rute admin terlindungi dengan benar di Cloudflare Workers:
1. Akses halaman `/admin/login` dan pastikan formulir dapat dimuat dengan baik.
2. Cobalah untuk mengakses `/admin` secara langsung tanpa login. Cloudflare Worker harus merespons dengan pengalihan (*redirect*) ke `/admin/login`.
3. Setelah login sebagai admin, pastikan cookie session tersimpan di browser Anda (`sb-access-token` dan `sb-refresh-token`).
4. Verifikasi bahwa refresh halaman tidak mengeluarkan Anda dari dashboard admin panel.
5. Cobalah logout dan pastikan Anda dialihkan kembali ke `/admin/login`.

---

# Step 3 — Inventory Encryption Secret

Modul stok memerlukan `INVENTORY_MASTER_KEY_V1` yang disimpan sebagai *server-only environment variable* di Cloudflare.

1. Generate key seperti yang dijelaskan di file `SETUP_INVENTORY.md`.
2. Buka menu **Settings** -> **Environment variables** di halaman *project* Cloudflare Anda.
3. Tambahkan variable rahasia (*secret*):
   - Variable name: `INVENTORY_MASTER_KEY_V1`
   - Value: (Paste key yang Anda buat)
4. **PENTING:** Pastikan Anda mengklik tombol **Encrypt** agar Cloudflare menyembunyikan nilainya!
5. Lakukan deploy ulang (Redeploy) agar environment variable baru dapat dibaca oleh Cloudflare Workers.

---

# Step 5 — KlikQRIS Webhooks & Secrets

Modul pembayaran menggunakan KlikQRIS memerlukan penyimpanan kredensial API Key dan Merchant ID yang aman di Cloudflare Workers.

## F. KlikQRIS Secrets
1. Buka **Settings** -> **Environment variables** di proyek Workers/Pages Cloudflare Anda.
2. Tambahkan variable rahasia (*secret*) baru dengan mengklik **Add variable**:
   - `KLIKQRIS_API_KEY` (Secret - Wajib di-encrypt!)
   - `KLIKQRIS_MERCHANT_ID` (Secret - Wajib di-encrypt!)
   - `SUPABASE_SERVICE_ROLE_KEY` (Secret - Pastikan ini terenkripsi agar tidak terekspos ke browser!)
3. Tambahkan variable biasa (*plain text*):
   - `KLIKQRIS_ENABLED` = `true`
   - `KLIKQRIS_DRIVER` = `sandbox` (Ganti dengan `inhouse` atau `my_pg` pada produksi)
   - `KLIKQRIS_WEBHOOK_URL` = `https://domain-anda.com/api/webhooks/klikqris`
   - `KLIKQRIS_REQUEST_TIMEOUT_MS` = `10000`
   - `PAYMENT_STATUS_SYNC_INTERVAL_SECONDS` = `15`
4. Klik **Save** dan deploy ulang proyek Anda.

## G. Cloudflare WAF Exception untuk Webhook
Server KlikQRIS akan mengirimkan HTTP POST request langsung ke URL webhook Anda. 
Agar request tersebut tidak diblokir oleh sistem perlindungan bot/WAF Cloudflare:
1. Masuk ke dashboard domain Anda di Cloudflare.
2. Pilih menu **Security** -> **WAF** -> **Custom rules**.
3. Buat rule baru (misal: "Bypass WAF for KlikQRIS Webhook"):
   - Field: `URI Path`
   - Operator: `equals`
   - Value: `/api/webhooks/klikqris`
   - Action: `Bypass` (Pilih bypass untuk WAF components like "Super Bot Fight Mode", "Security Level", "Rate Limiting" jika diperlukan, atau "Skip" WAF rules).
4. Klik **Deploy** untuk mengaktifkan aturan tersebut.
