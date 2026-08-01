import * as React from "react"
import { cn } from "@/lib/utils"

export interface PopoverProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: "left" | "right" | "center"
  className?: string
}

export function Popover({
  trigger,
  children,
  align = "left",
  className,
}: PopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const popoverRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const alignClasses = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2",
  }

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 w-72 rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] p-4 shadow-[4px_4px_0px_0px_var(--cartoon-shadow)] text-[var(--foreground)] animate-in fade-in-0 zoom-in-95",
            alignClasses[align],
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}
