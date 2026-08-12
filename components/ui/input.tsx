import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, X } from "lucide-react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onClear?: () => void
  invalid?: boolean
  inputSize?: "sm" | "default" | "lg"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightIcon, onClear, invalid, inputSize = "default", disabled, value, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const isPassword = type === "password"
    const currentType = isPassword ? (showPassword ? "text" : "password") : type

    const sizeClasses = {
      sm: "h-9 px-3 text-xs min-h-[36px]",
      default: "h-11 px-3.5 text-xs sm:text-sm min-h-[44px]",
      lg: "h-13 px-4 text-sm sm:text-base min-h-[48px]",
    }

    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3.5 text-[var(--muted-foreground)] pointer-events-none shrink-0">
            {leftIcon}
          </div>
        )}

        <input
          type={currentType}
          className={cn(
            "flex w-full rounded-xl border-2 border-[var(--border)] bg-[var(--input)] text-[var(--foreground)] font-semibold placeholder:text-[var(--muted-foreground)] transition-[border-color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
            sizeClasses[inputSize],
            leftIcon && "pl-10",
            (rightIcon || isPassword || onClear) && "pr-10",
            invalid && "border-rose-500 ring-rose-500",
            className
          )}
          ref={ref}
          disabled={disabled}
          value={value}
          onChange={onChange}
          {...props}
        />

        {onClear && value && !disabled && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 p-1 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] touch-target min-h-[32px] min-w-[32px]"
            aria-label="Hapus teks"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {isPassword && !onClear && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 p-1 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] touch-target min-h-[32px] min-w-[32px]"
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}

        {rightIcon && !isPassword && !onClear && (
          <div className="absolute right-3.5 text-[var(--muted-foreground)] pointer-events-none shrink-0">
            {rightIcon}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
