# 📘 Registry Resmi Komponen UI Beliakun.com (Modern Cartoon Commerce)

> [!IMPORTANT]
> Dokumen ini adalah registry resmi komponen UI Beliakun.com.
> Sebelum membuat halaman atau komponen baru, developer dan AI Agent wajib memeriksa dokumen ini serta mencari komponen reusable yang sudah tersedia.

> [!WARNING]
> Dilarang membuat komponen duplikat, menyalin primitive Shadcn berulang kali, atau membuat style lokal yang bertentangan dengan DESIGN.md dan STYLE.md.

---

## 🎨 Karakter Visual & Standardisasi System
- **Style Language**: Modern Cartoon Commerce (Neo-Brutalist Playful Modern).
- **Border**: 2px tegas (`border-[var(--border)]`), border 3-4px untuk container kartun utama.
- **Shadow**: Hard offset shadow (`shadow-[3.5px_3.5px_0px_0px_var(--cartoon-shadow)]`).
- **Touch Target**: Minimum 44×44px untuk seluruh tombol, input, select, dan icon trigger.
- **Responsive**: Mobile-First (320px, 360px, 390px, 430px, 768px, 1024px, 1280px, 1920px).
- **Semantic Design Tokens**: Menggunakan CSS Variables (`var(--background)`, `var(--foreground)`, `var(--card)`, `var(--primary)`, `var(--border)`, `var(--cartoon-shadow)`).

---

## 📑 Daftar Komponen UI

### 1. Actions & Buttons

#### Button
- Lokasi: `components/ui/button.tsx`
- Status: Stable
- Jenis: Primitive
- Foundation: Shadcn UI + CVA
- Tujuan: Menampilkan tindakan aksi pengguna.
- Variants: `primary`, `secondary`, `accent`, `cartoon`, `outline`, `ghost`, `link`, `destructive`, `success`, `soft`, `icon`.
- Sizes: `xs`, `sm`, `default`, `lg`, `icon`, `icon-sm`, `icon-lg`.
- States: `default`, `hover`, `active`, `focus-visible`, `disabled`, `loading`.
- Responsive: Touch target minimum 44px pada mobile.
- Theme: Menggunakan semantic token (`var(--primary)`, `var(--cartoon-shadow)`).
- Accessibility: Mendukung keyboard, focus-visible, dan aria-disabled.
- Digunakan pada: Storefront, dialog, form, cart, checkout.

#### ButtonGroup
- Lokasi: `components/beliakun-ui/button-group.tsx`
- Status: Stable
- Jenis: Custom Beliakun
- Foundation: Custom
- Tujuan: Menggabungkan beberapa button sejajar horizontal/vertikal.
- Variants: `attached`, `separated`.
- Digunakan pada: Filter bar, action toolbar.

#### Toggle & ToggleGroup
- Lokasi: `components/ui/toggle.tsx` & `components/ui/toggle-group.tsx`
- Status: Stable
- Jenis: Primitive
- Foundation: Shadcn UI
- Tujuan: Memilih status aktif/non-aktif tunggal atau grup pilihan.
- Variants: `default`, `outline`, `cartoon`.

---

### 2. Forms & Inputs

#### Input
- Lokasi: `components/ui/input.tsx`
- Status: Stable
- Jenis: Primitive
- Foundation: Shadcn UI
- Tujuan: Mengumpulkan masukan teks pendek dari pengguna.
- Features: `leftIcon`, `rightIcon`, `passwordVisibilityToggle`, `onClearAction`, `invalidState`.
- Sizes: `sm`, `default`, `lg`.

#### InputGroup
- Lokasi: `components/beliakun-ui/input-group.tsx`
- Status: Stable
- Jenis: Custom Beliakun
- Foundation: Custom
- Tujuan: Menggabungkan input dengan addon prefix/suffix (seperti kode negara `+62` atau addon domain).

#### InputOTP
- Lokasi: `components/beliakun-ui/input-otp.tsx`
- Status: Stable
- Jenis: Custom Beliakun
- Foundation: Custom
- Tujuan: Verifikasi kode transaksi OTP 6-digit dengan auto-advance dan paste support.

#### Textarea
- Lokasi: `components/ui/textarea.tsx`
- Status: Stable
- Jenis: Primitive
- Foundation: Shadcn UI
- Features: Character counter (`showCount`), auto-resize.

#### Checkbox
- Lokasi: `components/ui/checkbox.tsx`
- Status: Stable
- Jenis: Primitive
- Foundation: Shadcn UI
- States: `checked`, `unchecked`, `indeterminate`, `invalid`, `disabled`.

#### RadioGroup & RadioItem
- Lokasi: `components/ui/radio-group.tsx`
- Status: Stable
- Jenis: Primitive
- Foundation: Shadcn UI
- Variants: `default`, `cards` (pilihan paket produk & metode pembayaran).

#### Switch
- Lokasi: `components/ui/switch.tsx`
- Status: Stable
- Jenis: Primitive
- Foundation: Shadcn UI
- Responsive: Touch target 44px.

#### Slider
- Lokasi: `components/ui/slider.tsx`
- Status: Stable
- Jenis: Primitive
- Foundation: Custom HTML5 Range
- Features: Track gradient, value bubble.

