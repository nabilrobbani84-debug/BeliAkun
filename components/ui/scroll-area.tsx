import * as React from "react"
import { cn } from "@/lib/utils"

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: string | number
  orientation?: "vertical" | "horizontal" | "both"
}

export function ScrollArea({
  children,
  className,
  maxHeight = "300px",
  orientation = "vertical",
  ...props
}: ScrollAreaProps) {
  const style: React.CSSProperties = {
    maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
  }

  return (
    <div
      style={style}
      className={cn(
        "relative rounded-xl border border-[var(--border)]/30 p-2 scrollbar-none",
        orientation === "vertical" && "overflow-y-auto overflow-x-hidden",
        orientation === "horizontal" && "overflow-x-auto overflow-y-hidden whitespace-nowrap",
        orientation === "both" && "overflow-auto",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
