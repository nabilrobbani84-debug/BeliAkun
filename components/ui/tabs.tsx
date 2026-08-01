import * as React from "react"
import { cn } from "@/lib/utils"

export interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

const TabsContext = React.createContext<{
  value: string
  onValueChange: (val: string) => void
}>({ value: "", onValueChange: () => {} })

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn("w-full space-y-4", className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("cartoon-card p-2 bg-[var(--muted)] border-[var(--border)] flex items-center justify-start sm:justify-center gap-2 overflow-x-auto scrollbar-none", className)}>
      {children}
    </div>
  )
}

export function TabsTrigger({
  value,
  children,
  icon,
  className,
}: {
  value: string
  children: React.ReactNode
  icon?: React.ReactNode
  className?: string
}) {
  const { value: selectedValue, onValueChange } = React.useContext(TabsContext)
  const isActive = selectedValue === value

  return (
    <button
      type="button"
      onClick={() => onValueChange(value)}
      className={cn(
        "px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shrink-0 transition-[transform,box-shadow,border-color] duration-100 min-h-[44px] cursor-pointer touch-target",
        isActive
          ? "bg-blue-600 text-white border-2 border-[var(--border)] shadow-[2px_2px_0px_0px_var(--cartoon-shadow)]"
          : "bg-[var(--card)] text-[var(--foreground)] border-2 border-transparent hover:border-[var(--border)] hover:bg-[var(--muted)]/60",
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  )
}

export function TabsContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const { value: selectedValue } = React.useContext(TabsContext)
  if (selectedValue !== value) return null
  return <div className={cn("animate-in fade-in-0 duration-200", className)}>{children}</div>
}
