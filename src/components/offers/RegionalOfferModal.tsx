import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ArrowUpRight, Globe, Info } from "lucide-react";
import { Offer, AltLinkDetails } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import VerticalListModal from "./VerticalListModal";

interface RegionalOfferModalProps {
  offer: Offer;
  isOpen: boolean;
  onClose: () => void;
}

// Country code to flag emoji mapping
const COUNTRY_FLAGS: Record<string, string> = {
  'US': '🇺🇸',
  'IN': '🇮🇳',
  'UK': '🇬🇧',
  'GB': '🇬🇧',
  'CA': '🇨🇦',
  'AU': '🇦🇺',
  'DE': '🇩🇪',
  'FR': '🇫🇷',
  'JP': '🇯🇵',
  'BR': '🇧🇷',
  'MX': '🇲🇽',
  'ES': '🇪🇸',
  'IT': '🇮🇹',
  'NL': '🇳🇱',
  'SE': '🇸🇪',
  'NO': '🇳🇴',
  'DK': '🇩🇰',
  'FI': '🇫🇮',
  'SG': '🇸🇬',
  'TH': '🇹🇭',
  'ID': '🇮🇩',
  'IE': '🇮🇪',
  'AT': '🇦🇹',
  'HU': '🇭🇺',
  'ME': '🇲🇪',
  'MK': '🇲🇰',
  'CZ': '🇨🇿',
  'SK': '🇸🇰',
};

// Country code to full name mapping
const COUNTRY_NAMES: Record<string, string> = {
  'US': 'United States',
  'IN': 'India',
  'UK': 'United Kingdom',
  'GB': 'United Kingdom',
  'CA': 'Canada',
  'AU': 'Australia',
  'DE': 'Germany',
  'FR': 'France',
  'JP': 'Japan',
  'BR': 'Brazil',
  'MX': 'Mexico',
  'ES': 'Spain',
  'IT': 'Italy',
  'NL': 'Netherlands',
  'SE': 'Sweden',
  'NO': 'Norway',
  'DK': 'Denmark',
  'FI': 'Finland',
  'SG': 'Singapore',
  'TH': 'Thailand',
  'ID': 'Indonesia',
  'IE': 'Ireland',
  'AT': 'Austria',
  'HU': 'Hungary',
  'ME': 'Montenegro',
  'MK': 'North Macedonia',
  'CZ': 'Czech Republic',
  'SK': 'Slovakia',
};

// Detect user's country from browser language
function detectUserCountry(): string {
  try {
    const lang = navigator.language; // e.g., "en-US", "en-IN"
    const countryCode = lang.split('-')[1];
    return countryCode || 'US';
  } catch {
    return 'US';
  }
}

// Check if alt_links uses new format (objects) vs old format (strings)
function isNewAltLinksFormat(altLinks: Offer['alt_links']): boolean {
  if (!altLinks || typeof altLinks !== 'object') return false;

  const firstKey = Object.keys(altLinks)[0];
  if (!firstKey) return false;

  const firstValue = altLinks[firstKey];
  const isNewFormat = typeof firstValue === 'object' &&
    firstValue !== null &&
    'url' in firstValue &&
    'offer_text' in firstValue;

  // Debug logging (development only)
  if (process.env.NODE_ENV === 'development') {
    // Debug: format detection logged here during development
  }

  return isNewFormat;
}

// Copy text to clipboard
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    toast.success("Copied to clipboard!");
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

