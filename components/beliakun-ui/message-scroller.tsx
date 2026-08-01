import * as React from "react"
import { ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface MessageScrollerProps {
  children: React.ReactNode
  className?: string
  maxHeight?: string
}

export function MessageScroller({
  children,
  className,
  maxHeight = "400px",
}: MessageScrollerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [showScrollBottom, setShowScrollBottom] = React.useState(false)

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 80
      setShowScrollBottom(!isNearBottom)
    }
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [children])

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{ maxHeight }}
        className={cn("overflow-y-auto p-4 space-y-2 rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] scrollbar-none", className)}
      >
        {children}
      </div>

      {showScrollBottom && (
        <button
          type="button"
          onClick={scrollToBottom}
          className="cartoon-button-secondary touch-target p-2 absolute bottom-4 right-4 z-10 text-xs flex items-center gap-1 shadow-[2px_2px_0px_0px_#000] rounded-xl"
        >
          <ArrowDown className="w-4 h-4" /> Pesan Terbaru
        </button>
      )}
    </div>
  )
}
