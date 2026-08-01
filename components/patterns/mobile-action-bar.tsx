import * as React from "react"
import { cn } from "@/lib/utils"

export interface MobileActionBarProps {
  children: React.ReactNode
  className?: string
}

export function MobileActionBar({ children, className }: MobileActionBarProps) {
  return (
    <div
      className={cn(
        "fixed bottom-0 inset-x-0 z-40 bg-[var(--card)] border-t-2 border-[var(--border)] p-3 sm:hidden shadow-[0px_-4px_10px_rgba(0,0,0,0.1)] flex items-center justify-between gap-3 pb-safe",
        className
      )}
    >
      {children}
    </div>
  )
}
