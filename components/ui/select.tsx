import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
  className?: string
}

export function Select({
  options,
  value,
  defaultValue = "",
  onChange,
  placeholder = "Pilih opsi...",
  disabled = false,
  invalid = false,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const selectedValue = value !== undefined ? value : internalValue
  const selectRef = React.useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === selectedValue)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (val: string) => {
    if (disabled) return
    if (value === undefined) {
      setInternalValue(val)
    }
    onChange?.(val)
    setIsOpen(false)
  }

  return (
    <div className="relative w-full text-left" ref={selectRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full rounded-xl border-2 border-[var(--border)] bg-[var(--input)] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[var(--foreground)] flex items-center justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] cursor-pointer touch-target",
          invalid && "border-rose-500 ring-rose-500",
          className
        )}
      >
        <span className={cn("truncate", !selectedOption && "text-[var(--muted-foreground)]")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-[var(--muted-foreground)] shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full max-h-60 overflow-y-auto rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] p-1.5 shadow-[4px_4px_0px_0px_var(--cartoon-shadow)] animate-in fade-in-0 zoom-in-95">
          {options.map((opt) => {
            const isSelected = opt.value === selectedValue
            return (
              <button
                key={opt.value}
                type="button"
                disabled={opt.disabled}
                onClick={() => handleSelect(opt.value)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-between gap-2 transition-colors cursor-pointer min-h-[40px] touch-target",
                  isSelected
                    ? "bg-blue-600 text-white border border-[var(--border)] shadow-[1px_1px_0px_0px_var(--cartoon-shadow)]"
                    : "text-[var(--foreground)] hover:bg-[var(--muted)]",
                  opt.disabled && "opacity-50 pointer-events-none cursor-not-allowed"
                )}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="w-4 h-4 shrink-0 text-white" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
