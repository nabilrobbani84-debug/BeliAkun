# Dokumentasi Sistem Desain Beliakun.com (DESIGN.md)

> [!IMPORTANT]
> Dokumen ini merupakan sumber utama aturan UI/UX Beliakun.com.
> Setiap halaman dan komponen baru wajib mengikuti aturan di dalam dokumen ini.
> Jangan membuat bahasa visual, token, pattern, atau komponen baru sebelum memeriksa implementasi yang sudah tersedia.
> Apabila terdapat keputusan desain baru yang bersifat reusable, perbarui dokumentasi ini dalam perubahan yang sama.

> [!WARNING]
> Dilarang mengabaikan dokumentasi ini dan membuat UI berdasarkan preferensi sementara, asumsi pribadi, atau pola generik dari AI.

---

## Daftar Isi
1. [Filosofi Desain (Design Philosophy)](#1-filosofi-desain-design-philosophy)
2. [Karakter Brand (Brand Personality)](#2-karakter-brand-brand-personality)
3. [Aturan Desain Anti-AI Generik (Anti-Generic AI Design Rules)](#3-aturan-desain-anti-ai-generik-anti-generic-ai-design-rules)
4. [Anatomi Halaman (Page Anatomy)](#4-anatomi-halaman-page-anatomy)
5. [Sistem Layout (Layout System)](#5-sistem-layout-layout-system)
6. [Hirarki Visual (Visual Hierarchy)](#6-hirarki-visual-visual-hierarchy)
7. [Aturan Desain Responsif (Responsive Design Rules)](#7-aturan-desain-responsif-responsive-design-rules)
8. [Perilaku Komponen (Component Behavior)](#8-perilaku-komponen-component-behavior)
9. [Standar Product Card (Product Card Standard)](#9-standar-product-card-product-card-standard)
10. [Pengalaman Form & Checkout (Forms and Checkout UX)](#10-pengalaman-form--checkout-forms-and-checkout-ux)
11. [State & Umpan Balik (States and Feedback)](#11-state--umpan-balik-states-and-feedback)
12. [Panduan Gerak & Animasi (Motion Guidelines)](#12-panduan-gerak--animasi-motion-guidelines)
13. [Aksesibilitas (Accessibility)](#13-aksesibilitas-accessibility)
14. [Bahasa & Microcopy (Content and Microcopy)](#14-bahasa--microcopy-content-and-microcopy)
15. [Inventaris Komponen Utama (Component Inventory)](#15-inventaris-komponen-utama-component-inventory)
16. [Checklist Review Desain (Design Review Checklist)](#16-checklist-review-desain-design-review-checklist)
17. [Aturan Wajib untuk AI Agent](#17-aturan-wajib-untuk-ai-agent)
18. [Aturan Perubahan Design System](#18-aturan-perubahan-design-system)

---

## 1. Filosofi Desain (Design Philosophy)

Beliakun.com adalah marketplace produk & akun digital premium (seperti ChatGPT Plus, Gemini Advanced, Claude Pro, Canva Pro, CapCut Pro, Netflix, Spotify, VPN) yang mengusung gaya **Modern Cartoon Commerce**.

Aturan Filosofi Utama:
* **Content-First & Produk Cepat Ditemukan**: Pengguna harus dapat melihat pilihan produk, durasi paket, dan harga dalam kurun 3 detik pertama tanpa gangguan banner berlebih.
* **Kejelasan Harga & Transparansi**: Tidak ada biaya tersembunyi. Jenis akun (Private, Shared, Invite, Full Access) dan harga per durasi ditampilkan lugas.
* **Gaya Kartun sebagai Identitas, Bukan Gimmick**: Border hitam tegas (`#0F172A`, `2px`), hard offset shadow (`3.5px` s.d. `6px`), serta sudut tumpul (`rounded-2xl` / `1.25rem`) memberikan kesan *playful*, ramah, dan manusiawi tanpa mengorbankan profesionalisme toko online.
* **Hirarki Interaksi yang Jelas**: Primary CTA (Tombol Beli / Keranjang) selalu paling menonjol secara kontras visual dibandingkan elemen pendukung.
* **Layout Ringan & Mudah Dipindai**: Menghindari kepadatan visual berlebihan (*visual clutter*), menggunakan spacing yang konsisten dan leluasa (*generous negative space*).
* **Kepercayaan & Keamanan**: Garansi pengembalian, ulasan pembeli terverifikasi, dan kanal layanan pelanggan (WhatsApp) terintegrasi pada setiap alur transaksi.

> Setiap keputusan visual harus mendukung kejelasan, kepercayaan, dan kemudahan transaksi.

---

## 2. Karakter Brand (Brand Personality)

Karakter Brand Beliakun.com:
* **Modern**: Menggunakan antarmuka bersih berbasis Tailwind CSS, typography Plus Jakarta Sans yang rapi, dan transisi micro-interaction yang presisi.
* **Profesional & Terpercaya**: Menampilkan detail spesifikasi akun, garansi pemakaian, indikator stok terverifikasi, dan ulasan asli pembeli.
* **Kekinian & Playful**: Memiliki karakter visual kartun modern dengan border tegas, badge warna-warni bertekstur, dan aksen warna kuning hangat (`#FACC15`).
* **Ramah & Santai**: Menggunakan bahasa Indonesia sehari-hari yang akrab namun tetap santun (menggunakan kata "kamu" dan istilah "Lebih Santai").
* **Praktis & Cepat**: Mendukung pembelian instan tanpa pendaftaran berbelit, dilengkapi checkout simulasi QRIS / e-wallet secara cepat.

Hal yang Dilarang (Brand Anti-Values):
* ❌ Terlihat kaku dan dingin seperti aplikasi enterprise SaaS korporat.
* ❌ Terlihat kanak-kanak atau kekanak-kanakan (tidak menggunakan font comic sans atau warna neon berantakan).
* ❌ Terlihat murahan atau mencurigakan (tidak menggunakan countdown palsu yang agresif atau promosi mengganggu).
* ❌ Menggunakan jargon teknis berlebihan yang membingungkan orang awam.

---

## 3. Aturan Desain Anti-AI Generik (Anti-Generic AI Design Rules)

Dilarang keras menghasilkan UI dengan pola AI generik berikut:
1. ❌ **Hero SaaS Klişe**: Tata letak teks besar di kiri dengan gambar mockup dashboard melayang di kanan.
2. ❌ **Gradient Ungu-Biru Dark Mode**: Penggunaan latar belakang gelap dengan warna neon cyan/purple yang tidak sesuai tema Beliakun.com (tema utama Beliakun.com adalah Light Warm Cream `#FAF8F5`).
3. ❌ **Glassmorphism Berlebihan**: Latar belakang blur transparan pada semua card.
4. ❌ **Dekorasi Blob Acak**: Bentuk cairan/blob vektor berwarna-warni yang diletakkan acak tanpa fungsi UI.
5. ❌ **Grid Feature 3 Kolom Identik**: Tiga card berderet dengan icon lingkaran gradient di atasnya dan teks marketing SaaS klise ("Supercharge your workflow").
6. ❌ **Glow / Drop-Shadow Soft Besar**: Menggunakan shadow blur luas yang mengaburkan border kartun yang menjadi ciri khas Beliakun.com.
7. ❌ **Penggunaan Emoji sebagai Icon Utama**: Seluruh icon wajib menggunakan library `lucide-react`. Emoji hanya diperbolehkan pada avatar pengguna atau ilustrasi kustom khusus.
8. ❌ **Multi-Border Radius Tanpa Aturan**: Mencampur `rounded-none`, `rounded-md`, `rounded-full`, dan `rounded-3xl` pada elemen berdekatan tanpa mengikuti tabel token radius.
9. ❌ **Tombol Pill pada Semua Elemen**: Hanya badge dan tag yang berbentuk pill (`rounded-full`), tombol utama menggunakan radius `rounded-xl` (`0.875rem`).
10. ❌ **Komponen Shadcn UI Default**: Menggunakan komponen default shadcn tanpa memasang styling khas Beliakun.com (`border-2 border-slate-900 shadow-cartoon`).

> Sebelum membuat UI baru, AI Agent wajib membandingkannya dengan halaman dan komponen yang sudah ada. Jangan menciptakan bahasa visual baru apabila pola yang sesuai sudah tersedia.

---

## 4. Anatomi Halaman (Page Anatomy)

### 4.1 Urutan Seksi Standar Storefront (Homepage)
1. **Announcement Bar** (`components/AnnouncementBar.tsx`): Pengumuman promo berjalan dengan tombol aksi langsung.
2. **Header Navigasi Utama** (`components/StoreHeader.tsx`): Logo, pencarian cepat, tombol keranjang, dan akses akun/login.
3. **Hero Promotion Carousel** (`components/PromotionCarousel.tsx`): Slide banner penawaran terbatas dengan ilustrasi kartun.
4. **Pilar Keunggulan / Benefit List** (`components/BenefitList.tsx`): 4 poin keunggulan utama (Garansi, Instant, CS 24/7, Best Price).
5. **Flash Sale Section** (`components/FlashSaleSection.tsx`): Seksi penawaran khusus terbatas waktu dengan timer.
6. **Seksi Kategori** (`components/CategorySection.tsx`): Grid pilihan kategori produk digital.
7. **Product Tabs / Katalog Produk** (`components/ProductTabs.tsx`): Tab filter kategori beserta Grid Product Card.
8. **Panduan Cara Beli** (`components/HowItWorks.tsx`): 3 langkah mudah bertransaksi.
9. **Seksi Kepercayaan / Statistics** (`components/TrustSection.tsx`): Garansi & counter kepuasan pelanggan.
10. **Testimoni Pembeli** (`components/ReviewCarousel.tsx`): Carousel ulasan pembeli asli terverifikasi.
11. **FAQ Section** (`components/FAQSection.tsx`): Accordion tanya jawab seputar akun digital.
12. **Newsletter / CTA Promo** (`components/NewsletterCTA.tsx`): Form pendaftaran diskon email.
13. **Footer** (`components/StoreFooter.tsx`): Informasi legal, navigasi bottom, metode pembayaran, dan copyright.
14. **Mobile Navigation Bar** (`components/MobileNavigation.tsx`): Akses cepat bawah khusus layar smartphone.

### 4.2 Spesifikasi Halaman Tambahan
* **Halaman Katalog / Kategori**:
  * *Tujuan*: Memudahkan penjelajahan produk berdasarkan kategori spesifik.
  * *Anatomi*: Header -> Breadcrumb -> Category Hero Banner -> Sidebar Filter + Product Grid -> FAQ Kategori -> Footer.
* **Halaman Detail Produk / Quick View Modal**:
  * *Tujuan*: Menampilkan detail spesifikasi, garansi, jenis paket (Private vs Shared), durasi, dan tombol tambah ke keranjang / beli langsung.
  * *Anatomi*: Header/Modal Title -> Product Header (Logo, Rating, Badge) -> Package Options (Grid/Pill selector) -> Deskripsi & Fitur Utama -> Price Summary & CTA.
* **Halaman Keranjang (Cart Sheet)**:
  * *Tujuan*: Meninjau item yang dipilih, mengubah kuantitas, memilih paket, dan masuk ke checkout.
  * *Anatomi*: Sheet Header -> List Item Produk -> Ringkasan Subtotal -> Tombol Lanjut Checkout.
* **Halaman Checkout Modal**:
  * *Tujuan*: Pengisian data pembeli (Email, No WhatsApp) dan simulasi pembayaran (QRIS, GoPay, BCA).
  * *Anatomi*: Step 1 (Data Pemesan) -> Step 2 (Metode Pembayaran) -> Step 3 (Instruksi & Konfirmasi Pesanan).
* **Empty State & Error State**:
  * *Anatomi*: Ilustrasi Kartun -> Judul Keterangan -> Deskripsi Ramah -> Tombol Kembali ke Beranda / Muat Ulang.

---

## 5. Sistem Layout (Layout System)

| Elemen              | Desktop (`lg:` / `xl:`) | Tablet (`md:`) | Mobile (`sm:` & Base) |
| ------------------- | ---------------------: | -------------: | --------------------: |
| Container Max-Width |                 1280px |           100% |                  100% |
| Horizontal Padding  |            32px (`px-8`) |   24px (`px-6`) |          16px (`px-4`) |
| Section Spacing Y   |            64px (`py-16`) |  48px (`py-12`) |          32px (`py-8`) |
| Grid Gap (Card)     |            24px (`gap-6`) |  20px (`gap-5`) |         12px (`gap-3`) |

Aturan Grid & Column Layout:
* **Product Grid Catalog**:
  * Desktop (`xl`): 4 kolom (`grid-cols-4`)
  * Desktop sedang (`lg`): 3 kolom (`grid-cols-3`)
  * Tablet (`sm` / `md`): 2 kolom (`grid-cols-2`)
  * Mobile: 1 kolom atau 2 kolom ringkas (`grid-cols-1 sm:grid-cols-2`)
* **Category Grid**:
  * Desktop: 6 kolom (`grid-cols-6`)
  * Tablet: 3 kolom (`grid-cols-3`)
  * Mobile: 2 kolom (`grid-cols-2`)
* **Maximum Text Line Length**:
  * Paragraf deskripsi dibatasi maksimal `max-w-2xl` atau `65ch` agar nyaman dibaca.

---

## 6. Hirarki Visual (Visual Hierarchy)

1. **H1 Display**: Hanya 1 elemen `<h1>` per halaman (terletak di seksi Hero / Title Halaman).
2. **H2 Section Title**: Digunakan pada setiap judul seksi utama (misal: "Kategori Populer", "Promo Kilat Hari Ini"). Diiringi oleh badge kecil di atasnya dan subdeskripsi di bawahnya.
3. **H3 Card Title**: Digunakan pada nama produk di dalam Card atau judul item FAQ.
4. **Primary CTA**: Menggunakan tombol `cartoon-button-primary` (Warna Biru `#2563EB`) atau `cartoon-button-accent` (Warna Kuning `#FACC15`) dengan kontras paling dominan.
5. **Secondary Action**: Menggunakan `cartoon-button-secondary` (Warna Putih border Slate `#0F172A`).
6. **Metadata & Harga**:
   * Harga aktif: Ukuran font besar, tebal (`font-black`), warna Biru `#2563EB` atau Slate `#0F172A`.
   * Harga Coret (Original): Ukuran font kecil (`text-xs`), warna Slate Muted (`text-slate-400`), efek `line-through`.

---

## 7. Aturan Desain Responsif (Responsive Design Rules)

* **Mobile-First Approach**: Seluruh utility Tailwind ditulis tanpa prefix untuk mobile terlebih dahulu, kemudian ditingkatkan dengan `sm:`, `md:`, `lg:`, `xl:`.
* **Touch Target**: Seluruh elemen interaktif di mobile (tombol, input, icon button) wajib memiliki ukuran area sentuh minimal **44px × 44px**.
* **Navigasi Mobile**:
  * Header di desktop menampilkan menu lengkap.
  * Di layar mobile (`< 1024px`), navigasi dipindah ke `MobileNavigation.tsx` di bagian bawah layar dan `Sheet` drawer dari kanan.
* **Mencegah Overflow**:
  * Penggunaan `overflow-x-hidden` pada `body`.
  * Pembatasan teks panjang dengan `truncate` (1 baris) atau `line-clamp-2` (2 baris).
  * Harga Rupiah tidak boleh terputus atau *wrap* ke baris baru.

> Responsive design bukan sekadar mengecilkan ukuran desktop. Komposisi, prioritas konten, dan pola interaksi harus disesuaikan untuk layar kecil.

---

## 8. Perilaku Komponen (Component Behavior)

### 8.1 Header & Sticky Navigation (`StoreHeader.tsx`)
* **Sticky Position**: Header menempel di bagian atas (`sticky top-0 z-40`).
* **Visual Style**: Latar belakang putih dengan transparansi halus (`bg-white/95 backdrop-blur-md`), dibatasi border bawah `border-b-2 border-slate-900`.
* **Elemen**: Logo Beliakun.com, Search bar trigger, Cart counter badge, dan Login button.

### 8.2 Cart Sheet (`CartSheet.tsx`)
* **Trigger**: Menglik ikon keranjang di header / mobile bottom nav.
* **Behavior**: Muncul dari sisi kanan layar (`Slide in from right`).
* **Fitur**: Menampilkan daftar item, pemilih kuantitas (+/-), hapus item, ringkasan harga, dan CTA "Lanjut ke Pembayaran".

### 8.3 Checkout Modal (`CheckoutModal.tsx`)
* **Multi-Step Flow**:
  1. *Form Data*: Input WhatsApp & Email.
  2. *Metode Pembayaran*: QRIS (Instant), GoPay, Transfer Bank BCA.
  3. *Konfirmasi & Instruksi*: Menampilkan QR Code / Nomor Rekening dan ringkasan pesanan.
* **Perilaku Selesai**: Memicu sebaran kembang api (*confetti animation*) saat simulasi pembayaran berhasil.

### 8.4 Accordion FAQ (`FAQSection.tsx`)
* **Behavior**: Hanyasatu item terbuka pada satu waktu (atau toggle terbuka-tutup secara independen).
* **Icon Indicator**: Ikon ChevronDown yang berputar 180 derajat saat terbuka.

---

## 9. Standar Product Card (Product Card Standard)

Product Card adalah komponen inti storefront yang paling sering ditemui.

Aturan Visual & Layout Product Card:
* **Container**: Class `.cartoon-card-hover` dengan latar belakang putih (`bg-white`), padding `p-3.5 sm:p-4`, border `2px solid #0F172A`, offset shadow `3.5px 3.5px 0px 0px #0F172A`.
* **Badge Atas**:
  * Kiri: Badge Tag Utama (`Terlaris`, `Promo`, `Baru`, `Stok Terbatas`).
  * Kanan: Badge Diskon Persen (misal `-30%` dengan `bg-rose-500 text-white`).
* **Logo Produk**:
  * Kotak `w-11 h-11 rounded-2xl` dengan border `2px solid #0F172A` dan latar belakang warna spesifik brand (misal `bg-emerald-500` untuk ChatGPT, `bg-purple-600` untuk Claude).
  * Menampilkan 2 huruf inisial produk dengan font ekstra tebal.
* **Pilihan Durasi Paket (Package Pills)**:
  * Jika produk memiliki >1 paket, tampilkan pill mini durasi (`1 Bulan`, `3 Bulan`, `1 Tahun`).
  * Paket aktif menggunakan warna biru `bg-blue-600 text-white`, paket non-aktif `bg-slate-100 text-slate-700`.
* **Format Harga Rupiah (Wajib)**:
  * Wajib menggunakan format: `Rp49.000` (tanpa spasi setelah Rp, titik sebagai pemisah ribuan).
  * ❌ Dilarang: `IDR 49K`, `49rb`, `Rp. 49.000,-`, `Rp 49000`.
* **Aksi Bawah**:
  * Grid 2 tombol: Tombol "Detail" (`col-span-2`, secondary) dan "+ Keranjang" (`col-span-3`, primary).

---

## 10. Pengalaman Form & Checkout (Forms and Checkout UX)

* **Label Selalu Terlihat**: Setiap field input wajib memiliki `<label>` yang jelas di atasnya. Placeholder hanya sebagai contoh isi (misal: `081234567890`), bukan pengganti label.
* **In-Line Error Validation**: Pesan kesalahan ditampilkan tepat di bawah field input yang bermasalah dengan warna merah (`text-rose-600 text-xs`).
* **Pencegahan Double Submit**: Tombol checkout akan berubah ke state `loading` (disabled + spinner) saat proses pengiriman data berlangsung.
* **Keamanan Data & Privasi**: Menampilkan mikro-teks jaminan privasi data di bawah form checkout.

---

## 11. State & Umpan Balik (States and Feedback)

Semua komponen interaktif wajib mendukung 9 state berikut:
1. **Default**: Tampilan normal komponen.
2. **Hover**: Elemen terangkat halus (`transform: translate(-1.5px, -1.5px)`) dan shadow membesar (`box-shadow: 5px 5px 0px 0px #0F172A`).
3. **Active / Pressed**: Elemen tertekan ke bawah (`transform: translate(1px, 1px)`) dan shadow mengecil (`box-shadow: 1.5px 1.5px 0px 0px #0F172A`).
4. **Focus-Visible**: Ring outline biru/amber yang jelas saat dinavigasi menggunakan keyboard (`focus-visible:ring-2 focus-visible:ring-blue-600`).
5. **Disabled**: Latar belakang abu-abu (`bg-slate-200`), teks pudar (`text-slate-400`), kursor tidak aktif (`cursor-not-allowed`), shadow dihilangkan atau dipudarkan.
6. **Loading**: Skeleton pulse animation (`animate-pulse bg-slate-200 rounded-xl`) atau spinner berputar.
7. **Empty State**: Menampilkan ilustrasi kartun ramah + pesan penjelasan "Produk tidak ditemukan" + tombol reset filter.
8. **Error State**: Pesan pemberitahuan kemerahan yang santun tanpa istilah teknis (*stack trace*).
9. **Success State**: Notifikasi Toast float berwarna hijau emerald (`bg-emerald-500 text-white`) dengan ikon centang.

---

## 12. Panduan Gerak & Animasi (Motion Guidelines)

* **Durasi Transisi Standard**: `150ms` s.d. `200ms` untuk interaksi tombol dan hover card.
* **Easing Function**: Menggunakan `cubic-bezier(0.16, 1, 0.3, 1)` atau `ease-out` untuk pergerakan kartun yang cepat dan membal halus.
* **Modal / Sheet Animation**: Entry dengan fade-in & scale-up (`scale-95` ke `scale-100`).
* **Reduced Motion**: Mendukung `motion-reduce:transform-none` bagi pengguna yang mengaktifkan opsi aksesibilitas tanpa animasi di sistem operasi mereka.

---

## 13. Aksesibilitas (Accessibility)

* **Kontras Warna Minimal**: Memenuhi standar WCAG AA (rasio kontras teks minimal 4.5:1 terhadap latar belakang). Teks Slate `#0F172A` di atas latar Warm Cream `#FAF8F5` memiliki rasio > 12:1.
* **Keyboard Navigation**: Seluruh elemen interaktif dapat diakses dengan tombol `Tab`, dibuka dengan `Enter` / `Spacebar`, dan dibatalkan dengan `Escape`.
* **Icon Accessibility**: Semua button yang hanya berisi ikon wajib memiliki `aria-label` spesifik (contoh: `aria-label="Tutup keranjang"`).
* **Alt Text Gambar**: Gambar logo produk dan banner promosi wajib menyertakan `alt` text deskriptif.

---

## 14. Bahasa & Microcopy (Content and Microcopy)

* **Tone of Voice**: Ramah, santai, transparan, dan sigap.
* **Penggunaan Kata Kunci**:
  * ✅ "Harga Lebih Santai"
  * ✅ "Garansi Pemakaian 100%"
  * ✅ "Pengiriman Instan Hitungan Detik"
  * ✅ "Pilih paket yang paling cocok buat kamu"
  * ❌ "Transformasikan efisiensi digital Anda" (Terlalu korporat)
  * ❌ "Solusi mutakhir nomor 1 di Indonesia" (Klaim berlebihan)

---

## 15. Inventaris Komponen Utama (Component Inventory)

| Komponen | Lokasi File | Fungsi Utama | Variants / Sub-tipe | Digunakan Pada | Status |
| --- | --- | --- | --- | --- | --- |
| **AnnouncementBar** | `components/AnnouncementBar.tsx` | Pengumuman promo berjalan di header paling atas | Top Banner, Dismissible | Storefront Root | Aktif |
| **StoreHeader** | `components/StoreHeader.tsx` | Navigasi utama desktop & trigger modal | Sticky Header | Storefront Root | Aktif |
| **MobileNavigation** | `components/MobileNavigation.tsx` | Bottom bar navigasi khusus mobile | Fixed Bottom Bar | Layar HP (`<lg`) | Aktif |
| **PromotionCarousel** | `components/PromotionCarousel.tsx` | Banner promo hero slide otomatis/manual | Hero Carousel | Homepage Hero | Aktif |
| **BenefitList** | `components/BenefitList.tsx` | Menampilkan 4 pilar layanan utama toko | 4-Column Card Grid | Homepage | Aktif |
| **FlashSaleSection** | `components/FlashSaleSection.tsx` | Promo kilat dengan jam hitung mundur | Countdown Promo Section | Homepage | Aktif |
| **CategoryCard** | `components/CategoryCard.tsx` | Card kategori dengan icon & counter | Interactive Card | Category Section | Aktif |
| **CategorySection** | `components/CategorySection.tsx` | Grid kategori produk digital | Grid Layout | Homepage | Aktif |
| **ProductCard** | `components/ProductCard.tsx` | Card produk lengkap dengan selector paket | Default, Promo, Out of Stock | Katalog & Tab | Aktif |
| **ProductGrid** | `components/ProductGrid.tsx` | Pembungkus grid responsif untuk ProductCard | Responsive Grid | Katalog | Aktif |
| **ProductTabs** | `components/ProductTabs.tsx` | Tab filter kategori katalog | Scrollable Filter Tabs | Homepage Catalog | Aktif |
| **HowItWorks** | `components/HowItWorks.tsx` | Panduan 3 langkah cara pemesanan | 3-Step Card Flow | Homepage | Aktif |
| **TrustSection** | `components/TrustSection.tsx` | Seksi statistik & pilar kepercayaan | Stats Grid | Homepage | Aktif |
| **ReviewCarousel** | `components/ReviewCarousel.tsx` | Testimoni dan rating pembeli | Embla Carousel Testimonial | Homepage | Aktif |
| **FAQSection** | `components/FAQSection.tsx` | Pertanyaan & jawaban umum | Accordion List | Homepage & FAQ | Aktif |
| **NewsletterCTA** | `components/NewsletterCTA.tsx` | Form langganan promo email/WA | Form Banner Card | Footer Above | Aktif |
| **StoreFooter** | `components/StoreFooter.tsx` | Footer navigasi, lisensi, & metode bayar | Multi-column Footer | Storefront Root | Aktif |
| **CartSheet** | `components/CartSheet.tsx` | Drawer keranjang belanja dari samping | Slide-over Sheet | Global App | Aktif |
| **CheckoutModal** | `components/CheckoutModal.tsx` | Modal alur transaksi & simulasi bayar | Multi-step Dialog | Global App | Aktif |
| **QuickViewModal** | `components/QuickViewModal.tsx` | Modal detail produk cepat & paket | Product Detail Dialog | Global App | Aktif |
| **SearchDialog** | `components/SearchDialog.tsx` | Modal pencarian cepat dengan keyword | Search Modal | Global App | Aktif |
| **AuthModal** | `components/AuthModal.tsx` | Modal masuk / daftar akun | Tabs Dialog (Login/Reg) | Global App | Aktif |
| **ToastNotification** | `components/ToastNotification.tsx` | Notifikasi feedback mengambang | Success, Error, Info | Global App | Aktif |
| **CartoonIllustrations**| `components/CartoonIllustrations.tsx` | Aset ilustrasi SVG kartun kustom | AI, Speed, Shield, Discount | Banner & Card | Aktif |

---

## 16. Checklist Review Desain (Design Review Checklist)

Sebelum menyelesaikan pekerjaan pembuatan halaman/komponen baru, verifikasi poin berikut:
- [ ] Apakah halaman menggunakan latar belakang `#FAF8F5` dan border `#0F172A`?
- [ ] Apakah tombol utama menggunakan class `.cartoon-button-primary` atau `.cartoon-button-accent`?
- [ ] Apakah card utama menggunakan class `.cartoon-card` atau `.cartoon-card-hover`?
- [ ] Apakah format harga sesuai standar Rupiah Indonesia (contoh: `Rp49.000`)?
- [ ] Apakah tampilan sudah dites dan terlihat rapi pada ukuran layar Desktop (1280px), Tablet (768px), dan Mobile (375px)?
- [ ] Apakah komponen memiliki state Hover, Active, Disabled, dan Focus-Visible?
- [ ] Apakah tidak ada warna hex acak / hardcoded yang tidak terdaftar di token `STYLE.md`?
- [ ] Apakah seluruh ikon berasal dari `lucide-react`?
- [ ] Apakah telah lulus uji linter dan compile tanpa error?

---

## 17. Aturan Wajib untuk AI Agent

### Sebelum Membuat Halaman Baru
1. Agent wajib membaca `DESIGN.md` dan `STYLE.md`.
2. Agent wajib memeriksa komponen reusable yang sudah ada di `/components`.
3. Agent dilarang membuat komponen duplikat apabila fungsi serupa sudah tersedia.

### Sebelum Membuat Komponen Baru
1. Pastikan komponen menggunakan pola kartun Beliakun.com (`border-2 border-slate-900 shadow-cartoon`).
2. Sediakan props yang fleksibel dan tambahkan penanganan state loading/empty.
3. Gunakan fungsi `cn()` dari `@/lib/utils` untuk penggabungan class Tailwind.

### Setelah Implementasi
1. Jalankan `lint_applet` dan `compile_applet` untuk memastikan tidak ada kesalahan sintaks/type.
2. Perbarui file `DESIGN.md` dan `STYLE.md` apabila membuat token atau komponen baru yang reusable.

---

## 18. Aturan Perubahan Design System

1. Dilarang mengubah token global (`globals.css`) tanpa alasan terukur yang berlaku secara umum untuk seluruh aplikasi.
2. Setiap penambahan variant warna atau button baru wajib didokumentasikan di `STYLE.md` dan `DESIGN.md` pada turn yang sama.
3. Seluruh perubahan harus tetap mempertahankan gaya **Modern Cartoon Commerce** khas Beliakun.com.

---

## 19. Panduan Tema (Theme Guidelines)

### Karakter Light Mode
* **Warm & Clean**: Menggunakan canvas `#FAF8F5` dengan kartu surface putih `#FFFFFF`.
* **Garis Tepi Tegas**: Border hitam Slate 900 (`#0F172A`, `2px`) dan hard offset shadow (`3.5px` s.d. `6px`).
* **Kontras Tinggi**: Teks utama Slate 900 `#0F172A` di atas latar Warm Cream memiliki rasio kontras > 12:1 (memenuhi WCAG AA & AAA).

### Karakter Dark Mode
* **Deep Navy & Charcoal Canvas**: Menggunakan canvas `#0B0F19` dengan surface kartu `#151D2A` (bukan pure black `#000000`).
* **Offset Shadow Hitam Pekat**: Shadow kartun tetap terlihat di dark mode menggunakan shadow solid `#000000` dan border `#334155`.
* **Off-White Typography**: Teks utama `#F8FAFC`, muted text `#94A3B8`, memastikan tidak ada background putih tertinggal.
* **Semantic Token Compliance**: Menggunakan CSS Variables (`var(--background)`, `var(--foreground)`, `var(--card)`, `var(--border)`, `var(--cartoon-shadow)`) di seluruh komponen.

---

## 20. Responsive Design System

### Standard Breakpoints
Beliakun.com menggunakan pendekatan **Mobile-First** dengan Tailwind CSS breakpoints baku:

| Breakpoint | Min Width | Target Perangkat |
| :--- | :--- | :--- |
| `default` | `320px` | Perangkat Mobile Kecil (iPhone SE / Android Compact 320–360px) |
| `sm:` | `640px` | Perangkat Mobile Besar / Mini Tablet |
| `md:` | `768px` | Tablet Portrait (iPad 768×1024) |
| `lg:` | `1024px` | Tablet Landscape / Laptop Kecil (1024×768) |
| `xl:` | `1280px` | Laptop / Desktop Standar (1280×800, 1440×900) |
| `2xl:` | `1536px` | Desktop Ultrawide (1920×1080) |

### Tokens & Responsive Metrics

| Token / Metrics | Mobile (320px–430px) | Tablet (768px–1024px) | Desktop (1280px–1920px) |
| :--- | :--- | :--- | :--- |
| **Page Container Max Width** | `100%` | `100%` | `max-w-[1600px] mx-auto` |
| **Page Horizontal Padding** | `px-4` (16px) | `md:px-6` (24px) | `lg:px-8` (32px) |
| **Section Vertical Gap** | `py-6 sm:py-8` (24–32px) | `md:py-12` (48px) | `lg:py-18 xl:py-20` (72–80px) |
| **Grid Column Count** | `cols-1` (<380px) / `cols-2` (380px+) | `md:cols-3 lg:cols-4` | `xl:cols-5 2xl:cols-6` |
| **Grid Gap** | `gap-3` (12px) | `sm:gap-4` (16px) | `lg:gap-5` (20px) |
| **Card Padding** | `p-3.5` (14px) | `sm:p-4` (16px) | `md:p-5` (20px) |
| **Touch Target Minimum** | `min-h-[44px]` (44×44px) | `min-h-[44px]` (44×44px) | `min-h-[40px]` (40×40px) |

### Overflow & Viewport Safety Rules
1. **Dilarang keras menyembunyikan masalah layout dengan `overflow-x-hidden` global**.
2. **Product Grid Adaptive**: Pada layar < 380px (iPhone SE 320px), grid otomatis beralih ke `grid-cols-1` agar card produk dan tombol tidak terhimpit.
3. **Modal & Drawer Inset**: Modal dialog menggunakan `w-[calc(100vw-1.5rem)] max-w-2xl` agar tidak meluap keluar layar mobile 320px. Drawer sheet menggunakan safe area bottom padding (`pb-safe`).

---

## 21. Beliakun UI Component Principles

### filosofi Komponen UI
1. **Identitas Unik**: Komponen Beliakun.com menggunakan gaya **Modern Cartoon Commerce** (border 2px tegas, hard offset shadow, warm canvas `#FAF8F5`, deep navy dark `#0B0F19`, touch target 44px+).
2. **Reuse over Duplicate**: Developer dan AI Agent wajib menggunakan komponen dari `components/ui/`, `components/beliakun-ui/`, dan `components/patterns/` yang sudah tersedia di [COMPONENTS.md](file:///d:/Folder%20Pribadi/4.%20Bisnis/Beliakun.com/Websites/BeliAkun/COMPONENTS.md).
3. **Composition over Monolith**: Gunakan pola komposisi subkomponen (misal `<Card><CardHeader><CardTitle/></CardHeader></Card>`).
4. **Accessible & Responsive**: Semua komponen diuji keyboard focus (`focus-visible:ring-2`), screen reader label, dan mobile safe area (`pb-safe`).



