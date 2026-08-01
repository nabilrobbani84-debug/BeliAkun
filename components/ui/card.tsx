import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)]",
  {
    variants: {
      variant: {
        default: "shadow-[3.5px_3.5px_0px_0px_var(--cartoon-shadow)]",
        interactive: "shadow-[3.5px_3.5px_0px_0px_var(--cartoon-shadow)] transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--cartoon-shadow)] cursor-pointer",
        product: "shadow-[3.5px_3.5px_0px_0px_var(--cartoon-shadow)] transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--cartoon-shadow)] cursor-pointer flex flex-col justify-between",
        category: "shadow-[3.5px_3.5px_0px_0px_var(--cartoon-shadow)] transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--cartoon-shadow)] cursor-pointer",
        promotion: "border-4 shadow-[6px_6px_0px_0px_var(--cartoon-shadow)] sm:shadow-[8px_8px_0px_0px_var(--cartoon-shadow)] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white",
        flat: "shadow-none border-[var(--border)]/40",
        cartoon: "border-3 sm:border-4 shadow-[4px_4px_0px_0px_var(--cartoon-shadow)] sm:shadow-[8px_8px_0px_0px_var(--cartoon-shadow)]",
        selected: "border-blue-600 ring-2 ring-blue-600 shadow-[4px_4px_0px_0px_#2563EB] bg-blue-50 dark:bg-blue-950/60",
        disabled: "opacity-60 pointer-events-none shadow-none bg-[var(--muted)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4 sm:p-5", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-extrabold text-base sm:text-lg leading-tight tracking-tight text-[var(--foreground)]", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs sm:text-sm text-[var(--muted-foreground)] font-medium leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 sm:p-5 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4 sm:p-5 pt-0 border-t border-[var(--border)]/20 mt-2", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

const CardAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mt-3 pt-2 border-t border-[var(--border)]/20 flex items-center justify-between gap-2", className)} {...props} />
))
CardAction.displayName = "CardAction"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardAction, cardVariants }
