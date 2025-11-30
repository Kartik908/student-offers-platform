/**
 * SmartFilterBar - Premium subcategory and tag filtering
 * Redesigned with Linear/Raycast/Apple quality UI
 * Mobile-responsive with bottom sheet on small screens
 */
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, X, Search } from "lucide-react";
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface SmartFilterBarProps {
  subcategories: string[];
  tags: string[];
  selectedSubcategory: string | null;
  selectedTags: string[];
  onSubcategoryChange: (subcategory: string | null) => void;
  onTagsChange: (tags: string[]) => void;
  onClearAll: () => void;
}

export default function SmartFilterBar({
  subcategories,
  tags,
  selectedSubcategory,
  selectedTags,
  onSubcategoryChange,
  onTagsChange,
  onClearAll,
}: SmartFilterBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

  // Close dropdown when clicking outside or scrolling
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      // Check if click is outside both the button wrapper AND the portal dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        portalRef.current &&
        !portalRef.current.contains(target)
      ) {
        setDropdownOpen(false);
        setTagSearch("");
      }
    }

    function handleScroll(e: Event) {
      // Only close if scrolling outside the dropdown
      if (dropdownOpen && portalRef.current && !portalRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setTagSearch("");
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [dropdownOpen]);

  // Handle scroll fade indicators
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeftFade(scrollLeft > 5);
        setShowRightFade(scrollLeft < scrollWidth - clientWidth - 5);
      }
    };

    const scrollEl = scrollRef.current;
    if (scrollEl) {
      handleScroll();
      scrollEl.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
      return () => {
        scrollEl.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, [subcategories]);

  function toggleTag(tag: string) {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  }

  const filteredTags = tags.filter(t =>
    t.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const hasFilters = selectedSubcategory || selectedTags.length > 0;
  const activeFilterCount = (selectedSubcategory ? 1 : 0) + selectedTags.length;

  return (
    <div className="w-full mb-6 relative z-[30]">
      {/* Mobile Filter Button (< md) */}
      <div className="md:hidden">
        <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-12 flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-2 bg-primary text-primary-foreground rounded-full text-xs font-semibold">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto max-h-[85vh]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription className="text-xs">
                Filter offers by subcategory and tags
              </SheetDescription>
            </SheetHeader>

            <div className="mt-4 space-y-4 overflow-y-auto max-h-[calc(85vh-140px)] pb-20">
              {/* Subcategories Section */}
              {subcategories.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">Subcategories</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {subcategories.map((sub) => {
                      const active = sub === selectedSubcategory;
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => onSubcategoryChange(active ? null : sub)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                            active
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-muted text-foreground hover:bg-muted/80"
                          )}
                        >
                          {sub}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tags Section */}
              {tags.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">Tags</h3>

                  {/* Search */}
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search tags..."
                      value={tagSearch}
                      onChange={(e) => setTagSearch(e.target.value)}
                      className="pl-9 h-9 text-sm"
                    />
                  </div>

                  {/* Tag Grid */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {filteredTags.map((tag) => {
                      const checked = selectedTags.includes(tag);
                      return (
                        <label
                          key={tag}
                          className={cn(
                            "flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition text-sm",
                            checked ? "bg-accent" : "hover:bg-accent/50"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleTag(tag)}
                            className="h-4 w-4 min-h-[16px] min-w-[16px] max-h-[16px] max-w-[16px] rounded border-border cursor-pointer flex-shrink-0"
                          />
                          <span className="text-xs leading-none">{tag}</span>
                        </label>
                      );
                    })}
                  </div>

                  {filteredTags.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-8">
                      No tags found
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  onClearAll();
                  setTagSearch("");
                }}
                disabled={!hasFilters}
                className="flex-1 h-10"
              >
                Clear All
              </Button>
              <Button
                onClick={() => setMobileSheetOpen(false)}
                className="flex-1 h-10"
              >
                Apply
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Active Filters Summary (Mobile) */}
        {hasFilters && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {selectedSubcategory && (
              <div className="inline-flex items-center pl-3 pr-2 py-1.5 text-sm rounded-lg bg-primary/10 text-primary border border-primary/20">
                <span className="font-medium mr-1.5">{selectedSubcategory}</span>
                <X
                  className="h-4 w-4 cursor-pointer opacity-70 hover:opacity-100"
                  onClick={() => onSubcategoryChange(null)}
                />
              </div>
            )}
            {selectedTags.map((tag) => (
              <div
                key={tag}
                className="inline-flex items-center pl-3 pr-2 py-1.5 text-sm rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 hover:bg-purple-500/15 transition-colors"
              >
                <span className="font-medium mr-1.5">{tag}</span>
                <X
                  className="h-4 w-4 cursor-pointer opacity-70 hover:opacity-100"
                  onClick={() => toggleTag(tag)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Filter Bar (>= md) */}
      <div className="hidden md:block">
        {/* Main filter container */}
        <div className="bg-card border border-border/60 rounded-xl shadow-sm backdrop-blur-md">
          {/* Top section: Label + Pills + Filters button */}
          <div className="px-4 py-3 flex items-center gap-3 relative">
            {/* Subcategories label */}
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex-shrink-0">
              Subcategories
            </span>

            {/* Scrollable pills container with fade effect */}
            <div className="flex-1 min-w-0 relative">
              {/* Left fade gradient */}
              {showLeftFade && (
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-card to-transparent pointer-events-none z-10" />
              )}

              {/* Pills scroll container */}
              <div
                ref={scrollRef}
                className="overflow-x-auto whitespace-nowrap scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="flex gap-2 pr-2">
                  {subcategories.length > 0 ? (
                    subcategories.map((sub) => {
                      const active = sub === selectedSubcategory;
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => onSubcategoryChange(active ? null : sub)}
                          className={cn(
                            "flex-shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                            "outline-none focus:outline-none focus-visible:outline-none",
                            "ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0",
                            "active:scale-[0.98]",
                            active
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-muted/60 text-foreground hover:bg-muted hover:shadow-sm border border-transparent hover:border-border/40"
                          )}
                        >
                          {sub}
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-xs text-muted-foreground py-1.5 px-1">No subcategories available</p>
                  )}
                </div>
              </div>

              {/* Right fade gradient */}
              {showRightFade && (
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card to-transparent pointer-events-none z-10" />
              )}
            </div>

            {/* Filters button */}
            {tags.length > 0 && (
              <div className="flex-shrink-0">
                <div ref={dropdownRef} className="relative">
                  <Button
                    ref={buttonRef}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (buttonRef.current) {
                        const rect = buttonRef.current.getBoundingClientRect();
                        setDropdownPosition({
                          top: rect.bottom + 8,
                          right: window.innerWidth - rect.right
                        });
                      }
                      setDropdownOpen(!dropdownOpen);
                    }}
                    className={cn(
                      "inline-flex items-center gap-2 text-xs h-9 px-3.5 rounded-lg font-medium transition-all duration-200",
                      "hover:bg-accent hover:shadow-sm border-border/60",
                      dropdownOpen && "bg-accent shadow-sm ring-2 ring-primary/20"
                    )}
                  >
                    <Filter className="h-3.5 w-3.5" />
                    <span>Filters</span>
                    {selectedTags.length > 0 && (
                      <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 bg-primary text-primary-foreground rounded-full text-[10px] font-semibold leading-none">
                        {selectedTags.length}
                      </span>
                    )}
                  </Button>

                  {/* Filters dropdown - using portal */}
                  {dropdownOpen && createPortal(
                    <div
                      ref={portalRef}
                      className="fixed w-72 bg-popover border border-border/50 rounded-xl shadow-2xl z-[99999] animate-in fade-in-0 zoom-in-95 duration-200"
                      style={{
                        top: `${dropdownPosition.top}px`,
                        right: `${dropdownPosition.right}px`
                      }}
                    >
                      {/* Dropdown header */}
                      <div className="px-3 py-1 border-b border-border/40 bg-muted/30">
                        <div className="flex items-center gap-2">
                          <Search className="h-3 w-3 text-muted-foreground/50 flex-shrink-0" />
                          <Input
                            type="text"
                            placeholder="Search tags..."
                            value={tagSearch}
                            onChange={(e) => setTagSearch(e.target.value)}
                            className="!h-[20px] !min-h-[20px] !max-h-[20px] text-[11px] border-0 bg-transparent !px-0 !py-0 !leading-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/40"
                          />
                        </div>
                      </div>

                      {/* Tag checkboxes grid */}
                      <div className="px-2 pt-1 pb-2 max-h-64 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-x-0.5 gap-y-1">
                          {filteredTags.map((tag) => {
                            const checked = selectedTags.includes(tag);
                            return (
                              <label
                                key={tag}
                                htmlFor={`tag-${tag}`}
                                className={cn(
                                  "flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer w-full transition",
                                  checked ? "bg-accent" : "hover:bg-accent/50"
                                )}
                              >
                                <input
                                  id={`tag-${tag}`}
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleTag(tag)}
                                  className="!h-4 !w-4 !min-h-[16px] !min-w-[16px] !max-h-[16px] !max-w-[16px] rounded-sm border border-border/70 cursor-pointer bg-background checked:bg-primary checked:border-primary transition focus-visible:ring-1 focus-visible:ring-primary flex-shrink-0"
                                  style={{
                                    appearance: 'auto',
                                    WebkitAppearance: 'checkbox',
                                    MozAppearance: 'checkbox'
                                  }}
                                />
                                <span className="text-[11px] text-foreground leading-none">{tag}</span>
                              </label>
                            );
                          })}
                        </div>
                        {filteredTags.length === 0 && (
                          <div className="text-center py-8">
                            <p className="text-xs text-muted-foreground">No tags found</p>
                          </div>
                        )}
                      </div>

                      {/* Dropdown footer */}
                      <div className="px-3 py-1 border-t border-border/40 bg-muted/30 flex items-center gap-2">
                        <button
                          onClick={() => {
                            onTagsChange([]);
                            setTagSearch("");
                          }}
                          disabled={selectedTags.length === 0}
                          className="text-[11px] text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          Clear all
                        </button>
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            setTagSearch("");
                          }}
                          className="!h-[20px] !min-h-[20px] !max-h-[20px] px-3 !py-0 text-[11px] rounded-md font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors !leading-none flex items-center justify-center ml-auto"
                        >
                          Done
                        </button>
                      </div>
                    </div>,
                    document.body
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-border/40" />

          {/* Selected filters summary row */}
          {hasFilters && (
            <div className="px-4 py-2 bg-muted/30 flex gap-2 flex-wrap items-center">
              {/* Active filters label */}
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                Active
              </span>

              {/* Selected subcategory pill */}
              {selectedSubcategory && (
                <div className="inline-flex items-center pl-2 pr-1.5 py-1 text-xs h-6 rounded-md bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-colors">
                  <span className="font-medium truncate max-w-[120px] leading-none mr-1">{selectedSubcategory}</span>
                  <X
                    className="h-3 w-3 flex-shrink-0 opacity-70 hover:opacity-100 cursor-pointer transition-opacity"
                    onClick={() => onSubcategoryChange(null)}
                  />
                </div>
              )}

              {/* Selected tag pills */}
              {selectedTags.map((tag) => (
                <div
                  key={tag}
                  className="inline-flex items-center pl-2 pr-1.5 py-1 text-xs h-6 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 hover:bg-purple-500/15 transition-colors"
                >
                  <span className="font-medium truncate max-w-[100px] leading-none mr-1">{tag}</span>
                  <X
                    className="h-3 w-3 flex-shrink-0 opacity-70 hover:opacity-100 cursor-pointer transition-opacity"
                    onClick={() => toggleTag(tag)}
                  />
                </div>
              ))}

              {/* Clear all button */}
              <button
                onClick={onClearAll}
                className="ml-auto text-xs text-muted-foreground hover:text-destructive transition-colors font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
