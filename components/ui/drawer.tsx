import * as React from "react"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetDescription } from "./sheet"

export interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  description?: string
}

export function Drawer({
  isOpen,
  onClose,
  children,
  title,
  description,
}: DrawerProps) {
  return (
    <Sheet isOpen={isOpen} onClose={onClose} side="bottom">
      <div className="w-12 h-1.5 bg-[var(--border)] rounded-full mx-auto my-2.5 opacity-40 shrink-0" />
      {(title || description) && (
        <SheetHeader onClose={onClose}>
          {title && <SheetTitle>{title}</SheetTitle>}
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
      )}
      <SheetContent>{children}</SheetContent>
    </Sheet>
  )
}

export { SheetContent as DrawerContent, SheetFooter as DrawerFooter, SheetHeader as DrawerHeader, SheetTitle as DrawerTitle, SheetDescription as DrawerDescription }
