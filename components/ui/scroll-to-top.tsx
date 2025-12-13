'use client';

/**
 * Scroll to Top Button Component
 * A floating pill-shaped button with vertical text that appears when user scrolls down
 */
import { useEffect, useState } from "react"
import { ChevronUp } from "lucide-react"
import { trackButtonClick } from '@/lib/trackingManager';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    const toggleVisibility = () => {
      // Show earlier on mobile (150px) vs desktop (200px)
      const threshold = isMobile ? 150 : 200
      setIsVisible(window.scrollY > threshold)
    }

    // Initial checks
    checkMobile()
    toggleVisibility()

    // Event listeners
    window.addEventListener("scroll", toggleVisibility, { passive: true })
    window.addEventListener("resize", checkMobile, { passive: true })

    return () => {
      window.removeEventListener("scroll", toggleVisibility)
      window.removeEventListener("resize", checkMobile)
    }
  }, [isMobile])

  const scrollToTop = () => {
    // Track the button click with device info
    trackButtonClick('Scroll to Top', 'floating_button', {
      scroll_position: window.pageYOffset,
      page_height: document.documentElement.scrollHeight,
      device_type: isMobile ? 'mobile' : 'desktop',
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight
    });

    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-4 sm:bottom-8 sm:right-7 z-50 flex flex-col items-center justify-center gap-0.5 rounded-full border border-white/50 dark:border-white/10 bg-gradient-to-b from-white/90 to-white/50 dark:from-neutral-900/90 dark:to-neutral-900/50 hover:from-white hover:to-white/60 dark:hover:from-neutral-800/90 dark:hover:to-neutral-800/60 text-neutral-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-300 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-black/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] dark:hover:shadow-black/30 ring-1 ring-black/5 dark:ring-white/10 transition-all duration-200 p-0 sm:p-2.5 w-10 h-10 sm:w-8 sm:h-20 backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 touch-manipulation animate-fade-in-up hover:scale-105 hover:-translate-y-1 active:scale-95"
    >
      <ChevronUp className="w-5 h-5 sm:w-3 sm:h-3 stroke-[2.5] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
      <span className="hidden sm:block text-[8px] sm:text-[9px] font-semibold tracking-wide rotate-180 [writing-mode:vertical-lr] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
        TO TOP
      </span>
    </button>
  )
}