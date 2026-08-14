# Panduan Pengaturan Supabase (Manual)

Untuk mengaktifkan database katalog Beliakun.com, Anda perlu melakukan pengaturan Supabase secara manual melalui dashboard.

## A. Membuat Project
1. Buka [Dashboard Supabase](https://supabase.com/dashboard).
2. Pilih **New Project**.
3. Pilih *organization* yang Anda inginkan.
4. Isi nama project, misalnya `beliakun-production`.
5. Buat password database yang kuat dan simpan baik-baik.
6. Pilih region yang paling dekat dengan mayoritas pengguna Anda (contoh: Singapore).
7. Klik **Create new project** dan tunggu hingga project selesai dipersiapkan (biasanya beberapa menit).

## B. Mengambil API Credentials
1. Setelah project aktif, buka *Project Settings* (ikon gerigi) di menu samping.
2. Buka bagian **API**.
3. Salin **Project URL** dan masukkan ke file `.env.local` sebagai `NEXT_PUBLIC_SUPABASE_URL`.
4. Salin **anon/public key** dan masukkan ke `.env.local` sebagai `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. *(Opsional)* Salin **service_role secret** dan simpan di `.env.local` sebagai `SUPABASE_SERVICE_ROLE_KEY` (hanya jika Anda membutuhkannya di *server* nanti, tapi jangan pernah membagikannya ke *client*).

## C. Menjalankan Migration
Untuk membuat tabel dan RLS *policies*, jalankan *migration file* yang sudah disediakan di `supabase/migrations/0001_catalog_foundation.sql`.

**Melalui Supabase CLI (Dianjurkan):**
Jika Anda sudah meng-install Supabase CLI, jalankan perintah berikut di terminal:
```bash
supabase link --project-ref <your-project-id>
supabase db push
```

**Melalui SQL Editor (Alternatif):**
1. Buka Supabase Dashboard.
2. Pilih menu **SQL Editor** di menu samping.
3. Klik **New Query**.
4. Salin semua isi file `supabase/migrations/0001_catalog_foundation.sql`.
5. Tempel (*paste*) ke editor dan jalankan query dengan mengklik **Run**.
6. Buka menu **Table Editor** untuk memastikan tabel `categories`, `products`, dan `product_variants` sudah terbuat.

## D. Menjalankan Seed
Untuk mengisi data awal pengembangan (seperti produk ChatGPT, Gemini, dll):
1. Buka kembali **SQL Editor**.
2. Buat **New Query**.
3. Salin semua isi file `supabase/seed.sql`.
4. Tempel ke editor dan klik **Run**.
5. Buka menu **Table Editor** untuk melihat data contoh yang telah dimasukkan.

## E. Verifikasi RLS
Pastikan tabel aman:
1. Buka menu **Authentication** -> **Policies**.
2. Pastikan tabel `categories`, `products`, dan `product_variants` memiliki keterangan RLS aktif.
3. Pastikan *Anonymous user* dapat membaca (*Select*) data yang berstatus `active`.
4. Pastikan *Anonymous user* **tidak** memiliki izin *Insert*, *Update*, atau *Delete*.

---

# Step 2 — Auth dan Admin Setup

Untuk mengaktifkan otentikasi admin, ikuti konfigurasi tambahan berikut.

## F. Menjalankan Migration Step 2
Jalankan file `supabase/migrations/0002_admin_auth_catalog_management.sql` menggunakan cara yang sama seperti Step 1:
- Buka **SQL Editor**.
- Buat **New Query**.
- Salin seluruh isi file migrasi Step 2 dan klik **Run**.
- Verifikasi tabel baru `profiles` dan `product_delivery_fields` telah dibuat di **Table Editor**.

## G. Mengaktifkan Email Provider & URL Konfigurasi
1. Buka dasbor Supabase Anda, lalu pilih menu **Authentication** -> **Providers**.
2. Pastikan provider **Email** sudah aktif.
3. Buka menu **Authentication** -> **URL Configuration**.
4. Atur **Site URL** ke URL lokal Anda: `http://localhost:3000`. (Ganti dengan `https://beliakun.com` saat nanti live).
5. Di bagian **Redirect URLs**, tambahkan URL berikut:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/**`
   - `https://beliakun.com/auth/callback`
   - `https://beliakun.com/**`

## G2. Mengaktifkan Google OAuth Provider (Mengatasi Error 400: redirect_uri_mismatch)
Jika Anda mengalami error **`Error 400: redirect_uri_mismatch`** saat mencoba login dengan Google, ikuti langkah perbaikan berikut:

1. **Ambil Callback URL Supabase:**
   - Buka **Supabase Dashboard** -> **Authentication** -> **Providers** -> **Google**.
   - Salin **Callback URL (for OAuth)** (misal: `https://<project-ref>.supabase.co/auth/v1/callback`).

2. **Daftarkan Redirect URI di Google Cloud Console:**
   - Buka [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
   - Pilih project Google Cloud Anda, lalu klik Client ID OAuth 2.0 yang digunakan (atau buat baru jika belum ada).
   - Di bagian **Authorized redirect URIs**, klik **+ ADD URI** dan masukkan Callback URL Supabase yang sudah disalin di atas:
     `https://<project-ref>.supabase.co/auth/v1/callback`
   - Di bagian **Authorized JavaScript origins**, tambahkan:
     - `http://localhost:3000`
     - `https://<project-ref>.supabase.co`
   - Klik **SAVE**.

3. **Input Credentials ke Supabase:**
   - Salin **Client ID** dan **Client Secret** dari Google Cloud Console.
   - Kembali ke **Supabase Dashboard** -> **Authentication** -> **Providers** -> **Google**.
   - Aktifkan **Enable Google provider**, isi Client ID dan Client Secret, lalu klik **Save**.

4. **Tambahkan User ke Test Users (Jika Client Masih Status Testing):**
   - Jika status App di Google Cloud Console masih *Testing*, buka **OAuth consent screen** -> **Test users**.
   - Tambahkan alamat email akun Google Anda (contoh: `nabilrobbani6@gmail.com`).

5. **Mempublikasikan OAuth App ke Status Production:**
   - Untuk mengizinkan semua pengguna login dengan Google tanpa perlu menambahkan email satu per satu ke Test Users:
   - Buka [Google Cloud Console - OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent).
   - Di bawah bagian **Publishing status** (yang saat ini berstatus *Testing*), klik tombol **PUBLISH APP**.
   - Pada dialog konfirmasi yang muncul ("Publish to production?"), klik **CONFIRM**.
   - Status aplikasi akan berubah menjadi **In production** dan siap digunakan oleh semua akun Google!



## H. Membuat Akun Admin Pertama
1. Buka menu **Authentication** -> **Users**.
2. Klik **Add User** -> **Create User**.
3. Isi email dan password admin yang aman, lalu buat user.
4. Salin **User ID** (UUID) dari pengguna baru tersebut.
5. Buka **SQL Editor** -> **New Query**.
6. Jalankan query berikut untuk memberikan hak akses admin (ganti dengan UUID yang Anda salin):
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE id = 'UUID_USER_ANDA_YANG_DISALIN';
   ```
7. Sekarang, Anda dapat masuk ke `/admin/login` dengan kredensial tersebut!

---

# Step 3 — Sistem Stok dan Inventory

## I. Menjalankan Migration Step 3
Jalankan file `supabase/migrations/0003_inventory_system.sql` menggunakan cara yang sama:
- Buka **SQL Editor**.
- Buat **New Query**.
- Salin seluruh isi file migrasi Step 3 dan klik **Run**.
- Verifikasi tabel baru `inventory_items` dan `inventory_events` telah dibuat.

Untuk petunjuk pembuatan kunci enkripsi (Master Key) agar modul stok dapat berjalan, lihat panduan di [SETUP_INVENTORY.md](./SETUP_INVENTORY.md).

---

# Step 4 — Guest Checkout & Orders

## J. Menjalankan Migration Step 4
Jalankan file `supabase/migrations/0004_guest_checkout_orders.sql`:
- Buka **SQL Editor** -> **New Query**.
- Salin seluruh isi file migrasi Step 4 dan klik **Run**.
- Verifikasi tabel baru `orders`, `order_items`, `order_access_tokens`, dan `order_events` telah dibuat.

---

# Step 5 — Payments & KlikQRIS

## K. Menjalankan Migration Step 5
Jalankan file `supabase/migrations/0005_klikqris_payments.sql`:
- Buka **SQL Editor** -> **New Query**.
- Salin seluruh isi file migrasi Step 5 dan klik **Run**.
- Verifikasi tabel baru `payments` dan `payment_events` telah terbuat.
- Pastikan hak eksekusi RPC `settle_paid_payment` dan `settle_expired_payment` dibatasi dari akses publik/anonim secara langsung.

