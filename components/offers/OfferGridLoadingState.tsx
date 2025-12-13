/**
 * OfferGridLoadingState
 * 
 * Purpose: Renders a reusable loading skeleton specifically for the offer grid.
 * Used in: AllTools.tsx, Favorites.tsx
 * Context: Offers
 */
import { Skeleton } from "@/components/ui/skeleton";

interface OfferGridLoadingStateProps {
  count: number;
}

export const OfferGridLoadingState = ({ count }: OfferGridLoadingStateProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-72 w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
};