import * as React from "react"
import { FileText, Download, Trash2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AttachmentProps {
  fileName: string
  fileSize?: string
  fileType?: string
  status?: "uploading" | "uploaded" | "error"
  progress?: number
  onDownload?: () => void
  onRemove?: () => void
  className?: string
}

export function Attachment({
  fileName,
  fileSize = "1.2 MB",
  fileType = "PDF",
  status = "uploaded",
  progress = 100,
  onDownload,
  onRemove,
  className,
}: AttachmentProps) {
  return (
    <div className={cn("cartoon-card p-3 bg-[var(--card)] border-[var(--border)] flex items-center justify-between gap-3 max-w-sm", className)}>
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 border border-blue-400 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h5 className="font-extrabold text-xs text-[var(--foreground)] truncate">{fileName}</h5>
          <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--muted-foreground)] mt-0.5">
            <span>{fileType}</span>
            <span>•</span>
            <span>{fileSize}</span>
            {status === "uploaded" && (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 ml-auto">
                <CheckCircle2 className="w-3 h-3" /> Siap
              </span>
            )}
          </div>
          {status === "uploading" && (
            <div className="w-full bg-[var(--muted)] h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-blue-600 h-full transition-[width] duration-150" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {onDownload && (
          <button
            type="button"
            onClick={onDownload}
            className="p-1.5 rounded-lg bg-[var(--muted)] text-[var(--foreground)] hover:bg-blue-600 hover:text-white transition-colors touch-target min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="Unduh file"
          >
            <Download className="w-4 h-4" />
          </button>
        )}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 rounded-lg bg-[var(--muted)] text-rose-600 hover:bg-rose-500 hover:text-white transition-colors touch-target min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="Hapus file"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
