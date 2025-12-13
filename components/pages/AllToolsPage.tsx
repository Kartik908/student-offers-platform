'use client';

import { useState, useEffect, useMemo } from "react";
import CategoryNav from "@/components/categories/CategoryNav";
import SmartFilterBar from "@/components/offers/SmartFilterBar";
import OfferCard from "@/components/offers/OfferCard";
import OfferListItem from "@/components/offers/OfferListItem";
import { generateCategoriesFromOffers, offerMatchesCategory } from "@/lib/categoryUtils";
import { useOfferFilters } from "@/hooks/useOfferFilters";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useOffers } from "@/providers/OffersProvider";
import { Button } from "@/components/ui/button";
import { Offer } from "@/types";
import SuggestedOffers from "@/components/offers/SuggestedOffers";
// Lazy load the sticky bar to save initial bundle size
import { lazy, Suspense } from "react";
const GitHubPackStickyBar = lazy(() => import("@/components/promo/GitHubPackStickyBar"));
import { cn } from "@/lib/utils";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { OfferGridLoadingState } from "@/components/offers/OfferGridLoadingState";
import { ContentEmptyState } from "@/components/common";
import { Search, LayoutGrid, List } from "lucide-react";
import { SEO } from "@/components/seo/SEO";

interface AllToolsProps {
  offers: Offer[];
}

