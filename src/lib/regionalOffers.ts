import { Offer, AltLinkDetails } from "@/types";

/**
 * Check if alt_links uses new format (objects) vs old format (strings)
 */
export function isNewAltLinksFormat(altLinks: Offer['alt_links']): boolean {
  if (!altLinks || typeof altLinks !== 'object') return false;

  const firstKey = Object.keys(altLinks)[0];
  if (!firstKey) return false;

  const firstValue = altLinks[firstKey];
  const isNewFormat = typeof firstValue === 'object' &&
    firstValue !== null &&
    'url' in firstValue &&
    'offer_text' in firstValue;

  // Debug logging (development only)
  // Debug logging (development only)
  if (process.env.NODE_ENV === 'development') {
    // Logging removed for production
  }

  return isNewFormat;
}

/**
 * Check if an offer has regional variants (both old and new format)
 */
export function hasRegionalOffers(offer: Offer): boolean {
  // Accept both old format (string URLs) and new format (objects)
  return offer.has_alt_links && !!offer.alt_links && Object.keys(offer.alt_links).length > 0;
}

/**
 * Get regional offer details for a specific country
 */
export function getRegionalOffer(offer: Offer, countryCode: string): AltLinkDetails | null {
  if (!hasRegionalOffers(offer) || !offer.alt_links) return null;

  const countryOffer = offer.alt_links[countryCode];
  return typeof countryOffer === 'object' ? countryOffer : null;
}

/**
 * Get all available countries for an offer
 */
export function getAvailableCountries(offer: Offer): string[] {
  if (!hasRegionalOffers(offer) || !offer.alt_links) return [];
  return Object.keys(offer.alt_links);
}

/**
 * Detect user's country from browser language
 */
export function detectUserCountry(): string {
  try {
    const lang = navigator.language; // e.g., "en-US", "en-IN"
    const countryCode = lang.split('-')[1];
    return countryCode || 'US';
  } catch {
    return 'US';
  }
}