'use client';

/**
 * Client-only controls for the SiteHeader.
 * Split from SiteHeader to allow the main header to be a server component.
 */
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/nav/ThemeToggle";
import { useFavorites } from "@/providers/FavoritesProvider";
import { useModal } from "@/providers/ModalProvider";
import { SearchDialog } from "@/components/nav/SearchDialog";

export function HeaderClientControls() {
    const { favorites } = useFavorites();
    const { openSubmitOfferModal } = useModal();
    const pathname = usePathname();
    const [open, setOpen] = React.useState(false);

    // Keyboard shortcut for search (Cmd/Ctrl + K)
    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            const isInputFocused = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true';

            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k" && !isInputFocused) {
                e.preventDefault();
                setOpen(prev => !prev);
            }
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    // Close dialog when route changes
    const prevPathname = React.useRef(pathname);
    React.useEffect(() => {
        if (prevPathname.current !== pathname) {
            setOpen(false);
            prevPathname.current = pathname;
        }
    }, [pathname]);

    return (
        <>
            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 justify-center px-4 lg:px-6 max-w-2xl">
                <Button
                    variant="outline"
                    className="w-full h-11 rounded-lg justify-between text-muted-foreground px-4 border-border/50 shadow-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 hover:bg-transparent hover:text-muted-foreground hover:border-border/50 min-h-[44px]"
                    onClick={() => setOpen(true)}
                    aria-label="Open search dialog"
                >
                    <div className="flex items-center gap-3">
                        <Search className="h-5 w-5 stroke-[1.5] flex-shrink-0" />
                        <span className="text-sm lg:text-base truncate">Search tools, categories...</span>
                    </div>
                    <kbd className="pointer-events-none hidden lg:flex h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-[10px] font-medium opacity-100">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </Button>
            </div>

            {/* Actions cluster */}
            <div className="flex items-center gap-2 md:gap-3">
                {/* Mobile search */}
                <Button
                    variant="outline"
                    size="icon"
                    className="md:hidden h-12 w-12 sm:h-11 sm:w-11 rounded-lg border-border/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-[48px] min-w-[48px] sm:min-h-[44px] sm:min-w-[44px]"
                    onClick={() => setOpen(true)}
                    aria-label="Open search"
                >
                    <Search className="h-5 w-5 stroke-[1.5]" />
                    <span className="sr-only">Search</span>
                </Button>

                {/* Favorites */}
                <Link
                    href="/favorites"
                    className="flex items-center justify-center w-12 h-12 sm:w-11 sm:h-11"
                >
                    <Button
                        variant="outline"
                        size="icon"
                        aria-label={`Favorites (${favorites.length})`}
                        className="h-12 w-12 sm:h-11 sm:w-11 rounded-lg border-border/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 relative min-h-[48px] min-w-[48px] sm:min-h-[44px] sm:min-w-[44px]"
                    >
                        <Heart className="h-5 w-5 stroke-[1.5]" />
                        {favorites.length > 0 && (
                            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center min-w-[20px]">
                                {favorites.length > 99 ? '99+' : favorites.length}
                            </span>
                        )}
                        <span className="sr-only">Favorites ({favorites.length})</span>
                    </Button>
                </Link>

                {/* Theme toggle */}
                <ThemeToggle />

                {/* Submit button */}
                <Button
                    onClick={openSubmitOfferModal}
                    className="h-12 sm:h-12 rounded-lg px-4 sm:px-5 flex items-center gap-2 font-medium text-sm sm:text-base focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-[48px]"
                >
                    <Plus className="h-5 w-5 stroke-[1.5]" />
                    <span>Submit</span>
                </Button>
            </div>

            {/* Search Dialog */}
            <SearchDialog open={open} onOpenChange={setOpen} />
        </>
    );
}
