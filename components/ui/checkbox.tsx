import * as React from "react"
import { cn } from "@/lib/utils"
import { Check, Minus } from "lucide-react"

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  indeterminate?: boolean
  invalid?: boolean
  label?: React.ReactNode
  description?: React.ReactNode
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, indeterminate, invalid, disabled, checked, label, description, id, onChange, ...props }, ref) => {
    const generatedId = React.useId()
    const checkboxId = id || generatedId

    return (
      <div className="flex items-start gap-2.5">
        <div className="relative flex items-center justify-center mt-0.5 shrink-0">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              "w-5 h-5 rounded-lg border-2 border-[var(--border)] bg-[var(--card)] shadow-[1.5px_1.5px_0px_0px_var(--cartoon-shadow)] flex items-center justify-center text-slate-950 font-black cursor-pointer peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-[var(--border)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--ring)] peer-disabled:opacity-50 peer-disabled:cursor-not-allowed touch-target",
              invalid && "border-rose-500",
              className
            )}
          >
            {checked && !indeterminate && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            {indeterminate && <Minus className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        </div>

        {(label || description) && (
          <label
            htmlFor={checkboxId}
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
Checkbox.displayName = "Checkbox"

export { Checkbox }
