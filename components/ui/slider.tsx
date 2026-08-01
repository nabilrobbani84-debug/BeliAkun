import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
  disabled?: boolean
  className?: string
  label?: string
  showValue?: boolean
}

export function Slider({
  value,
  defaultValue = 50,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  className,
  label,
  showValue = true,
}: SliderProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const currentValue = value !== undefined ? value : internalValue

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    if (value === undefined) {
      setInternalValue(val)
    }
    onChange?.(val)
  }

  const percentage = Math.round(((currentValue - min) / (max - min)) * 100)

  return (
    <div className={cn("w-full space-y-2", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-xs font-extrabold text-[var(--foreground)]">
          {label && <span>{label}</span>}
          {showValue && (
            <span className="font-mono bg-[var(--muted)] px-2 py-0.5 rounded-md border border-[var(--border)]">
              {currentValue}
            </span>
          )}
        </div>
      )}

      <div className="relative flex items-center w-full min-h-[44px]">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={handleChange}
          disabled={disabled}
          className="w-full h-3 bg-[var(--muted)] rounded-full border-2 border-[var(--border)] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 accent-blue-600 shadow-[1px_1px_0px_0px_var(--cartoon-shadow)]"
          style={{
            background: `linear-gradient(to right, #2563eb ${percentage}%, var(--muted) ${percentage}%)`,
          }}
        />
      </div>
    </div>
  )
}
