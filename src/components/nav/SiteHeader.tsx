/**
 * The main site header, including navigation, search, and theme toggle.
 */
import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { GraduationCap, Search, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/nav/ThemeToggle";
import { useFavorites } from "@/providers/FavoritesProvider";
import { useOffers } from "@/hooks/useOffers";
import { useModal } from "@/providers/ModalProvider";
import { trackNavigation } from "@/lib/trackingManager";
import { SearchDialog } from "@/components/nav/SearchDialog";

const SiteHeader = () => {
  const { favorites } = useFavorites();
  const { openSubmitOfferModal } = useModal();
  const location = useLocation();
  const { data: offers, isLoading } = useOffers();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input field
      const target = e.target as HTMLElement;
      const isInputFocused = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true';

      // Don't trigger if any modal is open (check for modal backdrop)
      const isModalOpen = document.querySelector('[data-state="open"][role="dialog"]') !== null;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k" && !isInputFocused && !isModalOpen) {
        e.preventDefault();
        setOpen(prev => !prev);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    // Close dialog when route changes
    if (open) {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname + location.search]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between gap-4">
          {/* Logo - proper tap target and responsive text */}
          <NavLink
            to="/"
            className="flex flex-shrink-0 items-center gap-2 sm:gap-3 min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md p-1"
            onClick={() => trackNavigation(location.pathname, '/')}
          >
            {/* Icon with subtle glow */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-full blur-md bg-primary/20 dark:bg-primary/30 animate-pulse" />
              <GraduationCap className="relative h-6 w-6 text-primary/90 dark:text-primary stroke-[2] drop-shadow-[0_0_8px_rgba(59,130,246,0.4)] dark:drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
            </div>
            {/* Text with light glow - hidden on very small screens */}
            <span className="font-semibold tracking-tight text-primary dark:text-primary/90 text-base sm:text-lg hidden sm:inline-block leading-none truncate drop-shadow-[0_0_6px_rgba(59,130,246,0.3)] dark:drop-shadow-[0_0_6px_rgba(96,165,250,0.5)]">Student Offers</span>
          </NavLink>

          {/* Search - responsive with proper sizing */}
          <div className="hidden md:flex flex-1 justify-center px-4 lg:px-6 max-w-2xl">
            <Button
              variant="outline"
              className="w-full h-11 rounded-lg justify-between text-muted-foreground px-4 border-border/50 shadow-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 hover:bg-transparent hover:text-muted-foreground hover:border-border/50 min-h-[44px]"
              onClick={() => {
                const isModalOpen = document.querySelector('[data-state="open"][role="dialog"]') !== null;
                if (!isModalOpen) {
                  setOpen(true);
                }
              }}
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

          {/* Actions cluster - compact on mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            {/* Theme toggle and favorites with compact spacing */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <ThemeToggle />
              <NavLink
                to="/favorites"
                onClick={() => trackNavigation(location.pathname, '/favorites')}
              >
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={`Favorites (${favorites.length})`}
                  className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg border-border/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 relative min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px]"
                >
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 stroke-[1.5]" />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center min-w-[20px]">
                      {favorites.length > 99 ? '99+' : favorites.length}
                    </span>
                  )}
                  <span className="sr-only">Favorites ({favorites.length})</span>
                </Button>
              </NavLink>
            </div>

            {/* Mobile search */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden h-10 w-10 sm:h-11 sm:w-11 rounded-lg border-border/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px]"
              onClick={() => {
                const isModalOpen = document.querySelector('[data-state="open"][role="dialog"]') !== null;
                if (!isModalOpen) {
                  setOpen(true);
                }
              }}
              aria-label="Open search"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5 stroke-[1.5]" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Submit button - solid brand blue, proper sizing */}
            <Button
              onClick={openSubmitOfferModal}
              className="h-10 sm:h-12 rounded-lg px-4 sm:px-5 flex items-center gap-2 font-medium text-sm sm:text-base focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Plus className="h-4 w-4 stroke-[1.5]" />
              <span>Submit</span>
            </Button>
          </div>
        </div>
      </header>

      <SearchDialog
        open={open}
        onOpenChange={setOpen}
        offers={offers}
        isLoading={isLoading}
      />
    </>
  );
};

export default SiteHeader;