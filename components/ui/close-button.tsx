'use client';

/**
 * Standardized close button component with consistent styling and behavior
 */
import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface CloseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "minimal"
  size?: "sm" | "md" | "lg"
  onClose?: () => void
  ariaLabel?: string
}

const CloseButton = React.forwardRef<HTMLButtonElement, CloseButtonProps>(
  ({ className, variant = "default", size = "md", onClose, ariaLabel = "Close", onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e)
      onClose?.()
    }

    const variants = {
      default: "opacity-70 hover:opacity-100 transition-opacity rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      ghost: "hover:bg-accent hover:text-accent-foreground transition-colors rounded-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      minimal: "hover:bg-primary-foreground/20 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
    }

    const sizes = {
      sm: "h-6 w-6",
      md: "h-8 w-8",
      lg: "h-10 w-10"
    }

    const iconSizes = {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5"
    }

    return (
      <button
        ref={ref}
        className={cn(
          "flex items-center justify-center cursor-pointer disabled:pointer-events-none disabled:opacity-50 min-h-[44px] min-w-[44px]",
          variants[variant],
          sizes[size],
          className
        )}
        onClick={handleClick}
        aria-label={ariaLabel}
        {...props}
      >
        <X className={iconSizes[size]} />
        <span className="sr-only">{ariaLabel}</span>
      </button>
    )
  }
)

CloseButton.displayName = "CloseButton"

export { CloseButton }