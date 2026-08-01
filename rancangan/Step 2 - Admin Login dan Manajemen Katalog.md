# STEP 2 — Admin Authentication dan Manajemen Katalog Beliakun.com

Lanjutkan pengembangan **Beliakun.com** ke tahap kedua.

Fokus Step 2 hanya pada:

1. Supabase Auth untuk login admin.
2. Role dan authorization admin.
3. Protected Admin Dashboard.
4. CRUD kategori.
5. CRUD produk.
6. CRUD konfigurasi field data produk.
7. CRUD varian produk.
8. Dokumentasi pengaturan manual Supabase dan Cloudflare.

Jangan mengerjakan fitur berikut dahulu:

- Checkout user.
- Guest checkout.
- Keranjang production.
- KlikQRIS.
- Webhook pembayaran.
- Stok kredensial.
- Reservasi stok.
- Pengiriman email.
- Pengiriman produk.
- Cloudflare R2 upload.
- Dashboard analytics kompleks.
- Sistem pelanggan lengkap.
- Kupon.
- Refund.
- Ticket support.

Setelah Step 2 selesai, berhenti dan tunggu instruksi Step 3.

---

# 1. Verifikasi Step 1

Sebelum memulai, periksa apakah Step 1 sudah tersedia dan berfungsi.

Pastikan terdapat:
- categories
- products
- product_variants

Pastikan juga tersedia:
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/data/catalog.ts`
- `.env.example`
- `SETUP_SUPABASE.md`
- `SETUP_CLOUDFLARE.md`

Periksa migration, RLS, homepage category, homepage products, dan koneksi Supabase.

Jika Step 1 belum lengkap:
- Jangan membuat ulang semua struktur dari awal.
- Perbaiki hanya bagian yang menjadi blocker.
- Dokumentasikan blocker yang ditemukan.
- Jangan melakukan migration destructive.
- Jangan menghapus data existing.

# 2. Baca Dokumentasi Project

Sebelum mengubah source code:
- Baca DESIGN.md.
- Baca STYLE.md.
- Baca COMPONENTS.md.
- Baca SETUP_SUPABASE.md.
- Baca SETUP_CLOUDFLARE.md.
- Periksa seluruh migration Supabase.
- Periksa implementasi Theme Provider.
- Periksa komponen form yang sudah tersedia.
- Periksa struktur App Router.
- Periksa konfigurasi deployment Cloudflare Workers.

Gunakan komponen custom khas Beliakun.com.
Jangan membuat design system baru.

# 3. Prinsip Implementasi

Sistem admin harus:
- Sederhana.
- Ringan.
- Responsive.
- Mudah dipahami.
- Tidak terlalu banyak animasi.
- Tidak menggunakan dashboard SaaS generik.
- Mendukung light mode dan dark mode.
- Kompatibel dengan Cloudflare Workers.
- Menggunakan Supabase Auth.
- Menggunakan Supabase RLS.
- Tidak mengandalkan pengecekan role hanya di frontend.
- Tidak membocorkan service role key.
- Tidak membuat seluruh admin menjadi satu Client Component besar.

Gunakan Server Component untuk layout dan data awal.
Gunakan Client Component hanya untuk:
- Form interaktif.
- Dialog.
- Combobox.
- Dynamic field list.
- Optimistic UI jika memang aman.
- Theme toggle.
- Action yang benar-benar membutuhkan browser state.

# 4. Struktur Route Admin

Gunakan struktur App Router yang rapi.
Rekomendasi:
```text
app/
├── admin/
│   ├── login/
│   │   └── page.tsx
│   └── (protected)/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── categories/
│       │   ├── page.tsx
│       │   ├── new/
│       │   │   └── page.tsx
│       │   └── [id]/
│       │       └── edit/
│       │           └── page.tsx
│       └── products/
│           ├── page.tsx
│           ├── new/
│           │   └── page.tsx
│           └── [id]/
│               ├── page.tsx
│               └── edit/
│                   └── page.tsx
```

Sesuaikan dengan struktur project existing.

URL final minimal:
- `/admin/login`
- `/admin`
- `/admin/categories`
- `/admin/categories/new`
- `/admin/categories/[id]/edit`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]`
- `/admin/products/[id]/edit`

