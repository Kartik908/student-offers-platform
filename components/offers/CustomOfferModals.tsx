/**
 * Custom modals for specific offers
 * Each offer can have a unique modal with custom content fetched from database
 */
import React from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import { Offer } from "@/types";
import { cn } from "@/lib/utils";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: Offer;
}

/**
 * Custom modal configuration
 * Add offer IDs here to enable custom modals
 */
const CUSTOM_MODAL_OFFERS = {
  // Example: 'perplexity-pro': true,
  // Add more offer identifiers here
};

/**
 * Check if an offer should use a custom modal
 */
export function hasCustomModal(offer: Offer): boolean {
  // Check by offer name (normalized)
  const normalizedName = offer.name.toLowerCase().replace(/\s+/g, '-');
  return normalizedName in CUSTOM_MODAL_OFFERS;
}

/**
 * Partner offers data for Perplexity
 */
const PERPLEXITY_PARTNER_OFFERS = [
  { flag: "🇮🇳", country: "India", partner: "Airtel", offer: "Free 12-month Perplexity Pro subscription", link: "https://www.airtel.in/perplexity-pro/" },
  { flag: "🇸🇬", country: "Singapore", partner: "Singtel", offer: "Free 12-month Perplexity Pro subscription", link: "https://www.singtel.com/personal/my-account/rewards-perplexity" },
  { flag: "🇨🇦", country: "Canada", partner: "Bell", offer: "Free 12-month Perplexity Pro subscription", link: "https://www.bell.ca/Mobility/perplexity-pro" },
  { flag: "🇦🇺", country: "Australia", partner: "Optus", offer: "Free 12-month Perplexity Pro subscription", link: "https://www.optus.com.au/support/answer/what_is_perplexity" },
  { flag: "🇮🇩", country: "Indonesia", partner: "Telkomsel", offer: "Free 12-month Perplexity Pro subscription", link: "https://my.telkomsel.com/login", extra: "More details: https://www.telkomsel.com/en/enterprise/insight/news/telkomsel-and-perplexity-launch-ai-and-connectivity-bundle" },
  { flag: "🌍", country: "Global", partner: "Revolut", offer: "Free 12-month Perplexity Pro subscription", link: "https://www.perplexity.ai/join/p/revolut", extra: "More details: https://help.revolut.com/help/profile-and-plan/my-plan-benefits/partnership-benefits/perplexity/" },
  { flag: "🇩🇪", country: "Germany, Slovakia, Austria, Hungary, Montenegro, North Macedonia, Czech Republic", partner: "T-Mobile Magenta", offer: "Free 12-month Perplexity Pro subscription", link: "https://www.perplexity.ai/join/p/magenta", extra: "Activate via My T-Mobile app — code under Magenta Moments." },
  { flag: "🇺🇸", country: "United States", partner: "Venmo", offer: "Free 12-month Perplexity Pro subscription", link: "https://www.perplexity.ai/join/p/venmo-subscription" },
  { flag: "🇺🇸", country: "United States & select markets", partner: "PayPal", offer: "Free 12-month Perplexity Pro subscription", link: "https://www.perplexity.ai/join/p/paypal-subscription" },
  { flag: "🇺🇸", country: "United States", partner: "Xfinity", offer: "Free 12-month Perplexity Pro subscription", link: "https://www.perplexity.ai/join/p/xfinity", extra: "More details: https://www.perplexity.ai/hub/blog/redeem-a-free-year-of-perplexity-pro-through-xfinity-rewards" },
  { flag: "🇺🇸", country: "United States", partner: "Samsung Galaxy Devices", offer: "Free 12-month Perplexity Pro subscription", link: "https://www.perplexity.ai/help-center/en/articles/11825615-samsung-galaxy-perplexity-pro-12-months-free-for-u-s-galaxy-owner" }
];

/**
 * Perplexity Partner Offers Modal
 * Shows regional and partner-specific offers
 */
