/**
 * Vertical List Modal for regional offers with 5+ regions
 * Displays offers in a clean vertical list with flags and country names
 */
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Info } from "lucide-react";
import { Offer, AltLinkDetails } from "@/types";
import { cn } from "@/lib/utils";

interface VerticalListModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: Offer;
}

// Country code to flag emoji mapping
const COUNTRY_FLAGS: Record<string, string> = {
  'US': '🇺🇸', 'IN': '🇮🇳', 'UK': '🇬🇧', 'GB': '🇬🇧', 'CA': '🇨🇦',
  'AU': '🇦🇺', 'DE': '🇩🇪', 'FR': '🇫🇷', 'JP': '🇯🇵', 'BR': '🇧🇷',
  'MX': '🇲🇽', 'ES': '🇪🇸', 'IT': '🇮🇹', 'NL': '🇳🇱', 'SE': '🇸🇪',
  'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮', 'SG': '🇸🇬', 'ID': '🇮🇩',
  'IE': '🇮🇪', 'AT': '🇦🇹', 'HU': '🇭🇺', 'ME': '🇲🇪', 'MK': '🇲🇰',
  'CZ': '🇨🇿', 'SK': '🇸🇰',
};

// Country code to full name mapping
const COUNTRY_NAMES: Record<string, string> = {
  'US': 'United States', 'IN': 'India', 'UK': 'United Kingdom', 'GB': 'United Kingdom',
  'CA': 'Canada', 'AU': 'Australia', 'DE': 'Germany', 'FR': 'France',
  'JP': 'Japan', 'BR': 'Brazil', 'MX': 'Mexico', 'ES': 'Spain',
  'IT': 'Italy', 'NL': 'Netherlands', 'SE': 'Sweden', 'NO': 'Norway',
  'DK': 'Denmark', 'FI': 'Finland', 'SG': 'Singapore', 'ID': 'Indonesia',
  'IE': 'Ireland', 'AT': 'Austria', 'HU': 'Hungary', 'ME': 'Montenegro',
  'MK': 'North Macedonia', 'CZ': 'Czech Republic', 'SK': 'Slovakia',
};

// Detect user's country from browser language
function detectUserCountry(): string {
  try {
    const lang = navigator.language;
    const countryCode = lang.split('-')[1];
    return countryCode || 'US';
  } catch {
    return 'US';
  }
}

