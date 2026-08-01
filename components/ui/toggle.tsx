import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-xs sm:text-sm font-extrabold transition-[transform,box-shadow] duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50 min-h-[44px] cursor-pointer touch-target",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--card)] text-[var(--foreground)] border-2 border-[var(--border)] shadow-[2px_2px_0px_0px_var(--cartoon-shadow)] hover:bg-[var(--muted)] data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-slate-900 data-[state=on]:shadow-[3px_3px_0px_0px_#000]",
        outline:
          "bg-transparent text-[var(--foreground)] border-2 border-[var(--border)] hover:bg-[var(--muted)] data-[state=on]:bg-blue-600 data-[state=on]:text-white",
        cartoon:
          "bg-amber-100 dark:bg-amber-950/60 text-amber-950 dark:text-amber-300 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] data-[state=on]:bg-amber-400 data-[state=on]:text-slate-950",
      },
      size: {
        default: "px-3.5 py-2.5 min-w-[44px]",
        sm: "px-2.5 py-1.5 text-xs min-h-[36px] min-w-[36px]",
        lg: "px-5 py-3 text-base min-h-[48px] min-w-[48px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof toggleVariants> {
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, variant, size, pressed, defaultPressed = false, onPressedChange, disabled, children, ...props }, ref) => {
    const [internalPressed, setInternalPressed] = React.useState(defaultPressed)
    const isPressed = pressed !== undefined ? pressed : internalPressed

    const toggle = () => {
      if (disabled) return
      const next = !isPressed
      if (pressed === undefined) {
        setInternalPressed(next)
      }
      onPressedChange?.(next)
    }

    return (
      <button
        type="button"
        ref={ref}
        aria-pressed={isPressed}
        data-state={isPressed ? "on" : "off"}
        disabled={disabled}
        onClick={toggle}
        className={cn(toggleVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Toggle.displayName = "Toggle"

export { Toggle, toggleVariants }