export default function RegionalOfferModal({ offer, isOpen, onClose }: RegionalOfferModalProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Get available countries - memoize to prevent unnecessary re-renders
  const availableCountries = useMemo(() => {
    return offer.has_alt_links && offer.alt_links
      ? Object.keys(offer.alt_links)
      : [];
  }, [offer.has_alt_links, offer.alt_links]);

  // Check if we should use the vertical list layout (5+ regions with single offers each)
  const useListLayout = useMemo(() => {
    // Must have alt_links and at least 5 regions
    if (!offer.alt_links || availableCountries.length < 5) {
      return false;
    }

    // Check if all regions have single offers
    const allSingleOffers = availableCountries.every(countryCode => {
      const countryData = offer.alt_links![countryCode];

      // Old format: string URL = single offer
      if (typeof countryData === 'string') return true;

      // New format: object with url = single offer
      if (typeof countryData === 'object' && countryData !== null && !Array.isArray(countryData) && 'url' in countryData) {
        return true;
      }

      // Array format with single item = single offer
      if (Array.isArray(countryData) && countryData.length === 1) {
        return true;
      }

      // Multiple offers (arrays with 2+ items)
      return false;
    });

    return allSingleOffers;
  }, [offer.alt_links, availableCountries]);

  // Only show modal if has_alt_links is true and there are available countries
  const shouldShowModal = offer.has_alt_links && availableCountries.length > 0;

  // Auto-detect and set initial country when modal opens
  useEffect(() => {
    if (isOpen && availableCountries.length > 0 && !selectedCountry) {
      const detectedCountry = detectUserCountry();
      const initialCountry = availableCountries.includes(detectedCountry)
        ? detectedCountry
        : availableCountries[0];
      setSelectedCountry(initialCountry);
    }
  }, [isOpen, availableCountries, selectedCountry]);

  // Get current offer details - handle all formats
  const currentOffer = useMemo(() => {
    if (!selectedCountry || !offer.alt_links) return null;

    const countryData = offer.alt_links[selectedCountry];

    // Old format: string URL
    if (typeof countryData === 'string') {
      return {
        url: countryData,
        offer_text: offer.offer || 'Available in your region',
        pricing: null,
        discount_code: null
      } as AltLinkDetails;
    }

    // Array format: extract first item
    if (Array.isArray(countryData) && countryData.length > 0) {
      const firstOffer = countryData[0];
      if (typeof firstOffer === 'object' && firstOffer !== null && 'url' in firstOffer) {
        return firstOffer as AltLinkDetails;
      }
    }

    // Object format: direct object
    if (typeof countryData === 'object' && countryData !== null && !Array.isArray(countryData) && 'url' in countryData) {
      return countryData as AltLinkDetails;
    }

    return null;
  }, [selectedCountry, offer.alt_links, offer.offer]);



  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedCountry('');
    }
  }, [isOpen]);

  // If no alt_links at all, don't render
  if (!shouldShowModal) {
    return null;
  }

  const handleContinueToOffer = () => {
    if (currentOffer?.url) {
      window.open(currentOffer.url, '_blank', 'noopener,noreferrer');
      onClose();
    }
  };

  const handleCopyCode = () => {
    if (currentOffer?.discount_code) {
      copyToClipboard(currentOffer.discount_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // Use VerticalListModal for 5+ regions with single offers
  if (useListLayout) {
    return <VerticalListModal isOpen={isOpen} onClose={onClose} offer={offer} />;
  }

  // Pill layout for fewer regions or multiple offers per region
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-2xl max-h-[85vh] p-0 gap-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{
                duration: 0.2,
                ease: [0.16, 1, 0.3, 1],
                type: "tween"
              }}
            >
              <DialogHeader className="px-6 pt-6 pb-4 space-y-1">
                <DialogTitle className="text-xl font-semibold">
                  Claim: {offer.name}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Select your country to view the specific student offer available.
                </p>
              </DialogHeader>

              {/* Divider */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

              <motion.div
                className="px-6 py-5 space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                {/* Country Selection Pills */}
                <div className="flex flex-wrap gap-2">
                  {availableCountries.map((countryCode, index) => {
                    const isSelected = selectedCountry === countryCode;

                    // Get flag from alt_links data if available
                    const countryData = offer.alt_links?.[countryCode];
                    let dataFlag: string | undefined;
                    if (typeof countryData === 'object' && countryData !== null && !Array.isArray(countryData) && 'flag' in countryData) {
                      dataFlag = countryData.flag || undefined;
                    }

                    const flag = dataFlag || COUNTRY_FLAGS[countryCode] || '🌍';
                    const countryName = COUNTRY_NAMES[countryCode] || countryCode;

                    return (
                      <motion.button
                        key={countryCode}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: 0.15 + (index * 0.03),
                          duration: 0.2,
                          ease: [0.16, 1, 0.3, 1]
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedCountry(countryCode)}
                        className={cn(
                          "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 font-medium text-sm",
                          isSelected
                            ? "ring-2 ring-primary bg-accent/50 border-primary/50"
                            : "border-border bg-card/50 hover:bg-accent/30 hover:border-border/80"
                        )}
                      >
                        <span className="text-lg leading-none">{flag}</span>
                        <span className="leading-none">{countryName}</span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Selected Offer Details Card */}
                <AnimatePresence mode="wait">
                  {selectedCountry && currentOffer && (
                    <motion.div
                      key={selectedCountry}
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.98 }}
                      transition={{
                        duration: 0.25,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      className="bg-muted/30 rounded-xl p-5 border border-border/50"
                    >
                      <p className="text-sm text-foreground/90 leading-relaxed">
                        {currentOffer.offer_text}
                      </p>

                      {currentOffer.pricing && (
                        <p className="text-xs text-muted-foreground/70 mt-1.5 italic break-words">
                          {linkifyText(currentOffer.pricing)}
                        </p>
                      )}

                      {/* Discount Code Section */}
                      {currentOffer.discount_code && (
                        <div className="flex items-center gap-2 mt-1.5">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">Code:</span>
                            {' '}
                            <span className="font-mono bg-muted/80 px-2 py-0.5 rounded text-primary font-medium border border-border/50">
                              {currentOffer.discount_code}
                            </span>
                          </p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCopyCode}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-primary transition-colors hover:bg-transparent"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <AnimatePresence>
                            {copied && (
                              <motion.span
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.15 }}
                                className="text-xs text-green-400 font-medium"
                              >
                                Copied!
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Additional Requirements */}
                      {currentOffer.requirements && (
                        <p className="text-xs text-muted-foreground mt-1.5">
                          <span className="font-medium text-foreground">Requirements:</span> {currentOffer.requirements}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* No Selection State */}
                {!selectedCountry && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="bg-muted/30 rounded-xl p-4 border border-dashed border-border"
                  >
                    <p className="text-sm text-muted-foreground text-center">
                      Please select a country above to view available offers.
                    </p>
                  </motion.div>
                )}

              </motion.div>

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
                } catch (e) {
                  // Silently fail if extra_info is not valid JSON
                  return null;
                }
                return null;
              })()}

              {/* Divider */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

              {/* Footer */}
              <motion.div
                className="flex justify-end gap-3 p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.3 }}
              >
                <Button
                  variant="secondary"
                  onClick={onClose}
                  className="bg-card/50 hover:bg-card/70 border border-border"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleContinueToOffer}
                  disabled={!currentOffer?.url}
                  className="min-w-[140px] group"
                >
                  Continue to Offer
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}