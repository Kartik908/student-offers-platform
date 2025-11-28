/**
 * A modal dialog to show extra details for an offer.
 */
import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Offer } from '@/types';
import OfferExtraDetails from '@/components/offers/OfferExtraDetails';
import { cn } from "@/lib/utils";
import { Info, ArrowUpRight } from "lucide-react";

// Function to convert URLs in text to clickable links
const linkifyText = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 underline break-all"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

interface OfferDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: Offer;
}

const OfferDetailsModal = ({ isOpen, onClose, offer }: OfferDetailsModalProps) => {
  // Determine modal complexity
  const countries = offer.has_alt_links && offer.alt_links
    ? Object.entries(offer.alt_links).map(([name, urlOrDetails]) => ({
      name,
      url: typeof urlOrDetails === 'string' ? urlOrDetails : urlOrDetails.url
    }))
    : [];
  const hasMultipleCountries = countries.length >= 5;
  const hasExtraInfo = !!offer.extra_info;

  // Use tabbed design for complex offers (5+ countries + extra info OR just many countries)
  const useTabbed = (hasMultipleCountries && hasExtraInfo) || countries.length >= 6;

  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedOffer, setSelectedOffer] = useState<string>('');

  if (useTabbed) {
    // Prepare regions data with multiple offers per region
    const regions: Record<string, Array<{ id: string; label: string; price: string; url: string; flag: string }>> = {};

    // Process all alt_links (including Global offers)
    Object.entries(offer.alt_links || {}).forEach(([regionName, regionData]) => {
      if (!regions[regionName]) {
        regions[regionName] = [];
      }

      // Handle both single offer (object) and multiple offers (array) formats
      if (Array.isArray(regionData)) {
        // Multiple offers format: array of offer objects
        regionData.forEach((offerItem, index) => {
          regions[regionName].push({
            id: `${regionName.toLowerCase().replace(/\s+/g, '-')}-${index + 1}`,
            label: offerItem.offer_text || offer.offer,
            price: offerItem.pricing || 'Included with campus account',
            url: offerItem.url,
            flag: regionName === 'Global' ? '🌍' : '🏛️'
          });
        });
      } else if (typeof regionData === 'object' && regionData !== null) {
        // Single offer format: single offer object
        regions[regionName].push({
          id: `${regionName.toLowerCase().replace(/\s+/g, '-')}-1`,
          label: regionData.offer_text || offer.offer,
          price: regionData.pricing || 'Included with campus account',
          url: regionData.url,
          flag: regionName === 'Global' ? '🌍' : '🏛️'
        });
      } else if (typeof regionData === 'string') {
        // Legacy format: just URL string
        regions[regionName].push({
          id: `${regionName.toLowerCase().replace(/\s+/g, '-')}-1`,
          label: offer.offer,
          price: 'Available for students',
          url: regionData,
          flag: regionName === 'Global' ? '🌍' : '🏛️'
        });
      }
    });

    // Fallback: If no Global offer in alt_links but there's a claim_url, add it
    if (!regions['Global'] && offer.offer && offer.claim_url) {
      regions['Global'] = [{
        id: 'global-fallback',
        label: offer.offer,
        price: 'Available worldwide',
        url: offer.claim_url,
        flag: '🌍'
      }];
    }

    const regionKeys = Object.keys(regions);

    // Set initial selections
    if (!selectedRegion && regionKeys.length > 0) {
      setSelectedRegion(regionKeys[0]);
    }

    const currentOffers = regions[selectedRegion] || [];
    if (!selectedOffer && currentOffers.length > 0) {
      setSelectedOffer(currentOffers[0].id);
    }

    const selectedOfferData = currentOffers.find(item => item.id === selectedOffer);

    return (
      <Dialog open={isOpen} onOpenChange={() => { }}>
        <DialogContent
          className="w-full max-w-5xl max-h-[85vh] mx-0 sm:mx-auto mb-0 sm:mb-auto mt-auto sm:mt-auto border-0 sm:border bg-card backdrop-blur-md shadow-xl overflow-hidden rounded-t-2xl sm:rounded-2xl flex flex-col"
          hideCloseButton={true}
        >
          {/* Mobile bottom sheet handle */}
          <div className="flex sm:hidden justify-center pt-2 pb-1">
            <div className="w-8 h-1 bg-muted-foreground/30 rounded-full"></div>
          </div>

          {/* Header Section - Reduced padding */}
          <div className="px-4 sm:px-6 md:px-8 pt-3 sm:pt-4 md:pt-5 pb-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight">
              Claim: {offer.name}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
              Select your offer or view important notes below.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Content Area */}
          <div className="flex flex-col md:flex-row flex-1 min-h-0">
            {/* Sidebar - Scrollable Region List */}
            <div className="md:w-1/3 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 space-y-2">
              <div className="space-y-2">
                {regionKeys.map((region) => (
                  <button
                    key={region}
                    onClick={() => {
                      setSelectedRegion(region);
                      setSelectedOffer(''); // Reset offer selection
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all text-left text-xs sm:text-sm font-medium",
                      selectedRegion === region
                        ? "bg-primary border-primary text-primary-foreground shadow-md"
                        : "border-border text-foreground hover:bg-accent"
                    )}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span className="text-base sm:text-lg">
                        {regions[region]?.[0]?.flag || '🏳️'}
                      </span>
                      {region}
                    </span>
                    <span className="text-[10px] sm:text-[12px] opacity-70">
                      {regions[region]?.length ?? 0} offer{(regions[region]?.length ?? 0) > 1 ? 's' : ''}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:block border-l border-border"></div>

            {/* Offers and Notes Section */}
            <div className="md:w-2/3 flex flex-col min-h-0">
              <div className="px-4 sm:px-6 md:px-8 py-4 overflow-y-auto flex-1">
                <div className="mb-4">
                  <h2 className="text-base sm:text-lg font-semibold mb-2 flex items-center gap-2">
                    <span className="text-base sm:text-lg">
                      {regions[selectedRegion]?.[0]?.flag || '🏳️'}
                    </span>
                    {selectedRegion}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">
                    {currentOffers.length} available offer{currentOffers.length > 1 ? 's' : ''}
                  </p>
                </div>

                <div className="space-y-4">

                  {/* Offers */}
                  {currentOffers.map((offerItem) => (
                    <div
                      key={offerItem.id}
                      className={cn(
                        "border rounded-xl p-3 sm:p-4 transition-all shadow-sm cursor-pointer",
                        selectedOffer === offerItem.id
                          ? "bg-primary border-primary text-primary-foreground shadow-md"
                          : "bg-slate-100 border border-slate-200 shadow-sm hover:bg-slate-200 dark:bg-muted/30 dark:border-border dark:shadow-none dark:hover:bg-muted/50"
                      )}
                      onClick={() => setSelectedOffer(offerItem.id)}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-xs sm:text-sm mb-1 truncate">
                            {offerItem.label}
                          </h3>
                          {offerItem.price && (
                            <p className={cn(
                              "text-[11px] sm:text-xs truncate",
                              selectedOffer === offerItem.id ? "text-primary-foreground/75" : "text-muted-foreground"
                            )}>
                              {offerItem.price}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {currentOffers.length === 0 && (
                    <div className="text-xs sm:text-sm text-muted-foreground italic">
                      No offers available for this region.
                    </div>
                  )}
                </div>

                {/* Notes Section */}
                {hasExtraInfo && (
                  <div className="mt-4 p-3 sm:p-4 border border-primary/20 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                      <h4 className="font-semibold text-primary text-xs sm:text-sm">Important Notes</h4>
                    </div>
                    <div className="text-[11px] sm:text-xs text-muted-foreground space-y-1">
                      {offer.extra_info?.split('\n').map((note, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-1 leading-none">•</span>
                          <span>{linkifyText(note.trim())}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Divider */}
          <div className="border-t border-border"></div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 px-4 sm:px-6 md:px-8 py-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => {
              const finalUrl = selectedOfferData?.url || offer.claim_url;
              if (finalUrl) {
                window.open(finalUrl, '_blank', 'noopener,noreferrer');
                onClose();
              }
            }} className="group">
              Continue to Offer
              <ArrowUpRight className="h-3.5 w-3.5 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Simple modal for less complex offers
  return (
    <Dialog open={isOpen} onOpenChange={() => { }}>
      <DialogContent
        className="w-full max-w-md sm:max-w-md mx-0 sm:mx-auto mb-0 sm:mb-auto mt-auto sm:mt-auto border-0 sm:border bg-card backdrop-blur-md shadow-xl overflow-hidden rounded-t-2xl sm:rounded-2xl flex flex-col"
        hideCloseButton={true}
      >
        {/* Mobile bottom sheet handle */}
        <div className="flex sm:hidden justify-center pt-2 pb-1">
          <div className="w-8 h-1 bg-muted-foreground/30 rounded-full"></div>
        </div>

        {/* Header Section */}
        <div className="px-4 sm:px-6 pt-3 sm:pt-4 pb-4">
          <h2 className="text-lg sm:text-xl font-semibold leading-tight">
            Claim: {offer.name}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {countries.length > 0
              ? "Select your country to continue or copy a discount code."
              : "View offer details and continue to claim."
            }
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-border"></div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-4 flex-1">
          <OfferExtraDetails offer={offer} showNotesInline={true} />
        </div>

        {/* Bottom Divider */}
        <div className="border-t border-border"></div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 px-4 sm:px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => {
            if (offer.claim_url) {
              window.open(offer.claim_url, '_blank', 'noopener,noreferrer');
              onClose();
            }
          }} className="group">
            Continue to Offer
            <ArrowUpRight className="h-3.5 w-3.5 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfferDetailsModal;