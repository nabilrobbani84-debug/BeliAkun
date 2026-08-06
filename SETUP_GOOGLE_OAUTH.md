# Panduan Pengaturan Google OAuth Login & Notifikasi Email

Dokumen ini berisi panduan lengkap langkah demi langkah untuk mengaktifkan **Login dengan Akun Google** pada Beliakun.com dan memastikan notifikasi email keamanan masuk ke email pengguna saat login berhasil.

---

## 1. Pengaturan Google Cloud Console (Mendapatkan Client ID & Secret)

1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Buat proyek baru atau pilih proyek yang sudah ada.
3. Di menu sebelah kiri, buka **APIs & Services** > **OAuth consent screen**.
   - Pilih **External**, lalu klik **Create**.
   - Isi nama aplikasi (misal: `Beliakun`), email dukungan, dan email pengembang.
   - Pada bagian **Scopes**, tambahkan scope: `.../auth/userinfo.email` dan `.../auth/userinfo.profile`.
   - Simpan dan lanjutkan.
4. Di menu sebelah kiri, buka **APIs & Services** > **Credentials**.
   - Klik **+ Create Credentials** > **OAuth client ID**.
   - Pilih Application type: **Web application**.
   - Masukkan Name: `Beliakun Web Client`.
   - Di bagian **Authorized redirect URIs**, masukkan URL Callback dari Supabase:
     ```text
     https://<YOUR-SUPABASE-PROJECT-REF>.supabase.co/auth/v1/callback
     ```
   - Klik **Create**.
5. Simpan nilai **Client ID** dan **Client Secret** yang diberikan.

---

## 2. Pengaturan di Dashboard Supabase

1. Buka Dashboard [Supabase](https://supabase.com/dashboard).
2. Pilih proyek Anda.
3. Di menu samping, navigasi ke **Authentication** > **Providers**.
4. Cari provider **Google** dan aktifkan (toggle `Enabled`).
5. Masukkan:
   - **Client ID**: (diperoleh dari Google Cloud Console)
   - **Client Secret**: (diperoleh dari Google Cloud Console)
6. Di bagian **Authentication** > **URL Configuration**:
   - Atur **Site URL**: `http://localhost:3000` (atau URL domain produksi Anda, contoh: `https://beliakun.com`)
   - Tambahkan ke **Redirect URLs**:
     ```text
     http://localhost:3000/auth/callback
     https://beliakun.com/auth/callback
     ```
7. Klik **Save**.

---

## 3. Cara Kerja Notifikasi Email Berhasil Login

Ketika pengguna menglik **"Lanjutkan dengan Akun Google"**:
1. Aplikasi akan mengarahkan pengguna ke halaman login resmi Google.
2. Setelah sukses, Google akan mengembalikan akun ke endpoint aplikasi di `/auth/callback`.
3. Server Beliakun akan menukarkan kode token Supabase Auth.
4. Rute `/auth/callback` secara otomatis akan:
   - Mendapatkan alamat email resmi Google milik pengguna.
   - Mengantrekan email notifikasi keamanan (*Security Login Notification*) ke tabel `email_outbox`.
   - Menampilkan notifikasi popup (toast) di layar pengguna.
5. Email notifikasi keamanan masuk ke kotak masuk email Google pengguna.
