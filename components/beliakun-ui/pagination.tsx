import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const getPages = () => {
    const pages: (number | "ellipsis")[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push("ellipsis")
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (currentPage < totalPages - 2) pages.push("ellipsis")
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-center gap-1.5", className)}>
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="cartoon-button-secondary touch-target p-2 text-xs flex items-center justify-center min-h-[38px] min-w-[38px] disabled:opacity-40"
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {getPages().map((item, idx) => {
        if (item === "ellipsis") {
          return (
            <span key={idx} className="px-2 text-[var(--muted-foreground)]">
              <MoreHorizontal className="w-4 h-4" />
            </span>
          )
        }
        const isActive = item === currentPage
        return (
          <button
            key={idx}
            type="button"
            onClick={() => onPageChange(item)}
            className={cn(
              "px-3 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm border-2 transition-[background-color,border-color,transform] duration-100 min-h-[38px] min-w-[38px] touch-target",
              isActive
                ? "bg-blue-600 text-white border-[var(--border)] shadow-[1.5px_1.5px_0px_0px_var(--cartoon-shadow)]"
                : "bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--muted)]"
            )}
          >
            {item}
          </button>
        )
      })}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="cartoon-button-secondary touch-target p-2 text-xs flex items-center justify-center min-h-[38px] min-w-[38px] disabled:opacity-40"
        aria-label="Halaman berikutnya"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  )
}
