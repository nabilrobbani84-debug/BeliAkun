import * as React from "react"
import { cn } from "@/lib/utils"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "avatar" | "card" | "product" | "button" | "circle"
}

function Skeleton({ className, variant = "text", ...props }: SkeletonProps) {
  const variantClasses = {
    text: "h-4 w-full rounded-lg",
    avatar: "h-11 w-11 rounded-2xl shrink-0",
    card: "h-36 w-full rounded-2xl",
    product: "h-64 w-full rounded-2xl",
    button: "h-11 w-28 rounded-xl",
    circle: "h-10 w-10 rounded-full shrink-0",
  }

  return (
    <div
      className={cn(
        "animate-pulse bg-[var(--muted)] border border-[var(--border)]/30 opacity-70",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
