import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2, Info, Sparkles, AlertTriangle, X } from "lucide-react"

const alertVariants = cva(
  "relative w-full rounded-2xl border-2 border-[var(--border)] p-4 shadow-[3px_3px_0px_0px_var(--cartoon-shadow)] font-medium text-xs sm:text-sm text-[var(--foreground)] flex items-start gap-3",
  {
    variants: {
      variant: {
        default: "bg-[var(--card)]",
        info: "bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-950 dark:text-blue-200",
        success: "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 text-emerald-950 dark:text-emerald-200",
        warning: "bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-950 dark:text-amber-200",
        destructive: "bg-rose-50 dark:bg-rose-950/60 border-rose-600 text-rose-950 dark:text-rose-200",
        promotional: "bg-gradient-to-r from-amber-300 via-orange-300 to-amber-200 text-slate-950 border-slate-900 shadow-[3px_3px_0px_0px_#000]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  onClose?: () => void
  icon?: React.ReactNode
}

function Alert({ className, variant, children, onClose, icon, ...props }: AlertProps) {
  const getDefaultIcon = () => {
    switch (variant) {
      case "info":
        return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
      case "destructive":
        return <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
      case "promotional":
        return <Sparkles className="w-5 h-5 text-slate-900 shrink-0" />
      default:
        return <Info className="w-5 h-5 text-[var(--muted-foreground)] shrink-0" />
    }
  }

  return (
    <div role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
      {icon || getDefaultIcon()}
      <div className="flex-1 min-w-0 pr-4">{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-[var(--muted)]/50 touch-target min-h-[32px] min-w-[32px] flex items-center justify-center shrink-0"
          aria-label="Tutup alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h5 className={cn("font-extrabold text-sm sm:text-base leading-tight mb-1", className)} {...props} />
}

function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <div className={cn("text-xs sm:text-sm font-medium opacity-90 leading-relaxed", className)} {...props} />
}

export { Alert, AlertTitle, AlertDescription }
