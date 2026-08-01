# STEP 1 — Fondasi Supabase, Cloudflare, dan Katalog Beliakun.com

Kerjakan tahap pertama pengembangan website **Beliakun.com**.

Fokus tahap ini hanya pada:

1. Menyiapkan koneksi Supabase.
2. Menyiapkan struktur database katalog.
3. Menghubungkan homepage dengan data Supabase.
4. Memastikan project kompatibel dengan Cloudflare Workers.
5. Membuat dokumentasi pengaturan manual Supabase dan Cloudflare.

Jangan mengerjakan fitur berikut dahulu:

- Checkout.
- KlikQRIS.
- Webhook pembayaran.
- Pengiriman email.
- Stok kredensial.
- Dashboard admin lengkap.
- Login atau register.
- Keranjang kompleks.
- Pengiriman produk.
- Enkripsi kredensial.

Tahap ini harus sederhana, stabil, dan menjadi fondasi untuk tahap berikutnya.

---

# 1. Aturan Utama

Sebelum melakukan perubahan:

1. Baca `DESIGN.md`.
2. Baca `STYLE.md`.
3. Baca `COMPONENTS.md`.
4. Periksa struktur project.
5. Periksa `package.json`.
6. Periksa implementasi Next.js App Router.
7. Periksa konfigurasi Cloudflare/OpenNext yang sudah tersedia.
8. Periksa seluruh environment variable yang sudah digunakan.
9. Jangan menghapus fitur atau tampilan existing tanpa alasan.
10. Jangan mengubah desain homepage secara besar.

Gunakan tech stack final berikut:

```text
Next.js App Router
Cloudflare Workers
Cloudflare R2
Cloudflare DNS/CDN/WAF
Supabase Auth
Supabase PostgreSQL
KlikQRIS
GitHub
```

Untuk Step 1, yang digunakan secara aktif hanya:

- Next.js App Router
- Cloudflare Workers
- Supabase PostgreSQL
- GitHub

Supabase Auth, R2, dan KlikQRIS akan digunakan pada tahap berikutnya.

# 2. Protokol Pengaturan Manual

Apabila terdapat konfigurasi yang harus dilakukan oleh pemilik project melalui dashboard Supabase atau Cloudflare, jangan menganggap konfigurasi tersebut sudah dilakukan.

AI Agent wajib:

- Menjelaskan bahwa terdapat tindakan manual.
- Menyebutkan dashboard yang harus dibuka.
- Menjelaskan menu yang harus dipilih.
- Menjelaskan nilai yang harus disalin.
- Menjelaskan lokasi nilai tersebut harus dimasukkan.
- Memberikan cara memverifikasi konfigurasi.
- Tidak meminta secret dituliskan di chat publik.
- Tidak memasukkan secret ke source code.
- Tidak mengklaim integrasi berhasil sebelum diverifikasi.

Buat file:

- `SETUP_SUPABASE.md`
- `SETUP_CLOUDFLARE.md`

Di akhir pekerjaan, tampilkan bagian:

**ACTION REQUIRED FROM OWNER**

Jika tidak ada tindakan manual, tuliskan:

*Tidak ada tindakan manual tambahan untuk tahap ini.*

# 3. Environment Variables

Buat atau perbarui:

`.env.example`

Minimal sediakan:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=
```

Aturan:

- `NEXT_PUBLIC_SUPABASE_URL` boleh digunakan client.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` boleh digunakan client dan tetap harus dilindungi RLS.
- `SUPABASE_SERVICE_ROLE_KEY` hanya boleh digunakan pada server.
- Jangan mengakses service role dari Client Component.
- Jangan menggunakan prefix `NEXT_PUBLIC_` untuk service role.
- Jangan commit `.env.local`.
- Pastikan `.gitignore` melindungi file environment lokal.
- Jangan mencetak secret ke console atau log.

Untuk Step 1, hindari penggunaan `SUPABASE_SERVICE_ROLE_KEY` jika belum diperlukan.

# 4. Validasi Environment

Buat utility validasi environment yang ringan.

Contoh lokasi:

`lib/env.ts`

Utility harus:

- Memvalidasi variable wajib.
- Memberikan error yang jelas saat variable belum tersedia.
- Tidak membocorkan nilai secret.
- Membedakan variable public dan server.
- Tidak menyebabkan browser menerima server secret.

