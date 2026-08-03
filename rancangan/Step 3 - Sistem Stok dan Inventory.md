# STEP 3 — Sistem Stok dan Inventory Beliakun.com

Lanjutkan pengembangan **Beliakun.com** ke Step 3.

Fokus tahap ini hanya pada:

1. Database inventory atau stok digital.
2. Enkripsi data kredensial.
3. Menu admin Stok.
4. KPI stok.
5. Menambahkan stok berdasarkan produk dan varian.
6. Dynamic credential fields berdasarkan konfigurasi produk.
7. Detail stok dan reveal credential yang aman.
8. Status stok.
9. Filter, pencarian, dan pagination.
10. Dokumentasi pengaturan manual Supabase dan Cloudflare.

Sistem harus tetap:

- Sederhana.
- Ringan.
- Tidak terlalu kompleks.
- Mudah digunakan admin.
- Responsive.
- Mendukung light dan dark mode.
- Kompatibel dengan Cloudflare Workers.
- Tidak mengirim JavaScript berlebihan.
- Tidak menggunakan realtime jika belum diperlukan.

Jangan mengerjakan dahulu:

- Guest checkout.
- Keranjang production.
- Order.
- KlikQRIS.
- Webhook pembayaran.
- Reservasi stok oleh checkout.
- Pengiriman email.
- Pengiriman credential ke pembeli.
- Riwayat pembeli.
- Refund.
- Kupon.
- Cloudflare R2.
- Cron job kompleks.
- Analytics atau chart berat.

Setelah Step 3 selesai, berhenti dan tunggu instruksi Step 4.

---

# 1. Verifikasi Step Sebelumnya

Sebelum memulai, periksa hasil Step 1 dan Step 2.

Pastikan tersedia:
- categories
- products
- product_variants
- product_delivery_fields
- profiles

Pastikan tersedia:
- Supabase server client
- Supabase browser client
- Admin authentication
- Admin authorization
- Protected admin route
- CRUD produk
- CRUD kategori
- CRUD varian
- CRUD product delivery fields

Periksa juga:
- DESIGN.md
- STYLE.md
- COMPONENTS.md
- SETUP_SUPABASE.md
- SETUP_CLOUDFLARE.md
- SETUP_ADMIN.md

Jika terdapat blocker:
- Perbaiki hanya bagian yang diperlukan.
- Jangan membuat ulang sistem dari awal.
- Jangan menghapus data existing.
- Jangan mengubah migration lama yang telah dijalankan.
- Buat migration baru untuk setiap perubahan database.
- Dokumentasikan blocker yang ditemukan.

# 2. Prinsip Sistem Inventory

Satu baris inventory mewakili satu unit stok digital.

Contoh satu unit stok:
- Email: akun@example.com
- Password: password-rahasia
- Kode 2FA: ABCD1234
- PIN Profil: 1234

Contoh lain:
- License Key: XXXX-XXXX-XXXX
- Link Aktivasi: https://...

Contoh lain:
- Link Invite: https://...
- Instruksi: Klik link lalu gabung ke paket.

Setiap stok harus terhubung ke satu varian produk.

Alur admin:
Pilih produk → Pilih varian → Sistem membaca field pengiriman produk → Form credential dibuat otomatis → Admin mengisi credential → Data dienkripsi → Data ciphertext disimpan di Supabase → Stok menjadi AVAILABLE

Jangan menyimpan credential plaintext di database.

# 3. Hubungan Produk, Varian, dan Stok

Gunakan aturan berikut.

Produk
Menentukan:
- Nama produk.
- Metode pengiriman.
- Field data yang diterima pembeli.
- Instruksi umum.
- Garansi.

Varian
Menentukan:
- Nama paket.
- SKU.
- Harga.
- Durasi.
- Tipe akun.
- Tipe stok.

Inventory Item
Menentukan satu data stok nyata:
- Email.
- Password.
- PIN.
- License.
- Link.
- Credential lain.
- Catatan internal.
- Instruksi penggunaan.
- Catatan pengiriman.
- Status stok.
- Tanggal kedaluwarsa.

Jangan menyimpan credential pada tabel produk atau varian.

# 4. Aturan Tipe Stok

