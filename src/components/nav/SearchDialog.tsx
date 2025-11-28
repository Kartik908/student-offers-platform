import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Tag } from "lucide-react";
import { CloseButton } from "@/components/ui/close-button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { generateCategoriesFromOffers } from "@/lib/categoryUtils";
import { trackSearch } from "@/lib/trackingManager";
import { searchOffers } from '@/lib/searchUtils';
import { Offer } from '@/types';

interface SearchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    offers: Offer[] | undefined;
    isLoading: boolean;
}

// Helper function to highlight search matches
const highlightMatch = (text: string, query: string): React.ReactNode => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
        regex.test(part) ?
            <mark key={i} className="bg-primary/20 text-primary rounded px-0.5">{part}</mark> :
            part
    );
};

// Define types for search navigation items
type SearchItem =
    | { type: 'popular'; value: string }
    | { type: 'category'; value: { id: string; name: string; icon: React.ComponentType<{ className?: string }> } }
    | { type: 'tag'; value: string }
    | { type: 'tool'; value: Offer }
    | { type: 'search-result'; value: Offer };

export const SearchDialog = ({ open, onOpenChange, offers, isLoading }: SearchDialogProps) => {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = React.useState("");
    const [debouncedSearchValue, setDebouncedSearchValue] = React.useState("");
    const [showAllCategories, setShowAllCategories] = React.useState(false);
    const [showAllFilters, setShowAllFilters] = React.useState(false);
    const [showAllTools, setShowAllTools] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(-1);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const handleHoverIndex = React.useCallback((index: number) => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        hoverTimeoutRef.current = setTimeout(() => {
            setSelectedIndex(index);
        }, 50);
    }, []);

    // Generate categories dynamically from offers
    const categories = React.useMemo(() => {
        if (!offers) return [];
        return generateCategoriesFromOffers(offers);
    }, [offers]);

    const allTags = React.useMemo(() => {
        if (!offers) return [] as string[];
        const tags = new Set<string>();
        offers.forEach(d => d.tags?.forEach(t => tags.add(t)));
        return Array.from(tags).sort();
    }, [offers]);

    // Debounced search effect
    React.useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            setDebouncedSearchValue(searchValue);
        }, 200);

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [searchValue]);

    // Scroll focused item into view
    React.useEffect(() => {
        if (selectedIndex >= 0 && scrollContainerRef.current) {
            // Small delay to ensure DOM is updated
            const timeoutId = setTimeout(() => {
                const focusedElement = scrollContainerRef.current?.querySelector(`[data-nav-index="${selectedIndex}"]`);
                if (focusedElement && scrollContainerRef.current) {
                    const container = scrollContainerRef.current;
                    const elementRect = focusedElement.getBoundingClientRect();
                    const containerRect = container.getBoundingClientRect();

                    // Check if element is fully visible
                    const isVisible =
                        elementRect.top >= containerRect.top &&
                        elementRect.bottom <= containerRect.bottom;

                    if (!isVisible) {
                        focusedElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                            inline: 'nearest'
                        });
                    }
                }
            }, 10);

            return () => clearTimeout(timeoutId);
        }
    }, [selectedIndex]);

    // Reset expanded states when dialog closes
    React.useEffect(() => {
        if (!open) {
            setShowAllCategories(false);
            setShowAllFilters(false);
            setShowAllTools(false);
            // Clear any pending timeouts
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = null;
            }
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
                debounceTimeoutRef.current = null;
            }
            // Reset debounced search value
            setDebouncedSearchValue("");
            setSearchValue("");
            setSelectedIndex(-1);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={(newOpen) => {
            onOpenChange(newOpen);
        }}>
            <DialogContent className="w-[92%] max-w-[640px] sm:max-w-2xl max-h-[90vh] overflow-hidden p-0 gap-0 [&>button]:hidden rounded-lg shadow-lg sm:shadow-xl">
                <div className="flex items-center border-b px-3 relative">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Input
                        placeholder="Search for tools, categories, or filters..."
                        value={searchValue}
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                            setSelectedIndex(-1); // Reset selection when typing

                            // Track search input changes with PostHog
                            if (typeof window !== 'undefined' && window.posthog && e.target.value.length > 2) {
                                // Type assertion for PostHog instance
                                (window.posthog as { capture: (event: string, properties?: Record<string, unknown>) => void }).capture('search_input', {
                                    query: e.target.value,
                                    query_length: e.target.value.length,
                                });
                            }
                        }}
                        role="combobox"
                        aria-expanded="true"
                        aria-controls="search-listbox"
                        aria-autocomplete="list"
                        aria-activedescendant={selectedIndex >= 0 ? `option-${selectedIndex}` : undefined}
                        onKeyDown={(e) => {
                            // Build complete navigation list
                            const allNavigableItems: SearchItem[] = (() => {
                                if (!offers || !debouncedSearchValue || debouncedSearchValue.length === 0) {
                                    // Default state: popular searches + categories + filters + tools
                                    const items: SearchItem[] = [];

                                    // Popular searches
                                    items.push(
                                        { type: 'popular', value: "AI tools" },
                                        { type: 'popular', value: "GitHub Student Pack" },
                                        { type: 'popular', value: "Figma" },
                                        { type: 'popular', value: "Notion" }
                                    );

                                    // Categories
                                    const visibleCategories = categories.slice(0, showAllCategories ? categories.length : 10);
                                    visibleCategories.forEach(c => {
                                        items.push({ type: 'category', value: c });
                                    });

                                    // Filters/Tags
                                    const visibleTags = allTags.slice(0, showAllFilters ? allTags.length : 10);
                                    visibleTags.forEach(tag => {
                                        items.push({ type: 'tag', value: tag });
                                    });

                                    // Tools
                                    const visibleTools = offers.slice(0, showAllTools ? offers.length : 15);
                                    visibleTools.forEach(tool => {
                                        items.push({ type: 'tool', value: tool });
                                    });

                                    return items;
                                } else {
                                    // Search state: only search results
                                    const query = debouncedSearchValue.toLowerCase().trim();
                                    let filteredResults: Offer[] = [];

                                    // Use the same search logic as AllTools page
                                    filteredResults = searchOffers(offers, debouncedSearchValue);

                                    return filteredResults.slice(0, 8).map(tool => ({ type: 'search-result', value: tool }));
                                }
                            })();

                            if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                setSelectedIndex(prev => {
                                    if (prev < allNavigableItems.length - 1) {
                                        return prev + 1;
                                    }
                                    // Wrap to first item
                                    return 0;
                                });
                            } else if (e.key === 'ArrowUp') {
                                e.preventDefault();
                                setSelectedIndex(prev => {
                                    if (prev > 0) {
                                        return prev - 1;
                                    } else if (prev === 0) {
                                        // Wrap to last item
                                        return allNavigableItems.length - 1;
                                    }
                                    // From input (-1), go to last item
                                    return allNavigableItems.length - 1;
                                });
                            } else if (e.key === 'Enter') {
                                e.preventDefault();
                                if (selectedIndex >= 0 && selectedIndex < allNavigableItems.length) {
                                    const selectedItem = allNavigableItems[selectedIndex];
                                    onOpenChange(false);

                                    switch (selectedItem.type) {
                                        case 'popular': {
                                            const term = selectedItem.value;
                                            const to = term === "AI tools"
                                                ? `/tools?category=ai-tools`
                                                : term === "GitHub Student Pack" ? `/tools?category=github` : `/tools?q=${encodeURIComponent(term)}`;
                                            navigate(to);
                                            break;
                                        }
                                        case 'category':
                                            navigate(`/tools?category=${selectedItem.value.id}`);
                                            break;
                                        case 'tag':
                                            navigate(`/tools?tags=${encodeURIComponent(selectedItem.value)}`);
                                            break;
                                        case 'tool':
                                        case 'search-result':
                                            // Navigate with offer ID to ensure exact match
                                            navigate(`/tools?q=${encodeURIComponent(selectedItem.value.name)}&id=${selectedItem.value.id}`);
                                            break;
                                    }
                                } else if (searchValue.trim()) {
                                    // No selection, search for current input
                                    trackSearch(searchValue, 0);
                                    onOpenChange(false);
                                    navigate(`/tools?q=${encodeURIComponent(searchValue)}`);
                                }
                            } else if (e.key === 'Escape') {
                                onOpenChange(false);
                            } else if (e.key === 'Tab') {
                                // Keep focus in the input, don't let Tab escape
                                e.preventDefault();
                            } else {
                                // Reset selection when typing
                                setSelectedIndex(-1);
                            }
                        }}
                        className="flex h-10 w-full border-0 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 pr-8"
                        autoFocus
                    />
                    <CloseButton
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        variant="default"
                        size="md"
                        onClose={() => onOpenChange(false)}
                        ariaLabel="Close search"
                    />
                    {selectedIndex >= 0 && (
                        <div className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            ↑↓ navigate • ↵ select • esc close
                        </div>
                    )}
                </div>
                <div
                    ref={scrollContainerRef}
                    id="search-listbox"
                    className="max-h-[300px] overflow-y-auto scroll-smooth"
                    style={{ scrollPaddingTop: '0px', scrollPaddingBottom: '12px' }}
                    role="listbox"
                    aria-label="Search results"
                >
                    {(isLoading && !offers) && (
                        <div className="py-6 text-center text-sm">
                            <div className="inline-flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                Loading...
                            </div>
                        </div>
                    )}
                    {!isLoading && (!searchValue || searchValue.length === 0) && (
                        <>
                            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Popular Searches</div>
                            {["AI tools", "GitHub Student Pack", "Figma", "Notion"].map((term, index) => {
                                const to = term === "AI tools"
                                    ? `/tools?category=ai-tools`
                                    : term === "GitHub Student Pack" ? `/tools?category=github` : `/tools?q=${encodeURIComponent(term)}`;
                                const isSelected = selectedIndex === index;
                                return (
                                    <div
                                        key={term}
                                        id={`option-${index}`}
                                        data-nav-index={index}
                                        role="option"
                                        aria-selected={isSelected}
                                        className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${isSelected ? 'bg-accent text-accent-foreground' : ''
                                            }`}
                                        onPointerMove={() => handleHoverIndex(index)}
                                        onClick={() => {
                                            onOpenChange(false);
                                            navigate(to);
                                        }}
                                    >
                                        <Search className="mr-2 h-4 w-4 text-primary" />
                                        <span>{term}</span>
                                    </div>
                                );
                            })}

                            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground mt-2">Categories</div>
                            {categories.slice(0, showAllCategories ? categories.length : 10).map((c, index) => {
                                const globalIndex = 4 + index; // 4 popular searches + current category index
                                const isSelected = selectedIndex === globalIndex;
                                return (
                                    <div
                                        key={c.id}
                                        id={`option-${globalIndex}`}
                                        data-nav-index={globalIndex}
                                        role="option"
                                        aria-selected={isSelected}
                                        className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${isSelected ? 'bg-accent text-accent-foreground' : ''
                                            }`}
                                        onPointerMove={() => handleHoverIndex(globalIndex)}
                                        onClick={() => {
                                            onOpenChange(false);
                                            navigate(`/tools?category=${c.id}`);
                                        }}
                                    >
                                        <c.icon className="mr-2 h-4 w-4 text-primary" />
                                        <span>{c.name}</span>
                                    </div>
                                );
                            })}
                            {!showAllCategories && categories.length > 10 && (
                                <div
                                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                                    onClick={() => setShowAllCategories(true)}
                                    onPointerMove={() => handleHoverIndex(-1)}
                                >
                                    <span className="text-xs">+ {categories.length - 10} more categories</span>
                                </div>
                            )}

                            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground mt-2">Filters</div>
                            {allTags.slice(0, showAllFilters ? allTags.length : 6).map((tag, index) => {
                                const categoriesCount = showAllCategories ? categories.length : Math.min(10, categories.length);
                                const globalIndex = 4 + categoriesCount + index; // 4 popular + categories + current tag index
                                const isSelected = selectedIndex === globalIndex;
                                return (
                                    <div
                                        key={tag}
                                        id={`option-${globalIndex}`}
                                        data-nav-index={globalIndex}
                                        role="option"
                                        aria-selected={isSelected}
                                        className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${isSelected ? 'bg-accent text-accent-foreground' : ''
                                            }`}
                                        onPointerMove={() => handleHoverIndex(globalIndex)}
                                        onClick={() => {
                                            onOpenChange(false);
                                            navigate(`/tools?tags=${encodeURIComponent(tag)}`);
                                        }}
                                    >
                                        <Tag className="mr-2 h-4 w-4 text-primary" />
                                        <span>{tag}</span>
                                    </div>
                                );
                            })}
                            {!showAllFilters && allTags.length > 6 && (
                                <div
                                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                                    onClick={() => setShowAllFilters(true)}
                                    onPointerMove={() => handleHoverIndex(-1)}
                                >
                                    <span className="text-xs">+ {allTags.length - 6} more filters</span>
                                </div>
                            )}

                            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground mt-2">Tools</div>
                            {offers && offers.slice(0, showAllTools ? offers.length : 15).map((d, index) => {
                                const categoriesCount = showAllCategories ? categories.length : Math.min(10, categories.length);
                                const tagsCount = showAllFilters ? allTags.length : Math.min(6, allTags.length);
                                const globalIndex = 4 + categoriesCount + tagsCount + index; // 4 popular + categories + tags + current tool index
                                const isSelected = selectedIndex === globalIndex;
                                return (
                                    <div
                                        key={d.id}
                                        id={`option-${globalIndex}`}
                                        data-nav-index={globalIndex}
                                        role="option"
                                        aria-selected={isSelected}
                                        className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${isSelected ? 'bg-accent text-accent-foreground' : ''
                                            }`}
                                        onPointerMove={() => handleHoverIndex(globalIndex)}
                                        onClick={() => {
                                            onOpenChange(false);
                                            // Navigate with offer ID to ensure exact match
                                            navigate(`/tools?q=${encodeURIComponent(d.name)}&id=${d.id}`);
                                        }}
                                    >
                                        <div className="w-6 h-6 mr-3 rounded-md overflow-hidden flex items-center justify-center bg-muted/50">
                                            <img
                                                src={d.logo}
                                                alt={`${d.name} logo`}
                                                className="w-full h-full object-cover"
                                                loading="eager"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm">{d.name}</span>
                                            <span className="text-xs text-muted-foreground truncate max-w-[320px]">{d.offer}</span>
                                        </div>
                                    </div>
                                );
                            })}
                            {!showAllTools && offers && offers.length > 15 && (
                                <div
                                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                                    onClick={() => setShowAllTools(true)}
                                    onPointerMove={() => handleHoverIndex(-1)}
                                >
                                    <span className="text-xs">+ {offers.length - 15} more tools</span>
                                </div>
                            )}
                        </>
                    )}

                    {!isLoading && debouncedSearchValue && debouncedSearchValue.length > 0 && offers && (() => {
                        const query = debouncedSearchValue.toLowerCase().trim();
                        let filteredResults: Offer[] = [];

                        // Use the same search logic as AllTools page
                        filteredResults = searchOffers(offers, debouncedSearchValue);

                        // Check for exact matches for "Did you mean?" feature
                        const exactMatches = offers.filter(d =>
                            d.name.toLowerCase() === query
                        );

                        if (filteredResults.length === 0) {
                            return (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                    No results found for "{debouncedSearchValue}".
                                </div>
                            );
                        }

                        // Determine the resolved query - use fuzzy match if available
                        const resolvedQuery = exactMatches.length === 0 && filteredResults.length > 0
                            ? filteredResults[0].name
                            : debouncedSearchValue;

                        return (
                            <>
                                {/* Show 'Did you mean?' if fuzzy search found results but no exact match */}
                                {exactMatches.length === 0 && filteredResults.length > 0 && (
                                    <div className="px-2 border-b border-border -mt-[1px]">
                                        <div className="text-xs text-muted-foreground py-1.5 leading-tight">
                                            Did you mean: <button
                                                onClick={() => {
                                                    setSearchValue(filteredResults[0].name);
                                                    // Don't close the dropdown, let user see updated results
                                                }}
                                                className="text-primary font-medium hover:underline focus:outline-none focus:underline"
                                            >
                                                {filteredResults[0].name}
                                            </button>?
                                        </div>
                                    </div>
                                )}

                                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                    Search Results ({filteredResults.length} found)
                                </div>

                                {filteredResults.slice(0, 8).map((d, index) => {
                                    const isSelected = selectedIndex === index;
                                    return (
                                        <div
                                            key={d.id}
                                            id={`option-${index}`}
                                            data-nav-index={index}
                                            role="option"
                                            aria-selected={isSelected}
                                            className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${isSelected ? 'bg-accent text-accent-foreground' : ''
                                                }`}
                                            onPointerMove={() => handleHoverIndex(index)}
                                            onClick={() => {
                                                onOpenChange(false);
                                                // Navigate with offer ID to ensure exact match
                                                navigate(`/tools?q=${encodeURIComponent(d.name)}&id=${d.id}`);
                                            }}
                                        >
                                            <div className="w-6 h-6 mr-3 rounded-md overflow-hidden flex items-center justify-center bg-muted/50">
                                                <img
                                                    src={d.logo}
                                                    alt={`${d.name} logo`}
                                                    className="w-full h-full object-cover"
                                                    loading="eager"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm">{highlightMatch(d.name, resolvedQuery)}</span>
                                                <span className="text-xs text-muted-foreground truncate max-w-[320px]">{highlightMatch(d.offer, resolvedQuery)}</span>
                                            </div>
                                        </div>
                                    );
                                })}

                                {filteredResults.length > 8 && (
                                    <>
                                        <div className="border-t border-border my-1"></div>
                                        <div
                                            className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-primary"
                                            onPointerMove={() => handleHoverIndex(-1)}
                                            onClick={() => {
                                                trackSearch(resolvedQuery, filteredResults.length);
                                                onOpenChange(false);
                                                navigate(`/tools?q=${encodeURIComponent(resolvedQuery)}`);
                                            }}
                                        >
                                            <ArrowRight className="mr-2 h-4 w-4" />
                                            <span>See all results for "{resolvedQuery}"</span>
                                        </div>
                                    </>
                                )}
                            </>
                        );
                    })()}
                </div>
            </DialogContent>
        </Dialog>
    );
};