Jangan menambahkan library validasi baru jika project sudah memiliki solusi environment validation.

# 5. Instalasi Supabase

Periksa apakah dependency berikut sudah tersedia:

- `@supabase/supabase-js`
- `@supabase/ssr`

Jika belum tersedia, instal menggunakan package manager project.

Jangan memasang dependency yang tidak diperlukan.

Buat struktur seperti:

```text
lib/
└── supabase/
    ├── client.ts
    ├── server.ts
    └── types.ts
```

**client.ts**

Digunakan hanya untuk Client Component yang benar-benar membutuhkan Supabase browser client.

**server.ts**

Digunakan untuk Server Component, Route Handler, dan server-side query.

**types.ts**

Tempat type database hasil generate atau type sementara.

Jangan membuat seluruh halaman menjadi Client Component hanya karena menggunakan Supabase.

Homepage sebaiknya tetap menggunakan Server Component.

# 6. Database Migration

Buat folder jika belum tersedia:

```text
supabase/
├── migrations/
└── seed.sql
```

Buat migration awal:

`supabase/migrations/0001_catalog_foundation.sql`

Migration harus aman, jelas, dan dapat dijalankan ulang melalui alur migration yang benar.

Jangan melakukan operasi destructive seperti menghapus tabel existing tanpa pemeriksaan.

# 7. Enum Database

Buat enum atau constraint yang sesuai untuk status berikut.

**Status Kategori**
- active
- inactive
- archived

**Status Produk**
- draft
- active
- inactive
- archived

**Badge Produk**
- none
- bestseller
- saving
- new
- limited_stock

**Metode Pengiriman**
- instant
- manual

**Status Varian**
- active
- inactive
- archived

**Tipe Stok**
- limited
- unlimited

**Tipe Akun**
- invite
- sharing
- private
- license
- link_access
- custom

**Satuan Durasi**
- day
- week
- month
- year
- lifetime
- custom

Gunakan nama internal berbahasa Inggris dan tampilkan label bahasa Indonesia di UI.

# 8. Tabel Categories

Buat tabel: `categories`

Minimal memiliki field:

- id
- name
- slug
- description
- status
- icon_key
- sort_order
- created_at
- updated_at

Aturan:

- id menggunakan UUID.
- name wajib.
- slug wajib dan unik.
- description opsional.
- status default active.
- icon_key sementara menyimpan key atau path file.
- Jangan menyimpan base64 image di database.
- sort_order digunakan untuk urutan kategori.
- Tambahkan index pada slug, status, dan sort_order.

Untuk Step 1, icon boleh menggunakan asset lokal atau URL placeholder. Upload Cloudflare R2 akan dibuat pada tahap admin/media.

# 9. Tabel Products

Buat tabel: `products`

Minimal memiliki field:

- id
- category_id
- name
- slug
- short_description
- description
- features
- badge
- delivery_method
- warranty_enabled
- warranty_duration
- warranty_unit
- warranty_label
- thumbnail_key
- status
- sort_order
- created_at
- updated_at

Aturan:

- category_id memiliki foreign key ke categories.
- name wajib.
- slug wajib dan unik.
- short_description digunakan pada Product Card.
- description digunakan pada halaman detail.
- features dapat menggunakan jsonb array string.
- badge menggunakan enum atau constraint.
- delivery_method dapat berupa instant atau manual.
- Garansi harus mendukung tidak ada garansi dan custom.
- thumbnail_key menyimpan key file, bukan binary.
- status default draft.
- Tambahkan index yang relevan.

Jangan menyimpan harga langsung pada tabel products karena harga berada pada varian.

# 10. Tabel Product Variants

Buat tabel: `product_variants`

Minimal memiliki field:

- id
- product_id
- name
- sku
- price
- compare_at_price
- duration_value
- duration_unit
- duration_label
- package_label
- stock_type
- account_type
- status
- sort_order
- created_at
- updated_at

Aturan:

- product_id foreign key ke products.
- sku wajib dan unik.
- Harga disimpan sebagai integer Rupiah.
- Jangan gunakan floating-point untuk harga.
- Contoh 49000 berarti Rp49.000.
- compare_at_price opsional.
- Harga diskon valid jika lebih kecil dari harga normal.
- duration_value boleh kosong untuk lifetime atau custom.
- duration_unit menggunakan enum.
- package_label dapat berisi “Paling Populer”, “Hemat”, dan sejenisnya.
- stock_type menggunakan limited atau unlimited.
- account_type menggunakan tipe akun yang telah ditentukan.
- Tambahkan index untuk product_id, sku, status, dan sort_order.

