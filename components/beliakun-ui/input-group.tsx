import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  children: React.ReactNode
}

export function InputGroup({
  prefix,
  suffix,
  children,
  className,
  ...props
}: InputGroupProps) {
  return (
    <div className={cn("flex items-stretch w-full relative", className)} {...props}>
      {prefix && (
        <div className="flex items-center px-3.5 bg-[var(--muted)] text-[var(--foreground)] border-2 border-r-0 border-[var(--border)] rounded-l-xl font-extrabold text-xs sm:text-sm select-none shrink-0 min-h-[44px]">
          {prefix}
        </div>
      )}

      <div className={cn("flex-1 min-w-0 [&_input]:rounded-none", prefix && "[&_input]:rounded-r-xl", suffix && "[&_input]:rounded-l-xl", prefix && suffix && "[&_input]:rounded-none")}>
        {children}
      </div>

      {suffix && (
        <div className="flex items-center px-3.5 bg-[var(--muted)] text-[var(--foreground)] border-2 border-l-0 border-[var(--border)] rounded-r-xl font-extrabold text-xs sm:text-sm select-none shrink-0 min-h-[44px]">
          {suffix}
        </div>
      )}
    </div>
  )
}
