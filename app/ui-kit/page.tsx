"use client"

import React, { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { Sparkles, Sun, Moon, Check, Laptop, Smartphone, Tablet, Terminal, AlertTriangle, ShieldCheck, Heart } from "lucide-react"

// UI Primitives
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionItem } from "@/components/ui/accordion"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertDialog } from "@/components/ui/alert-dialog"
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { Sheet, SheetHeader, SheetTitle, SheetDescription, SheetContent, SheetFooter } from "@/components/ui/sheet"
import { Drawer } from "@/components/ui/drawer"
import { DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Popover } from "@/components/ui/popover"
import { Tooltip } from "@/components/ui/tooltip"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Carousel, CarouselItem } from "@/components/ui/carousel"
import { Collapsible } from "@/components/ui/collapsible"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select } from "@/components/ui/select"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Typography } from "@/components/ui/typography"

// Beliakun Custom UI
import { Empty } from "@/components/beliakun-ui/empty"
import { Field } from "@/components/beliakun-ui/field"
import { Item } from "@/components/beliakun-ui/item"
import { Kbd } from "@/components/beliakun-ui/kbd"
import { Marker } from "@/components/beliakun-ui/marker"
import { Spinner } from "@/components/beliakun-ui/spinner"
import { ButtonGroup } from "@/components/beliakun-ui/button-group"
import { NativeSelect } from "@/components/beliakun-ui/native-select"
import { Combobox } from "@/components/beliakun-ui/combobox"
import { DatePicker } from "@/components/beliakun-ui/date-picker"
import { DataTable } from "@/components/beliakun-ui/data-table"
import { Attachment } from "@/components/beliakun-ui/attachment"
import { Bubble } from "@/components/beliakun-ui/bubble"
import { MessageScroller } from "@/components/beliakun-ui/message-scroller"
import { InputGroup } from "@/components/beliakun-ui/input-group"
import { InputOTP } from "@/components/beliakun-ui/input-otp"
import { Pagination } from "@/components/beliakun-ui/pagination"
import { Resizable } from "@/components/beliakun-ui/resizable"
import { Sidebar } from "@/components/beliakun-ui/sidebar"
import { Chart } from "@/components/beliakun-ui/chart"

// Patterns
import { SectionHeading } from "@/components/patterns/section-heading"
import { PageContainer } from "@/components/patterns/page-container"
import { FormLayout } from "@/components/patterns/form-layout"
import { ResponsiveGrid } from "@/components/patterns/responsive-grid"

