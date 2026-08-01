import * as React from "react"
import { cn } from "@/lib/utils"

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  invalid?: boolean
  disabled?: boolean
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, invalid, disabled, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "block text-xs font-extrabold text-[var(--foreground)] leading-none select-none",
        disabled && "opacity-50 cursor-not-allowed",
        invalid && "text-rose-500",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
    </label>
  )
)
Label.displayName = "Label"

export { Label }
