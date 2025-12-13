'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Command } from 'cmdk';
import {
    Search,
    TrendingUp,
    Sparkles,
    Tag,
    Clock,
    ArrowRight,
    Zap,
    Star,
    X,
} from 'lucide-react';
import type { Offer } from '@/types';
import { searchOffers } from '@/lib/searchUtils';
import { cn } from '@/lib/utils';

interface SearchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// Popular searches with action types
// 'category' = navigate to category page, 'search' = text search with synonym expansion
const POPULAR_SEARCHES = [
    { term: 'Design Tools', action: 'category' as const, target: 'design-and-uiux', icon: Sparkles },
    { term: 'Student Discounts', action: 'category' as const, target: 'student-discount-platforms', icon: Tag },
    { term: 'Free Trials', action: 'search' as const, target: 'free trial', icon: Zap },
    { term: 'Coding Tools', action: 'search' as const, target: 'coding', icon: Star },
];

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
    const router = useRouter();
    const [query, setQuery] = React.useState('');
    const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // On-demand offers fetching
    const [offers, setOffers] = React.useState<Offer[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [hasFetched, setHasFetched] = React.useState(false);

    // Load recent searches from localStorage
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('recent-searches');
            if (saved) {
                try {
                    setRecentSearches(JSON.parse(saved));
                } catch {
                    // Ignore parse errors
                }
            }
        }
    }, []);

    // Fetch offers on-demand when dialog opens (only once)
    React.useEffect(() => {
        if (open && !hasFetched) {
            setIsLoading(true);
            fetch('/api/offers')
                .then(res => res.json())
                .then(data => {
                    setOffers(data || []);
                    setHasFetched(true);
                })
                .catch(err => {
                    console.error('Failed to fetch offers for search:', err);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [open, hasFetched]);

    // Focus input and reset query when dialog opens
    React.useEffect(() => {
        if (open) {
            setQuery('');
            // Small delay to ensure dialog is rendered before focusing
            const timer = setTimeout(() => inputRef.current?.focus(), 50);
            return () => clearTimeout(timer);
        }
    }, [open]);

    // Save search term to recent searches
    const saveRecentSearch = React.useCallback((term: string) => {
        if (!term.trim()) return;
        const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recent-searches', JSON.stringify(updated));
    }, [recentSearches]);

    // Handle offer selection - navigate to tools page with offer name as search query
    // (Offers are viewed via modals on the grid, not dedicated pages)
    const handleSelectOffer = React.useCallback((offer: Offer) => {
        saveRecentSearch(offer.name);
        onOpenChange(false);
        // Navigate to tools page with the offer name as search query
        // This will highlight/show the offer so user can click to view details
        router.push(`/tools?q=${encodeURIComponent(offer.name)}`);
    }, [saveRecentSearch, onOpenChange, router]);

    // Handle category selection - navigate to /tools with category filter
    const handleCategorySelect = React.useCallback((categorySlug: string) => {
        onOpenChange(false);
        router.push(`/tools?category=${encodeURIComponent(categorySlug)}`);
    }, [onOpenChange, router]);

    // Handle popular search click - navigate based on action type
    const handlePopularSelect = React.useCallback((search: typeof POPULAR_SEARCHES[number]) => {
        onOpenChange(false);
        if (search.action === 'category') {
            router.push(`/tools?category=${search.target}`);
        } else {
            saveRecentSearch(search.term);
            router.push(`/tools?q=${encodeURIComponent(search.target)}`);
        }
    }, [onOpenChange, router, saveRecentSearch]);

    // Handle recent search click - navigate to search
    const handleRecentSearchSelect = React.useCallback((term: string) => {
        saveRecentSearch(term);
        onOpenChange(false);
        router.push(`/tools?q=${encodeURIComponent(term)}`);
    }, [saveRecentSearch, onOpenChange, router]);

    // Clear recent search
    const clearRecentSearch = React.useCallback((term: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = recentSearches.filter(s => s !== term);
        setRecentSearches(updated);
        localStorage.setItem('recent-searches', JSON.stringify(updated));
    }, [recentSearches]);

    // Clear all recent searches
    const clearAllRecentSearches = React.useCallback(() => {
        setRecentSearches([]);
        localStorage.removeItem('recent-searches');
    }, []);

    // Helper: Convert category name to slug (e.g., "AI Tools" → "ai-tools")
    const categoryToSlug = React.useCallback((name: string): string => {
        return name
            .toLowerCase()
            .trim()
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }, []);

    // Get unique categories from offers with name and slug
    const categories = React.useMemo(() => {
        const cats = new Map<string, { name: string; slug: string }>();
        offers.forEach(offer => {
            if (offer.category_main && !cats.has(offer.category_main)) {
                cats.set(offer.category_main, {
                    name: offer.category_main,
                    slug: categoryToSlug(offer.category_main)
                });
            }
        });
        return Array.from(cats.values()).sort((a, b) => a.name.localeCompare(b.name)).slice(0, 6);
    }, [offers, categoryToSlug]);

    // Search results with fuzzy matching
    const searchResults = React.useMemo(() => {
        if (!query.trim()) {
            return offers.filter(o => o.is_featured).slice(0, 5);
        }
        return searchOffers(offers, query).slice(0, 8);
    }, [offers, query]);

    // Common item classes for light/dark mode support
    const itemClass = cn(
        "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none transition-colors",
        "text-foreground",
        "hover:bg-accent hover:text-accent-foreground",
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
        "aria-selected:bg-accent aria-selected:text-accent-foreground"
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    "overflow-hidden p-0 shadow-2xl",
                    "w-[calc(100vw-2rem)] sm:w-full max-w-2xl",
                    "border border-border",
                    "max-h-[85vh] sm:max-h-[80vh]"
                )}
                hideCloseButton
            >
                {/* Accessibility: Hidden title and description for screen readers */}
                <VisuallyHidden>
                    <DialogTitle>Search</DialogTitle>
                    <DialogDescription>Search for tools, categories, and offers using keyboard navigation</DialogDescription>
                </VisuallyHidden>

                <Command
                    className="flex h-full w-full flex-col overflow-hidden rounded-lg bg-popover text-popover-foreground"
                    shouldFilter={false}
                    loop
                >
                    {/* Search Input */}
                    <div className="flex items-center border-b border-border px-3 sm:px-4" data-cmdk-input-wrapper="">
                        <Search className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-muted-foreground" />
                        <Command.Input
                            ref={inputRef}
                            value={query}
                            onValueChange={setQuery}
                            placeholder="Search tools, categories..."
                            className={cn(
                                "flex h-12 sm:h-14 w-full bg-transparent py-3 text-sm sm:text-base",
                                "outline-none ring-0 focus:ring-0 focus:outline-none border-0",
                                "placeholder:text-muted-foreground",
                                "disabled:cursor-not-allowed disabled:opacity-50"
                            )}
                        />
                        {/* Clear button on mobile */}
                        {query && (
                            <button
                                onClick={() => setQuery('')}
                                className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors sm:hidden"
                                aria-label="Clear search"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Results List - responsive height */}
                    <Command.List className="max-h-[50vh] sm:max-h-[400px] overflow-y-auto overflow-x-hidden p-1.5 sm:p-2">
                        {/* Loading State */}
                        {isLoading && (
                            <Command.Loading className="py-6 sm:py-8 text-center">
                                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                    <span>Loading...</span>
                                </div>
                            </Command.Loading>
                        )}

                        {/* Empty State */}
                        {!isLoading && query && searchResults.length === 0 && (
                            <Command.Empty className="py-6 sm:py-8 text-center">
                                <Search className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground opacity-40 mb-2" />
                                <p className="text-sm text-muted-foreground">No results found for &quot;{query}&quot;</p>
                                <p className="text-xs text-muted-foreground/70 mt-1">Try a different search term</p>
                            </Command.Empty>
                        )}

                        {!query && recentSearches.length > 0 && (
                            <Command.Group
                                heading={
                                    <div className="flex items-center justify-between">
                                        <span>Recent</span>
                                        <button
                                            onClick={clearAllRecentSearches}
                                            className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                }
                                className="mb-2"
                            >
                                {recentSearches.map((term, i) => (
                                    <Command.Item
                                        key={`recent-${i}`}
                                        value={`recent-${term}`}
                                        onSelect={() => handleRecentSearchSelect(term)}
                                        className="relative flex cursor-pointer select-none items-center rounded-lg px-3 py-1.5 text-sm outline-none transition-colors text-foreground hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground group/recent"
                                    >
                                        <Clock className="mr-2 sm:mr-3 h-4 w-4 text-muted-foreground flex-shrink-0" />
                                        <span className="flex-1 truncate">{term}</span>
                                        <button
                                            onClick={(e) => clearRecentSearch(term, e)}
                                            className="p-1 -mr-1 text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
                                            aria-label={`Remove ${term} from recent searches`}
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}

                        {/* Popular Searches */}
                        {!query && (
                            <Command.Group heading="Popular" className="mb-2">
                                {POPULAR_SEARCHES.map((search) => (
                                    <Command.Item
                                        key={search.term}
                                        value={`popular-${search.term}`}
                                        onSelect={() => handlePopularSelect(search)}
                                        className={itemClass}
                                    >
                                        <search.icon className="mr-2 sm:mr-3 h-4 w-4 text-primary" />
                                        <span className="flex-1">{search.term}</span>
                                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}

                        {/* Categories */}
                        {!query && categories.length > 0 && (
                            <Command.Group heading="Categories" className="mb-2">
                                {categories.map((cat) => (
                                    <Command.Item
                                        key={cat.slug}
                                        value={`category-${cat.slug}`}
                                        onSelect={() => handleCategorySelect(cat.slug)}
                                        className={itemClass}
                                    >
                                        <Tag className="mr-2 sm:mr-3 h-4 w-4 text-muted-foreground" />
                                        <span className="flex-1 truncate">{cat.name}</span>
                                        <span className="text-xs text-muted-foreground tabular-nums">
                                            {offers.filter(o => o.category_main === cat.name).length}
                                        </span>
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}

                        {/* Separator between sections */}
                        {!query && searchResults.length > 0 && (
                            <Command.Separator className="my-1.5 h-px bg-border" />
                        )}

                        {/* Search Results / Featured */}
                        {!isLoading && searchResults.length > 0 && (
                            <Command.Group heading={query ? 'Results' : 'Featured'}>
                                {searchResults.map((offer) => (
                                    <Command.Item
                                        key={offer.id}
                                        value={`offer-${offer.name}-${offer.id}`}
                                        onSelect={() => handleSelectOffer(offer)}
                                        className={cn(itemClass, "group")}
                                    >
                                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                            <div className="relative flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 flex items-center justify-center overflow-hidden">
                                                {offer.logo ? (
                                                    offer.logo.endsWith('.mp4') || offer.logo.endsWith('.webm') ? (
                                                        <video
                                                            src={offer.logo}
                                                            className="w-full h-full object-cover"
                                                            autoPlay
                                                            loop
                                                            muted
                                                            playsInline
                                                        />
                                                    ) : (
                                                        <Image
                                                            src={offer.logo}
                                                            alt={offer.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    )
                                                ) : (
                                                    <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-medium truncate text-foreground">{offer.name}</span>
                                                    {offer.is_featured && (
                                                        <Star className="h-3 w-3 text-primary fill-primary flex-shrink-0" />
                                                    )}
                                                </div>
                                                {offer.category_main && (
                                                    <p className="text-xs text-muted-foreground truncate">{offer.category_main}</p>
                                                )}
                                            </div>
                                        </div>
                                        <ArrowRight className="ml-2 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-data-[selected=true]:opacity-100 transition-opacity" />
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}
                    </Command.List>

                    {/* Footer with keyboard hints - hidden on very small screens */}
                    <div className="hidden sm:block border-t border-border px-3 py-2 text-xs text-muted-foreground bg-muted/30 dark:bg-muted/20">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px]">↑↓</kbd>
                                navigate
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px]">↵</kbd>
                                select
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px]">esc</kbd>
                                close
                            </span>
                        </div>
                    </div>

                    {/* Mobile: Tap anywhere outside hint */}
                    <div className="sm:hidden border-t border-border px-3 py-2 text-center text-xs text-muted-foreground bg-muted/30 dark:bg-muted/20">
                        Tap outside to close
                    </div>
                </Command>
            </DialogContent>
        </Dialog>
    );
}
