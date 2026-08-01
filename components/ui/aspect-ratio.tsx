import * as React from "react"
import { cn } from "@/lib/utils"

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number | "square" | "video" | "banner" | "portrait" | "product"
  children: React.ReactNode
}

export function AspectRatio({
  ratio = "video",
  children,
  className,
  ...props
}: AspectRatioProps) {
  const getRatioPadding = () => {
    if (typeof ratio === "number") return `${(1 / ratio) * 100}%`
    switch (ratio) {
      case "square":
        return "100%"
      case "video":
        return "56.25%" // 16:9
      case "banner":
        return "33.33%" // 3:1
      case "portrait":
        return "125%" // 4:5
      case "product":
        return "75%" // 4:3
      default:
        return "56.25%"
    }
  }

  return (
    <div className={cn("relative w-full overflow-hidden rounded-2xl border-2 border-[var(--border)] bg-[var(--muted)]", className)} {...props}>
      <div style={{ paddingTop: getRatioPadding() }} />
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}