Varian memiliki tipe stok:
- limited
- unlimited

Limited
Varian limited menggunakan inventory item.
Contoh:
- Akun private.
- Akun sharing.
- License key satu kali.
- Kode redeem.
- Link akses unik.

Admin dapat menambahkan stok ke varian limited.

Unlimited
Varian unlimited tidak menggunakan inventory item.
Biasanya digunakan untuk:
- Pengiriman manual.
- Invite yang dibuat admin.
- Layanan yang diproses setelah pembayaran.
- Produk yang tidak memiliki credential siap pakai.

Pada form tambah stok:
- Varian unlimited harus ditolak.
- Tampilkan penjelasan bahwa varian tersebut tidak membutuhkan inventory.
- Jangan membuat data stok kosong untuk varian unlimited.

# 5. Migration Step 3

Buat migration baru:
`supabase/migrations/0003_inventory_system.sql`

Gunakan nomor urut sesuai kondisi project.
Jangan mengubah migration Step 1 atau Step 2.

Migration minimal mencakup:
- Enum status inventory.
- Tabel inventory items.
- Tabel inventory events.
- Index.
- Constraint.
- Trigger updated_at.
- Row Level Security.
- Admin policies.
- Larangan akses public.

# 6. Enum Status Inventory

Buat status berikut:
- available
- reserved
- sold
- expired
- invalid
- replaced

Arti setiap status:

Available
Stok tersedia dan dapat digunakan untuk transaksi.

Reserved
Stok sedang ditahan untuk pesanan yang belum selesai.
Status ini disiapkan untuk Step 4.
Admin tidak perlu mengubah stok menjadi reserved secara manual.

Sold
Stok telah digunakan oleh pesanan yang berhasil.
Status ini nantinya diubah oleh sistem checkout dan fulfillment.
Admin tidak boleh sembarangan menandai stok sebagai sold melalui list biasa.

Expired
Credential telah melewati masa berlaku.

Invalid
Credential tidak valid, rusak, tidak dapat digunakan, atau perlu diperiksa.

Replaced
Stok lama telah diganti dengan stok lain.

KPI admin:
- Tersedia  = available
- Direservasi = reserved
- Terjual = sold
- Lainnya = expired + invalid + replaced
- Total = seluruh status

# 7. Tabel Inventory Items

Buat tabel:
`inventory_items`

Minimal memiliki field:
- id
- variant_id
- status
- encrypted_payload
- payload_fingerprint
- encryption_version
- internal_note
- usage_instructions
- delivery_note
- expires_at
- reservation_reference
- reserved_at
- reserved_until
- sold_at
- created_by
- updated_by
- created_at
- updated_at

Detail Field
- `id`: UUID. Primary key. Dibuat otomatis.
- `variant_id`: Foreign key ke `product_variants`. Wajib. On delete harus aman. Jangan hapus inventory saat varian diarsipkan. Lebih baik gunakan restrict daripada cascade untuk data inventory.
- `status`: Menggunakan enum inventory status. Default available.
- `encrypted_payload`: Menyimpan credential yang telah dienkripsi. Gunakan jsonb sebagai envelope terenkripsi atau text terstruktur. Tidak boleh menyimpan plaintext.
- `payload_fingerprint`: Digunakan untuk mendeteksi credential yang sama agar tidak dimasukkan dua kali. Fingerprint harus berasal dari credential yang telah dinormalisasi. Jangan menyimpan credential asli sebagai fingerprint. Gunakan HMAC, bukan hash plaintext biasa.
- `encryption_version`: Default 1. Digunakan agar key rotation dapat dilakukan pada masa mendatang.
- `internal_note`: Catatan untuk admin. Tidak dikirim kepada pembeli.
- `usage_instructions`: Instruksi penggunaan yang nantinya dapat dikirim ke pembeli.
- `delivery_note`: Catatan tambahan untuk proses pengiriman.
- `expires_at`: Opsional. Digunakan jika credential memiliki masa berlaku sebelum terjual.

Reservation Fields
- `reservation_reference`
- `reserved_at`
- `reserved_until`
Disiapkan untuk Step 4. Pada Step 3 belum perlu membuat sistem checkout yang menggunakan field ini.

