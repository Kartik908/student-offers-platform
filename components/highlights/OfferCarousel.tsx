/**
 * A horizontal scrolling carousel for displaying offers.
 */
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Offer } from "@/types";
import OfferCard from "@/components/offers/OfferCard";
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OfferCarouselProps {
  title?: string;
  subtitle?: string;
  offers: Offer[];
  seeAllLink?: string;
  seeAllText?: string;
}

const OfferCarousel: React.FC<OfferCarouselProps> = ({ title, subtitle, offers, seeAllLink = '', seeAllText }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState({ left: false, right: false });

  const manageArrows = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const isOverflowing = scrollWidth > clientWidth;
      const buffer = 1;

      setShowArrows({
        left: isOverflowing && scrollLeft > buffer,
        right: isOverflowing && scrollLeft < scrollWidth - clientWidth - buffer,
      });
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      manageArrows();
      container.addEventListener('scroll', manageArrows);
      window.addEventListener('resize', manageArrows);
      const timeoutId = setTimeout(manageArrows, 100);
      return () => {
        clearTimeout(timeoutId);
        container.removeEventListener('scroll', manageArrows);
        window.removeEventListener('resize', manageArrows);
      };
    }
  }, [manageArrows, offers]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardWidth = 324; // Approx width of a card + gap
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -cardWidth : cardWidth,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="container mb-12">
          <div className="text-center md:text-left">
            {title && <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight mb-2">{title}</h2>}
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
      )}

      <div className="relative">
        <div ref={scrollContainerRef} className="overflow-x-auto no-scrollbar py-2">
          <div className="flex gap-6 pl-4 sm:pl-6 md:pl-10 lg:pl-20 pr-4 sm:pr-6 md:pr-10 lg:pr-20">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="w-[280px] sm:w-[300px] flex-shrink-0"
              >
                <OfferCard deal={offer} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="container mt-6 flex items-center justify-end gap-4"
      >
        {seeAllLink && seeAllLink.trim() !== '' && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="ghost" className="hidden md:flex">
                  <Link href={seeAllLink} className="flex items-center">
                    See all
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              {seeAllText && (
                <TooltipContent>
                  <p>{seeAllText}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full shadow-sm transition-all duration-200 hover:scale-105"
            onClick={() => scroll('left')}
            disabled={!showArrows.left}
            aria-label="Scroll offers left"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full shadow-sm transition-all duration-200 hover:scale-105"
            onClick={() => scroll('right')}
            disabled={!showArrows.right}
            aria-label="Scroll offers right"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OfferCarousel;