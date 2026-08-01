import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
  attached?: boolean
  children: React.ReactNode
}

export function ButtonGroup({
  orientation = "horizontal",
  attached = true,
  children,
  className,
  ...props
}: ButtonGroupProps) {
  return (
    <div
      className={cn(
        "inline-flex flex-wrap items-center",
        orientation === "vertical" && "flex-col items-stretch",
        attached && orientation === "horizontal" && "[&>button]:rounded-none [&>button:first-child]:rounded-l-xl [&>button:last-child]:rounded-r-xl [&>button:not(:first-child)]:-ml-0.5",
        attached && orientation === "vertical" && "[&>button]:rounded-none [&>button:first-child]:rounded-t-xl [&>button:last-child]:rounded-b-xl [&>button:not(:first-child)]:-mt-0.5",
        !attached && "gap-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
