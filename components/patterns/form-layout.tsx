import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormLayoutProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
  title?: string
  description?: string
}

export function FormLayout({
  children,
  title,
  description,
  className,
  ...props
}: FormLayoutProps) {
  return (
    <form className={cn("cartoon-card p-5 sm:p-8 bg-[var(--card)] border-[var(--border)] space-y-4 max-w-xl mx-auto w-full", className)} {...props}>
      {(title || description) && (
        <div className="pb-3 border-b border-[var(--border)]/20">
          {title && <h3 className="font-extrabold text-base sm:text-lg text-[var(--foreground)]">{title}</h3>}
          {description && <p className="text-xs sm:text-sm text-[var(--muted-foreground)] font-semibold mt-0.5">{description}</p>}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </form>
  )
}
