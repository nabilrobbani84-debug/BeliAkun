import * as React from "react"
import { cn } from "@/lib/utils"

export interface ItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: React.ReactNode
  media?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  meta?: React.ReactNode
  variant?: "default" | "interactive" | "selected" | "disabled"
}

export function Item({
  icon,
  media,
  title,
  description,
  action,
  meta,
  variant = "default",
  className,
  onClick,
  ...props
}: ItemProps) {
  const isClickable = Boolean(onClick) || variant === "interactive" || variant === "selected"

  return (
    <div
      onClick={onClick}
      className={cn(
        "cartoon-card p-3 sm:p-3.5 bg-[var(--card)] flex items-center justify-between gap-3",
        isClickable && "cursor-pointer hover:bg-[var(--muted)] hover:translate-x-[-1px] hover:translate-y-[-1px]",
        variant === "selected" && "bg-blue-50 dark:bg-blue-950/60 border-blue-600 ring-2 ring-blue-600",
        variant === "disabled" && "opacity-50 pointer-events-none",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {media && <div className="shrink-0">{media}</div>}
        {icon && !media && (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-300 text-slate-950 border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#000] flex items-center justify-center shrink-0 text-sm">
            {icon}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-xs sm:text-sm text-[var(--foreground)] truncate">
              {title}
            </h4>
            {meta && <span className="text-[10px] font-bold text-[var(--muted-foreground)] shrink-0">{meta}</span>}
          </div>
          {description && (
            <p className="text-[11px] sm:text-xs text-[var(--muted-foreground)] font-medium truncate mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
