import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SidebarItem {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: React.ReactNode
}

export interface SidebarProps {
  items: SidebarItem[]
  activeId?: string
  onSelect?: (id: string) => void
  collapsed?: boolean
  onToggleCollapse?: () => void
  header?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function Sidebar({
  items,
  activeId,
  onSelect,
  collapsed = false,
  onToggleCollapse,
  header,
  footer,
  className,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "cartoon-card bg-[var(--card)] border-[var(--border)] flex flex-col justify-between transition-[width] duration-200 p-3",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border)]/20">
          {!collapsed && header && <div className="min-w-0 flex-1">{header}</div>}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1.5 rounded-xl bg-[var(--muted)] hover:bg-[var(--muted)]/80 touch-target min-h-[36px] min-w-[36px] flex items-center justify-center shrink-0 ml-auto"
              title={collapsed ? "Buka Sidebar" : "Tutup Sidebar"}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        <nav className="space-y-1.5">
          {items.map((item) => {
            const isActive = activeId === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect?.(item.id)}
                className={cn(
                  "w-full text-left p-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2.5 cursor-pointer min-h-[44px] touch-target",
                  isActive
                    ? "bg-blue-600 text-white border-2 border-[var(--border)] shadow-[2px_2px_0px_0px_var(--cartoon-shadow)]"
                    : "text-[var(--foreground)] hover:bg-[var(--muted)] border-2 border-transparent"
                )}
                title={collapsed ? item.label : undefined}
              >
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                {!collapsed && <span className="truncate flex-1">{item.label}</span>}
                {!collapsed && item.badge && <span className="shrink-0">{item.badge}</span>}
              </button>
            )
          })}
        </nav>
      </div>

      {!collapsed && footer && <div className="pt-3 border-t border-[var(--border)]/20">{footer}</div>}
    </aside>
  )
}
