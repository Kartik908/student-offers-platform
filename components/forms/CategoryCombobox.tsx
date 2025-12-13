'use client';

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { useOffers } from "@/providers/OffersProvider"
import { generateCategoriesFromOffers } from "@/lib/categoryUtils"

interface CategoryComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategoryCombobox({ value, onChange }: CategoryComboboxProps) {
  // Try to get offers from context, but don't fail if not available
  let offers = null;
  try {
    const context = useOffers();
    offers = context?.data;
  } catch {
    // Provider not available, use fallback categories
  }

  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  // Generate categories dynamically from offers or use fallback
  const categories = React.useMemo(() => {
    if (!offers || offers.length === 0) {
      // Fallback categories when offers not available
      return [
        { value: 'development', label: 'Development' },
        { value: 'design', label: 'Design' },
        { value: 'productivity', label: 'Productivity' },
        { value: 'ai', label: 'AI & ML' },
        { value: 'education', label: 'Education' },
        { value: 'cloud', label: 'Cloud & Infrastructure' },
        { value: 'security', label: 'Security' },
        { value: 'github', label: 'GitHub Student' },
      ].sort((a, b) => a.label.localeCompare(b.label));
    }
    return generateCategoriesFromOffers(offers).map(cat => ({
      value: cat.id,
      label: cat.name
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, [offers])

  const filteredCategories = inputValue.trim() === ""
    ? categories
    : categories.filter(category =>
      category.label.toLowerCase().includes(inputValue.toLowerCase())
    )

  // All navigable items (categories + create option if applicable)
  const allNavigableItems = React.useMemo(() => {
    const items = [...filteredCategories];
    if (inputValue && inputValue.trim() !== "" && !categories.find(c => c.label.toLowerCase() === inputValue.toLowerCase())) {
      items.push({ value: 'create', label: `Create "${inputValue}"` });
    }
    return items;
  }, [filteredCategories, inputValue, categories]);

  // Scroll focused item into view
  React.useEffect(() => {
    if (selectedIndex >= 0 && scrollContainerRef.current) {
      const focusedElement = scrollContainerRef.current.querySelector(`[data-category-index="${selectedIndex}"]`);
      if (focusedElement) {
        focusedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });
      }
    }
  }, [selectedIndex]);

  // Reset selection when items change
  React.useEffect(() => {
    setSelectedIndex(-1);
  }, [filteredCategories.length, inputValue]);

  const handleSelect = (currentValue: string) => {
    onChange(currentValue === value ? "" : currentValue)
    setOpen(false)
    setInputValue("")
    setSelectedIndex(-1)
  }

  const handleCreate = () => {
    if (inputValue && !categories.find(c => c.label.toLowerCase() === inputValue.toLowerCase())) {
      onChange(inputValue)
      setOpen(false)
      setInputValue("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev =>
        prev < allNavigableItems.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < allNavigableItems.length) {
        const selectedItem = allNavigableItems[selectedIndex];
        if (selectedItem.value === 'create') {
          handleCreate();
        } else {
          handleSelect(selectedItem.label);
        }
      } else if (inputValue && !categories.find(c => c.label.toLowerCase() === inputValue.toLowerCase())) {
        handleCreate();
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setSelectedIndex(-1);
    } else {
      // Reset selection when typing
      setSelectedIndex(-1);
    }
  }

  return (
    <Popover open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (newOpen) {
        setInputValue("") // Reset search when opening
      }
    }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-left font-normal bg-muted/50 border-border text-foreground hover:bg-muted hover:border-border h-10 px-3 focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <div className="flex items-center flex-1 min-w-0">
            {value ? (
              <div className="inline-flex items-center pl-2 pr-1.5 py-1 text-xs h-6 rounded-md bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-colors">
                <span className="font-medium truncate max-w-[120px] leading-none mr-1">{categories.find((category) => category.label.toLowerCase() === value.toLowerCase())?.label || value}</span>
                <span
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onChange("");
                  }}
                  onMouseDown={(e: React.MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  role="button"
                  aria-label="Remove category"
                  className="inline-flex items-center justify-center"
                >
                  <X
                    className="h-2 w-2 flex-shrink-0 opacity-70 hover:opacity-100 cursor-pointer transition-opacity"
                  />
                </span>
              </div>
            ) : (
              <span className="text-muted-foreground text-sm">Select a category…</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-popover border-border z-[200]">
        <div className="flex items-center border-b border-border px-3">
          <Input
            placeholder="Search category or create new..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex h-10 w-full border-0 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div
          ref={scrollContainerRef}
          className="h-[280px] overflow-y-auto p-1 scroll-smooth [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full"
          onWheel={(e) => {
            e.stopPropagation();
          }}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#64748b #e2e8f0'
          }}
        >
          {/* Show all categories */}
          {filteredCategories.map((category, index) => {
            const isSelected = selectedIndex === index;
            return (
              <div
                key={category.value}
                data-category-index={index}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                  isSelected && "bg-accent text-accent-foreground"
                )}
                onClick={() => handleSelect(category.label)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.toLowerCase() === category.label.toLowerCase() ? "opacity-100" : "opacity-0"
                  )}
                />
                {category.label}
              </div>
            );
          })}

          {/* Create new category option */}
          {inputValue && inputValue.trim() !== "" && !categories.find(c => c.label.toLowerCase() === inputValue.toLowerCase()) && (
            <>
              <div className="border-t border-border my-1"></div>
              <div
                data-category-index={filteredCategories.length}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                  selectedIndex === filteredCategories.length && "bg-accent text-accent-foreground"
                )}
                onClick={handleCreate}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create "{inputValue}"
              </div>
            </>
          )}

          {/* No results message */}
          {filteredCategories.length === 0 && (!inputValue || inputValue.trim() === "") && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No categories found.
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