const AllTools = ({ offers }: AllToolsProps) => {
  // const { data: offers, isLoading, error } = useOffers(); // Removed in favor of server-passed props
  const {
    selectedCategory,
    selectedSubcategory,
    searchQuery,
    activeFilters,
    sortBy,
    itemsPerPage,
    view,
    currentPage,
    filteredOffers,
    sortedOffers,
    paginatedOffers,
    totalPages,
    subcategories,
    availableTags,
    handleCategoryChange,
    handlePageChange,
    handleSortChange,
    handleItemsPerPageChange,
    handleViewChange,
    handleSubcategoryChange,
    handleTagsChange,
    clearAllFilters,
    clearAllParams,
  } = useOfferFilters(offers);

  const [highlightedOfferId, setHighlightedOfferId] = useState<number | null>(null);
  const isGitHubCategory = selectedCategory === 'github';

  // Generate categories dynamically from offers
  const categories = useMemo(() => {
    if (!offers) return [];
    return generateCategoriesFromOffers(offers);
  }, [offers]);

  // Scroll to top match when searching
  useEffect(() => {
    if (searchQuery && offers && sortedOffers.length > 0) {
      const topMatchId = sortedOffers[0].id;
      const itemIndex = sortedOffers.findIndex(d => d.id === topMatchId);
      const pageOfItem = Math.floor(itemIndex / itemsPerPage) + 1;

      // Note: Page change is handled by the hook if needed, but here we might need to sync if we want to jump to it.
      // However, the hook handles page resets on search.
      // If we want to force jump to the page of the item:
      if (currentPage !== pageOfItem) handlePageChange(pageOfItem);

      setHighlightedOfferId(topMatchId);
      setTimeout(() => {
        const element = document.getElementById(`offer-${topMatchId}`);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
      const timer = setTimeout(() => setHighlightedOfferId(null), 2500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, offers]); // Intentionally not including sortedOffers to avoid loops, just when query changes

  // Update page title dynamically based on category and search
  useEffect(() => {
    let title = 'All Tools';

    if (searchQuery) {
      title = `Search: ${searchQuery}`;
    } else if (selectedCategory && selectedCategory !== 'all') {
      // Try to find category from generated categories
      const category = categories.find(cat => cat.id === selectedCategory);
      if (category) {
        title = category.name;
      } else {
        // Fallback: capitalize and format the category ID
        title = selectedCategory
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    }

    document.title = `${title} | Student Offers`;
  }, [selectedCategory, searchQuery, categories]);

  // Filters are active only if subcategory, tags, or search are applied
  const areFiltersActive = selectedSubcategory || searchQuery !== '' || activeFilters.length > 0;

  const selectedCategoryInfo = useMemo(() => {
    if (selectedCategory === 'all') return { name: 'All Tools' };
    if (selectedCategory === 'github') return { name: 'GitHub Student Pack' };
    return categories.find(c => c.id === selectedCategory);
  }, [selectedCategory, categories]);

  const { suggestedOffers, suggestedOffersTitle } = useMemo(() => {
    if (!offers) return { suggestedOffers: [], suggestedOffersTitle: '' };

    // If we have plenty of results, no need for suggestions
    if (filteredOffers && filteredOffers.length >= 4) {
      return { suggestedOffers: [], suggestedOffersTitle: '' };
    }

    const filteredOfferIds = new Set(filteredOffers.map(d => d.id));
    const suggestions: Offer[] = [];
    const suggestionIds = new Set<number>();

    // Helper to add unique suggestions
    const addSuggestion = (offer: Offer) => {
      if (!filteredOfferIds.has(offer.id) && !suggestionIds.has(offer.id)) {
        suggestions.push(offer);
        suggestionIds.add(offer.id);
      }
    };

    // 1. Context-Aware Suggestions (Tag Scoring)
    // Collect tags from the current filtered results to understand user intent
    const currentTags = new Set<string>();
    filteredOffers.forEach(offer => {
      [offer.tag1, offer.tag2, offer.tag3].forEach(tag => {
        if (tag) currentTags.add(tag.toLowerCase());
      });
    });

    // Score other offers based on tag overlap
    const scoredOffers = offers
      .filter(offer => !filteredOfferIds.has(offer.id)) // Exclude current results
      .map(offer => {
        let score = 0;
        [offer.tag1, offer.tag2, offer.tag3].forEach(tag => {
          if (tag && currentTags.has(tag.toLowerCase())) {
            score += 1;
          }
        });
        return { offer, score };
      })
      .filter(item => item.score > 0) // Only keep relevant ones
      .sort((a, b) => b.score - a.score); // Sort by relevance

    // Add top scored offers
    scoredOffers.forEach(item => {
      if (suggestions.length < 4) {
        addSuggestion(item.offer);
      }
    });

    // 2. Fallback: Category-based suggestions (if searching/filtering didn't yield enough tags)
    if (suggestions.length < 4 && selectedCategory !== 'all') {
      offers.forEach(offer => {
        if (suggestions.length >= 4) return;
        if (offerMatchesCategory(offer, selectedCategory)) {
          addSuggestion(offer);
        }
      });
    }

    // 3. Fallback: Popular/Random (fill the rest)
    if (suggestions.length < 4) {
      // Prioritize "Popular" or "Featured" if available, otherwise just fill
      offers.forEach(offer => {
        if (suggestions.length >= 4) return;
        if (offer.is_featured || offer.is_hidden_gem) {
          addSuggestion(offer);
        }
      });

      // Final fill
      offers.forEach(offer => {
        if (suggestions.length >= 4) return;
        addSuggestion(offer);
      });
    }

    // Determine Title
    let title = "You might also like";
    if (searchQuery) {
      title = "Related to your search";
    } else if (selectedCategory !== 'all') {
      const categoryName = selectedCategoryInfo?.name || "Category";
      title = `Similar ${categoryName} Tools`;
    }

    return { suggestedOffers: suggestions, suggestedOffersTitle: title };
  }, [offers, filteredOffers, selectedCategory, searchQuery, selectedCategoryInfo]);

  const pageHeading = selectedCategoryInfo?.name || 'All Tools';

  // Filter summary
  const filterSummary = [
    selectedSubcategory,
    ...activeFilters,
    searchQuery ? `"${searchQuery}"` : null
  ].filter(Boolean).join(' • ');

  return (
    <div style={{ overflow: 'visible' }}>
      <SEO
        title={pageHeading}
        description={`Browse verified student discounts for ${pageHeading}. Find the best deals on developer tools, design software, and more.`}
        canonical="https://studentoffers.co/tools"
      />
      <CategoryNav activeCategory={selectedCategory} onCategoryChange={handleCategoryChange} categories={categories} />
      <div className={cn("container py-6 md:py-10 transition-all duration-300", isGitHubCategory && "pb-32 sm:pb-28")}>
        <div className="mb-4 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-semibold">{pageHeading}</h1>
              <div className="flex flex-wrap items-center text-sm text-muted-foreground mt-2 gap-x-2">
                <span>Showing {sortedOffers.length} offers</span>
                {areFiltersActive && (
                  <>
                    <span className="hidden sm:inline">-</span>
                    <span className="font-medium text-foreground max-w-xs truncate">{filterSummary}</span>
                    <Button variant="link" className="h-auto p-0 text-sm" onClick={clearAllParams}>Clear</Button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile: Inline controls with wrap */}
            <div className="flex flex-row flex-wrap items-center gap-2 w-full sm:w-auto">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Select value={sortBy} onValueChange={handleSortChange}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="popular">Popular</SelectItem>
                        <SelectItem value="alphabetical">Alphabetical A-Z</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sort by</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Select value={String(itemsPerPage)} onValueChange={(v) => handleItemsPerPageChange(Number(v))}>
                      <SelectTrigger className="w-[80px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12</SelectItem>
                        <SelectItem value="24">24</SelectItem>
                        <SelectItem value="48">48</SelectItem>
                        <SelectItem value="96">96</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Items per page</p>
                </TooltipContent>
              </Tooltip>
              <ToggleGroup type="single" value={view} defaultValue="grid" onValueChange={(v) => v && handleViewChange(v as 'grid' | 'list')} variant="outline" className="w-auto ml-auto">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <ToggleGroupItem value="grid" aria-label="Grid view">
                        <LayoutGrid className="h-4 w-4" />
                      </ToggleGroupItem>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Grid view</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <ToggleGroupItem value="list" aria-label="List view">
                        <List className="h-4 w-4" />
                      </ToggleGroupItem>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>List view</p>
                  </TooltipContent>
                </Tooltip>
              </ToggleGroup>
            </div>
          </div>
        </div>

        {/* Smart Filter Bar - Combined subcategories and tags */}
        {/* Only show on specific categories, NOT on "All Categories" */}
        {offers && selectedCategory !== 'all' && (subcategories.length > 0 || availableTags.length > 0) && (
          <SmartFilterBar
            subcategories={subcategories}
            tags={availableTags}
            selectedSubcategory={selectedSubcategory}
            selectedTags={activeFilters}
            onSubcategoryChange={handleSubcategoryChange}
            onTagsChange={handleTagsChange}
            onClearAll={clearAllFilters}
          />
        )}

        {/* Smart Filter Bar - Combined subcategories and tags */}
        {offers && (
          <>
            {paginatedOffers.length > 0 ? (
              view === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-4 sm:mt-6">
                  {paginatedOffers.map((offer) => (
                    <div key={offer.id} id={`offer-${offer.id}`} className="offer-card-wrapper">
                      <OfferCard deal={offer} isHighlighted={highlightedOfferId === offer.id} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-6">
                  {paginatedOffers.map((offer) => (
                    <div key={offer.id} id={`offer-${offer.id}`} className="offer-card-wrapper">
                      <OfferListItem deal={offer} />
                    </div>
                  ))}
                </div>
              )
            ) : (
              <ContentEmptyState Icon={Search} title="No results found" message="Try adjusting your filters or search query." />
            )}
          </>
        )}

        {/* Suggested Offers removed from hook, but we can re-add if needed. 
            Actually, the hook doesn't return suggestedOffers. 
            Let's keep it simple for now or re-implement it using the hook data.
            For now, I'll comment it out to match the plan of simplification, 
            or I should have added it to the hook.
            
            Wait, suggestedOffers logic was:
            if results < 4, show suggestions.
            
            I'll quickly re-implement it here using the data from hook, 
            or better yet, I should have added it to the hook.
            
            Since I cannot edit the hook in this tool call, I will re-implement the useMemo here 
            using the data I have (offers, filteredOffers, selectedCategory).
         */}
        {/* Re-implementing suggestedOffers locally for now */}
        {/* Re-implementing suggestedOffers locally for now */}
        {suggestedOffers.length > 0 ? <SuggestedOffers offers={suggestedOffers} title={suggestedOffersTitle} /> : null}

        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(Math.max(1, currentPage - 1)); }} className={currentPage === 1 ? "pointer-events-none opacity-50" : ""} />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PaginationItem key={page}><PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(page); }} isActive={currentPage === page}>{page}</PaginationLink></PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(Math.min(totalPages, currentPage + 1)); }} className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      <Suspense fallback={null}>
        <GitHubPackStickyBar isActive={isGitHubCategory} />
      </Suspense>
    </div >
  );
};

export default AllTools;