Tambahkan database constraint untuk mencegah:

- price < 0
- compare_at_price < 0
- duration_value < 0

# 11. Updated At Trigger

Buat function dan trigger reusable untuk memperbarui: `updated_at`

Trigger digunakan pada:
- categories
- products
- product_variants

Jangan membuat function updated_at terpisah untuk setiap tabel.

# 12. Row Level Security

Aktifkan RLS pada:
- categories
- products
- product_variants

Buat kebijakan public read-only.

Pengunjung tanpa login hanya boleh membaca:
- categories.status = active
- products.status = active
- product_variants.status = active

Public tidak boleh:
- Insert.
- Update.
- Delete.
- Mengubah harga.
- Mengubah status.
- Mengubah produk.

Jangan membuat policy public menggunakan kondisi true untuk operasi tulis.
Admin policy belum perlu dibuat pada tahap ini jika role admin belum tersedia.
Dokumentasikan bahwa operasi admin akan menggunakan sistem authorization pada tahap berikutnya.

# 13. Seed Data

Buat: `supabase/seed.sql`

Masukkan data contoh minimal:

**Kategori**
- ChatGPT
- Gemini
- Claude
- CapCut

**Produk contoh**
Minimal satu produk dan satu varian untuk setiap kategori.
Contoh:
- ChatGPT Plus
- Gemini Advanced
- Claude Pro
- CapCut Pro

Gunakan data contoh yang jelas ditandai sebagai development seed.
Jangan mengklaim harga, durasi, stok, atau layanan contoh sebagai data production.
Pastikan seed dapat dijalankan tanpa membuat duplicate data berulang.

# 14. Repository Data Access

Buat layer data sederhana.

Contoh:
```text
lib/
└── data/
    └── catalog.ts
```

Sediakan function seperti:
- getActiveCategories()
- getActiveProducts()
- getProductBySlug()
- getVariantsByProductId()

Aturan:
- Gunakan server Supabase client.
- Jangan query Supabase langsung dari banyak komponen.
- Tangani error dengan baik.
- Jangan tampilkan database error mentah kepada pengguna.
- Gunakan TypeScript return type yang jelas.
- Jangan menggunakan any.

# 15. Homepage Integration

Hubungkan homepage dengan data Supabase.

Section yang mengambil data:
- Kategori Produk
- Semua Produk

Homepage tetap memiliki struktur:
- Hero Banner Slider
- Kategori Produk
- Semua Produk
- Trust Section
- CTA
- Footer

Hero, Trust Section, CTA, dan Footer tidak perlu mengambil data Supabase pada tahap ini.

Kategori harus menampilkan:
- Icon
- Nama
- Link/filter

Product Card harus menampilkan:
- Nama
- Deskripsi pendek
- Badge
- Harga varian termurah
- Harga lama jika ada
- Durasi
- Tipe akun
- Status

Gunakan komponen existing dari COMPONENTS.md.
Jangan membuat Product Card baru jika sudah tersedia.

# 16. State UI

Sediakan state:

**Loading**
Gunakan Skeleton yang mengikuti layout sebenarnya.

**Empty**
Gunakan pesan:
Belum ada produk yang tersedia.

**Error**
Gunakan pesan:
Produk belum dapat dimuat.
Silakan coba kembali beberapa saat lagi.

Jangan menampilkan pesan teknis Supabase kepada pengguna.
Pastikan state mendukung light dan dark mode.

# 17. Caching dan Rendering

Gunakan strategi yang sederhana.

Untuk katalog:
- Gunakan Server Component.
- Gunakan caching atau revalidation yang sesuai.
- Jangan melakukan fetch produk pada setiap Card.
- Jangan membuat satu query untuk setiap produk.
- Hindari N+1 query.
- Ambil produk dan varian secara efisien.

Jangan membuat seluruh homepage dinamis apabila hanya section produk yang membutuhkan data.
Pastikan strategi caching kompatibel dengan Cloudflare Workers dan konfigurasi OpenNext project.

