import * as React from "react"
import { cn } from "@/lib/utils"

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

export function Kbd({ children, className, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center font-mono text-[10px] sm:text-xs font-black bg-[var(--muted)] text-[var(--foreground)] border-2 border-[var(--border)] px-1.5 py-0.5 rounded-lg shadow-[1px_1px_0px_0px_var(--cartoon-shadow)] select-none",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  )
}
