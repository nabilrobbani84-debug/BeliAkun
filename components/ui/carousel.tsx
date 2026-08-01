import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CarouselProps {
  children: React.ReactNode
  className?: string
  loop?: boolean
  showArrows?: boolean
}

export function Carousel({
  children,
  className,
  loop = true,
  showArrows = true,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop, align: "start" })

  const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  return (
    <div className={cn("relative w-full group", className)}>
      <div className="overflow-hidden p-1" ref={emblaRef}>
        <div className="flex gap-4">{children}</div>
      </div>

      {showArrows && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            className="cartoon-button-secondary touch-target p-2.5 absolute left-2 top-1/2 -translate-y-1/2 z-10 text-[var(--foreground)] opacity-90 hover:opacity-100 hidden sm:flex items-center justify-center min-h-[44px] min-w-[44px]"
            aria-label="Item sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="cartoon-button-secondary touch-target p-2.5 absolute right-2 top-1/2 -translate-y-1/2 z-10 text-[var(--foreground)] opacity-90 hover:opacity-100 hidden sm:flex items-center justify-center min-h-[44px] min-w-[44px]"
            aria-label="Item berikutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  )
}

export function CarouselItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex-[0_0_88%] sm:flex-[0_0_48%] lg:flex-[0_0_32%] min-w-0", className)}>{children}</div>
}