# 18. Cloudflare Compatibility

Periksa apakah project sudah memiliki konfigurasi deployment Cloudflare.

Cari file seperti:
- wrangler.jsonc
- wrangler.toml
- open-next.config.ts

Jika belum tersedia, buat konfigurasi yang sesuai dengan versi dependency project.
Jangan menggunakan konfigurasi Cloudflare lama tanpa memeriksa package dan runtime saat ini.

Pastikan:
- Next.js App Router dapat dibuild.
- Node compatibility hanya diaktifkan jika diperlukan.
- Environment variables dapat dibaca.
- Tidak menggunakan API Node.js yang tidak didukung.
- Tidak bergantung pada filesystem permanen.
- Tidak menggunakan fs untuk menyimpan data runtime.
- Tidak menggunakan Vercel-only API.
- Tidak mengubah seluruh project menjadi static export jika server rendering masih dibutuhkan.

# 19. Cloudflare R2

Jangan membuat fitur upload R2 pada Step 1.
Namun siapkan dokumentasi bahwa R2 akan digunakan untuk:
- Gambar produk
- Icon kategori
- Banner
- Attachment
- Invoice
- File delivery

Jangan membuat bucket atau binding palsu.
Jika AI Agent memiliki akses langsung untuk membuat konfigurasi binding, tetap minta konfirmasi pemilik sebelum membuat resource production.

# 20. SETUP_SUPABASE.md

Buat panduan dengan langkah berikut.

**A. Membuat Project**
- Buka dashboard Supabase.
- Pilih New Project.
- Pilih organization.
- Isi nama project, misalnya beliakun-production.
- Buat password database yang kuat.
- Pilih region yang dekat dengan mayoritas pengguna.
- Tunggu project aktif.

**B. Mengambil API Credentials**
- Buka project.
- Masuk ke Project Settings.
- Buka bagian API.
- Salin Project URL.
- Salin anon/public key.
- Jangan membagikan service role key.

