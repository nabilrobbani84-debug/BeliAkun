import * as React from "react"
import { AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "./dialog"
import { Button } from "./button"

export interface AlertDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "destructive" | "warning" | "default"
  loading?: boolean
}

export function AlertDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  variant = "destructive",
  loading = false,
}: AlertDialogProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="md">
      <DialogHeader onClose={onClose}>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 border border-rose-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <DialogTitle>{title}</DialogTitle>
          </div>
        </div>
      </DialogHeader>

      <DialogContent>
        <DialogDescription>{description}</DialogDescription>
      </DialogContent>

      <DialogFooter>
        <Button variant="secondary" onClick={onClose} disabled={loading} className="w-full sm:w-auto">
          {cancelText}
        </Button>
        <Button
          variant={variant === "destructive" ? "destructive" : "primary"}
          onClick={onConfirm}
          loading={loading}
          className="w-full sm:w-auto"
        >
          {confirmText}
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
