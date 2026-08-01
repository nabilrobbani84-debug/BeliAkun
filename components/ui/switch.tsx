import * as React from "react"
import { cn } from "@/lib/utils"

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: React.ReactNode
  description?: React.ReactNode
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked, defaultChecked = false, onCheckedChange, disabled, label, description, id, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked)
    const isChecked = checked !== undefined ? checked : internalChecked
    const generatedId = React.useId()
    const switchId = id || generatedId

    const toggle = () => {
      if (disabled) return
      const next = !isChecked
      if (checked === undefined) {
        setInternalChecked(next)
      }
      onCheckedChange?.(next)
    }

    return (
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={isChecked}
          id={switchId}
          ref={ref}
          disabled={disabled}
          onClick={toggle}
          className={cn(
            "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-[var(--border)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-[1.5px_1.5px_0px_0px_var(--cartoon-shadow)] touch-target min-h-[44px] min-w-[48px] items-center px-0.5",
            isChecked ? "bg-blue-600" : "bg-[var(--muted)]",
            className
          )}
          {...props}
        >
          <span
            className={cn(
              "pointer-events-none block h-5.5 w-5.5 rounded-full bg-white border border-slate-900 shadow-[1px_1px_0px_0px_#000] transition-transform",
              isChecked ? "translate-x-5" : "translate-x-0.5"
            )}
          />
        </button>

        {(label || description) && (
          <label
            htmlFor={switchId}
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
Switch.displayName = "Switch"

export { Switch }
