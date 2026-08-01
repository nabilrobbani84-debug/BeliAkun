import * as React from "react"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DatePickerProps {
  value?: string
  onChange?: (date: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pilih tanggal...",
  disabled = false,
  className,
}: DatePickerProps) {
  const [dateValue, setDateValue] = React.useState(value || "")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setDateValue(val)
    onChange?.(val)
  }

  const handleClear = () => {
    setDateValue("")
    onChange?.("")
  }

  return (
    <div className="relative w-full">
      <input
        type="date"
        value={value !== undefined ? value : dateValue}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          "w-full rounded-xl border-2 border-[var(--border)] bg-[var(--input)] pl-10 pr-9 py-2.5 text-xs sm:text-sm font-extrabold text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] cursor-pointer touch-target",
          className
        )}
      />
      <CalendarIcon className="w-4 h-4 text-[var(--muted-foreground)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
      {dateValue && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] touch-target min-h-[32px] min-w-[32px]"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
