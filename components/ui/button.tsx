import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl text-xs sm:text-sm font-extrabold transition-[transform,box-shadow] duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 min-h-[44px] cursor-pointer select-none active:translate-x-[1px] active:translate-y-[1px]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary)] text-[var(--primary-foreground)] border-2 border-[var(--border)] shadow-[2.5px_2.5px_0px_0px_var(--cartoon-shadow)] hover:brightness-105 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_0px_var(--cartoon-shadow)]",
        primary:
          "bg-blue-600 dark:bg-blue-600 text-white border-2 border-[var(--border)] shadow-[2.5px_2.5px_0px_0px_var(--cartoon-shadow)] hover:bg-blue-500 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_0px_var(--cartoon-shadow)] active:shadow-[1px_1px_0px_0px_var(--cartoon-shadow)]",
        secondary:
          "bg-[var(--card)] text-[var(--foreground)] border-2 border-[var(--border)] shadow-[2.5px_2.5px_0px_0px_var(--cartoon-shadow)] hover:bg-[var(--muted)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_0px_var(--cartoon-shadow)] active:shadow-[1px_1px_0px_0px_var(--cartoon-shadow)]",
        accent:
          "bg-amber-400 text-slate-950 border-2 border-slate-900 shadow-[2.5px_2.5px_0px_0px_#000] hover:bg-amber-300 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_0px_#000]",
        cartoon:
          "bg-amber-400 text-slate-950 border-2 border-slate-900 shadow-[2.5px_2.5px_0px_0px_#000] hover:bg-amber-300 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_0px_#000]",
        outline:
          "border-2 border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)] shadow-[1.5px_1.5px_0px_0px_var(--cartoon-shadow)]",
        ghost:
          "bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)] shadow-none min-h-[40px]",
        link:
          "text-[var(--primary)] underline-offset-4 hover:underline shadow-none p-0 min-h-0 min-w-0 font-extrabold",
        destructive:
          "bg-rose-500 text-white border-2 border-slate-900 shadow-[2.5px_2.5px_0px_0px_#000] hover:bg-rose-600 hover:-translate-x-[1px] hover:-translate-y-[1px]",
        success:
          "bg-emerald-500 text-white border-2 border-slate-900 shadow-[2.5px_2.5px_0px_0px_#000] hover:bg-emerald-600",
        soft:
          "bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)]/40 hover:bg-[var(--muted)]/80 shadow-none",
        icon:
          "p-2.5 bg-[var(--card)] text-[var(--foreground)] border-2 border-[var(--border)] shadow-[2px_2px_0px_0px_var(--cartoon-shadow)] rounded-xl min-w-[44px] min-h-[44px]",
      },
      size: {
        default: "px-4 py-2.5 text-xs sm:text-sm",
        xs: "px-2.5 py-1.5 text-xs min-h-[36px] rounded-xl shadow-[1.5px_1.5px_0px_0px_var(--cartoon-shadow)]",
        sm: "px-3.5 py-2 text-xs min-h-[40px] rounded-xl shadow-[2px_2px_0px_0px_var(--cartoon-shadow)]",
        lg: "px-6 py-3 text-sm sm:text-base min-h-[48px] rounded-2xl shadow-[3px_3px_0px_0px_var(--cartoon-shadow)]",
        icon: "h-11 w-11 p-0 flex items-center justify-center shrink-0",
        "icon-sm": "h-9 w-9 p-0 flex items-center justify-center shrink-0 min-h-[36px]",
        "icon-lg": "h-12 w-12 p-0 flex items-center justify-center shrink-0 min-h-[48px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-current border-t-transparent shrink-0" />
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