- `sold_at`: Diisi ketika inventory telah berhasil digunakan oleh order. Pada Step 3 biasanya masih null.

Actor Fields
- `created_by`
- `updated_by`
Foreign key ke profile admin atau user auth yang melakukan perubahan.

Timestamp
- `created_at`
- `updated_at`
Gunakan trigger `updated_at` existing.

# 8. Constraint Inventory

Tambahkan constraint yang aman.
Minimal:
- variant_id wajib.
- encrypted_payload wajib.
- payload_fingerprint wajib.
- encryption_version lebih besar dari nol.
- reserved_until harus lebih besar dari reserved_at.
- sold_at hanya digunakan untuk status sold atau status lanjutan yang relevan.
- Credential fingerprint tidak boleh duplikat.

Gunakan unique index:
`payload_fingerprint`
atau kombinasi yang paling sesuai. Tujuan utamanya mencegah credential yang sama dimasukkan dua kali. Jangan membandingkan ciphertext karena AES-GCM menghasilkan ciphertext berbeda meskipun payload sama.

# 9. Tabel Inventory Events

Buat tabel:
`inventory_events`

Minimal field:
- id
- inventory_item_id
- actor_id
- event_type
- previous_status
- new_status
- summary
- metadata
- created_at

Jenis event yang diperlukan:
- created
- metadata_updated
- credential_updated
- status_changed
- revealed
- restored
- marked_invalid
- marked_expired

Aturan:
- Jangan simpan credential plaintext.
- Jangan simpan password.
- Jangan simpan encryption key.
- Jangan menyimpan seluruh encrypted payload jika tidak diperlukan.
- Metadata hanya untuk informasi non-rahasia.

Contoh summary:
- Stok dibuat.
- Status diubah dari available menjadi invalid.
- Credential dilihat oleh admin.
- Instruksi penggunaan diperbarui.

Event log tidak perlu memiliki UI kompleks. Tampilkan beberapa aktivitas terbaru pada halaman detail stok.

# 10. Row Level Security

Aktifkan RLS pada:
- `inventory_items`
- `inventory_events`

Aturan:
Public:
Public tidak boleh:
- Select.
- Insert.
- Update.
- Delete.
- Melihat jumlah stok mentah.
- Melihat ciphertext.
- Melihat fingerprint.
- Melihat internal note.
Jangan membuat public policy pada inventory.

Customer:
Customer biasa tidak boleh mengakses inventory.

Admin:
Admin dan super admin yang aktif dapat:
- Membaca inventory.
- Menambah inventory.
- Memperbarui metadata inventory.
- Mengubah status yang diperbolehkan.
- Membaca inventory events.

Gunakan helper authorization dari Step 2.
Jangan menggunakan pengecekan role hanya di frontend.

# 11. Enkripsi Credential

Gunakan enkripsi aplikasi sebelum data masuk ke Supabase.
Target runtime adalah: Cloudflare Workers
Gunakan Web Crypto API: `crypto.subtle`
Gunakan: `AES-256-GCM`

Jangan menggunakan:
- Base64 sebagai enkripsi.
- ROT13.
- XOR manual.
- Password plaintext.
- Encryption key di source code.
- Node-only crypto API jika tidak kompatibel dengan Workers.
- Library encryption yang tidak diperlukan.

# 12. Master Encryption Key

Gunakan environment variable server-only:
`INVENTORY_MASTER_KEY_V1=`

Aturan:
- Nilai harus berupa 32 random bytes dalam Base64.
- Jangan menggunakan kata sandi biasa.
- Jangan menggunakan nama brand sebagai key.
- Jangan menggunakan UUID biasa sebagai key.
- Jangan menggunakan prefix `NEXT_PUBLIC_`.
- Jangan mengirim key ke browser.
- Jangan menyimpan key di Supabase.
- Jangan memasukkan key ke GitHub.
- Jangan mencetak key ke log.

Tambahkan ke `.env.example` tetapi biarkan nilainya kosong.

# 13. Key Derivation

Dari satu master key, turunkan dua key berbeda menggunakan HKDF.

Encryption Key:
Gunakan context atau info: `beliakun-inventory-encryption-v1`
Digunakan untuk AES-GCM.

