'use client';

import { useState, useEffect, useMemo } from "react";
import { useSearchParams as useNextSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { Offer } from "@/types";
import { offerMatchesCategory, getSubcategoriesForCategory, getTagsFromOffers } from "@/lib/categoryUtils";
import { searchOffers } from "@/lib/searchUtils";

const ITEMS_PER_PAGE = 24;

export const useOfferFilters = (offers: Offer[] | undefined) => {
  const searchParams = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedCategory = searchParams?.get("category") || "all";
  const selectedSubcategory = searchParams?.get("subcategory") || null;
  const searchQuery = searchParams?.get("q") || "";
  const activeFilters = useMemo(() => searchParams?.get("tags")?.split(',') || [], [searchParams]);

  const sortBy = (searchParams?.get("sort") as 'newest' | 'popular' | 'alphabetical') || 'newest';
  const pageParam = parseInt(searchParams?.get("page") || "1", 10);
  const itemsPerPageParam = parseInt(searchParams?.get("perPage") || String(ITEMS_PER_PAGE), 10);
  const viewParam = (searchParams?.get("view") as 'grid' | 'list') || 'grid';

  // Debounce search query for better performance (150ms delay)
  const debouncedSearchQuery = useDebounce(searchQuery, 150);

  const [currentPage, setCurrentPage] = useState(pageParam);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageParam);
  const [view, setView] = useState<'grid' | 'list'>(viewParam);

  // Sync state with URL params
  useEffect(() => {
    setCurrentPage(pageParam);
  }, [pageParam]);

  useEffect(() => {
    setItemsPerPage(itemsPerPageParam);
  }, [itemsPerPageParam]);

  useEffect(() => {
    setView(viewParam);
  }, [viewParam]);

  const updateSearchParams = (newParams: Record<string, string | null>) => {
    const currentParams = new URLSearchParams(searchParams?.toString() || '');
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "") currentParams.delete(key);
      else currentParams.set(key, value);
    });
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  const setSearchParams = (params: Record<string, string> | URLSearchParams) => {
    const newParams = params instanceof URLSearchParams ? params : new URLSearchParams(params);
    router.push(`${pathname}?${newParams.toString()}`);
  };

  // Offers filtered by category and subcategory (before tag filtering)
  const offersForTagFiltering = useMemo(() => {
    if (!offers) return [];
    let results: Offer[] = offers;

    // Filter by main category
    if (selectedCategory !== 'all') {
      results = results.filter(deal => offerMatchesCategory(deal, selectedCategory));
    }

    // Filter by subcategory (only for specific categories, not "All Categories")
    if (selectedSubcategory && selectedCategory !== 'all') {
      results = results.filter(deal =>
        deal.category_sub?.toLowerCase() === selectedSubcategory.toLowerCase()
      );
    }

    return results;
  }, [offers, selectedCategory, selectedSubcategory]);

  const filteredOffers = useMemo(() => {
    let results = [...offersForTagFiltering];

    // Filter by tags (AND logic - must have ALL selected tags)
    if (activeFilters.length > 0) {
      results = results.filter(deal =>
        activeFilters.every(filter => deal.tags?.includes(filter))
      );
    }

    // Search filtering with weighted scoring (using debounced query)
    if (debouncedSearchQuery && debouncedSearchQuery.trim().length > 0) {
      // Use the new weighted search algorithm
      results = searchOffers(results, debouncedSearchQuery);
    }

    return results;
  }, [offersForTagFiltering, activeFilters, debouncedSearchQuery]);

  // Get subcategories for the selected category
  const subcategories = useMemo(() => {
    if (!offers) return [];

    // For "All Categories", do NOT show subcategories
    if (selectedCategory === 'all') {
      return [];
    }

    // For specific categories (including GitHub), show their subcategories
    return getSubcategoriesForCategory(offers, selectedCategory);
  }, [offers, selectedCategory]);

  // Get available tags from filtered offers (excluding subcategories)
  const availableTags = useMemo(() => {
    const tags = getTagsFromOffers(offersForTagFiltering);

    // Filter out tags that match subcategories
    const subcategoriesLower = subcategories.map(sub => sub.toLowerCase());
    return tags.filter(tag => !subcategoriesLower.includes(tag.toLowerCase()));
  }, [offersForTagFiltering, subcategories]);

  const sortedOffers = useMemo(() => {
    const tempOffers = [...filteredOffers];

    // If there's a search query, maintain search relevance order
    // Only apply additional sorting if no search is active
    if (!debouncedSearchQuery || debouncedSearchQuery.length <= 1) {
      if (sortBy === 'alphabetical') {
        tempOffers.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === 'newest') {
        tempOffers.sort((a, b) => b.id - a.id);
      } else if (sortBy === 'popular') {
        // Sort by featured first, then by id
        tempOffers.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return b.id - a.id;
        });
      }
    }
    // When searching, filteredOffers already has the correct relevance order

    return tempOffers;
  }, [filteredOffers, sortBy, debouncedSearchQuery]);

  const totalPages = Math.ceil(sortedOffers.length / itemsPerPage);
  const paginatedOffers = sortedOffers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCategoryChange = (categoryId: string) => updateSearchParams({ category: categoryId === "all" ? null : categoryId, subcategory: null, q: null, tags: null, page: null });

  const handleFilterChange = (filter: string) => {
    const newFilters = activeFilters.includes(filter) ? activeFilters.filter(f => f !== filter) : [...activeFilters, filter];
    updateSearchParams({ tags: newFilters.length > 0 ? newFilters.join(',') : null, page: null });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateSearchParams({ page: page > 1 ? String(page) : null });
    window.scrollTo(0, 0);
  };

  const handleSortChange = (newSort: 'newest' | 'popular' | 'alphabetical') => {
    updateSearchParams({ sort: newSort !== 'newest' ? newSort : null, page: null });
  };

  const handleItemsPerPageChange = (newPerPage: number) => {
    setItemsPerPage(newPerPage);
    updateSearchParams({ perPage: newPerPage !== ITEMS_PER_PAGE ? String(newPerPage) : null, page: null });
  };

  const handleViewChange = (newView: 'grid' | 'list') => {
    setView(newView);
    updateSearchParams({ view: newView !== 'grid' ? newView : null });
  };

  const clearAllFilters = () => {
    updateSearchParams({
      subcategory: null,
      tags: null,
      page: null
    });
  };

  const clearAllParams = () => setSearchParams({});

  const handleSubcategoryChange = (subcategory: string | null) => {
    updateSearchParams({
      subcategory: subcategory || null,
      page: null
    });
  };

  const handleTagsChange = (tags: string[]) => {
    updateSearchParams({
      tags: tags.length > 0 ? tags.join(',') : null,
      page: null
    });
  };

  return {
    // State
    selectedCategory,
    selectedSubcategory,
    searchQuery,
    activeFilters,
    sortBy,
    itemsPerPage,
    view,
    currentPage,

    // Derived Data
    filteredOffers,
    sortedOffers,
    paginatedOffers,
    totalPages,
    subcategories,
    availableTags,

    // Handlers
    handleCategoryChange,
    handleFilterChange, // Note: This seems to be for single tag toggle, but SmartFilterBar uses handleTagsChange (array)
    handlePageChange,
    handleSortChange,
    handleItemsPerPageChange,
    handleViewChange,
    handleSubcategoryChange,
    handleTagsChange,
    clearAllFilters,
    clearAllParams,
    setSearchParams // Expose if needed for direct manipulation
  };
};
