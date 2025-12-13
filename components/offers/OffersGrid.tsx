'use client';

/**
 * A grid layout for displaying a list of offers.
 */
import { useMemo } from "react";
import { Offer } from "@/types";
import OfferCard from "@/components/offers/OfferCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { shuffleArray } from "@/lib/utils";

interface OffersGridProps {
  offers: Offer[];
}

const OffersGrid = ({ offers }: OffersGridProps) => {
  // Randomize offers once when component mounts
  const randomizedOffers = useMemo(() => shuffleArray(offers), [offers]);

  return (
    <div className="w-full">
      <header className="mb-12 text-center px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight">
            Explore All Offers
          </h2>
          <p className="text-muted-foreground mt-2">Browse every verified student deal in one place</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {randomizedOffers.length > 0 ? (
          randomizedOffers.map((offer) => (
            <OfferCard key={offer.id} deal={offer} />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No offers to display</p>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <Button asChild size="lg">
          <Link href="/tools">
            View All Tools
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default OffersGrid;