Fingerprint Key:
Gunakan context atau info: `beliakun-inventory-fingerprint-v1`
Digunakan untuk HMAC-SHA256.

Jangan menggunakan key AES secara langsung sebagai HMAC key tanpa derivation.
Salt HKDF dapat berupa string konstan versioned yang terdokumentasi.
Pastikan implementasi kompatibel dengan Cloudflare Workers.

# 14. Utility Crypto

Buat file seperti:
`lib/security/inventory-crypto.ts`

Minimal menyediakan:
- `encryptInventoryPayload()`
- `decryptInventoryPayload()`
- `createInventoryFingerprint()`
- `normalizeInventoryPayload()`

Encrypt:
Input: `Record<string, string>`
Output: `{ version: number, algorithm: "A256GCM", iv: string, ciphertext: string }`
Gunakan IV random yang berbeda untuk setiap proses enkripsi.

Decrypt:
- Hanya berjalan di server.
- Membaca encryption version.
- Memvalidasi envelope.
- Mengembalikan credential object.
- Memberikan error aman jika decrypt gagal.
- Jangan mengembalikan raw crypto error kepada UI.

Fingerprint:
- Normalisasi key dan value.
- Urutkan key secara konsisten.
- Gunakan HMAC-SHA256.
- Output Base64URL atau hexadecimal.
- Jangan menggunakan internal note atau instruksi dalam fingerprint.
- Hanya credential payload yang masuk fingerprint.

# 15. Validasi Environment

Perbarui utility environment server.
Validasi: `INVENTORY_MASTER_KEY_V1`

Pastikan:
- Variable hanya dibaca di server.
- Error menyebut nama variable yang hilang.
- Error tidak mencetak nilainya.
- Client bundle tidak menerima secret.
Jangan memvalidasi secret server di Client Component.

# 16. Dynamic Credential Schema

Credential form harus dibuat berdasarkan data: `product_delivery_fields`

Contoh konfigurasi: Email, Password, Kode 2FA, PIN.
Maka form tambah stok harus otomatis menampilkan: Email, Password, Kode 2FA, PIN.

Jenis field yang didukung:
- text
- email
- password
- url
- code
- pin
- textarea
- number

Server wajib memvalidasi:
- Field required harus terisi.
- Field email harus memiliki format email.
- Field URL harus valid.
- Field number hanya menerima angka yang sesuai.
- Unknown field harus ditolak.
- Field yang tidak termasuk konfigurasi produk tidak boleh disimpan.
- Panjang value harus dibatasi.
- Key tidak boleh duplikat.
Jangan hanya memvalidasi melalui frontend.

# 17. Credential Payload

Contoh payload sebelum dienkripsi:
{
  "email": "akun@example.com",
  "password": "secret-password",
  "two_factor_code": "ABCD1234",
  "profile_pin": "1234"
}

Setelah dienkripsi, Supabase hanya menyimpan ciphertext-nya.
Database tidak boleh memiliki kolom: email_account, account_password, two_factor_code, pin, license_key secara plaintext.

# 18. Route Admin Stok

Tambahkan menu: Stok

Route minimal:
- `/admin/stock`
- `/admin/stock/new`
- `/admin/stock/[id]`

Opsional:
- `/admin/stock/[id]/edit` (Jika edit digabungkan ke halaman detail, tidak perlu route terpisah).

Menu admin menjadi: Dashboard, Produk, Kategori, Stok, Keluar.
Jangan menambahkan menu checkout, payment, atau order pada Step 3.

# 19. Halaman Daftar Stok

Buat halaman: `/admin/stock`

Tampilkan KPI cards:
- Tersedia
- Direservasi
- Terjual
- Lainnya
- Total Stok

KPI harus mengambil data nyata. Jangan menggunakan angka mockup.

List Stok
Kolom desktop:
- ID
- Produk
- Varian
- SKU
- Status
- Tanggal Kedaluwarsa
- Dibuat
- Aksi

Jangan menampilkan credential pada list, encrypted payload, atau fingerprint.
Pada mobile, ubah menjadi card list.

# 20. Search dan Filter

