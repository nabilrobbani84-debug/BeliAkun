# Setup Inventory & Master Key (Step 3)

Sistem Beliakun.com menggunakan enkripsi end-to-end (di level aplikasi) untuk menyimpan data stok (credential) sebelum disimpan di Supabase. Hal ini memastikan bahwa jika seseorang memiliki akses langsung ke database Supabase, mereka tidak dapat membaca data pelanggan Anda.

Agar enkripsi ini bekerja, Anda wajib memiliki **Inventory Master Key** yang aman. Key ini hanya boleh disimpan di server (Environment Variables) dan tidak boleh bocor ke publik atau ke dalam database.

## 1. Men-generate Master Key
Master Key yang dibutuhkan adalah 32-bytes random string dalam format Base64 (atau Base64URL).
Anda dapat membuatnya dengan mudah menggunakan perintah berikut di terminal (jika Anda memiliki Node.js terinstall):

```bash
node -e "console.log(crypto.randomBytes(32).toString('base64url'))"
```

## 2. Menyimpan Key ke Environment Lokal
1. Buka file `.env.local` di root project Anda.
2. Tambahkan atau perbarui baris berikut dengan key yang baru saja Anda hasilkan:
   ```env
   INVENTORY_MASTER_KEY_V1=TULIS_KEY_ANDA_DI_SINI
   ```
3. Restart server pengembangan Anda (`npm run dev`).

## 3. Menyimpan Key ke Production (Vercel / Cloudflare)
Bila Anda men-deploy aplikasi ini ke Vercel atau Cloudflare Pages, Anda WAJIB menambahkan variabel `INVENTORY_MASTER_KEY_V1` ke pengaturan Environment Variables di dashboard mereka.

**Peringatan Penting:**
- JANGAN PERNAH merubah atau menghilangkan `INVENTORY_MASTER_KEY_V1` jika sudah ada stok yang tersimpan. Jika key ini hilang, seluruh stok yang sudah dienkripsi TIDAK AKAN PERNAH BISA didekripsi kembali (hangus).
- Jika di masa depan Anda ingin merotasi key, buat variabel baru (misal `INVENTORY_MASTER_KEY_V2`) dan pastikan sistem masih menyimpan fallback key lama, namun untuk saat ini sistem hanya menggunakan `V1`.

## 4. Cara Kerja Enkripsi (Untuk Developer)
- Saat Admin menambah stok, form mengirimkan raw credential ke Next.js Server Action (`createInventoryItemAction`).
- Server mengubah credential menjadi JSON string, lalu mengenkripsinya dengan `AES-256-GCM` menggunakan `HKDF` turunan dari Master Key (Web Crypto API).
- Server juga membuat HMAC-SHA256 fingerprint dari data yang dinormalisasi untuk mencegah duplikasi (karena AES-GCM menghasilkan ciphertext yang selalu berubah meski inputnya sama).
- Ciphertext, IV, dan Versi Enkripsi lalu disimpan di Supabase.

## 5. Menampilkan Kredensial (Reveal)
Saat Admin mengklik "Tampilkan Data Stok" di Dashboard Admin:
1. Client meminta data secara asinkronus ke server (Server Action).
2. Server mengambil `encrypted_payload` dari Supabase.
3. Server mendekripsi data menggunakan Master Key.
4. Server mencatat aktivitas (`revealed`) di tabel log audit `inventory_events`.
5. Server mengembalikan plaintext ke client secara *no-store* (tidak masuk cache HTTP manapun).
6. UI akan menyembunyikan data secara otomatis dalam 60 detik.
