import * as React from "react"
import { cn } from "@/lib/utils"

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
  label?: React.ReactNode
  variant?: "muted" | "strong"
}

function Separator({
  className,
  orientation = "horizontal",
  label,
  variant = "muted",
  ...props
}: SeparatorProps) {
  if (label && orientation === "horizontal") {
    return (
      <div className={cn("flex items-center gap-3 my-3 w-full", className)} {...props}>
        <div className={cn("flex-1 h-px", variant === "strong" ? "bg-[var(--border)]" : "bg-[var(--border)]/30")} />
        <span className="text-[10px] sm:text-[11px] font-extrabold text-[var(--muted-foreground)] uppercase tracking-wider">
          {label}
        </span>
        <div className={cn("flex-1 h-px", variant === "strong" ? "bg-[var(--border)]" : "bg-[var(--border)]/30")} />
      </div>
    )
  }

  return (
    <div
      role="separator"
      className={cn(
        variant === "strong" ? "bg-[var(--border)]" : "bg-[var(--border)]/30",
        orientation === "horizontal" ? "h-px w-full my-3" : "w-px h-full mx-3 inline-block self-stretch",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
