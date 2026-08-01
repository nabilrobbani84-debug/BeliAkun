import * as React from "react"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SectionHeadingProps {
  badge?: React.ReactNode
  title: React.ReactNode
  subtitle?: React.ReactNode
  action?: React.ReactNode
  align?: "left" | "center"
  className?: string
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  action,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 mb-3 sm:mb-4",
        align === "center" ? "text-center items-center max-w-2xl mx-auto" : "sm:flex-row sm:items-end justify-between",
        className
      )}
    >
      <div>
        {badge && (
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-wide text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-300 dark:border-blue-700 mb-1.5">
            <Sparkles className="w-3 h-3" /> {badge}
          </span>
        )}
        <h2 className="font-black text-lg sm:text-xl md:text-2xl text-[var(--foreground)] tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] font-semibold mt-0.5 max-w-md">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="self-end sm:self-auto shrink-0">{action}</div>}
    </div>
  )
}
