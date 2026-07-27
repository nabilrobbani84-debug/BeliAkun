# Dokumentasi Aturan Styling & Visual Beliakun.com (STYLE.md)

> [!IMPORTANT]
> Dokumen ini merupakan sumber utama aturan UI/UX Beliakun.com.
> Setiap halaman dan komponen baru wajib mengikuti aturan di dalam dokumen ini.
> Jangan membuat bahasa visual, token, pattern, atau komponen baru sebelum memeriksa implementasi yang sudah tersedia.
> Apabila terdapat keputusan desain baru yang bersifat reusable, perbarui dokumentasi ini dalam perubahan yang sama.

> [!WARNING]
> Dilarang mengabaikan dokumentasi ini dan membuat UI berdasarkan preferensi sementara, asumsi pribadi, atau pola generik dari AI.

---

## Daftar Isi
1. [Arsitektur Styling (Styling Architecture)](#1-arsitektur-styling-styling-architecture)
2. [Token Warna (Color Tokens)](#2-token-warna-color-tokens)
3. [Aturan Warna Semantik (Semantic Color Rules)](#3-aturan-warna-semantik-semantic-color-rules)
4. [Skala Tipografi (Typography)](#4-skala-tipografi-typography)
5. [Skala Spacing (Spacing Scale)](#5-skala-spacing-spacing-scale)
6. [Border Radius System](#6-border-radius-system)
7. [Sistem Border (Border System)](#7-sistem-border-border-system)
8. [Sistem Shadow Kartun (Shadow System)](#8-sistem-shadow-kartun-shadow-system)
9. [Ikonografi (Iconography)](#9-ikonografi-iconography)
10. [Aset Gambar & Ilustrasi (Image and Illustration)](#10-aset-gambar--ilustrasi-image-and-illustration)
11. [Varian Tombol (Button Variants)](#11-varian-tombol-button-variants)
12. [Varian Card (Card Variants)](#12-varian-card-card-variants)
13. [Varian Badge (Badge Variants)](#13-varian-badge-badge-variants)
14. [Komponen Form (Form Components)](#14-komponen-form-form-components)
15. [Komponen Navigasi (Navigation Components)](#15-komponen-navigasi-navigation-components)
16. [Komponen Overlay (Overlay Components)](#16-komponen-overlay-overlay-components)
17. [Aturan Carousel (Carousel Rules)](#17-aturan-carousel-carousel-rules)
18. [Hirarki Z-Index (Z-Index System)](#18-hirarki-z-index-z-index-system)
19. [Titik Henti Breakpoint (Breakpoints)](#19-titik-henti-breakpoint-breakpoints)
20. [Penyesuaian Shadcn UI (Shadcn UI Customization Rules)](#20-penyesuaian-shadcn-ui-shadcn-ui-customization-rules)
21. [Contoh Kode Resmi (Code Examples)](#21-contoh-kode-resmi-code-examples)
22. [Urutan Class Tailwind (Class Ordering)](#22-urutan-class-tailwind-class-ordering)
23. [Praktik Styling yang Dilarang (Prohibited Styling Practices)](#23-praktik-styling-yang-dilarang-prohibited-styling-practices)
24. [Inventaris Design Token (Design Token Inventory)](#24-inventaris-design-token-design-token-inventory)
25. [Pengelolaan Perubahan & Rules AI Agent](#25-pengelolaan-perubahan--rules-ai-agent)

---

## 1. Arsitektur Styling (Styling Architecture)

* **Framework Styling**: Tailwind CSS v4 dengan impor PostCSS `@import "tailwindcss";` dan plugin animasi `@import "tw-animate-css";`.
* **Kustomisasi Class CSS Global**: Terletak pada `app/globals.css`. Digunakan untuk class helper kartun reusabel (`.cartoon-card`, `.cartoon-card-hover`, `.cartoon-button-primary`, `.cartoon-button-secondary`, `.cartoon-button-accent`, `.cartoon-badge`).
* **Penggabungan Class Utility**: Menggunakan helper `cn()` dari `lib/utils.ts` yang menggabungkan `clsx` dan `tailwind-merge`.
* **Manajemen Varian**: Menggunakan `class-variance-authority` (cva) untuk mendefinisikan varian komponen secara sistematis.

Contoh Penggunaan Utility `cn()`:
```tsx
import { cn } from "@/lib/utils";

export function CustomBadge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("cartoon-badge px-2.5 py-1 text-xs bg-amber-400 text-slate-900", className)}>
      {children}
    </span>
  );
}
```

---

## 2. Token Warna (Color Tokens)

| Token Nama | Class / CSS Variable | Nilai Hex | Fungsi Utama | Contoh Penggunaan | Larangan |
| --- | --- | --- | --- | --- | --- |
| **Canvas Background** | `bg-[#FAF8F5]` | `#FAF8F5` | Latar belakang seluruh halaman | `body`, `main` wrapper | Dilarang memakai putih murni `#FFFFFF` untuk canvas utama |
| **Dark Neutral / Border** | `bg-slate-900`, `border-slate-900` | `#0F172A` | Border tegas kartun, teks utama, shadow kartun | `border-2 border-slate-900`, `text-slate-900` | Dilarang memakai border abu-abu pudar untuk card utama |
| **Card Surface** | `bg-white` | `#FFFFFF` | Latar belakang card, modal, input, dropdown | `.cartoon-card` | Dilarang memberi background transparan penuh tanpa border |
| **Primary Blue** | `bg-blue-600` / `hover:bg-blue-700` | `#2563EB` | Tombol CTA utama, status aktif, link harga | `.cartoon-button-primary` | Dilarang dipakai untuk tombol sekunder atau pesan error |
| **Accent Yellow** | `bg-amber-400` / `hover:bg-amber-500` | `#FACC15` | Highlight promo, badge terlaris, tombol aksen | `.cartoon-button-accent` | Dilarang dipakai untuk seluruh background seksi besar |
| **Secondary Neutral** | `bg-white` / `hover:bg-slate-50` | `#FFFFFF` | Tombol sekunder, tombol filter non-aktif | `.cartoon-button-secondary` | Dilarang dihilangkan border-nya |
| **Success Emerald** | `bg-emerald-500`, `bg-emerald-100` | `#10B981` | Indikator stok tersedia, verifikasi, toast sukses | `bg-emerald-100 text-emerald-800` | Dilarang dipakai untuk tombol aksi pembatalan |
| **Rose / Sale** | `bg-rose-500`, `bg-rose-100` | `#F43F5E` | Diskon promo, stok terbatas, badge promo kilat | `bg-rose-500 text-white` | Dilarang dipakai untuk elemen dekoratif non-promosional |
| **Rating Gold** | `text-amber-500`, `fill-amber-400` | `#F59E0B` | Bintang rating dan skor kepuasan pelanggan | `<Star className="fill-amber-400" />` | Dilarang memakai warna abu-abu untuk bintang aktif |
| **Muted Foreground** | `text-slate-600`, `text-slate-500` | `#475569` | Subdeskripsi, informasi durasi, nama kategori | `text-xs text-slate-500 font-medium` | Dilarang menggunakan warna yang terlalu samar (WCAG AA) |

---

## 3. Aturan Warna Semantik (Semantic Color Rules)

1. **Aturan 60-30-10 Layout Color**:
   * `60%` Latar belakang dominan: Warm Cream `#FAF8F5`.
   * `30%` Elemen Struktural: Kartu putih `#FFFFFF` berpembatas Slate `#0F172A`.
   * `10%` Warna Aksen Interaktif: Biru `#2563EB` (Primary CTA) & Kuning `#FACC15` (Aksen Promo).
2. **Aturan Warna Status**:
   * Status Berhasil / Tersedia: Warna Emerald (`bg-emerald-100 text-emerald-800 border-emerald-300`).
   * Status Habis / Bahaya: Warna Rose (`bg-rose-100 text-rose-800 border-rose-300`).
   * Status Menunggu / Peringatan: Warna Amber (`bg-amber-100 text-amber-800 border-amber-300`).

---

## 4. Skala Tipografi (Typography)

Satu-satunya font family yang digunakan adalah **Plus Jakarta Sans** (`var(--font-sans)`).

| Tingkat Tipografi | Responsive Class Tailwind | Ukuran Desktop | Ukuran Mobile | Weight | Line Height |
| --- | --- | --- | --- | --- | --- |
| **Hero Display** | `text-2xl sm:text-4xl lg:text-5xl` | 48px | 24px | `font-black` (900) | `leading-tight` |
| **Heading H1** | `text-xl sm:text-3xl lg:text-4xl` | 36px | 20px | `font-extrabold` (800) | `leading-tight` |
| **Heading H2** | `text-lg sm:text-2xl` | 24px | 18px | `font-extrabold` (800) | `leading-snug` |
| **Heading H3** | `text-xs sm:text-sm` | 14px | 12px | `font-extrabold` (800) | `leading-snug` |
| **Body Large** | `text-sm sm:text-base` | 16px | 14px | `font-medium` (500) | `leading-relaxed` |
| **Body Regular**| `text-xs sm:text-sm` | 14px | 12px | `font-medium` (500) | `leading-relaxed` |
| **Caption / Small**| `text-[10px] sm:text-[11px]` | 11px | 10px | `font-bold` (700) | `leading-normal` |

Aturan Pembatasan Teks (Truncation):
* **Judul Produk Card**: Wajib `line-clamp-1` atau `truncate`.
* **Deskripsi Produk Card**: Wajib `line-clamp-2`.
* **Label Tombol**: Wajib `whitespace-nowrap` (tidak boleh patah ke dua baris).

---

## 5. Skala Spacing (Spacing Scale)

Skala spacing wajib mengikuti kelipatan grid Tailwind berbasis `4px`:

* `0.5` = `2px` (gap antar elemen sangat rapat)
* `1` = `4px` (padding internal badge)
* `1.5` = `6px` (gap antar tombol mini)
* `2` = `8px` (padding tombol kecil, gap antar elemen form)
* `3` = `12px` (padding card rapat di mobile)
* `4` = `16px` (padding card standar, margin antar seksi kecil)
* `6` = `24px` (gap grid desktop)
* `8` = `32px` (padding seksi mobile)
* `12` = `48px` (padding seksi tablet)
* `16` = `64px` (padding seksi desktop)

❌ Dilarang memakai nilai acak seperti `p-[13px]`, `m-[17px]`, `gap-[29px]`.

---

## 6. Border Radius System

1. **Badge / Pill (`rounded-full`)**: `9999px`. Digunakan khusus untuk tag produk, penunjuk persentase diskon, dan avatar.
2. **Card Utama (`rounded-2xl`)**: `1.25rem` (20px). Digunakan untuk seluruh `.cartoon-card`, modal container, dan banner hero.
3. **Tombol & Form Input (`rounded-xl`)**: `0.875rem` (14px). Digunakan untuk `.cartoon-button-primary`, `.cartoon-button-secondary`, `.cartoon-button-accent`, input text, dan select box.
4. **Package Pill Selector (`rounded-lg`)**: `0.5rem` (8px). Digunakan untuk tombol opsi durasi paket di dalam card produk.

---

## 7. Sistem Border (Border System)

Style kartun Beliakun.com bertumpu pada garis tepi yang tegas:

* **Border Kartun Standard**: `border-2 border-slate-900` (`2px solid #0F172A`). Digunakan pada card, modal, tombol, dan logo produk.
* **Border Kartun Badge**: `border border-slate-900` (`1px` s.d. `1.5px solid #0F172A`).
* **Border Divider Halus**: `border-t border-slate-200` (`1px solid #E2E8F0`). Digunakan untuk pemisah harga di bagian bawah card.

---

## 8. Sistem Shadow Kartun (Shadow System)

Beliakun.com menggunakan **Hard Offset Shadow** tanpa blur opacity pudar.

Tabel Varian Shadow Kartun:
* **Shadow Small (`shadow-cartoon-sm`)**: `shadow-[1.5px_1.5px_0px_0px_#0F172A]`. Digunakan untuk badge dan tombol mini.
* **Shadow Medium (`shadow-cartoon-md`)**: `shadow-[3px_3px_0px_0px_#0F172A]`. Digunakan untuk tombol standar (`.cartoon-button-primary`).
* **Shadow Card (`shadow-cartoon-lg`)**: `shadow-[3.5px_3.5px_0px_0px_#0F172A]`. Digunakan untuk `.cartoon-card`.
* **Shadow Hover (`shadow-cartoon-hover`)**: `shadow-[6px_6px_0px_0px_#0F172A]`. Memicu efek timbul saat kursor diarahkan ke card/tombol.
* **Shadow Active (`shadow-cartoon-active`)**: `shadow-[1.5px_1.5px_0px_0px_#0F172A]`. Memicu efek tertekan saat tombol diklik.

---

## 9. Ikonografi (Iconography)

* **Library Ikon**: Seluruh ikon wajib diimpor dari `lucide-react`.
* **Ukuran Standard**:
  * Ikon Button / Badge: `w-3.5 h-3.5` atau `w-4 h-4`.
  * Ikon Navigation / Header: `w-5 h-5`.
  * Ikon Feature / Benefit: `w-6 h-6` atau `w-8 h-8`.
* **Properti Stroke**: Stroke width default `2px` (font-weight konsisten dengan border kartun).

---

## 10. Aset Gambar & Ilustrasi (Image and Illustration)

* **Gaya Ilustrasi**: Menggunakan komponen `CartoonIllustrations.tsx` berbasis SVG geometris bersih dengan border hitam `stroke="#0F172A"` dan isi warna solid (`fill="#FACC15"`, `fill="#2563EB"`).
* **Logo Produk Digital**: Diwakili oleh blok warna inisial huruf `w-11 h-11 rounded-2xl` berpembatas `border-2 border-slate-900` untuk menjaga konsistensi tanpa tergantung pada gambar eksternal yang lambat dimuat.

---

## 11. Varian Tombol (Button Variants)

| Variant | Class Utama | State Hover | State Active / Pressed |
| --- | --- | --- | --- |
| **Primary** | `.cartoon-button-primary` (Blue `#2563EB`) | `hover:bg-blue-700 hover:-translate-x-[1.5px] hover:-translate-y-[1.5px]` | `active:translate-x-[1px] active:translate-y-[1px]` |
| **Secondary** | `.cartoon-button-secondary` (White) | `hover:bg-slate-50 hover:-translate-x-[1.5px] hover:-translate-y-[1.5px]` | `active:translate-x-[1px] active:translate-y-[1px]` |
| **Accent** | `.cartoon-button-accent` (Yellow `#FACC15`) | `hover:bg-amber-500 hover:-translate-x-[1.5px] hover:-translate-y-[1.5px]` | `active:translate-x-[1px] active:translate-y-[1px]` |
| **Ghost / Icon**| `p-2 rounded-xl text-slate-900 hover:bg-slate-100` | `hover:bg-amber-300` | `active:scale-95` |

---

## 12. Varian Card (Card Variants)

1. **Standard Static Card (`.cartoon-card`)**: Background putih, border Slate 900, shadow `3.5px`, radius `rounded-2xl`. Digunakan untuk seksi statis (FAQ, How It Works, Stats).
2. **Interactive Hover Card (`.cartoon-card-hover`)**: Mengalami pergeseran `-2px, -2px` dan shadow membesar menjadi `6px` saat dihover. Digunakan untuk ProductCard dan CategoryCard.

---

## 13. Varian Badge (Badge Variants)

* **Tag Terlaris**: `bg-amber-400 text-slate-950 border border-slate-900 shadow-[1px_1px_0px_0px_#000]`
* **Tag Baru**: `bg-emerald-400 text-slate-950 border border-slate-900 shadow-[1px_1px_0px_0px_#000]`
* **Tag Stok Terbatas**: `bg-rose-400 text-slate-950 border border-slate-900 shadow-[1px_1px_0px_0px_#000]`
* **Tag Promo / Default**: `bg-blue-400 text-slate-950 border border-slate-900 shadow-[1px_1px_0px_0px_#000]`
* **Tag Persen Diskon**: `bg-rose-500 text-white border border-slate-900 shadow-[1px_1px_0px_0px_#000]`

---

## 14. Komponen Form (Form Components)

Aturan Styling Input:
```tsx
<input
  type="text"
  className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-[2px_2px_0px_0px_#0F172A]"
  placeholder="Contoh: 081234567890"
/>
```

---

## 15. Komponen Navigasi (Navigation Components)

* **Header Links**: `text-xs font-extrabold text-slate-700 hover:text-blue-600 transition-colors`.
* **Mobile Bottom Bar**: `fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-900 py-2 px-4 z-40 flex items-center justify-around`.

---

## 16. Komponen Overlay (Overlay Components)

* **Backdrop Overlay**: `bg-slate-900/60 backdrop-blur-sm z-50`.
* **Modal Dialog Container**: `bg-white border-2 border-slate-900 rounded-2xl p-5 sm:p-6 shadow-[8px_8px_0px_0px_#0F172A] max-w-lg w-full max-h-[90vh] overflow-y-auto`.

---

## 17. Aturan Carousel (Carousel Rules)

* **Library**: `embla-carousel-react` dengan plugin `embla-carousel-autoplay`.
* **Navigasi Carousel**: Tombol panah melayang di kiri dan kanan dengan class `.cartoon-button-secondary p-2.5 rounded-2xl`.

---

## 18. Hirarki Z-Index (Z-Index System)

* `z-0`: Background & elemen dekoratif dasar
* `z-10`: Kartu & badge interaktif
* `z-20`: Header sticky
* `z-30`: Mobile bottom navigation
* `z-40`: Search dialog & notification toast
* `z-50`: Modal overlay & Cart Sheet drawer

---

## 19. Titik Henti Breakpoint (Breakpoints)

* `sm`: `640px` (Layar HP Besar / Tablet Kecil)
* `md`: `768px` (Tablet)
* `lg`: `1024px` (Laptop / Desktop)
* `xl`: `1280px` (Desktop Lebar)

---

## 20. Penyesuaian Shadcn UI (Shadcn UI Customization Rules)

Apabila menambahkan komponen Shadcn UI baru:
1. Pasang border kartun: `border-2 border-slate-900`.
2. Pasang shadow kartun: `shadow-[3.5px_3.5px_0px_0px_#0F172A]`.
3. Pasang radius konsisten: `rounded-xl` atau `rounded-2xl`.
4. Sesuaikan warna background dengan token Beliakun.com (`#FAF8F5` / `#FFFFFF`).

---

## 21. Contoh Kode Resmi (Code Examples)

### Contoh 1: Halaman Seksi Utama (Page Section)
```tsx
export function FeatureSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="flex flex-col items-center text-center mb-8">
        <span className="cartoon-badge bg-amber-400 text-slate-950 px-3 py-1 text-xs mb-2">
          Fitur Unggulan
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Kenapa Belanja di Beliakun.com?
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Feature Cards */}
      </div>
    </section>
  );
}
```

### Contoh 2: Product Card Standar
```tsx
<div className="cartoon-card-hover bg-white p-4 flex flex-col justify-between cursor-pointer">
  <div className="flex items-center justify-between mb-2">
    <span className="text-[10px] font-extrabold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full border border-slate-900 shadow-[1px_1px_0px_0px_#000]">
      Terlaris
    </span>
    <span className="text-[10px] font-extrabold bg-rose-500 text-white px-2 py-0.5 rounded-full border border-slate-900 shadow-[1px_1px_0px_0px_#000]">
      -25%
    </span>
  </div>
  <h3 className="font-extrabold text-sm text-slate-900 truncate">ChatGPT Plus Premium</h3>
  <div className="pt-2 border-t border-slate-200 mt-3 flex items-center justify-between">
    <span className="font-black text-blue-600">Rp49.000</span>
    <button className="cartoon-button-primary px-3 py-1.5 text-xs">
      + Keranjang
    </button>
  </div>
</div>
```

---

## 22. Urutan Class Tailwind (Class Ordering)

Class Tailwind disusun dengan urutan logis:
1. **Layout / Display**: `flex`, `grid`, `block`, `hidden`
2. **Positioning**: `relative`, `absolute`, `sticky`, `top-0`, `z-10`
3. **Sizing**: `w-full`, `max-w-7xl`, `h-11`
4. **Spacing**: `px-4`, `py-2`, `mb-3`, `gap-2`
5. **Typography**: `font-extrabold`, `text-sm`, `text-slate-900`, `truncate`
6. **Background & Color**: `bg-white`, `bg-blue-600`
7. **Border & Radius**: `border-2`, `border-slate-900`, `rounded-2xl`
8. **Shadow & Effects**: `shadow-cartoon`, `transition-all`
9. **Responsive / States**: `sm:text-base`, `hover:bg-blue-700`

---

## 23. Praktik Styling yang Dilarang (Prohibited Styling Practices)

* ❌ Dilarang memakai `!important` kecuali dipaksa oleh library pihak ketiga.
* ❌ Dilarang memakai inline style (`style={{ backgroundColor: '#123456' }}`).
* ❌ Dilarang memakai z-index ekstrim seperti `z-[999999]`.
* ❌ Dilarang membuat border radius acak seperti `rounded-[17px]`.

---

## 24. Inventaris Design Token (Design Token Inventory)

| Token Nama | Class Utility Tailwind | Nilai CSS | Deskripsi |
| --- | --- | --- | --- |
| Canvas Background | `bg-[#FAF8F5]` | `#FAF8F5` | Latar belakang hangat toko |
| Dark Border / Text | `border-slate-900`, `text-slate-900` | `#0F172A` | Border hitam tegas & teks utama |
| Primary CTA | `.cartoon-button-primary` | `#2563EB` | Tombol beli & tindakan utama |
| Accent Promo | `.cartoon-button-accent` | `#FACC15` | Tombol aksen & badge terlaris |
| Secondary Neutral | `.cartoon-button-secondary` | `#FFFFFF` | Tombol detail & aksi sekunder |
| Card Border Radius| `rounded-2xl` | `1.25rem` (20px) | Sudut tumpul kartu kartun |
| Button Border Radius| `rounded-xl` | `0.875rem` (14px) | Sudut tumpul tombol kartun |
| Hard Shadow Card | `shadow-[3.5px_3.5px_0px_0px_#0F172A]` | Offset 3.5px | Shadow kartu kartun |
| Hard Shadow Hover | `shadow-[6px_6px_0px_0px_#0F172A]` | Offset 6px | Shadow saat dihover |

---

## 25. Pengelolaan Perubahan & Rules AI Agent

1. Seluruh AI Agent dan developer wajib mematuhinya sebagai aturan baku.
2. Setiap kali ada penambahan fitur baru, pastikan class CSS mengikuti token di atas.
3. Selalu verifikasi build dengan `lint_applet` dan `compile_applet`.
