import * as React from "react"
import { cn } from "@/lib/utils"
import { Toggle, ToggleProps } from "./toggle"

export interface ToggleGroupProps {
  type?: "single" | "multiple"
  value?: string | string[]
  defaultValue?: string | string[]
  onValueChange?: (value: any) => void
  children: React.ReactNode
  className?: string
}

export function ToggleGroup({
  type = "single",
  value,
  defaultValue,
  onValueChange,
  children,
  className,
}: ToggleGroupProps) {
  const [internalValue, setInternalValue] = React.useState<any>(
    defaultValue || (type === "single" ? "" : [])
  )
  const currentValue = value !== undefined ? value : internalValue

  const handleToggleItem = (itemVal: string) => {
    if (type === "single") {
      const next = currentValue === itemVal ? "" : itemVal
      if (value === undefined) setInternalValue(next)
      onValueChange?.(next)
    } else {
      const arr = Array.isArray(currentValue) ? currentValue : []
      const next = arr.includes(itemVal)
        ? arr.filter((v) => v !== itemVal)
        : [...arr, itemVal]
      if (value === undefined) setInternalValue(next)
      onValueChange?.(next)
    }
  }

  return (
    <div className={cn("inline-flex flex-wrap gap-1.5 p-1 bg-[var(--muted)] border-2 border-[var(--border)] rounded-2xl", className)}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement<ToggleProps & { value: string }>(child)) return child
        const itemVal = child.props.value
        const isPressed = type === "single" ? currentValue === itemVal : (currentValue as string[])?.includes(itemVal)

        return React.cloneElement(child, {
          pressed: isPressed,
          onPressedChange: () => handleToggleItem(itemVal),
        })
      })}
    </div>
  )
}

export function ToggleGroupItem({
  value,
  children,
  ...props
}: ToggleProps & { value: string }) {
  return (
    <Toggle value={value} {...props}>
      {children}
    </Toggle>
  )
}