Tambahkan:
- Search nama produk.
- Search SKU varian.
- Filter produk.
- Filter varian.
- Filter status.
- Filter kedaluwarsa.
- Sorting tanggal terbaru atau terlama.
- Pagination.

Jangan membuat search yang mencari isi credential.
Jangan pernah mengirim credential plaintext untuk keperluan search.
Gunakan pagination sekitar 20 atau 25 item per halaman.

# 21. KPI Query

Buat query KPI yang efisien.
Jangan melakukan satu query untuk setiap inventory item.
Gunakan query teragregasi atau helper repository.
Jangan menghitung seluruh data di browser.

# 22. Form Tambah Stok

Buat halaman: `/admin/stock/new`

Form dibagi menjadi:
A. Pilih Produk dan Varian
- Admin memilih produk.
- Sistem hanya menampilkan varian produk tersebut.
- Varian archived tidak dapat dipilih.
- Varian unlimited tidak dapat menerima stok (tampilkan pesan penolakan).

B. Data Credential
- Form dibuat dari `product_delivery_fields`.
- Jangan menyimpan nilai credential pada localStorage.

C. Informasi Stok
- Tanggal Kedaluwarsa
- Catatan Internal
- Instruksi Penggunaan
- Catatan Pengiriman

D. Action
- Simpan Stok
- Simpan dan Tambah Lagi
- Batal

Setelah berhasil: Tampilkan toast, bersihkan credential dari form, redirect.

# 23. Validasi Tambah Stok

Sebelum menyimpan:
- Verifikasi admin.
- Ambil varian dan produk dari database (jangan mempercayai ID dari browser).
- Pastikan varian tidak archived dan stock_type = limited.
- Ambil product delivery fields dan validasi credential sesuai schema.
- Normalisasi payload, buat fingerprint, periksa duplicate.
- Enkripsi payload.
- Insert inventory dan buat inventory event.
- Revalidate halaman stock.

# 24. Duplicate Credential

Jika fingerprint sudah tersedia, tolak penyimpanan.
Pesan UI: "Data stok ini sudah pernah ditambahkan. Periksa kembali produk dan varian yang dipilih."
Jangan menampilkan fingerprint, payload lama, password lama, atau ID inventory lain kepada user.

# 25. Halaman Detail Stok

Buat halaman: `/admin/stock/[id]`

Tampilkan informasi detail stok (Produk, Varian, SKU, Tipe akun, Status, dsb) dan aktivitas terbaru.
Credential harus ditampilkan dalam keadaan tersembunyi.
Tambahkan tombol: "Tampilkan Data Stok"

# 26. Reveal Credential

Reveal credential wajib dilakukan melalui server.
Alur: Admin klik Tampilkan Data Stok → Server memverifikasi session & role → Server mengambil encrypted payload & decrypt → Server mencatat reveal event → Credential dikirim sebagai response no-store.

Aturan:
- Gunakan Server Action atau POST Route Handler.
- Jangan cache response.
- Gunakan header atau mechanism no-store.
- Sembunyikan otomatis setelah sekitar 60 detik atau saat berpindah halaman.
- Sediakan copy button.

# 27. Masking Credential

Sebelum reveal, jangan mengirim plaintext ke browser.
Sebelum admin mengklik reveal, browser hanya menerima nama field dan placeholder mask.
Plaintext hanya dikirim setelah reveal berhasil.

# 28. Update Credential

Admin dapat memperbaiki credential hanya jika status: available, invalid, atau expired.
Jangan izinkan perubahan credential jika status: reserved, sold.
Saat credential diperbarui: Validasi ulang, buat fingerprint baru, periksa duplicate, enkripsi ulang menggunakan IV baru, perbarui encrypted payload, dan buat inventory event.

# 29. Update Metadata

Admin dapat memperbarui: Internal note, Usage instructions, Delivery note, Expires at.
Catat event `metadata_updated`.

# 30. Status Transition

Pada Step 3, action admin yang tersedia:
- Available → Invalid
- Available → Expired
- Invalid → Available
- Expired → Available
- Available → Replaced

Jangan menyediakan action manual biasa: Available → Sold / Reserved.

# 31. Expired Inventory

