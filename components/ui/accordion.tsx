import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AccordionItemProps {
  id: string
  title: React.ReactNode
  children: React.ReactNode
  isOpen?: boolean
  onToggle?: () => void
  variant?: "default" | "bordered" | "cartoon"
}

export function AccordionItem({
  title,
  children,
  isOpen = false,
  onToggle,
  variant = "cartoon",
}: AccordionItemProps) {
  return (
    <div
      className={cn(
        "overflow-hidden",
        variant === "cartoon" && (isOpen ? "cartoon-card bg-[var(--card)] border-blue-600 ring-2 ring-blue-600" : "cartoon-card bg-[var(--card)] border-[var(--border)]"),
        variant === "bordered" && "border-2 border-[var(--border)] rounded-xl bg-[var(--card)]",
        variant === "default" && "border-b border-[var(--border)]/20"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 sm:p-5 text-left font-extrabold text-xs sm:text-sm text-[var(--foreground)] flex items-center justify-between gap-3 focus:outline-none min-h-[48px] cursor-pointer"
      >
        <span>{title}</span>
        <div
          className={cn(
            "p-1.5 rounded-xl border-2 border-[var(--border)] transition-transform shrink-0",
            isOpen ? "bg-amber-400 text-slate-950 rotate-180" : "bg-[var(--muted)] text-[var(--foreground)]"
          )}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {isOpen && (
        <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--foreground)] font-medium leading-relaxed border-t border-[var(--border)]/20">
          {children}
        </div>
      )}
    </div>
  )
}

export interface AccordionProps {
  type?: "single" | "multiple"
  defaultValue?: string | string[]
  children: React.ReactNode
  className?: string
  variant?: "default" | "bordered" | "cartoon"
}

export function Accordion({
  defaultValue,
  children,
  className,
  variant = "cartoon",
}: AccordionProps) {
  const [openIds, setOpenIds] = React.useState<string[]>(
    Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : []
  )

  const handleToggle = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <div className={cn("space-y-3", className)}>
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement<AccordionItemProps>(child)) return child
        const itemId = child.props.id || `acc-${idx}`
        const isOpen = openIds.includes(itemId)
        return React.cloneElement(child, {
          id: itemId,
          isOpen,
          variant: child.props.variant || variant,
          onToggle: () => handleToggle(itemId),
        })
      })}
    </div>
  )
}