// Helper function to detect and linkify URLs in text
function linkifyText(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline break-all"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export default function VerticalListModal({ isOpen, onClose, offer }: VerticalListModalProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  // Get available countries
  const availableCountries = React.useMemo(() =>
    offer.alt_links ? Object.keys(offer.alt_links) : []
    , [offer.alt_links]);

  // Auto-detect user's country on open
  useEffect(() => {
    if (isOpen && availableCountries.length > 0 && !selectedCountry) {
      const detectedCountry = detectUserCountry();
      const initialCountry = availableCountries.includes(detectedCountry)
        ? detectedCountry
        : availableCountries[0];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedCountry(initialCountry);
    }
  }, [isOpen, availableCountries, selectedCountry]);

  // Reset selection when modal closes
  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedCountry('');
    }
  }, [isOpen]);

  // Get current offer details - handle all formats
  const getCurrentOfferData = (countryCode: string): (AltLinkDetails & { partner?: string; country?: string; flag?: string }) | null => {
    if (!offer.alt_links) return null;

    const countryData = offer.alt_links[countryCode];

    // Old format: string URL
    if (typeof countryData === 'string') {
      return {
        url: countryData,
        offer_text: offer.offer || 'Available in your region',
        pricing: null,
        discount_code: null,
        requirements: null,
      };
    }

    // Array format: extract first item
    if (Array.isArray(countryData) && countryData.length > 0) {
      const firstOffer = countryData[0];
      if (typeof firstOffer === 'object' && firstOffer !== null && 'url' in firstOffer) {
        return firstOffer as AltLinkDetails & { partner?: string; country?: string; flag?: string };
      }
    }

    // Object format: direct object
    if (typeof countryData === 'object' && countryData !== null && !Array.isArray(countryData) && 'url' in countryData) {
      return countryData as AltLinkDetails & { partner?: string; country?: string; flag?: string };
    }

    return null;
  };

  const currentOffer = selectedCountry ? getCurrentOfferData(selectedCountry) : null;

  const handleContinueToOffer = () => {
    if (currentOffer?.url) {
      window.open(currentOffer.url, '_blank', 'noopener,noreferrer');
      onClose();
    }
  };

  if (!offer.alt_links || availableCountries.length === 0) {
    return null;
  }

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
                {offer.name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground truncate">
                Select your regional offer to continue.
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Offers List */}
        <div className="px-6 py-5 overflow-y-auto max-h-[40vh] space-y-3 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          {availableCountries.map((countryCode, index) => {
            const offerData = getCurrentOfferData(countryCode);
            if (!offerData) return null;

            // Use flag from data if available, otherwise fallback to mapping
            const flag = offerData.flag || COUNTRY_FLAGS[countryCode] || '🌍';
            // Use country from data if available, otherwise fallback to mapping
            const countryName = offerData.country || COUNTRY_NAMES[countryCode] || countryCode;
            const isSelected = selectedCountry === countryCode;

            return (
              <div
                key={countryCode}
                onClick={() => setSelectedCountry(countryCode)}
                className={cn(
                  "border rounded-xl p-4 cursor-pointer transition-all duration-200 animate-fade-in-up",
                  isSelected
                    ? "ring-2 ring-primary bg-primary/10 border-primary shadow-sm"
                    : "border-border bg-muted/30 hover:bg-muted/50 hover:border-border/80"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-1.5">
                  <span className="text-lg">{flag}</span>
                  <span>{countryName}{offerData.partner ? ` — ${offerData.partner}` : ''}</span>
                </h3>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {offerData.offer_text}
                </p>
                {offerData.pricing && (
                  <p className="text-xs text-muted-foreground/70 mt-1.5 italic break-words">
                    {linkifyText(offerData.pricing)}
                  </p>
                )}
                {offerData.discount_code && (
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="font-medium text-foreground">Code:</span>{' '}
                    <span className="font-mono bg-muted/80 px-2 py-0.5 rounded text-primary font-medium border border-border/50">
                      {offerData.discount_code}
                    </span>
                  </p>
                )}
                {offerData.requirements && (
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="font-medium text-foreground">Requirements:</span> {offerData.requirements}
                  </p>
                )}
              </div>
            );
          })}

        </div>

        {/* Important Notes Section */}
        {offer.extra_info && (() => {
          try {
            const extraInfo = JSON.parse(offer.extra_info);
            const importantNotes = extraInfo.important_notes || [];

            if (importantNotes.length > 0) {
              return (
                <>
                  {/* Divider */}
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

                  {/* Important Notes - Full Width */}
                  <div className="px-6 py-3">
                    <div className="border border-primary/20 rounded-lg p-4 bg-primary/5">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        <h3 className="text-xs font-semibold text-primary">Important Notes</h3>
                      </div>
                      {importantNotes.map((note: { text?: string; link_url?: string; link_label?: string }, index: number) => (
                        <p key={index} className="text-[11px] text-foreground/70 leading-relaxed w-full break-words mb-1 last:mb-0 max-w-none">
                          {note.text}
                          {note.link_url && note.link_label && (
                            <>
                              {' '}
                              <a
                                href={note.link_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline font-medium"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {note.link_label}
                              </a>
                            </>
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                </>
              );
            }
          } catch {
            // Silently fail if extra_info is not valid JSON
            return null;
          }
          return null;
        })()}

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-10 px-4 hover:bg-muted/50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleContinueToOffer}
            disabled={!selectedCountry || !currentOffer?.url}
            className="h-10 min-w-[140px] group"
          >
            Continue to Offer
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </div>
      </DialogContent >
    </Dialog>
  );
}