#### Select & NativeSelect
- Lokasi: `components/ui/select.tsx` & `components/beliakun-ui/native-select.tsx`
- Status: Stable
- Jenis: Primitive & Custom
- Foundation: Custom Popover & Mobile Native `<select>`.

#### Combobox
- Lokasi: `components/beliakun-ui/combobox.tsx`
- Status: Stable
- Jenis: Custom Beliakun
- Foundation: Custom Search + Popover
- Tujuan: Pemilihan opsi dari daftar panjang dengan pencarian cepat.

#### DatePicker
- Lokasi: `components/beliakun-ui/date-picker.tsx`
- Status: Stable
- Jenis: Custom Beliakun
- Foundation: HTML5 Date Input + Formatter Indonesia.

#### Field
- Lokasi: `components/beliakun-ui/field.tsx`
- Status: Stable
- Jenis: Custom Beliakun
- Foundation: Custom Layout Wrapper
- Subcomponents: `Label`, `Description`, `Error`, `RequiredIndicator`.

---

### 3. Navigation

#### Breadcrumb
- Lokasi: `components/ui/breadcrumb.tsx`
- Status: Stable
- Jenis: Primitive
- Features: Text truncation, Home icon, current page `aria-current`.

#### Pagination
- Lokasi: `components/beliakun-ui/pagination.tsx`
- Status: Stable
- Jenis: Custom Beliakun
- Features: Prev/Next, Page numbers, Ellipsis.

#### Tabs
- Lokasi: `components/ui/tabs.tsx`
- Status: Stable
- Jenis: Primitive
- Features: Horizontal scrollable pills, active cartoon styling.

#### Sidebar
- Lokasi: `components/beliakun-ui/sidebar.tsx`
- Status: Stable
- Jenis: Custom Beliakun
- Modes: Desktop Expanded, Desktop Collapsed, Mobile Sheet.

---

### 4. Feedback & Status

#### Alert
- Lokasi: `components/ui/alert.tsx`
- Status: Stable
- Jenis: Primitive
- Variants: `default`, `info`, `success`, `warning`, `destructive`, `promotional`.

#### Progress & Spinner
- Lokasi: `components/ui/progress.tsx` & `components/beliakun-ui/spinner.tsx`
- Status: Stable
- Jenis: Primitive & Custom.

#### Skeleton
- Lokasi: `components/ui/skeleton.tsx`
- Status: Stable
- Variants: `text`, `avatar`, `card`, `product`, `button`, `circle`.

#### Badge & Marker
- Lokasi: `components/ui/badge.tsx` & `components/beliakun-ui/marker.tsx`
- Status: Stable.

---

### 5. Overlays & Drawers

#### Dialog & AlertDialog
- Lokasi: `components/ui/dialog.tsx` & `components/ui/alert-dialog.tsx`
- Features: Focus trap, Escape close, cartoon backdrop.

#### Sheet & Drawer
- Lokasi: `components/ui/sheet.tsx` & `components/ui/drawer.tsx`
- Sides: `right`, `left`, `top`, `bottom` dengan safe area `pb-safe`.

#### DropdownMenu, Popover & Tooltip
- Lokasi: `components/ui/dropdown-menu.tsx`, `components/ui/popover.tsx`, `components/ui/tooltip.tsx`
- Features: Collision handling.

---

### 6. Data Display & Messaging

#### Card
- Lokasi: `components/ui/card.tsx`
- Variants: `default`, `interactive`, `product`, `category`, `promotion`, `flat`, `cartoon`, `selected`, `disabled`.

#### Table & DataTable
- Lokasi: `components/ui/table.tsx` & `components/beliakun-ui/data-table.tsx`
- Features: Search, Sorting, Pagination, Striped rows.

#### Item, Avatar, Kbd, Attachment
- Lokasi: `components/beliakun-ui/item.tsx`, `components/ui/avatar.tsx`, `components/beliakun-ui/kbd.tsx`, `components/beliakun-ui/attachment.tsx`.

#### Bubble & MessageScroller
- Lokasi: `components/beliakun-ui/bubble.tsx` & `components/beliakun-ui/message-scroller.tsx`
- Features: Auto-scroll to bottom, customer/support message bubbles.

---

### 7. Layout Patterns (`components/patterns/`)

- `SectionHeading`: Title, subtitle, badge tag, dan action button.
- `PageContainer`: Resizable page container `max-w-[1600px] mx-auto px-4 sm:px-5 md:px-6 lg:px-8`.
- `FormLayout`: Form card wrapper terstruktur.
- `MobileActionBar`: Sticky bottom bar mobile dengan `pb-safe`.
- `ResponsiveGrid`: Adaptive grid layout (1-6 kolom).

---

## 🚫 Pola yang Dilarang
1. Dilarang mengimpor komponen default Shadcn tanpa penyesuaian gaya Beliakun.com.
2. Dilarang menggunakan inline hex color (misal `style={{ color: "#2563eb" }}`).
3. Dilarang membuat file komponen duplikat untuk halaman tertentu.
4. Dilarang menghilangkan focus outline atau touch target pada mobile.
