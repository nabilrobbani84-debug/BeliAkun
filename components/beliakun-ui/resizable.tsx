import * as React from "react"
import { cn } from "@/lib/utils"

export interface ResizableProps {
  left: React.ReactNode
  right: React.ReactNode
  initialLeftWidth?: number // percentage
  className?: string
}

export function Resizable({
  left,
  right,
  initialLeftWidth = 50,
  className,
}: ResizableProps) {
  const [leftWidth, setLeftWidth] = React.useState(initialLeftWidth)
  const isDraggingRef = React.useRef(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleMouseDown = () => {
    isDraggingRef.current = true
  }

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const newWidth = ((e.clientX - rect.left) / rect.width) * 100
      setLeftWidth(Math.min(Math.max(newWidth, 20), 80))
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  return (
    <div ref={containerRef} className={cn("flex w-full items-stretch overflow-hidden rounded-2xl border-2 border-[var(--border)]", className)}>
      <div style={{ width: `${leftWidth}%` }} className="min-w-0 flex-1 overflow-auto p-4 bg-[var(--card)]">
        {left}
      </div>

      {/* Handle Divider */}
      <div
        onMouseDown={handleMouseDown}
        className="w-3 bg-[var(--muted)] hover:bg-blue-600 transition-colors cursor-col-resize flex items-center justify-center border-x-2 border-[var(--border)] shrink-0 select-none"
      >
        <div className="w-1 h-6 bg-[var(--border)] rounded-full" />
      </div>

      <div style={{ width: `${100 - leftWidth}%` }} className="min-w-0 flex-1 overflow-auto p-4 bg-[var(--card)]">
        {right}
      </div>
    </div>
  )
}