function PerplexityPartnerOffersModal({ isOpen, onClose, offer }: CustomModalProps) {
  const [selectedOffer, setSelectedOffer] = React.useState<number | null>(null);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0 gap-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            {offer.logo && (
              <div className="relative h-10 w-10 flex-shrink-0 rounded-xl overflow-hidden border border-border/50 bg-background shadow-sm">
                {offer.logo.endsWith('.mp4') || offer.logo.endsWith('.webm') ? (
                  <video
                    src={offer.logo}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <Image
                    src={offer.logo}
                    alt={`${offer.name} logo`}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-semibold truncate leading-tight">
                Perplexity Partner Offers
              </DialogTitle>
              <p className="text-sm text-muted-foreground truncate">
                Select your regional or partner offer to continue.
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Offers List */}
        <div className="px-6 py-5 overflow-y-auto max-h-[55vh] space-y-3 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          {PERPLEXITY_PARTNER_OFFERS.map((partnerOffer, index) => (
            <div
              key={index}
              onClick={() => setSelectedOffer(index)}
              className={cn(
                "border rounded-xl p-4 cursor-pointer transition-all duration-200",
                selectedOffer === index
                  ? "ring-2 ring-primary bg-primary/10 border-primary"
                  : "border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/20"
              )}
            >
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-1">
                <span className="text-lg">{partnerOffer.flag}</span>
                <span>{partnerOffer.country} — {partnerOffer.partner}</span>
              </h3>
              <p className="text-sm text-muted-foreground">
                {partnerOffer.offer}
              </p>
              {partnerOffer.extra && (
                <p className="text-xs text-muted-foreground mt-2">
                  {partnerOffer.extra.split(/(https?:\/\/[^\s]+)/g).map((part, idx) =>
                    part.match(/^https?:\/\//) ? (
                      <a
                        key={idx}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {part}
                      </a>
                    ) : (
                      <span key={idx}>{part}</span>
                    )
                  )}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            asChild
            disabled={selectedOffer === null}
            className="min-w-[140px] group"
          >
            <a
              href={selectedOffer !== null ? PERPLEXITY_PARTNER_OFFERS[selectedOffer].link : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              Continue to Offer
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import SearchBarModal from './SearchBarModal';

/**
 * Main Custom Modal Router
 * Routes to the appropriate custom modal based on offer
 */
export function CustomOfferModal({ isOpen, onClose, offer }: CustomModalProps) {
  const normalizedName = offer.name.toLowerCase().replace(/\s+/g, '-');

  // Route to specific custom modal based on exact offer name
  if (normalizedName === 'google-ai-pro') {
    return <SearchBarModal isOpen={isOpen} onClose={onClose} offer={offer} />;
  }

  if (normalizedName.includes('perplexity') && normalizedName.includes('partner')) {
    return <PerplexityPartnerOffersModal isOpen={isOpen} onClose={onClose} offer={offer} />;
  }

  // Add more custom modals here
  // if (normalizedName.includes('github')) {
  //   return <GitHubModal isOpen={isOpen} onClose={onClose} offer={offer} />;
  // }

  // Fallback to default modal (shouldn't happen if hasCustomModal is used correctly)
  return null;
}

/**
 * Template for creating new custom modals
 * Copy this and customize for each offer
 */
export function TemplateCustomModal({ isOpen, onClose, offer }: CustomModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={offer.logo}
                alt={offer.name}
                width={48}
                height={48}
                className="rounded-lg object-cover"
              />
              <div>
                <DialogTitle className="text-2xl">{offer.name}</DialogTitle>
                <DialogDescription className="text-base mt-1">
                  {offer.offer}
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Add custom sections here */}

          {/* Description */}
          <div>
            <h3 className="font-semibold text-lg mb-2">About</h3>
            <p className="text-sm text-muted-foreground">
              {offer.description}
            </p>
          </div>

          {/* Extra Info (if available) */}
          {offer.extra_info && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Additional Information</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {offer.extra_info}
              </p>
            </div>
          )}

          {/* Tags */}
          {offer.tags && offer.tags.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {offer.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* CTA Button */}
          <Button asChild className="w-full" size="lg">
            <a
              href={offer.claim_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              Claim Offer
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
