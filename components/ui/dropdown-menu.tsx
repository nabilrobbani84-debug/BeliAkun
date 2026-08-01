import * as React from "react"
import { cn } from "@/lib/utils"

export interface DropdownMenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: "left" | "right"
  className?: string
}

export function DropdownMenu({
  trigger,
  children,
  align = "right",
  className,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 w-56 rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] p-1.5 shadow-[4px_4px_0px_0px_var(--cartoon-shadow)] text-[var(--foreground)] animate-in fade-in-0 zoom-in-95",
            align === "right" ? "right-0" : "left-0",
            className
          )}
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && (child.type as { displayName?: string })?.displayName === "DropdownMenuItem") {
              return React.cloneElement(child as React.ReactElement<{ onClick?: () => void }>, {
                onClick: () => {
                  (child.props as { onClick?: () => void }).onClick?.()
                  setIsOpen(false)
                },
              })
            }
            return child
          })}
        </div>
      )}
    </div>
  )
}

export function DropdownMenuItem({
  className,
  children,
  onClick,
  destructive = false,
  disabled = false,
  icon,
}: {
  className?: string
  children: React.ReactNode
  onClick?: () => void
  destructive?: boolean
  disabled?: boolean
  icon?: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-colors cursor-pointer min-h-[40px] touch-target",
        destructive
          ? "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60"
          : "text-[var(--foreground)] hover:bg-[var(--muted)]",
        disabled && "opacity-50 pointer-events-none cursor-not-allowed",
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
    </button>
  )
}
DropdownMenuItem.displayName = "DropdownMenuItem"

export function DropdownMenuLabel({ children }: { children: React.ReactNode }) {
  return <div className="px-3 py-1.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[var(--muted-foreground)]">{children}</div>
}

export function DropdownMenuSeparator() {
  return <div className="h-px bg-[var(--border)]/20 my-1" />
}