Masukkan ke `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

**C. Menjalankan Migration**
Berikan dua cara jika project mendukungnya:

Melalui Supabase CLI:
Tuliskan command yang sesuai dengan project.

Melalui SQL Editor:
- Buka Supabase Dashboard.
- Pilih SQL Editor.
- Buat query baru.
- Salin isi migration.
- Periksa query.
- Jalankan.
- Periksa tabel melalui Table Editor.

Jelaskan bahwa migration CLI lebih dianjurkan agar perubahan database tercatat di Git.

**D. Menjalankan Seed**
Jelaskan cara menjalankan seed.sql.

**E. Verifikasi RLS**
Jelaskan cara memastikan:
- Tabel memiliki RLS aktif.
- Anonymous user dapat membaca data active.
- Anonymous user tidak dapat insert, update, atau delete.

# 21. SETUP_CLOUDFLARE.md

Buat panduan berikut.

**A. Membuat atau Memilih Account Cloudflare**
- Login Cloudflare.
- Pastikan domain beliakun.com telah ditambahkan.
- Pastikan nameserver mengarah ke Cloudflare.
- Jangan mengubah DNS production tanpa pemeriksaan.

**B. Workers**
- Buka Workers & Pages.
- Buat Worker atau hubungkan repository GitHub.
- Pilih repository Beliakun.com.
- Sesuaikan build command dengan OpenNext project.
- Sesuaikan deploy command dengan konfigurasi project.

Jangan menulis command generik jika package script project menggunakan command berbeda.

**C. Environment Variables**
Masukkan variable public sebagai variable biasa:
- NEXT_PUBLIC_APP_URL
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

Masukkan variable rahasia sebagai secret:
- SUPABASE_SERVICE_ROLE_KEY

Untuk Step 1, service role boleh belum dimasukkan jika tidak digunakan.

Jelaskan cara memasukkan melalui:
- Cloudflare Dashboard.
- Wrangler CLI jika tersedia.

**D. Preview**
Jelaskan cara menjalankan preview runtime Cloudflare secara lokal.
Gunakan script project sebenarnya, misalnya:
`npm run preview`
Jangan hanya menguji dengan: `npm run dev`

**E. Deployment Verification**
Periksa:
- Homepage dapat dibuka.
- Kategori tampil.
- Produk tampil.
- Tidak ada environment error.
- Tidak ada secret di browser.
- Tidak ada hydration warning.
- Tidak ada runtime incompatibility.

# 22. Health Check

Buat health check sederhana, misalnya:
`/api/health`

Response tidak boleh membocorkan secret.
Contoh response:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

Jika database tidak dapat dihubungi:
```json
{
  "status": "degraded",
  "database": "unavailable"
}
```
Gunakan status HTTP yang sesuai.

Jangan tampilkan:
- Database URL.
- API key.
- Stack trace.
- Internal query.
- Secret.

# 23. TypeScript

Pastikan seluruh data memiliki type.
Minimal:
- Category
- Product
- ProductVariant
- ProductWithVariants

Jika Supabase CLI tersedia, dokumentasikan cara generate database types.
Contoh output:
`lib/supabase/database.types.ts`

Jangan mengarang hasil generated type jika database belum tersedia.
Gunakan type sementara yang sesuai migration sampai type berhasil digenerate.

# 24. Keamanan

Pastikan:
- Tidak ada service role di browser.
- Tidak ada secret di Git.
- RLS aktif.
- Public hanya dapat membaca data active.
- Harga berasal dari database.
- Slug unik.
- SKU unik.
- Input seed aman.
- Error tidak membocorkan informasi internal.
- Tidak menggunakan API route untuk operasi admin pada Step 1.

# 25. Jangan Dilakukan pada Step 1

Dilarang:
- Membuat checkout.
- Mengintegrasikan KlikQRIS.
- Membuat webhook.
- Mengirim kredensial.
- Membuat tabel stok kompleks.
- Membuat admin dashboard lengkap.
- Membuat role admin asal-asalan.
- Menonaktifkan RLS.
- Menggunakan service role untuk fetch katalog public.
- Menyimpan secret di Client Component.
- Membuat data production palsu.
- Mengubah homepage menjadi Client Component penuh.
- Menggunakan localStorage sebagai database.
- Menyimpan produk dalam file JSON sebagai sumber utama setelah Supabase aktif.

# 26. Quality Check

Jalankan command project yang sesuai:
`npm run lint`
`npm run type-check`
`npm run build`

Jika tersedia:
`npm run test`
`npm run preview`

Perbaiki:
- TypeScript error.
- ESLint error.
- Build error.
- Runtime error.
- Hydration warning.
- Environment error.
- Supabase query error.
- Cloudflare compatibility error.
- Horizontal overflow.
- Loading state rusak.
- Dark mode rusak.

Jangan menonaktifkan lint rule agar build berhasil.

# 27. Definition of Done

Step 1 dianggap selesai apabila:
- Supabase client server dan browser tersedia.
- Environment validation tersedia.
- Migration katalog tersedia.
- Tabel categories tersedia.
- Tabel products tersedia.
- Tabel product_variants tersedia.
- Constraint dan index tersedia.
- RLS tersedia.
- Public read policy tersedia.
- Public write tidak diperbolehkan.
- Seed development tersedia.
- Homepage membaca kategori dari Supabase.
- Homepage membaca produk dari Supabase.
- Loading state tersedia.
- Empty state tersedia.
- Error state tersedia.
- Health endpoint tersedia.
- Cloudflare compatibility diperiksa.
- .env.example diperbarui.
- SETUP_SUPABASE.md tersedia.
- SETUP_CLOUDFLARE.md tersedia.
- Lint berhasil.
- Type-check berhasil.
- Build berhasil.
- Tidak ada secret bocor.

# 28. Laporan Akhir

Setelah selesai, tampilkan laporan:

- File yang Dibuat (Tuliskan semua file baru)
- File yang Diubah (Tuliskan semua file yang diperbarui)
- Database (Tuliskan Migration, Tables, Enums, Indexes, Constraints, RLS, Policies, Seed)
- Supabase Manual Setup (Tuliskan tindakan yang harus dilakukan pemilik)
- Cloudflare Manual Setup (Tuliskan tindakan yang harus dilakukan pemilik)
- Environment Variables (Tuliskan nama variable saja)
- Pengujian (Supabase connection, Anonymous read, Anonymous write blocked, Homepage categories, Homepage products, Health endpoint, Light mode, Dark mode, Mobile, Lint, Type-check, Build, Cloudflare preview)
- ACTION REQUIRED FROM OWNER (Tuliskan tindakan manual secara berurutan)
