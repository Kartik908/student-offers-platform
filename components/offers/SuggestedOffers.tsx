/**
 * A section to display suggested offers, typically when search results are low.
 */
import { Offer } from "@/types";
import OfferCard from "@/components/offers/OfferCard";

interface SuggestedOffersProps {
  offers: Offer[];
  title?: string;
}

const SuggestedOffers = ({ offers, title = "You might also like" }: SuggestedOffersProps) => {
  if (!offers || offers.length === 0) {
    return null;
  }

  return (
    <div className="my-12 bg-muted/30 rounded-2xl p-6 sm:p-8 border border-border/50">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6">{title}</h2>
      <div className="relative">
        <div className="overflow-x-auto no-scrollbar py-2 -mx-2 px-2">
          <div className="flex gap-4 sm:gap-6">
            {offers.map((offer) => (
              <div key={offer.id} className="w-[260px] sm:w-[280px] flex-shrink-0">
                <OfferCard deal={offer} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestedOffers;