import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  variant?: "default" | "success" | "warning" | "destructive"
  showLabel?: boolean
  label?: string
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, variant = "default", showLabel = false, label, ...props }, ref) => {
    const percentage = Math.min(Math.max(0, Math.round((value / max) * 100)), 100)

    const fillVariants = {
      default: "bg-blue-600",
      success: "bg-emerald-500",
      warning: "bg-amber-400",
      destructive: "bg-rose-500",
    }

    return (
      <div className="w-full space-y-1">
        {(showLabel || label) && (
          <div className="flex justify-between items-center text-xs font-extrabold text-[var(--foreground)]">
            <span>{label || "Kemajuan"}</span>
            <span className="font-mono">{percentage}%</span>
          </div>
        )}

        <div
          ref={ref}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={value}
          className={cn(
            "relative h-3.5 w-full overflow-hidden rounded-full border-2 border-[var(--border)] bg-[var(--muted)] shadow-[1px_1px_0px_0px_var(--cartoon-shadow)]",
            className
          )}
          {...props}
        >
          <div
            className={cn("h-full transition-[width] duration-300 rounded-full", fillVariants[variant])}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
