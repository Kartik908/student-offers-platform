'use client';

/**
 * Renders the primary Call-to-Action button for the hero section.
 */
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export const HeroCTA = () => {

  const handleCTAClick = () => {
    // Use fallback analytics that works even when PostHog is blocked
    trackEvent('hero_cta_clicked', {
      button_text: 'Browse All Tools',
      location: 'hero_section',
    });
  };

  return (
    <div className="flex items-center justify-center mt-7 sm:mt-10">
      <Button asChild size="lg" className="h-[52px] sm:h-12 px-6 text-base font-semibold group text-primary-foreground">
        <Link href="/tools" className="flex items-center gap-2" onClick={handleCTAClick}>
          Browse All Tools
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
    </div>
  );
};