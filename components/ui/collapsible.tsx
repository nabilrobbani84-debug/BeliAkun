import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CollapsibleProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function Collapsible({
  open,
  defaultOpen = false,
  onOpenChange,
  trigger,
  children,
  className,
}: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const isOpen = open !== undefined ? open : internalOpen

  const toggle = () => {
    const next = !isOpen
    if (open === undefined) {
      setInternalOpen(next)
    }
    onOpenChange?.(next)
  }

  return (
    <div className={cn("w-full border-2 border-[var(--border)] rounded-2xl bg-[var(--card)] p-3 sm:p-4 shadow-[2px_2px_0px_0px_var(--cartoon-shadow)]", className)}>
      <button
        type="button"
        onClick={toggle}
        className="w-full text-left flex items-center justify-between gap-3 font-extrabold text-xs sm:text-sm text-[var(--foreground)] min-h-[44px] cursor-pointer"
      >
        <div className="flex-1">{trigger}</div>
        <div
          className={cn(
            "p-1.5 rounded-xl border border-[var(--border)] transition-transform shrink-0",
            isOpen ? "bg-amber-400 text-slate-950 rotate-180" : "bg-[var(--muted)] text-[var(--foreground)]"
          )}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {isOpen && (
        <div className="pt-3 mt-2 border-t border-[var(--border)]/20 text-xs sm:text-sm font-medium leading-relaxed animate-in fade-in-0 duration-200">
          {children}
        </div>
      )}
    </div>
  )
}
