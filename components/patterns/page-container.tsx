import * as React from "react"
import { cn } from "@/lib/utils"

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function PageContainer({ className, children, ...props }: PageContainerProps) {
  return (
    <div
      className={cn("w-full max-w-[1600px] mx-auto px-3.5 sm:px-5 md:px-6 lg:px-8", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function SectionContainer({ className, children, ...props }: PageContainerProps) {
  return (
    <section
      className={cn("w-full py-3 sm:py-4 md:py-5 lg:py-6", className)}
      {...props}
    >
      {children}
    </section>
  )
}