Jika `expires_at <= current time`, maka stok tidak boleh dianggap tersedia untuk checkout nantinya.
Tampilkan indikator kedaluwarsa. Pastikan query stok tersedia mengecualikan item yang telah kedaluwarsa.

# 32. Repository Inventory

Buat data access layer seperti: `lib/data/inventory.ts`
Gunakan server Supabase client.
Jangan query langsung dari banyak komponen.
Pisahkan query list dan query detail.

# 33. Server Actions

Buat server action atau route handler yang jelas (misal: `createInventoryItemAction`).
Setiap action wajib: Verifikasi session, verifikasi role, validasi input, jalankan server-side logic, gunakan RLS, revalidate route terkait.

# 34. Jangan Cache Inventory Admin

Halaman admin inventory bersifat private.
Tidak menggunakan public cache atau ISR untuk data credential.
Reveal response menggunakan no-store.

# 35. UI dan UX

Gunakan component system Beliakun.com.
Hindari dashboard terlalu padat.
Jangan menggunakan chart pada Step 3.

# 36. Responsive

Uji halaman stok pada berbagai resolusi (Mobile, Tablet, Desktop).

# 37. Light dan Dark Mode

Pastikan semua UI mendukung semantic token untuk light/dark mode.

# 38. Badge Status

Gunakan mapping semantic:
- available → Tersedia (success)
- reserved → Direservasi (warning)
- sold → Terjual (neutral/primary)
- expired → Kedaluwarsa (destructive/muted)
- invalid → Tidak Valid (destructive)
- replaced → Diganti (secondary)

# 39. Empty State

Sediakan empty state untuk list stok yang kosong.

# 40. Error State

Gunakan pesan natural untuk error. Jangan menampilkan crypto exception atau stack trace.

# 41. Audit Keamanan

Cari kemungkinan credential bocor dan hapus logging credential.
Pastikan error monitoring melakukan redaction pada field sensitif.

# 42. Cloudflare Compatibility

Pastikan utility crypto kompatibel dengan Cloudflare Workers (gunakan Web Crypto API).

# 43. Unit Testing

Jika test framework tersedia, buat test untuk Crypto, Validation, dan Authorization.

# 44. Manual Setup Supabase

Perbarui `SETUP_SUPABASE.md` dan tambahkan panduan Step 3 — Inventory System.

# 45. Manual Setup Cloudflare

Perbarui `SETUP_CLOUDFLARE.md` dan tambahkan panduan Step 3 — Inventory Encryption Secret (`INVENTORY_MASTER_KEY_V1`).

# 46. Buat SETUP_INVENTORY.md

Buat file `SETUP_INVENTORY.md` yang berisi penjelasan sistem stok dan troubleshooting.

# 47. Environment Variables

Perbarui `.env.example` dengan `INVENTORY_MASTER_KEY_V1=`.

# 48. Dokumentasi Component System

Perbarui `COMPONENTS.md` jika menambahkan komponen baru.

# 49. Struktur File yang Disarankan

Gunakan struktur rapi. Contoh: `app/admin/(protected)/stock/...` dan `components/admin/inventory/...`

# 50. Jangan Dilakukan pada Step 3

Dilarang membuat checkout, tabel order, KlikQRIS, webhook, mengirim email, reservasi checkout, menggunakan service role di browser, menyimpan credential plaintext, dll.

# 51. Quality Check

Jalankan `npm run lint`, `npm run type-check`, `npm run build`.

# 52. Definition of Done

Step 3 dianggap selesai apabila semua kriteria terpenuhi (termasuk enkripsi credential, manajemen stok, dan testing).

# 53. Laporan Akhir

Setelah selesai, tampilkan laporan akhir yang mencakup File yang Dibuat, File yang Diubah, Database, Inventory Features, Security, dll. Berikan juga ACTION REQUIRED FROM OWNER.

Setelah Step 3 selesai, berhenti.

Urutan berikutnya:
Step 1 — Fondasi katalog dan Supabase
Step 2 — Login admin dan manajemen katalog
Step 3 — Inventory dan enkripsi credential
Step 4 — Guest checkout dan sistem order
Step 5 — KlikQRIS dan webhook pembayaran
Step 6 — Pengiriman otomatis dan email
Step 7 — Operasional, pelacakan, dan production hardening
