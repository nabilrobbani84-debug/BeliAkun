# Panduan Konfigurasi KlikQRIS (Step 5)

Dokumen ini menjelaskan alur integrasi KlikQRIS sandbox dan production untuk Beliakun.com.

## 1. Pendaftaran KlikQRIS
Untuk mendapatkan kredensial:
1. Registrasi atau masuk ke dasbor merchant di [KlikQRIS](https://klikqris.com).
2. Lengkapi data merchant Anda agar akun disetujui.
3. Buka tab **API / Integrasi** di dasbor untuk menemukan:
   - **Merchant ID** (ID Merchant Anda)
   - **API Key** (Kunci rahasia API Anda)

## 2. Sandbox Testing
Gunakan mode `sandbox` terlebih dahulu sebelum mengaktifkan transaksi uang asli.
1. Atur variabel lingkungan di `.env.local`:
   ```env
   KLIKQRIS_ENABLED=true
   KLIKQRIS_DRIVER=sandbox
   KLIKQRIS_API_KEY=kunci_api_sandbox_anda
   KLIKQRIS_MERCHANT_ID=id_merchant_sandbox_anda
   KLIKQRIS_WEBHOOK_URL=https://domain-anda.com/api/webhooks/klikqris
   ```
2. Hubungkan domain lokal Anda ke internet menggunakan **Ngrok** atau **Cloudflare Tunnel** agar webhook dapat dikirimkan oleh server KlikQRIS ke PC lokal Anda:
   - Jalankan ngrok: `ngrok http 3000`
   - Salin URL https ngrok (misalnya `https://abcd-123.ngrok-free.app`) dan setel `KLIKQRIS_WEBHOOK_URL` menggunakan URL tersebut (ditambah `/api/webhooks/klikqris`).
   - Daftarkan URL webhook ini di panel KlikQRIS Anda.
3. Jalankan pengujian:
   - Buat pesanan sebagai guest.
   - Pindai/Lihat QRIS di halaman `/pesanan/[orderNumber]`.
   - Gunakan simulator pembayaran Sandbox KlikQRIS untuk melakukan simulasi transaksi **SUCCESS** atau **EXPIRED**.
   - Pastikan status pesanan lokal berubah otomatis menjadi `paid` atau `expired` dan stok terlepas/terjual dengan benar.

## 3. Webhook Idempotency & Security
Sistem pembayaran Beliakun.com dilengkapi pertahanan tingkat tinggi:
- **Validasi Signature**: Signature callback diverifikasi dengan membandingkan hash SHA-256 dari tanda tangan awal transaksi demi mencegah pemalsuan callback.
- **Idempotensi**: Setiap kejadian callback webhook dihitung *fingerprint*-nya (SHA-256 dari nominal, status, dan signature). Jika KlikQRIS mengirimkan webhook yang sama berulang kali, sistem hanya akan memprosesnya sekali (idempotent) sehingga tidak terjadi penjualan ganda (*double fulfillment*).
- **Payment Review**: Jika nominal yang terbayar di KlikQRIS berbeda dengan nilai pesanan di sistem lokal, status transaksi akan dipindahkan ke `payment_review` untuk peninjauan admin manual (stok tidak akan dikirimkan otomatis).

## 4. Peluncuran Production (Uang Asli)
Setelah semua pengujian di Sandbox berhasil:
1. Pastikan status merchant Anda di KlikQRIS telah aktif (Live).
2. Ubah `KLIKQRIS_DRIVER` menjadi `inhouse` atau `my_pg` sesuai tipe merchant Anda.
3. Ganti `KLIKQRIS_API_KEY` dan `KLIKQRIS_MERCHANT_ID` dengan kredensial produksi Anda.
4. Daftarkan webhook URL resmi Anda di dashboard produksi KlikQRIS (misal: `https://beliakun.com/api/webhooks/klikqris`).
