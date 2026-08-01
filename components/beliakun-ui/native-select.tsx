import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface NativeSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface NativeSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: NativeSelectOption[]
  invalid?: boolean
}

export const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, options, invalid, disabled, value, onChange, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            "w-full appearance-none rounded-xl border-2 border-[var(--border)] bg-[var(--input)] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[var(--foreground)] pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] cursor-pointer touch-target",
            invalid && "border-rose-500 ring-rose-500",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-[var(--muted-foreground)] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
      </div>
    )
  }
)
NativeSelect.displayName = "NativeSelect"
