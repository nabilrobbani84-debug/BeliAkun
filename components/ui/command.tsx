import * as React from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CommandProps {
  placeholder?: string
  value?: string
  onValueChange?: (val: string) => void
  children: React.ReactNode
  className?: string
}

export function Command({
  placeholder = "Ketik perintah atau cari...",
  value,
  onValueChange,
  children,
  className,
}: CommandProps) {
  const [internalQuery, setInternalQuery] = React.useState("")
  const query = value !== undefined ? value : internalQuery

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (value === undefined) {
      setInternalQuery(val)
    }
    onValueChange?.(val)
  }

  return (
    <div className={cn("w-full cartoon-card bg-[var(--card)] border-[var(--border)] overflow-hidden flex flex-col", className)}>
      <div className="p-3 bg-[var(--card)] border-b-2 border-[var(--border)] flex items-center gap-2.5">
        <Search className="w-4 h-4 text-[var(--muted-foreground)] shrink-0" />
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-xs sm:text-sm font-bold text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none min-h-[36px]"
        />
        {query && (
          <button
            type="button"
            onClick={() => onValueChange?.("") || setInternalQuery("")}
            className="p-1 rounded-lg bg-[var(--muted)] text-[var(--foreground)] touch-target min-h-[32px] min-w-[32px]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="p-2 space-y-1 max-h-60 overflow-y-auto">{children}</div>
    </div>
  )
}

export function CommandGroup({ heading, children }: { heading?: string; children: React.ReactNode }) {
  return (
    <div className="py-1">
      {heading && <div className="px-2 py-1 text-[10px] font-extrabold uppercase text-[var(--muted-foreground)] tracking-wider">{heading}</div>}
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}

export function CommandItem({
  children,
  onSelect,
  active = false,
  icon,
}: {
  children: React.ReactNode
  onSelect?: () => void
  active?: boolean
  icon?: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-colors cursor-pointer min-h-[40px] touch-target",
        active
          ? "bg-blue-600 text-white border border-[var(--border)] shadow-[1px_1px_0px_0px_var(--cartoon-shadow)]"
          : "text-[var(--foreground)] hover:bg-[var(--muted)]"
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
    </button>
  )
}
