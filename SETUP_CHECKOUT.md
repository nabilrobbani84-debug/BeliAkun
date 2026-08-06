# Setup Guest Checkout & Orders (Step 4)

Dokumen ini menjelaskan konfigurasi yang diperlukan untuk menjalankan sistem pesanan guest di Beliakun.com.

## 1. Environment Variables
Pastikan file `.env.local` Anda memiliki konfigurasi berikut:

```env
# Feature Flag (Ubah ke true saat peluncuran)
CHECKOUT_ENABLED=true

# Batas Waktu Reservasi Pesanan (menit)
ORDER_RESERVATION_MINUTES=30

# Masa Berlaku Token Akses Guest (hari)
ORDER_ACCESS_TOKEN_TTL_DAYS=90
```

## 2. Migrasi Database
Jalankan file SQL migrasi di Supabase:
`supabase/migrations/0004_guest_checkout_orders.sql`

## 3. Cron Job / Edge Functions (Membersihkan Reservasi Kedaluwarsa)
Karena Beliakun.com tidak memiliki background worker (Node.js cron), pesanan yang sudah melewati `reservation_expires_at` (contoh: 30 menit) akan tertahan kecuali ada pemicu. 

Untuk membersihkan reservasi yang kedaluwarsa secara otomatis, Anda memiliki 3 opsi:

### Opsi A: pg_cron (Database Level) - DIREKOMENDASIKAN
Jika ekstensi `pg_cron` tersedia di Supabase Pro/Team, Anda dapat menjadwalkan RPC untuk berjalan setiap 5 menit:
```sql
SELECT cron.schedule('release-expired-reservations', '*/5 * * * *', 'SELECT release_expired_order_reservations(50)');
```

### Opsi B: Supabase Edge Functions (cron)
Anda dapat mendeploy Edge Function dan mengatur jadwal eksekusinya menggunakan Supabase Cron.
Function tersebut cukup memanggil fungsi RPC `release_expired_order_reservations`.

### Opsi C: Manual Admin Cleanup
Terdapat tombol "Bersihkan Reservasi" di halaman Admin > Pesanan. Admin dapat mengkliknya kapan saja untuk membersihkan stok yang dipesan tetapi tidak dibayar (kedaluwarsa).

## 4. Keamanan Guest Access
1. Token akses pesanan (Order Access Token) digenerate secara kriptografis menggunakan `crypto.getRandomValues`.
2. Raw token (32 byte buffer -> base64) disimpan dalam HttpOnly Cookie di browser pembeli.
3. Yang disimpan di database hanyalah SHA-256 hash dari raw token tersebut.
4. Akses untuk mengambil data pesanan hanya melalui Server Action (`lib/data/orders.ts`) yang menggunakan Service Role (bypassing RLS), sehingga API tidak terekspos ke publik.
