import * as React from "react"
import { cn } from "@/lib/utils"

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "default" | "lg"
  variant?: "primary" | "muted" | "inverse" | "current"
  label?: string
}

export function Spinner({
  size = "default",
  variant = "primary",
  label = "Memuat...",
  className,
  ...props
}: SpinnerProps) {
  const sizeClasses = {
    xs: "w-3.5 h-3.5 border-2",
    sm: "w-4 h-4 border-2",
    default: "w-6 h-6 border-3",
    lg: "w-8 h-8 border-4",
  }

  const variantClasses = {
    primary: "border-blue-600 border-t-transparent",
    muted: "border-[var(--muted-foreground)] border-t-transparent",
    inverse: "border-white border-t-transparent",
    current: "border-current border-t-transparent",
  }

  return (
    <div role="status" aria-label={label} className="inline-flex items-center gap-2" {...props}>
      <div
        className={cn(
          "animate-spin rounded-full shrink-0",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
      />
      {label && <span className="sr-only">{label}</span>}
    </div>
  )
}
