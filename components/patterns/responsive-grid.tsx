import * as React from "react"
import { cn } from "@/lib/utils"

export interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "product" | "category" | "benefit" | "stat" | "step"
  children: React.ReactNode
}

export function ResponsiveGrid({
  variant = "product",
  children,
  className,
  ...props
}: ResponsiveGridProps) {
  const variantGrids = {
    product: "grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5",
    category: "grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4",
    benefit: "grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4",
    stat: "grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4",
    step: "grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6",
  }

  return (
    <div className={cn(variantGrids[variant], className)} {...props}>
      {children}
    </div>
  )
}
