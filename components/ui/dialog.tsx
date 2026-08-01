import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DialogProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl"
}

export function Dialog({
  isOpen,
  onClose,
  children,
  className,
  maxWidth = "lg",
}: DialogProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[var(--overlay)] backdrop-blur-xs transition-opacity"
      />

      {/* Container */}
      <div
        className={cn(
          "relative w-[calc(100vw-1.5rem)] sm:w-full bg-[var(--background)] border-3 sm:border-4 border-[var(--border)] rounded-2xl sm:rounded-3xl shadow-[4px_4px_0px_0px_var(--cartoon-shadow)] sm:shadow-[8px_8px_0px_0px_var(--cartoon-shadow)] overflow-hidden z-10 my-4 text-[var(--foreground)] animate-in fade-in-0 zoom-in-95",
          maxWidthClasses[maxWidth],
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({ className, children, onClose }: { className?: string; children: React.ReactNode; onClose?: () => void }) {
  return (
    <div className={cn("p-4 sm:p-5 bg-[var(--card)] border-b-2 border-[var(--border)] flex items-center justify-between", className)}>
      <div className="min-w-0 flex-1 pr-2">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="cartoon-button-secondary touch-target p-2 text-[var(--foreground)]"
          aria-label="Tutup modal"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

export function DialogTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h3 className={cn("font-extrabold text-base sm:text-lg text-[var(--foreground)] truncate", className)}>{children}</h3>
}

export function DialogDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn("text-xs sm:text-sm text-[var(--muted-foreground)] font-semibold truncate mt-0.5", className)}>{children}</p>
}

export function DialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto", className)}>{children}</div>
}

export function DialogFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("p-4 sm:p-5 bg-[var(--card)] border-t-2 border-[var(--border)] flex flex-row items-center justify-between gap-3 sm:gap-4", className)}>{children}</div>
}
