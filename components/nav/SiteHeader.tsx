/**
 * SiteHeader - Server Component
 * Static parts (logo) render instantly with zero JS.
 * Interactive parts (search, favorites, theme) loaded via HeaderClientControls.
 */
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { HeaderClientControls } from "@/components/nav/HeaderClientControls";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo - Server rendered, zero JS */}
        <Link
          href="/"
          className="flex flex-shrink-0 items-center gap-2 sm:gap-3 min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md p-1"
          aria-label="Student Offers Home"
        >
          {/* Icon with subtle glow */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 rounded-full blur-md bg-primary/20 dark:bg-primary/30 animate-pulse" />
            <GraduationCap className="relative h-6 w-6 text-primary/90 dark:text-primary stroke-[2] drop-shadow-[0_0_8px_rgba(59,130,246,0.4)] dark:drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
          </div>
          {/* Text with light glow */}
          <span className="font-semibold tracking-tight text-primary dark:text-primary/90 text-base sm:text-lg hidden sm:inline-block leading-none truncate drop-shadow-[0_0_6px_rgba(59,130,246,0.3)] dark:drop-shadow-[0_0_6px_rgba(96,165,250,0.5)]">Student Offers</span>
        </Link>

        {/* Client Controls - Search, Favorites, Theme, Submit */}
        <HeaderClientControls />
      </div>
    </header>
  );
}

