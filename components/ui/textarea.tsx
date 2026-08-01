import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
  showCount?: boolean
  maxLength?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, showCount, maxLength, value, onChange, disabled, ...props }, ref) => {
    const currentLength = typeof value === "string" ? value.length : 0

    return (
      <div className="w-full relative">
        <textarea
          className={cn(
            "flex min-h-[100px] w-full rounded-xl border-2 border-[var(--border)] bg-[var(--input)] px-3.5 py-3 text-xs sm:text-sm font-semibold text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] transition-[border-color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 resize-y",
            invalid && "border-rose-500 ring-rose-500",
            className
          )}
          ref={ref}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          disabled={disabled}
          {...props}
        />

        {showCount && maxLength && (
          <div className="text-[10px] font-bold text-[var(--muted-foreground)] text-right mt-1">
            {currentLength}/{maxLength}
          </div>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