Varian dan field produk boleh dikelola di halaman detail atau edit produk agar menu admin tetap sederhana.

# 5. Migration Step 2

Buat migration baru:
`supabase/migrations/0002_admin_auth_catalog_management.sql`

Gunakan nomor urut yang sesuai migration project.
Jangan mengubah migration Step 1 yang sudah pernah dijalankan.

Migration Step 2 harus mencakup:
- Enum role.
- Tabel profiles.
- Trigger profile user baru.
- Helper authorization admin.
- RLS admin untuk katalog.
- Tabel konfigurasi field pengiriman produk.
- Index dan constraint tambahan.
- Audit timestamp.

# 6. Role User

Buat role sederhana:
- customer
- admin
- super_admin

Untuk tahap awal:
- customer adalah default.
- admin dapat mengelola katalog.
- super_admin memiliki akses setara admin dan disiapkan untuk pengaturan lanjutan.

Jangan menggunakan data role dari form browser sebagai sumber kebenaran.
Jangan mengizinkan user mengubah role miliknya sendiri.

# 7. Tabel Profiles

Buat tabel: `profiles`

Minimal field:
- id
- email
- display_name
- role
- status
- created_at
- updated_at

Aturan:
- id UUID dan mereferensikan auth.users.id.
- email diambil dari Auth user.
- display_name opsional.
- role default customer.
- status menggunakan active atau suspended.
- Hapus profile otomatis atau gunakan cascade sesuai keputusan yang aman.
- Tambahkan index role dan status.

Jangan menyimpan password di tabel profiles.
Password hanya dikelola oleh Supabase Auth.

# 8. Trigger Profile Otomatis

Buat trigger ketika user baru dibuat pada auth.users.
Trigger harus:
- Membuat record profile.
- Mengambil email dengan aman.
- Memberikan role default customer.
- Tidak menerima role dari metadata publik tanpa validasi.
- Tidak gagal hanya karena display name kosong.

Gunakan function dengan security definer secara hati-hati.
Tetapkan search_path secara eksplisit.

# 9. Helper Authorization

Buat function authorization reusable, misalnya: `is_admin()` atau `has_admin_role()`

Function harus mengembalikan true hanya jika:
- auth.uid() memiliki profile aktif
- dan role adalah admin atau super_admin

Aturan keamanan:
- Gunakan security definer hanya jika diperlukan.
- Tetapkan search_path.
- Jangan mengambil role dari local storage.
- Jangan mengambil role dari query parameter.
- Jangan menggunakan pengecekan email hardcoded di source code.

# 10. RLS Profiles

Aktifkan RLS pada profiles.
Policy minimal:
- User membaca profile sendiri: User authenticated hanya dapat membaca profile miliknya.
- User memperbarui data non-sensitif sendiri: display_name.
- User tidak boleh memperbarui: role, status, email secara langsung.
- Admin dapat membaca profile yang dibutuhkan untuk administrasi.

Pada Step 2 belum perlu membuat halaman pelanggan.
Jangan membuat policy public read profiles.

# 11. RLS Katalog untuk Admin

Pertahankan public policy dari Step 1:
- Public hanya membaca kategori active.
- Public hanya membaca produk active.
- Public hanya membaca varian active.

Tambahkan policy admin agar admin dapat:
- Membaca semua status.
- Insert.
- Update.
- Mengarsipkan.

Untuk tahap ini, hindari hard delete dari UI. Gunakan status: active, inactive, archived, draft.
Jika tetap menyediakan delete, batasi hanya untuk record yang belum pernah digunakan dan gunakan konfirmasi yang jelas.
Lebih dianjurkan: Archive daripada Delete permanently.

