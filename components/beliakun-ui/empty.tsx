import * as React from "react"
import { Search, ShoppingBag, PackageX, FilterX, AlertTriangle, Inbox } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface EmptyProps {
  variant?: "search" | "cart" | "order" | "product" | "filter" | "error" | "generic"
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
  className?: string
  icon?: React.ReactNode
}

export function Empty({
  variant = "generic",
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
  icon,
}: EmptyProps) {
  const defaults = {
    search: {
      title: "Hasil Tidak Ditemukan",
      description: "Coba gunakan kata kunci lain seperti ChatGPT, Canva, Netflix, atau Spotify.",
      icon: <Search className="w-8 h-8 text-amber-950" />,
      bg: "bg-amber-300",
    },
    cart: {
      title: "Keranjang Belanja Masih Kosong",
      description: "Yuk pilih akun digital favoritmu dengan harga hemat dan proses serba cepat!",
      icon: <ShoppingBag className="w-8 h-8 text-blue-950" />,
      bg: "bg-blue-300",
    },
    order: {
      title: "Belum Ada Pesanan",
      description: "Kamu belum pernah melakukan pemesanan. Mulai belanja akun digital pertamamu sekarang!",
      icon: <PackageX className="w-8 h-8 text-emerald-950" />,
      bg: "bg-emerald-300",
    },
    product: {
      title: "Produk Belum Tersedia",
      description: "Kategori atau filter ini belum memiliki produk saat ini. Silakan periksa kembali nanti.",
      icon: <Inbox className="w-8 h-8 text-purple-950" />,
      bg: "bg-purple-300",
    },
    filter: {
      title: "Filter Tidak Cocok",
      description: "Tidak ada produk yang cocok dengan kombinasi filter saat ini. Coba atur ulang filter.",
      icon: <FilterX className="w-8 h-8 text-rose-950" />,
      bg: "bg-rose-300",
    },
    error: {
      title: "Terjadi Kesalahan Data",
      description: "Gagal memuat informasi. Silakan muat ulang halaman atau hubungi customer service kami.",
      icon: <AlertTriangle className="w-8 h-8 text-rose-950" />,
      bg: "bg-rose-400",
    },
    generic: {
      title: "Tidak Ada Data",
      description: "Belum ada informasi yang ditampilkan pada bagian ini.",
      icon: <Inbox className="w-8 h-8 text-slate-950" />,
      bg: "bg-amber-300",
    },
  }

  const currentConfig = defaults[variant]
  const displayTitle = title || currentConfig.title
  const displayDesc = description || currentConfig.description
  const displayIcon = icon || currentConfig.icon

  return (
    <div className={cn("cartoon-card p-6 sm:p-10 bg-[var(--card)] border-[var(--border)] text-center flex flex-col items-center justify-center max-w-md mx-auto my-4", className)}>
      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl ${currentConfig.bg} border-3 border-slate-900 shadow-[4px_4px_0px_0px_#000] flex items-center justify-center mb-4 shrink-0`}>
        {displayIcon}
      </div>

      <h3 className="font-extrabold text-base sm:text-lg text-[var(--foreground)] mb-1 leading-snug">
        {displayTitle}
      </h3>
      <p className="text-xs sm:text-sm text-[var(--muted-foreground)] font-semibold leading-relaxed mb-5 max-w-xs">
        {displayDesc}
      </p>

      {(onAction || onSecondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-2.5 w-full">
          {onAction && (
            <Button variant="primary" onClick={onAction} className="w-full sm:w-auto">
              {actionLabel || "Kembali Belanja"}
            </Button>
          )}
          {onSecondaryAction && (
            <Button variant="secondary" onClick={onSecondaryAction} className="w-full sm:w-auto">
              {secondaryActionLabel || "Bantuan CS"}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
