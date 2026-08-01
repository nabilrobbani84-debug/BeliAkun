import * as React from "react"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  showHome?: boolean
}

export function Breadcrumb({ items, className, showHome = true }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-xs font-bold text-[var(--muted-foreground)] overflow-x-auto scrollbar-none py-1", className)}>
      <ol className="flex items-center gap-1.5 whitespace-nowrap">
        {showHome && (
          <li className="flex items-center gap-1.5">
            <a
              href="/"
              className="flex items-center gap-1 text-[var(--foreground)] hover:text-blue-600 transition-colors p-1 rounded-md touch-target min-h-[36px]"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Beranda</span>
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--muted-foreground)] shrink-0" />
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className="flex items-center gap-1.5">
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="font-extrabold text-[var(--foreground)] truncate max-w-[140px] sm:max-w-[200px]"
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="hover:text-blue-600 transition-colors truncate max-w-[120px] sm:max-w-[180px] p-1 rounded-md touch-target min-h-[36px]"
                >
                  {item.label}
                </a>
              )}

              {!isLast && <ChevronRight className="w-3.5 h-3.5 text-[var(--muted-foreground)] shrink-0" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