# 12. Tabel Product Delivery Fields

Buat tabel: `product_delivery_fields`

Tabel ini hanya menyimpan konfigurasi jenis data yang nantinya diterima pembeli. Tabel ini belum menyimpan kredensial stok.

Minimal field:
- id
- product_id
- field_key
- label
- field_type
- placeholder
- description
- is_required
- is_secret
- sort_order
- created_at
- updated_at

Jenis field yang didukung:
- text
- email
- password
- url
- code
- pin
- textarea
- number

Contoh konfigurasi produk akun:
- Email
- Password
- 2FA
- Profile
- PIN

Contoh konfigurasi license:
- License Key
- Link Aktivasi
- Instruksi

Contoh konfigurasi invite:
- Email Tujuan
- Link Invite
- Instruksi Bergabung

Aturan:
- field_key harus menggunakan slug atau snake_case.
- field_key unik dalam satu produk.
- label wajib.
- field_type wajib.
- is_secret digunakan untuk password, PIN, 2FA, dan data sensitif.
- sort_order menentukan urutan.
- Tambahkan foreign key cascade ke products.
- Tambahkan index product_id.
- Aktifkan RLS.
- Public boleh membaca konfigurasi field hanya untuk produk active jika memang dibutuhkan storefront.
- Hanya admin yang boleh insert, update, dan delete.

Jangan menyimpan password atau credential nyata pada tabel ini.

# 13. Supabase Auth Client

Pastikan implementasi menggunakan:
- `@supabase/ssr`
- `@supabase/supabase-js`

