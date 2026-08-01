import * as React from "react"
import { cn } from "@/lib/utils"

export interface BubbleProps {
  sender?: "customer" | "support" | "system"
  message: React.ReactNode
  timestamp?: string
  avatar?: React.ReactNode
  className?: string
}

export function Bubble({
  sender = "customer",
  message,
  timestamp,
  avatar,
  className,
}: BubbleProps) {
  const isSupport = sender === "support"
  const isSystem = sender === "system"

  if (isSystem) {
    return (
      <div className="w-full text-center my-2">
        <span className="inline-block bg-[var(--muted)] text-[var(--muted-foreground)] font-bold text-[10px] sm:text-[11px] px-3 py-1 rounded-full border border-[var(--border)]/40">
          {message} {timestamp && `• ${timestamp}`}
        </span>
      </div>
    )
  }

  return (
    <div className={cn("flex items-end gap-2 my-2.5 max-w-[85%] sm:max-w-[75%]", isSupport ? "ml-auto flex-row-reverse" : "mr-auto flex-row", className)}>
      {avatar && <div className="shrink-0 mb-1">{avatar}</div>}

      <div
        className={cn(
          "cartoon-card p-3 sm:p-3.5 space-y-1",
          isSupport
            ? "bg-blue-600 text-white border-[var(--border)] shadow-[2.5px_2.5px_0px_0px_var(--cartoon-shadow)]"
            : "bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] shadow-[2.5px_2.5px_0px_0px_var(--cartoon-shadow)]"
        )}
      >
        <div className="text-xs sm:text-sm font-medium leading-relaxed break-words">{message}</div>
        {timestamp && (
          <div className={cn("text-[9px] font-bold text-right opacity-75", isSupport ? "text-blue-100" : "text-[var(--muted-foreground)]")}>
            {timestamp}
          </div>
        )}
      </div>
    </div>
  )
}
