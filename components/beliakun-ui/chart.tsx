import * as React from "react"
import { cn } from "@/lib/utils"

export interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

export interface ChartProps {
  data: ChartDataPoint[]
  title?: string
  subtitle?: string
  height?: number
  className?: string
}

export function Chart({
  data,
  title,
  subtitle,
  height = 200,
  className,
}: ChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className={cn("cartoon-card p-4 sm:p-5 bg-[var(--card)] border-[var(--border)] space-y-4 w-full", className)}>
      {(title || subtitle) && (
        <div>
          {title && <h4 className="font-extrabold text-sm sm:text-base text-[var(--foreground)]">{title}</h4>}
          {subtitle && <p className="text-xs text-[var(--muted-foreground)] font-semibold mt-0.5">{subtitle}</p>}
        </div>
      )}

      {/* Bar Chart Container */}
      <div className="flex items-end justify-between gap-2 border-b-2 border-[var(--border)] pb-2 pt-4" style={{ height: `${height}px` }}>
        {data.map((point, idx) => {
          const barHeightPercent = Math.round((point.value / maxValue) * 100)
          const barBg = point.color || "bg-blue-500"

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
              <span className="text-[10px] font-black text-[var(--foreground)] opacity-0 group-hover:opacity-100 transition-opacity">
                {point.value}
              </span>
              <div
                className={cn("w-full rounded-t-xl border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#000] transition-[height,filter] duration-200 group-hover:brightness-110", barBg)}
                style={{ height: `${barHeightPercent}%` }}
              />
              <span className="text-[10px] font-extrabold text-[var(--muted-foreground)] truncate max-w-full mt-1">
                {point.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
