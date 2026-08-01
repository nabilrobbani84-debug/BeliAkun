import * as React from "react"
import { cn } from "@/lib/utils"

export interface RadioGroupProps {
  name: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  children: React.ReactNode
  className?: string
  variant?: "default" | "cards"
}

const RadioGroupContext = React.createContext<{
  name: string
  selectedValue?: string
  onChange?: (value: string) => void
  variant?: "default" | "cards"
}>({ name: "" })

export function RadioGroup({
  name,
  value,
  defaultValue,
  onChange,
  children,
  className,
  variant = "default",
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "")
  const selectedValue = value !== undefined ? value : internalValue

  const handleChange = (val: string) => {
    if (value === undefined) {
      setInternalValue(val)
    }
    onChange?.(val)
  }

  return (
    <RadioGroupContext.Provider
      value={{ name, selectedValue, onChange: handleChange, variant }}
    >
      <div className={cn("space-y-2", variant === "cards" && "grid grid-cols-1 sm:grid-cols-2 gap-2.5 space-y-0", className)}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

export interface RadioItemProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  label?: React.ReactNode
  description?: React.ReactNode
  badge?: React.ReactNode
  icon?: React.ReactNode
}

export const RadioItem = React.forwardRef<HTMLInputElement, RadioItemProps>(
  ({ className, value, label, description, badge, icon, disabled, id, ...props }, ref) => {
    const { name, selectedValue, onChange, variant } = React.useContext(RadioGroupContext)
    const generatedId = React.useId()
    const itemId = id || generatedId
    const isSelected = selectedValue === value

    if (variant === "cards") {
      return (
        <div
          onClick={() => !disabled && onChange?.(value)}
          className={cn(
            "cursor-pointer cartoon-card p-3.5 border-2 transition-[border-color,box-shadow] duration-100 relative",
            isSelected
              ? "bg-blue-50 dark:bg-blue-950/60 border-blue-600 ring-2 ring-blue-600 shadow-[3px_3px_0px_0px_#2563EB]"
              : "bg-[var(--card)] border-[var(--border)] hover:bg-[var(--muted)]",
            disabled && "opacity-50 cursor-not-allowed pointer-events-none",
            className
          )}
        >
          {badge && (
            <span className="absolute -top-2.5 right-3 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-slate-900 shadow-[1px_1px_0px_0px_#000]">
              {badge}
            </span>
          )}

          <div className="flex items-start gap-3">
            <div className="relative flex items-center justify-center mt-0.5 shrink-0">
              <input
                type="radio"
                id={itemId}
                name={name}
                value={value}
                checked={isSelected}
                disabled={disabled}
                onChange={() => onChange?.(value)}
                ref={ref}
                className="sr-only"
                {...props}
              />
              <div className="w-5 h-5 rounded-full border-2 border-[var(--border)] bg-[var(--card)] shadow-[1px_1px_0px_0px_var(--cartoon-shadow)] flex items-center justify-center">
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
              </div>
            </div>

            {icon && <div className="shrink-0 text-blue-600">{icon}</div>}

            <div className="min-w-0 flex-1">
              {label && <span className="font-extrabold text-xs sm:text-sm block text-[var(--foreground)]">{label}</span>}
              {description && (
                <span className="text-[11px] text-[var(--muted-foreground)] block font-medium mt-0.5 leading-snug">
                  {description}
                </span>
              )}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className={cn("flex items-start gap-2.5", className)}>
        <div className="relative flex items-center justify-center mt-0.5 shrink-0">
          <input
            type="radio"
            id={itemId}
            name={name}
            value={value}
            checked={isSelected}
            disabled={disabled}
            onChange={() => onChange?.(value)}
            ref={ref}
            className="sr-only peer"
            {...props}
          />
          <div className="w-5 h-5 rounded-full border-2 border-[var(--border)] bg-[var(--card)] shadow-[1px_1px_0px_0px_var(--cartoon-shadow)] flex items-center justify-center peer-checked:border-blue-600 peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--ring)] touch-target cursor-pointer">
            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
          </div>
        </div>

        {(label || description) && (
          <label
            htmlFor={itemId}
            className={cn(
              "cursor-pointer select-none text-xs font-semibold text-[var(--foreground)] leading-snug",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {label && <span className="font-extrabold block">{label}</span>}
            {description && (
              <span className="text-[11px] text-[var(--muted-foreground)] block font-medium mt-0.5">
                {description}
              </span>
            )}
          </label>
        )}
      </div>
    )
  }
)
RadioItem.displayName = "RadioItem"
