# Panduan Operasional Admin Beliakun.com

Dokumen ini berisi panduan praktis untuk mengelola katalog toko digital Beliakun.com melalui dashboard admin.

---

## 1. Akses Dashboard Admin
1. Buka browser dan arahkan ke alamat `/admin` (atau `/admin/login` jika belum masuk).
2. Masukkan alamat **Email** dan **Password** administrator Anda.
3. Klik **Masuk**. Anda akan langsung diarahkan ke halaman dasbor utama.

---

## 2. Mengelola Kategori
Menu **Kategori** digunakan untuk mengelompokkan jenis produk di halaman beranda.

### A. Menambahkan Kategori Baru
1. Masuk ke menu **Kategori** di sidebar.
2. Klik tombol **Tambah Kategori** di kanan atas.
3. Masukkan **Nama Kategori** (misalnya: `Gemini`).
4. **Slug** akan dibuat secara otomatis (misalnya: `gemini`). Anda bisa mengeditnya secara manual jika perlu (gunakan huruf kecil dan tanda hubung, tanpa spasi).
5. Masukkan **Deskripsi** kategori.
6. Tentukan **Status**:
   - `Aktif`: Kategori akan tampil dan dapat dipilih oleh pelanggan di beranda.
   - `Non-aktif`: Kategori tidak tampil di toko.
   - `Diarsipkan`: Disimpan sebagai arsip histori.
7. Masukkan nilai **Urutan Tampil** (angka). Semakin kecil nilainya, kategori akan tampil lebih awal di beranda.
8. Klik **Simpan Kategori**.

### B. Mengubah Kategori
1. Klik ikon **Edit (Pensil)** pada kategori yang ingin diubah.
2. Lakukan perubahan pada form, lalu klik **Perbarui Kategori**.

---

## 3. Mengelola Produk & Variasi Paket
Menu **Produk** adalah tempat utama untuk mengelola layanan digital yang Anda tawarkan.

### A. Membuat Produk Baru (Langkah Dasar)
1. Buka menu **Produk** di sidebar, lalu klik **Tambah Produk**.
2. **Isi Informasi Dasar**: Nama Produk, Slug (otomatis), Kategori, Deskripsi Pendek (untuk kartu produk), dan Deskripsi Lengkap.
3. **Pilih Badge**: Tentukan apakah produk memerlukan label seperti `Terlaris`, `Baru`, atau `Stok Terbatas`.
4. **Fitur & Keunggulan**: Klik **Tambah Fitur** untuk memasukkan daftar poin keunggulan produk (misalnya: "Garansi 30 Hari", "Akses Pribadi"). Anda dapat menghapusnya dengan ikon sampah.
5. **Garansi**: Jika produk memiliki garansi, centang kotak opsi dan tentukan durasi (misalnya: 30 Hari).
6. **Metode Pengiriman**: 
   - `Manual oleh Admin`: Pesanan akan diproses secara manual setelah pembayaran diverifikasi.
   - `Instan`: Pesanan dikirim secara otomatis oleh sistem (akan dihubungkan dengan manajemen stok di tahap berikutnya).
7. Tentukan **Status** (pilih `Draf` terlebih dahulu) dan **Urutan Tampil**.
8. Klik **Lanjutkan ke Varian**. Anda akan langsung dialihkan ke halaman detail produk untuk mengatur variasi paket.

---

### B. Mengatur Varian (Paket Durasi / Tipe Akun)
Setiap produk wajib memiliki minimal **satu varian aktif** sebelum dapat diterbitkan di toko.
1. Pada detail produk (tab **Variasi Paket**), klik **Tambah Variasi**.
2. Masukkan **Nama Varian** (misalnya: `1 Bulan (Sharing)`).
3. Masukkan **SKU** yang unik (misalnya: `GPT-1M-SHR`). SKU tidak boleh sama dengan varian mana pun di toko Anda.
4. Tentukan **Harga** jual (Rupiah bulat, tanpa titik/koma) dan **Harga Sebelum Diskon** (jika ingin mencoret harga lama).
5. Isi **Durasi** (misalnya: Nilai `1` dengan Satuan `Bulan` dan Label `1 Bulan`).
6. Pilih **Tipe Akun** (Sharing, Private, Lisensi, dll.) dan **Tipe Stok** (Terbatas / Unlimited).
7. Klik **Simpan Varian**.

---

### C. Mengonfigurasi Data yang Diterima Pembeli (Fulfillment Fields)
Untuk produk yang dikirim, Anda dapat menentukan data apa saja yang akan dikirimkan kepada pembeli setelah pembayaran sukses.
1. Pada halaman detail produk, buka tab **Konfigurasi Data Pembeli**.
2. Klik **Tambah Field Data**.
3. Tentukan rincian kolom data:
   - **Label**: Nama data (misalnya: `Email Akun` atau `Password`).
   - **Key**: Penanda database internal (misalnya: `email` atau `password`). Harus unik di produk tersebut.
   - **Tipe Input**: Pilih tipe yang sesuai (Text, Email, Password, PIN, dll.).
   - **Wajib Diisi**: Centang agar data ini tidak boleh dikosongkan.
   - **Sensitif**: Centang opsi ini jika data bersifat rahasia (seperti Password atau PIN) agar data disembunyikan/dienkripsi secara aman.
4. Klik **Simpan Konfigurasi Data**.

---

## 4. Troubleshooting & Solusi

| Masalah | Penyebab | Solusi |
| --- | --- | --- |
| Gagal Login ("Akses ditolak") | Akun Anda belum memiliki role `admin` | Jalankan query SQL di Supabase editor untuk mengubah role profil UUID Anda menjadi `'admin'`. |
| Error "Slug sudah digunakan" | Ada produk atau kategori lain yang memiliki slug URL yang sama | Ubah nama atau slug produk/kategori baru agar unik (misalnya tambah akhiran angka atau kata pembeda). |
| Error "SKU sudah digunakan" | SKU varian harus unik secara global di seluruh toko | Buat format penulisan SKU yang terstandarisasi, misalnya: `[KODE_PRODUK]-[DURASI]-[TIPE]`. |
| Perubahan data tidak langsung muncul di storefront | Cache Next.js/Cloudflare belum diperbarui | Pastikan server actions memicu revalidasi jalur dengan benar, atau tunggu cache kedaluwarsa (biasanya beberapa menit). |