Gunakan pola cookie SSR yang benar.
Periksa:
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`

Jika dibutuhkan, tambahkan:
- `lib/supabase/middleware.ts` atau helper session refresh yang sesuai arsitektur project.

Jangan membuat Supabase client baru di setiap file secara sembarangan.
Jangan menyimpan access token secara manual di local storage jika library sudah menanganinya.

# 14. Middleware atau Route Guard

Lindungi seluruh route `/admin/*` kecuali `/admin/login`.
Validasi harus dilakukan di server.

Alurnya:
- Belum login -> redirect ke `/admin/login`
- Sudah login tetapi bukan admin -> tampilkan unauthorized atau redirect ke halaman aman
- Admin aktif -> izinkan mengakses dashboard

Jangan hanya menyembunyikan menu admin di frontend. RLS tetap wajib.
Pastikan implementasi kompatibel dengan Cloudflare Workers.

# 15. Halaman Login Admin

Buat halaman: `/admin/login`
Gunakan Supabase email dan password.

Form berisi:
- Email
- Password
- Tombol Masuk

Tambahkan:
- Show/hide password.
- Loading state.
- Invalid state.
- Error message natural.
- Disabled state.
- Redirect setelah berhasil.
- Return URL yang aman jika diperlukan.

Gunakan copy:
> Masuk ke Admin Beliakun.com
> Kelola produk dan katalog toko dari satu tempat.

Pesan error:
> Email atau password tidak sesuai.

Jangan tampilkan error teknis Supabase kepada pengguna.
Jangan menyediakan register admin publik.
Jangan menyediakan pilihan role pada halaman login.

# 16. Logout Admin

Tambahkan logout pada sidebar atau account menu.
Saat logout:
- Panggil Supabase sign out.
- Hapus session.
- Redirect ke `/admin/login`.
- Jangan reload berulang.
- Jangan meninggalkan halaman admin dari browser cache sebagai halaman aktif.

# 17. Admin Layout

Buat layout admin sederhana.
Struktur:
- Sidebar atau mobile Sheet
- Topbar
- Breadcrumb
- Main content

Menu tahap ini:
- Dashboard
- Produk
- Kategori
- Keluar

Sembunyikan menu stok, pesanan, pembayaran, dll. yang belum siap.

# 18. Responsive Admin

Pastikan admin responsive (Mobile, Tablet, Desktop) tanpa horizontal overflow.

# 19. Dashboard Admin

Buat dashboard sederhana menampilkan KPI:
- Total Produk
- Produk Aktif
- Produk Draft
- Total Kategori

Tambahkan quick action:
- Tambah Produk
- Tambah Kategori
- Lihat Storefront

Jangan membuat chart pada Step 2.

# 20. Halaman Kategori

Buat halaman: `/admin/categories`
Tampilkan: Nama, Slug, Status, Urutan, Jumlah produk (opsional), Tanggal diperbarui, Action edit, Action archive.
Tambahkan: Search, Filter status, Tombol tambah kategori, Empty/Loading/Error state.

# 21. Form Kategori

Field: Nama, Slug, Deskripsi, Status, Icon key atau image path, Urutan.
Behavior: Slug otomatis dibuat dari nama (lowercase, trim, spasi jadi hubung, dll.), Slug tetap dapat diedit.

# 22. Halaman Produk

Buat halaman: `/admin/products`
Tampilkan: Thumbnail/placeholder, Nama produk, Kategori, Status, Badge, Metode pengiriman, Jumlah varian, Harga mulai dari, Tanggal diperbarui, Action detail/edit/archive.
Tambahkan: Search (nama atau SKU), Filter (kategori, status, pengiriman), Sorting, Tombol tambah produk.

# 23. Form Produk

Terbagi atas:
- **Informasi Dasar**: Nama, Slug, Kategori, Deskripsi Pendek, Deskripsi Lengkap, Status, Fitur (dynamic list).
- **Tampilan Produk**: Badge (Tanpa badge, Terlaris, Hemat, Baru, Stok terbatas), Thumbnail key/path, Urutan.
- **Garansi**: Durasi, Satuan, Label.
- **Pengiriman**: Instan atau Manual.

# 24. Konfigurasi Field Produk

Area: **Data yang Akan Diterima Pembeli**
Admin dapat mengelola dynamic field list (Label, Key, Tipe field, Wajib/opsional, Rahasia/biasa, Deskripsi, Urutan).

# 25. Varian Produk

Kelola varian di halaman produk.
Field: Nama Varian, SKU (unik), Harga (integer Rupiah), Harga Sebelum Diskon, Nilai & Satuan Durasi, Label Durasi, Label Paket, Tipe Stok, Tipe Akun, Status, Urutan.

# 26. Validasi Form

Gunakan React Hook Form & Zod jika tersedia. Validasi di client dan server.

# 27. Mutation

Gunakan Server Actions atau Route Handler.
Setiap mutation harus memvalidasi autentikasi, otorisasi admin, input, dan memicu revalidasi cache.

# 28. Slug & Price Formatter Utility

Sediakan utility slug builder dan Rupiah format helper.

# 29. Storefront Integration

Pastikan revalidation cache bekerja sehingga perubahan data langsung terlihat di storefront.

# 30. Light dan Dark Mode

Pastikan UI admin ter-style dengan benar untuk mode gelap dan terang.

# 31. Security

Validasi keamanan server-side, RLS, dilarang register admin publik, dilarang service role di browser.

# 32. Audit Log Sederhana

Simpan `created_at` & `updated_at`. Jika memungkinkan buat tabel `admin_activity_logs`.

# 33. SETUP_SUPABASE.md & SETUP_CLOUDFLARE.md

Perbarui panduan dengan konfigurasi Auth, Redirect URLs, pembuatan user admin pertama, RLS verification, dsb.

# 34. SETUP_ADMIN.md

Buat panduan operasional admin untuk pemilik toko.

---

## Urutan Pengembangan Proyek Beliakun.com

1. **Step 1**: Database katalog dan storefront
2. **Step 2**: Auth admin dan CRUD katalog
3. **Step 3**: Sistem stok dan inventory
4. **Step 4**: Guest checkout dan order
5. **Step 5**: KlikQRIS dan webhook
6. **Step 6**: Pengiriman otomatis dan email
7. **Step 7**: Riwayat pesanan dan operasional production
