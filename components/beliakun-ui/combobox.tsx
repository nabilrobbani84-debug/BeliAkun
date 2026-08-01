import * as React from "react"
import { Search, Check, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ComboboxOption {
  value: string
  label: string
  category?: string
}

export interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onChange?: (val: string) => void
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  className?: string
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Pilih item...",
  searchPlaceholder = "Cari item...",
  disabled = false,
  className,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [selectedValue, setSelectedValue] = React.useState(value || "")
  const comboRef = React.useRef<HTMLDivElement>(null)

  const selectedOpt = options.find((o) => o.value === (value !== undefined ? value : selectedValue))

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (comboRef.current && !comboRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filtered = options.filter(
    (o) =>
      o.label.toLowerCase().includes(query.toLowerCase()) ||
      o.category?.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = (val: string) => {
    if (disabled) return
    if (value === undefined) setSelectedValue(val)
    onChange?.(val)
    setIsOpen(false)
    setQuery("")
  }

  return (
    <div className="relative w-full text-left" ref={comboRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full rounded-xl border-2 border-[var(--border)] bg-[var(--input)] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[var(--foreground)] flex items-center justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] cursor-pointer touch-target",
          className
        )}
      >
        <span className={cn("truncate", !selectedOpt && "text-[var(--muted-foreground)]")}>
          {selectedOpt ? selectedOpt.label : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-[var(--muted-foreground)] shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] p-2 shadow-[4px_4px_0px_0px_var(--cartoon-shadow)] animate-in fade-in-0 zoom-in-95">
          <div className="p-2 border-b border-[var(--border)]/20 flex items-center gap-2 mb-1">
            <Search className="w-3.5 h-3.5 text-[var(--muted-foreground)] shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-xs font-bold text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none min-h-[32px]"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="p-1 text-[var(--muted-foreground)]">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="max-h-52 overflow-y-auto space-y-1">
            {filtered.length === 0 ? (
              <div className="text-center py-4 text-xs font-bold text-[var(--muted-foreground)]">
                Tidak ada opsi ditemukan
              </div>
            ) : (
              filtered.map((opt) => {
                const isSelected = opt.value === (value !== undefined ? value : selectedValue)
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-between gap-2 transition-colors cursor-pointer min-h-[40px] touch-target",
                      isSelected
                        ? "bg-blue-600 text-white border border-[var(--border)] shadow-[1px_1px_0px_0px_var(--cartoon-shadow)]"
                        : "text-[var(--foreground)] hover:bg-[var(--muted)]"
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