export default function UIKitPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState("actions")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [otpValue, setOtpValue] = useState("123456")
  const [sliderVal, setSliderVal] = useState(65)
  const [progressVal, setProgressVal] = useState(70)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const dummyTableData = [
    { id: "1", name: "ChatGPT Plus 1 Bulan", category: "AI Premium", price: "Rp45.000", status: "Aktif" },
    { id: "2", name: "Canva Pro Invite 1 Tahun", category: "Design", price: "Rp25.000", status: "Aktif" },
    { id: "3", name: "Netflix Premium Private", category: "Entertainment", price: "Rp120.000", status: "Stok Terbatas" },
    { id: "4", name: "NordVPN 1 Bulan", category: "VPN", price: "Rp15.000", status: "Aktif" },
    { id: "5", name: "Claude Pro Private", category: "AI Premium", price: "Rp85.000", status: "Promo" },
  ]

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors pb-20">
      {/* Top Header Showcase Navigation */}
      <header className="sticky top-0 z-40 bg-[var(--card)] border-b-4 border-[var(--border)] shadow-[0px_4px_10px_rgba(0,0,0,0.1)]">
        <PageContainer className="py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] flex items-center justify-center text-slate-950 font-black text-xl shrink-0">
              🎨
            </div>
            <div>
              <h1 className="font-black text-lg sm:text-xl text-[var(--foreground)] leading-tight">
                Beliakun.com UI Kit & Component Showcase
              </h1>
              <p className="text-xs text-[var(--muted-foreground)] font-extrabold">
                Modern Cartoon Commerce Component System (60+ Reusable Components)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="gap-2"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
            </Button>
          </div>
        </PageContainer>
      </header>

      {/* Main Container */}
      <PageContainer className="pt-8 space-y-8">
        {/* Banner Announcement */}
        <Alert variant="promotional">
          <AlertTitle className="text-slate-950">✨ Registry Komponen Resmi Beliakun.com</AlertTitle>
          <AlertDescription className="text-slate-900">
            Seluruh komponen berikut dirancang secara spesifik mengikuti karakter **Modern Cartoon Commerce** (border 2px tegas, hard offset shadow, warm light canvas `#FAF8F5`, deep navy dark canvas `#0B0F19`, touch target 44px+).
          </AlertDescription>
        </Alert>

        {/* Tab Navigation Menu */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="justify-start overflow-x-auto max-w-full">
            <TabsTrigger value="actions">Actions & Buttons</TabsTrigger>
            <TabsTrigger value="forms">Forms & Inputs</TabsTrigger>
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
            <TabsTrigger value="feedback">Feedback & Status</TabsTrigger>
            <TabsTrigger value="overlay">Overlays & Drawers</TabsTrigger>
            <TabsTrigger value="data">Data Display</TabsTrigger>
            <TabsTrigger value="messaging">Messaging & Chat</TabsTrigger>
            <TabsTrigger value="layout">Layout & Patterns</TabsTrigger>
          </TabsList>

          {/* Section 1: Actions & Buttons */}
          <TabsContent value="actions" className="space-y-6">
            <SectionHeading
              badge="ACTIONS"
              title="Button, Toggle & Action Controls"
              subtitle="Variasi tombol dengan hard offset shadow, state pressed, loading, dan touch target 44px."
            />

            <Card className="p-6 space-y-6">
              <div>
                <Typography variant="h4" className="mb-3">Button Variants</Typography>
                <div className="flex flex-wrap gap-3 items-center">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="cartoon">Cartoon Amber</Button>
                  <Button variant="accent">Accent Coral</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="soft">Soft Muted</Button>
                  <Button variant="link">Link Button</Button>
                </div>
              </div>

              <Separator />

              <div>
                <Typography variant="h4" className="mb-3">Button Sizes & Loading States</Typography>
                <div className="flex flex-wrap gap-3 items-center">
                  <Button size="xs">Size XS (32px)</Button>
                  <Button size="sm">Size SM (38px)</Button>
                  <Button size="default">Size Default (44px)</Button>
                  <Button size="lg">Size Large (48px)</Button>
                  <Button loading>Loading...</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>

              <Separator />

              <div>
                <Typography variant="h4" className="mb-3">Button Groups & Toggles</Typography>
                <div className="space-y-4">
                  <ButtonGroup>
                    <Button variant="primary">Opsi A</Button>
                    <Button variant="secondary">Opsi B</Button>
                    <Button variant="outline">Opsi C</Button>
                  </ButtonGroup>

                  <div className="flex flex-wrap gap-3 items-center">
                    <Toggle variant="default">Toggle Biasa</Toggle>
                    <Toggle variant="cartoon" defaultPressed>Toggle Cartoon</Toggle>
                    <ToggleGroup type="single" defaultValue="grid">
                      <ToggleGroupItem value="grid">Grid View</ToggleGroupItem>
                      <ToggleGroupItem value="list">List View</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Section 2: Forms & Inputs */}
          <TabsContent value="forms" className="space-y-6">
            <SectionHeading
              badge="FORMS"
              title="Input, Form Field & Controls"
              subtitle="Elemen form lengkap dengan floating icons, clear button, error state, dan OTP controller."
            />

            <Card className="p-6 space-y-6">
              <FormLayout title="Contoh Form Transaksi" description="Lengkapi data pengguna dengan field teruji.">
                <Field label="Alamat Email" required error="Format email belum valid!">
                  <Input leftIcon={<Terminal className="w-4 h-4" />} placeholder="budi@gmail.com" invalid />
                </Field>

                <Field label="Kata Sandi" required description="Minimal 8 karakter unik">
                  <Input type="password" placeholder="••••••••" />
                </Field>

                <Field label="Pilih Paket Akun (Combobox)">
                  <Combobox
                    options={[
                      { value: "1", label: "ChatGPT Plus 1 Bulan - Rp45.000" },
                      { value: "2", label: "Canva Pro Invite 1 Tahun - Rp25.000" },
                      { value: "3", label: "Netflix Premium Private - Rp120.000" },
                    ]}
                    placeholder="Cari atau pilih paket..."
                  />
                </Field>

                <Field label="Nomor WhatsApp (Input Group)">
                  <InputGroup prefix="+62">
                    <Input placeholder="81234567890" />
                  </InputGroup>
                </Field>

                <Field label="Tanggal Aktif (Date Picker)">
                  <DatePicker />
                </Field>

                <Field label="Catatan Tambahan (Textarea)">
                  <Textarea placeholder="Tuliskan catatan opsional..." showCount maxLength={200} value="Mohon proses secepatnya ya min!" onChange={() => {}} />
                </Field>

                <Field label="Verifikasi Kode OTP 6 Digit">
                  <InputOTP value={otpValue} onChange={setOtpValue} />
                </Field>

                <div className="space-y-3 pt-2">
                  <Checkbox label="Saya menyetujui syarat & ketentuan garansi Beliakun.com" defaultChecked />
                  <Switch label="Terima notifikasi promo via WhatsApp" defaultChecked />
                  <Slider label="Jumlah Stok Yang Dibeli" value={sliderVal} onChange={setSliderVal} />
                </div>
              </FormLayout>
            </Card>
          </TabsContent>

          {/* Section 3: Navigation */}
          <TabsContent value="navigation" className="space-y-6">
            <SectionHeading
              badge="NAVIGATION"
              title="Breadcrumb, Tabs & Sidebar"
              subtitle="Elemen navigasi terstruktur untuk membantu orientasi lokasi pengguna."
            />

            <Card className="p-6 space-y-6">
              <div>
                <Typography variant="h4" className="mb-3">Breadcrumb Navigation</Typography>
                <Breadcrumb
                  items={[
                    { label: "Katalog Akun", href: "#" },
                    { label: "AI Premium", href: "#" },
                    { label: "ChatGPT Plus 1 Bulan" },
                  ]}
                />
              </div>

              <Separator />

              <div>
                <Typography variant="h4" className="mb-3">Pagination Navigation</Typography>
                <Pagination currentPage={page} totalPages={8} onPageChange={setPage} />
              </div>

              <Separator />

              <div>
                <Typography variant="h4" className="mb-3">Sidebar Kompact & Expanded</Typography>
                <Sidebar
                  items={[
                    { id: "home", label: "Beranda Toko", badge: <Badge variant="new">Baru</Badge> },
                    { id: "orders", label: "Riwayat Pesanan", badge: <Badge variant="bestseller">3</Badge> },
                    { id: "settings", label: "Pengaturan Akun" },
                  ]}
                  activeId="home"
                />
              </div>
            </Card>
          </TabsContent>

          {/* Section 4: Feedback & Status */}
          <TabsContent value="feedback" className="space-y-6">
            <SectionHeading
              badge="FEEDBACK"
              title="Alert, Progress & Micro Indicators"
              subtitle="Pemberitahuan visual status pesanan, progress bar, dan marker indikator."
            />

            <Card className="p-6 space-y-4">
              <Alert variant="info">
                <AlertTitle>Informasi Sistem</AlertTitle>
                <AlertDescription>Pesanan kamu sedang diproses oleh sistem otomatis.</AlertDescription>
              </Alert>

              <Alert variant="success">
                <AlertTitle>Pembayaran Berhasil!</AlertTitle>
                <AlertDescription>Kredensial akun telah dikirimkan ke WhatsApp kamu.</AlertDescription>
              </Alert>

              <Alert variant="warning">
                <AlertTitle>Stok Terbatas</AlertTitle>
                <AlertDescription>Hanya tersisa 3 akun lagi untuk promo minggu ini.</AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <AlertTitle>Gagal Memproses</AlertTitle>
                <AlertDescription>Kode voucher yang kamu masukkan sudah kadaluarsa.</AlertDescription>
              </Alert>

              <Separator />

              <div className="space-y-4">
                <Typography variant="h4">Progress Bar & Spinners</Typography>
                <Progress value={progressVal} showLabel label="Progress Aktivasi Garansi" />
                <div className="flex items-center gap-4">
                  <Spinner size="sm" />
                  <Spinner size="default" />
                  <Spinner size="lg" />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Typography variant="h4">Badges & Markers</Typography>
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge variant="bestseller">TERLARIS</Badge>
                  <Badge variant="promo">DISCOUNT 30%</Badge>
                  <Badge variant="new">BARU</Badge>
                  <Badge variant="limited">STOK TERBATAS</Badge>
                  <Badge variant="success">TERVERIFIKASI</Badge>
                  <Marker variant="ping" color="success" />
                  <Marker variant="number" count={12} color="destructive" />
                  <Kbd>Ctrl + K</Kbd>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Section 5: Overlays & Drawers */}
          <TabsContent value="overlay" className="space-y-6">
            <SectionHeading
              badge="OVERLAY"
              title="Dialog, Sheet & Popovers"
              subtitle="Komponen modal, bottom drawer, dropdown menu, dan popover tooltip."
            />

            <Card className="p-6 space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" onClick={() => setDialogOpen(true)}>Buka Dialog Modal</Button>
                <Button variant="destructive" onClick={() => setAlertDialogOpen(true)}>Buka Alert Dialog</Button>
                <Button variant="cartoon" onClick={() => setSheetOpen(true)}>Buka Side Sheet</Button>
                <Button variant="secondary" onClick={() => setDrawerOpen(true)}>Buka Mobile Drawer</Button>
              </div>

              <Separator />

              <div className="flex flex-wrap gap-4 items-center">
                <DropdownMenu
                  trigger={<Button variant="outline">Buka Dropdown Menu</Button>}
                >
                  <DropdownMenuLabel>Akun Pelanggan</DropdownMenuLabel>
                  <DropdownMenuItem>Profil Saya</DropdownMenuItem>
                  <DropdownMenuItem>Riwayat Pesanan</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem destructive>Keluar Akun</DropdownMenuItem>
                </DropdownMenu>

                <Popover trigger={<Button variant="secondary">Buka Popover Info</Button>}>
                  <Typography variant="h4">Informasi Garansi</Typography>
                  <Typography variant="bodySmall" className="mt-1">
                    Garansi berlaku 30 hari penuh sejak tanggal pembelian.
                  </Typography>
                </Popover>

                <Tooltip content="Diskon 30% Spesial">
                  <Button variant="accent">Hover Tooltip</Button>
                </Tooltip>
              </div>
            </Card>

            {/* Modal Components Render */}
            <Dialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)}>
              <DialogHeader onClose={() => setDialogOpen(false)}>
                <DialogTitle>Detail Akun ChatGPT Plus</DialogTitle>
                <DialogDescription>Informasi kredensial dan panduan login aman.</DialogDescription>
              </DialogHeader>
              <DialogContent>
                <Typography variant="body">Email: user@beliakun.com</Typography>
                <Typography variant="body">Password: SuperSecret123!</Typography>
              </DialogContent>
              <DialogFooter>
                <Button variant="primary" onClick={() => setDialogOpen(false)}>Tutup</Button>
              </DialogFooter>
            </Dialog>

            <AlertDialog
              isOpen={alertDialogOpen}
              onClose={() => setAlertDialogOpen(false)}
              onConfirm={() => setAlertDialogOpen(false)}
              title="Hapus Dari Keranjang?"
              description="Item ChatGPT Plus akan dihapus dari daftar keranjang belanja kamu."
            />

            <Sheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)}>
              <SheetHeader onClose={() => setSheetOpen(false)}>
                <SheetTitle>Keranjang Belanja</SheetTitle>
              </SheetHeader>
              <SheetContent>
                <Typography variant="body">Daftar item keranjang kamu ada di sini.</Typography>
              </SheetContent>
              <SheetFooter>
                <Button variant="primary" className="w-full">Lanjut Pembayaran</Button>
              </SheetFooter>
            </Sheet>

            <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Pilihan Durasi Paket">
              <Typography variant="body">Drawer khusus mobile tampilan bawah.</Typography>
            </Drawer>
          </TabsContent>

          {/* Section 6: Data Display */}
          <TabsContent value="data" className="space-y-6">
            <SectionHeading
              badge="DATA DISPLAY"
              title="Card, Table & Data Display"
              subtitle="Tampilan data terstruktur, card interaktif, dan tabel dengan fitur sorting & search."
            />

            <Card className="p-6 space-y-6">
              <div className="space-y-3">
                <Typography variant="h4">Data Table Interactive</Typography>
                <DataTable
                  data={dummyTableData}
                  columns={[
                    { key: "name", header: "Nama Produk", sortable: true },
                    { key: "category", header: "Kategori" },
                    { key: "price", header: "Harga Paket", sortable: true },
                    {
                      key: "status",
                      header: "Status",
                      render: (item) => <Badge variant={item.status === "Aktif" ? "success" : "promo"}>{item.status}</Badge>,
                    },
                  ]}
                />
              </div>

              <Separator />

              <div>
                <Typography variant="h4" className="mb-3">Item Cards & Avatars</Typography>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Item
                    media={<Avatar fallback="CP" status="online" />}
                    title="ChatGPT Plus 1 Bulan"
                    description="Akun Private Garansi 30 Hari Full"
                    meta="Rp45.000"
                    action={<Button size="xs">Beli</Button>}
                  />
                  <Item
                    media={<Avatar fallback="CV" status="offline" />}
                    title="Canva Pro Invite 1 Tahun"
                    description="Undangan Tim Edu / Pro Resmi"
                    meta="Rp25.000"
                    action={<Button size="xs" variant="cartoon">Beli</Button>}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Section 7: Messaging & Chat */}
          <TabsContent value="messaging" className="space-y-6">
            <SectionHeading
              badge="MESSAGING"
              title="Chat Bubbles & Attachments"
              subtitle="Komponen percakapan customer service dan lampiran file bukti bayar."
            />

            <Card className="p-6 space-y-4">
              <MessageScroller maxHeight="300px">
                <Bubble sender="system" message="Pesanan #BLK-994821 dibuat oleh pelanggan" timestamp="14:20" />
                <Bubble sender="customer" message="Halo min, saya sudah transfer via QRIS ya!" timestamp="14:22" />
                <Bubble sender="support" message="Halo Kak Budi! Terima kasih. Pembayaran kamu sudah terverifikasi otomatis." timestamp="14:23" />
              </MessageScroller>

              <Separator />

              <div>
                <Typography variant="h4" className="mb-3">Attachment File</Typography>
                <Attachment fileName="Bukti_Transfer_QRIS_BLK994821.pdf" fileSize="450 KB" onDownload={() => {}} onRemove={() => {}} />
              </div>
            </Card>
          </TabsContent>

          {/* Section 8: Layout & Patterns */}
          <TabsContent value="layout" className="space-y-6">
            <SectionHeading
              badge="LAYOUT"
              title="Responsive Grid & Charts"
              subtitle="Visualisasi grafik performa dan pola grid adaptive."
            />

            <Card className="p-6 space-y-6">
              <Chart
                title="Penjualan Produk Minggu Ini"
                subtitle="Total transaksi berhasil terverifikasi otomatis"
                data={[
                  { label: "Sen", value: 45 },
                  { label: "Sel", value: 70 },
                  { label: "Rab", value: 95 },
                  { label: "Kam", value: 60 },
                  { label: "Jum", value: 120 },
                  { label: "Sab", value: 150 },
                  { label: "Min", value: 180 },
                ]}
              />

              <Separator />

              <div>
                <Typography variant="h4" className="mb-3">Empty State Reusable</Typography>
                <Empty variant="cart" onAction={() => {}} />
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </div>
  )
}
