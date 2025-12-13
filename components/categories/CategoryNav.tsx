'use client';

/**
 * A sticky navigation bar for browsing offer categories.
 */
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from '@/lib/utils';
import { Category } from '@/types';

interface CategoryNavProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  categories: Category[];
}

const CategoryNav = ({ activeCategory, onCategoryChange, categories }: CategoryNavProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState({ left: false, right: false });
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // All categories including "all" and priority categories in specific order
  const allCategories = React.useMemo(() => {
    // Start with "All Tools"
    const ordered: Category[] = [
      { id: 'all', name: 'All Tools', icon: '' } // explicit empty string for no icon
    ];

    // Add AI Tools (2nd position)
    const aiTools = categories.find(c => c.id === 'ai-tools');
    if (aiTools) {
      ordered.push(aiTools);
    }

    // Add GitHub Student Pack (3rd position - always shown)
    // Use 'Github' string to match Category type and dynamic lookup
    ordered.push({ id: 'github', name: 'GitHub Student Pack', icon: 'Github' });

    // Add other priority categories
    const productivity = categories.find(c => c.id === 'productivity');
    if (productivity) {
      ordered.push(productivity);
    }

    const development = categories.find(c => c.id === 'development');
    if (development) {
      ordered.push(development);
    }

    // Add remaining categories (excluding ones already added)
    const addedIds = new Set(ordered.map(c => c.id));
    const remaining = categories.filter(c => !addedIds.has(c.id));

    return [...ordered, ...remaining];
  }, [categories]);

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
      // Initial check with a small delay to ensure layout is ready
      const timeoutId = setTimeout(manageArrows, 100);

      container.addEventListener('scroll', manageArrows);
      window.addEventListener('resize', manageArrows);

      return () => {
        clearTimeout(timeoutId);
        container.removeEventListener('scroll', manageArrows);
        window.removeEventListener('resize', manageArrows);
      };
    }
  }, [manageArrows, allCategories]);



  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && scrollContainerRef.current) {
      const focusedButton = scrollContainerRef.current.querySelector(`[data-category-index="${focusedIndex}"]`);
      if (focusedButton) {
        focusedButton.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    }
  }, [focusedIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (focusedIndex === -1) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setFocusedIndex(prev => prev > 0 ? prev - 1 : prev);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setFocusedIndex(prev => prev < allCategories.length - 1 ? prev + 1 : prev);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < allCategories.length) {
          onCategoryChange(allCategories[focusedIndex].id);
          setFocusedIndex(-1); // Reset focus after selection
        }
      } else if (e.key === 'Escape') {
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, allCategories, onCategoryChange]);

  useEffect(() => {
    if (scrollContainerRef.current && activeCategory) {
      const activeButton = scrollContainerRef.current.querySelector<HTMLButtonElement>(
        `[data-category-id="${activeCategory}"]`
      );

      if (activeButton) {
        setTimeout(() => {
          activeButton.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest'
          });
        }, 100);
      }
    }
  }, [activeCategory]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const nonActiveClasses = "hover:bg-accent hover:text-accent-foreground";

  return (
    <div
      className="sticky top-16 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm"
      style={{
        position: 'sticky',
        top: '4rem',
        zIndex: 40,
        willChange: 'transform'
      }}
    >
      <div className="container relative py-4 sm:py-6">
        <div ref={scrollContainerRef} className="overflow-x-auto no-scrollbar scroll-smooth">
          <nav className="flex items-center gap-2 whitespace-nowrap py-1" role="navigation" aria-label="Category navigation">
            {allCategories.map((category, index) => {
              const isActive = activeCategory === category.id;

              // Resolve icon component from string name dynamically
              // If icon is present but not found in LucideIcons, fallback to Package
              // If icon is empty string/null (like All Tools), render nothing
              let IconComponent = null;

              if (category.icon) {
                if (typeof category.icon === 'string') {
                  IconComponent = (LucideIcons as any)[category.icon] || LucideIcons.Package;
                } else {
                  // Fallback if it somehow is already a component (though types say string)
                  IconComponent = category.icon;
                }
              }

              return (
                <Button
                  key={category.id}
                  data-category-id={category.id}
                  data-category-index={index}
                  variant={isActive ? "default" : "outline"}
                  className={cn(
                    "h-10 sm:h-12 px-3 sm:px-4 rounded-lg sm:rounded-xl flex-shrink-0 text-xs sm:text-sm focus-visible:ring-0 focus-visible:ring-offset-0",
                    isActive ? "font-semibold shadow-sm" : nonActiveClasses
                  )}
                  onClick={() => {
                    onCategoryChange(category.id);
                    setFocusedIndex(-1);
                    // Scroll to top when category changes
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(-1)}
                  tabIndex={0}
                >
                  {IconComponent && <IconComponent className="mr-1.5 h-5 w-5" />}
                  <span className="font-medium whitespace-nowrap">{category.name}</span>
                </Button>
              );
            })}
          </nav>
        </div>
        {showArrows.left && (
          <div className="absolute left-0 top-0 bottom-0 flex items-center bg-gradient-to-r from-background via-background/80 to-transparent pr-12 pointer-events-none">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full shadow-sm ml-2 pointer-events-auto"
              onClick={() => scroll('left')}
              aria-label="Scroll categories left"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
        )}
        {showArrows.right && (
          <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end bg-gradient-to-l from-background via-background/80 to-transparent pl-12 pointer-events-none">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full shadow-sm mr-2 pointer-events-auto"
              onClick={() => scroll('right')}
              aria-label="Scroll categories right"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryNav;