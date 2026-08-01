import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border border-slate-900 px-2.5 py-0.5 text-[11px] font-extrabold shadow-[1px_1px_0px_0px_#000] transition-colors focus:outline-none shrink-0",
  {
    variants: {
      variant: {
        default: "bg-blue-400 text-slate-950",
        secondary: "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-[var(--border)] shadow-[1px_1px_0px_0px_var(--cartoon-shadow)]",
        outline: "bg-transparent text-[var(--foreground)] border-[var(--border)] shadow-none",
        bestseller: "bg-amber-400 text-slate-950",
        promo: "bg-blue-400 text-slate-950",
        new: "bg-emerald-400 text-slate-950",
        limited: "bg-rose-400 text-slate-950",
        success: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border-emerald-400 dark:border-emerald-700",
        warning: "bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border-amber-400 dark:border-amber-700",
        destructive: "bg-rose-500 text-white",
        neutral: "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100",
        verified: "bg-emerald-400 text-slate-950",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
