import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

export interface FieldProps {
  label?: React.ReactNode
  description?: React.ReactNode
  error?: React.ReactNode
  required?: boolean
  invalid?: boolean
  disabled?: boolean
  children: React.ReactNode
  className?: string
  layout?: "vertical" | "horizontal"
}

export function Field({
  label,
  description,
  error,
  required = false,
  invalid = false,
  disabled = false,
  children,
  className,
  layout = "vertical",
}: FieldProps) {
  const isInvalid = invalid || Boolean(error)

  if (layout === "horizontal") {
    return (
      <div className={cn("grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-start py-1.5", className)}>
        <div className="sm:col-span-4 pt-2">
          {label && <Label required={required} invalid={isInvalid} disabled={disabled}>{label}</Label>}
          {description && <p className="text-[11px] text-[var(--muted-foreground)] font-medium mt-0.5">{description}</p>}
        </div>
        <div className="sm:col-span-8 space-y-1">
          {children}
          {error && <p className="text-[11px] font-bold text-rose-500 mt-1">{error}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-1.5 w-full", className)}>
      {label && <Label required={required} invalid={isInvalid} disabled={disabled}>{label}</Label>}
      {children}
      {description && !error && (
        <p className="text-[11px] text-[var(--muted-foreground)] font-medium leading-tight">
          {description}
        </p>
      )}
      {error && <p className="text-[11px] font-bold text-rose-500 leading-tight">{error}</p>}
    </div>
  )
}
