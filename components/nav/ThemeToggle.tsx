/**
 * Pure shadcn theme toggle with proper View Transitions
 */
'use client'

import { useCallback, useEffect, useState } from "react"
import { useTheme } from 'next-themes'
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { trackThemeChange } from "@/lib/trackingManager"

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const handleToggle = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'

    // Use View Transitions API if available
    if (!document.startViewTransition) {
      setTheme(newTheme)
      trackThemeChange(newTheme, { previous_theme: theme, trigger: 'manual_toggle' })
      return
    }

    document.startViewTransition(() => {
      setTheme(newTheme)
      trackThemeChange(newTheme, { previous_theme: theme, trigger: 'manual_toggle' })
    })
  }, [theme, setTheme])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="h-12 w-12 sm:h-11 sm:w-11 rounded-lg border-border/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-[48px] min-w-[48px] sm:min-h-[44px] sm:min-w-[44px]"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className="h-12 w-12 sm:h-11 sm:w-11 rounded-lg border-border/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-[48px] min-w-[48px] sm:min-h-[44px] sm:min-w-[44px] relative"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}

export { ThemeToggle }