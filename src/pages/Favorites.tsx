import OfferCard from "@/components/offers/OfferCard";
import { useFavorites } from "@/providers/FavoritesProvider";
import { useOffers } from "@/providers/OffersProvider";
import { Heart, Shield, Info } from "lucide-react";
import { FavoritesHeader } from "@/components/favorites/FavoritesHeader";
import { OfferGridLoadingState } from "@/components/offers/OfferGridLoadingState";
import { ContentEmptyState } from "@/components/common";

import { SEO } from "@/components/seo/SEO";

const Favorites = () => {
  const { favorites } = useFavorites();
  const { data: offers, isLoading, error } = useOffers();

  const favoriteOffers = offers?.filter(offer => favorites.includes(String(offer.id))) || [];

  // Only show loading state if we have no data at all
  const showLoadingState = isLoading && !offers;

  return (
    <div className="container py-10">
      <SEO
        title="My Favorites"
        description="View your saved student discounts and offers. Keep track of the best deals you've found."
        canonical="https://studentoffers.co/favorites"
      />
      <FavoritesHeader />

      {/* Privacy Callout */}
      <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 leading-tight">
              <span className="font-medium text-blue-900 dark:text-blue-100">Your favorites stay private</span>
              <span className="hidden sm:inline"> — </span>
              <span className="block sm:inline">Stored locally in your browser, never shared anywhere.</span>
            </p>
          </div>
        </div>
      </div>

      {showLoadingState && <OfferGridLoadingState count={4} />}
      {error && !offers && <p className="text-destructive text-center mt-6">Failed to load offers: {error.message}</p>}
      {offers && favoriteOffers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteOffers.map((offer) => (
            <OfferCard key={offer.id} deal={offer} />
          ))}
        </div>
      )}
      {offers && favoriteOffers.length === 0 && (
        <ContentEmptyState
          Icon={Heart}
          title="No favorites yet"
          message="Click the heart icon on any offer to save it here."
        />
      )}
    </div>
  );
};

export default Favorites;