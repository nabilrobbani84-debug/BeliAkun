import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const typographyVariants = cva("text-[var(--foreground)]", {
  variants: {
    variant: {
      display: "font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-none",
      h1: "font-black text-2xl sm:text-3xl md:text-4xl tracking-tight leading-tight",
      h2: "font-extrabold text-xl sm:text-2xl md:text-3xl tracking-tight leading-tight",
      h3: "font-extrabold text-lg sm:text-xl md:text-2xl leading-snug",
      h4: "font-extrabold text-base sm:text-lg leading-snug",
      lead: "text-sm sm:text-base md:text-lg font-semibold text-[var(--muted-foreground)] leading-relaxed",
      body: "text-xs sm:text-sm font-medium leading-relaxed",
      bodySmall: "text-[11px] sm:text-xs font-medium leading-relaxed",
      muted: "text-xs text-[var(--muted-foreground)] font-semibold",
      caption: "text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted-foreground)]",
      code: "font-mono text-xs bg-[var(--muted)] px-1.5 py-0.5 rounded border border-[var(--border)]/40 font-bold",
    },
  },
  defaultVariants: {
    variant: "body",
  },
})

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType
}

export function Typography({
  className,
  variant,
  as,
  children,
  ...props
}: TypographyProps) {
  const defaultTagMap: Record<string, React.ElementType> = {
    display: "h1",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    lead: "p",
    body: "p",
    bodySmall: "p",
    muted: "span",
    caption: "span",
    code: "code",
  }

  const Component = as || defaultTagMap[variant || "body"] || "p"

  return (
    <Component className={cn(typographyVariants({ variant, className }))} {...props}>
      {children}
    </Component>
  )
}
