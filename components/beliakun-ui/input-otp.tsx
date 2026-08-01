import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputOTPProps {
  length?: number
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  invalid?: boolean
  className?: string
}

export function InputOTP({
  length = 6,
  value = "",
  onChange,
  disabled = false,
  invalid = false,
  className,
}: InputOTPProps) {
  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([])

  const otpArray = React.useMemo(() => {
    const chars = value.split("")
    return Array.from({ length }, (_, i) => chars[i] || "")
  }, [value, length])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.slice(-1)
    const newOtp = [...otpArray]
    newOtp[index] = val
    const combined = newOtp.join("")
    onChange?.(combined)

    if (val && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").trim().slice(0, length)
    onChange?.(pasted)
    inputsRef.current[Math.min(pasted.length, length - 1)]?.focus()
  }

  return (
    <div className={cn("flex items-center justify-center gap-2 sm:gap-3", className)}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          disabled={disabled}
          value={otpArray[index]}
          onChange={(e) => handleInputChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          ref={(el) => {
            inputsRef.current[index] = el
          }}
          className={cn(
            "w-10 h-12 sm:w-12 sm:h-14 rounded-xl border-2 border-[var(--border)] bg-[var(--input)] text-center font-black text-lg sm:text-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[1.5px_1.5px_0px_0px_var(--cartoon-shadow)] disabled:opacity-50 touch-target",
            invalid && "border-rose-500 ring-rose-500"
          )}
        />
      ))}
    </div>
  )
}
