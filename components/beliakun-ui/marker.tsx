import * as React from "react"
import { cn } from "@/lib/utils"

export interface MarkerProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "dot" | "ping" | "number" | "status" | "notification" | "online" | "sale"
  color?: "neutral" | "info" | "success" | "warning" | "destructive"
  count?: number
}

export function Marker({
  variant = "dot",
  color = "info",
  count,
  className,
  children,
  ...props
}: MarkerProps) {
  const colorClasses = {
    neutral: "bg-slate-400 text-slate-950",
    info: "bg-blue-400 text-slate-950",
    success: "bg-emerald-400 text-slate-950",
    warning: "bg-amber-400 text-slate-950",
    destructive: "bg-rose-500 text-white",
  }

  if (variant === "ping") {
    return (
      <span className="relative flex h-3 w-3">
        <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", colorClasses[color])} />
        <span className={cn("relative inline-flex rounded-full h-3 w-3 border border-slate-900", colorClasses[color])} />
      </span>
    )
  }

  if (variant === "notification" || variant === "number") {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center font-extrabold text-[10px] px-1.5 min-w-[20px] h-5 rounded-full border border-slate-900 shadow-[1px_1px_0px_0px_#000]",
          colorClasses[color],
          className
        )}
        {...props}
      >
        {count !== undefined ? (count > 99 ? "99+" : count) : children}
      </span>
    )
  }

  return (
    <span
      className={cn(
        "inline-block w-2.5 h-2.5 rounded-full border border-slate-900 shadow-[0.5px_0.5px_0px_0px_#000]",
        colorClasses[color],
        className
      )}
      {...props}
    />
  )
}
