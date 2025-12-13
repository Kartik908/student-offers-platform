"use client"

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

const locations = [
  "Worldwide",
  "US Only",
  "EU Only",
  "Varies by region",
  "North America",
  "Europe",
  "Asia Pacific",
  "Latin America",
  "UK Only",
  "Canada Only",
  "Australia Only",
  "India Only"
].map(name => ({ value: name, label: name }));

interface LocationComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

export function LocationCombobox({ value, onChange }: LocationComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  const filteredLocations = inputValue.trim() === ""
    ? locations
    : locations.filter(location =>
      location.label.toLowerCase().includes(inputValue.toLowerCase())
    )

  // All navigable items (locations + create option if applicable)
  const allNavigableItems = React.useMemo(() => {
    const items = [...filteredLocations];
    if (inputValue && inputValue.trim() !== "" && !locations.find(l => l.label.toLowerCase() === inputValue.toLowerCase())) {
      items.push({ value: 'create', label: `Create "${inputValue}"` });
    }
    return items;
  }, [filteredLocations, inputValue]);

  // Scroll focused item into view
  React.useEffect(() => {
    if (selectedIndex >= 0 && scrollContainerRef.current) {
      const focusedElement = scrollContainerRef.current.querySelector(`[data-location-index="${selectedIndex}"]`);
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
  }, [filteredLocations.length, inputValue]);

  const handleSelect = (currentValue: string) => {
    onChange(currentValue === value ? "" : currentValue)
    setOpen(false)
    setInputValue("")
    setSelectedIndex(-1)
  }

  const handleCreate = () => {
    if (inputValue && !locations.find(l => l.label.toLowerCase() === inputValue.toLowerCase())) {
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
      } else if (inputValue && !locations.find(l => l.label.toLowerCase() === inputValue.toLowerCase())) {
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
          className="w-full justify-between text-left font-normal bg-muted/50 border-border text-foreground hover:bg-accent hover:text-accent-foreground min-h-[40px] h-auto py-2"
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {value ? (
              <div className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                <span>{value}</span>
                <span
                  role="button"
                  tabIndex={0}
                  className="flex items-center justify-center h-4 w-4 p-0 opacity-70 hover:opacity-100 hover:bg-primary-foreground/20 rounded-full transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    onChange("")
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      onChange("");
                    }
                  }}
                  aria-label="Clear location"
                >
                  <X className="h-3 w-3" />
                </span>
              </div>
            ) : (
              <span className="text-muted-foreground text-sm">Select location...</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-popover border-border z-[200]">
        <div className="flex items-center border-b border-border px-3">
          <Input
            placeholder="Search location or create new..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex h-10 w-full border-0 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div
          ref={scrollContainerRef}
          className="max-h-[200px] overflow-y-auto p-1 scroll-smooth [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full"
          onWheel={(e) => {
            e.stopPropagation();
          }}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#64748b #e2e8f0'
          }}
        >
          {/* Show all locations */}
          {filteredLocations.map((location, index) => {
            const isSelected = selectedIndex === index;
            return (
              <div
                key={location.value}
                data-location-index={index}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                  isSelected && "bg-accent text-accent-foreground"
                )}
                onClick={() => handleSelect(location.label)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === location.label ? "opacity-100" : "opacity-0"
                  )}
                />
                {location.label}
              </div>
            );
          })}

          {/* Create new location option */}
          {inputValue && inputValue.trim() !== "" && !locations.find(l => l.label.toLowerCase() === inputValue.toLowerCase()) && (
            <>
              <div className="border-t border-border my-1"></div>
              <div
                data-location-index={filteredLocations.length}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                  selectedIndex === filteredLocations.length && "bg-accent text-accent-foreground"
                )}
                onClick={handleCreate}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create "{inputValue}"
              </div>
            </>
          )}

          {/* No results message */}
          {filteredLocations.length === 0 && (!inputValue || inputValue.trim() === "") && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No locations found.
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}