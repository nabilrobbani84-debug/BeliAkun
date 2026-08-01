import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SheetProps {
  isOpen: boolean
  onClose: () => void
  side?: "left" | "right" | "top" | "bottom"
  children: React.ReactNode
  className?: string
}

export function Sheet({
  isOpen,
  onClose,
  side = "right",
  children,
  className,
}: SheetProps) {
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

  const sideClasses = {
    right: "fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10",
    left: "fixed inset-y-0 left-0 max-w-full flex pr-6 sm:pr-10",
    top: "fixed inset-x-0 top-0 max-h-full flex pb-6",
    bottom: "fixed inset-x-0 bottom-0 max-h-full flex pt-6",
  }

  const containerClasses = {
    right: "w-[calc(100vw-2.5rem)] sm:w-full max-w-md bg-[var(--background)] border-l-4 border-[var(--border)] shadow-2xl flex flex-col h-full text-[var(--foreground)]",
    left: "w-[calc(100vw-2.5rem)] sm:w-full max-w-md bg-[var(--background)] border-r-4 border-[var(--border)] shadow-2xl flex flex-col h-full text-[var(--foreground)]",
    top: "w-full bg-[var(--background)] border-b-4 border-[var(--border)] shadow-2xl flex flex-col max-h-[85vh] text-[var(--foreground)]",
    bottom: "w-full bg-[var(--background)] border-t-4 border-[var(--border)] shadow-2xl flex flex-col max-h-[85vh] rounded-t-3xl text-[var(--foreground)]",
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[var(--overlay)] backdrop-blur-xs transition-opacity"
      />

      <div className={sideClasses[side]}>
        <div className={cn(containerClasses[side], className)}>
          {children}
        </div>
      </div>
    </div>
  )
}

export function SheetHeader({ className, children, onClose }: { className?: string; children: React.ReactNode; onClose?: () => void }) {
  return (
    <div className={cn("p-4 sm:p-5 bg-[var(--card)] border-b-2 border-[var(--border)] flex items-center justify-between", className)}>
      <div className="min-w-0 flex-1 pr-2">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="cartoon-button-secondary touch-target p-2 text-[var(--foreground)]"
          aria-label="Tutup sheet"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

export function SheetTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h3 className={cn("font-extrabold text-base sm:text-lg text-[var(--foreground)] truncate", className)}>{children}</h3>
}

export function SheetDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn("text-xs text-[var(--muted-foreground)] font-semibold truncate", className)}>{children}</p>
}

export function SheetContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex-1 overflow-y-auto p-4 sm:p-5 space-y-4", className)}>{children}</div>
}

export function SheetFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("p-4 sm:p-5 bg-[var(--card)] border-t-2 border-[var(--border)] space-y-3 pb-safe", className)}>{children}</div>
}
