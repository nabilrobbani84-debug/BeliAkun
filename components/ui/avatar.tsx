import * as React from "react"
import { cn } from "@/lib/utils"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  status?: "online" | "offline"
  size?: "xs" | "sm" | "default" | "lg" | "xl"
  verified?: boolean
}

export function Avatar({
  src,
  alt = "Avatar",
  fallback = "BA",
  status,
  size = "default",
  verified,
  className,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false)

  const sizeClasses = {
    xs: "w-7 h-7 text-[10px]",
    sm: "w-9 h-9 text-xs",
    default: "w-11 h-11 text-sm",
    lg: "w-14 h-14 text-base",
    xl: "w-18 h-18 text-xl",
  }

  return (
    <div className="relative inline-block shrink-0">
      <div
        className={cn(
          "rounded-2xl bg-amber-300 text-slate-950 font-black border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] flex items-center justify-center overflow-hidden shrink-0 select-none",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{fallback.substring(0, 2).toUpperCase()}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 shadow-[1px_1px_0px_0px_#000]",
            status === "online" ? "bg-emerald-400" : "bg-slate-400"
          )}
        />
      )}

      {verified && !status && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white border border-slate-900 flex items-center justify-center text-[10px] shadow-[1px_1px_0px_0px_#000]">
          ✓
        </span>
      )}
    </div>
  )
}
