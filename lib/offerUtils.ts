/**
 * Utility functions for offer styling and formatting
 */

/**
 * Get CSS classes for offer badge based on offer text content
 * Premium styling with subtle gradients and glass effects
 */
export const getOfferBadgeClasses = (offer: string) => {
  const lowerOffer = offer.toLowerCase();

  // Base classes for all ribbons (glass effect, shadow, hover glow)
  const baseClasses = "shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md";

  if (lowerOffer.includes('trial')) {
    return `${baseClasses} bg-gradient-to-br from-teal-50 to-teal-100 text-teal-800 border-teal-300 dark:from-teal-500/10 dark:to-teal-500/20 dark:text-teal-100 dark:border-teal-500/20 hover:dark:border-teal-500/30`;
  }
  if (lowerOffer.includes('credit')) {
    return `${baseClasses} bg-gradient-to-br from-purple-50 to-purple-100 text-purple-800 border-purple-300 dark:from-purple-500/10 dark:to-purple-500/20 dark:text-purple-100 dark:border-purple-500/20 hover:dark:border-purple-500/30`;
  }
  if (lowerOffer.includes('off') || lowerOffer.includes('discount')) {
    return `${baseClasses} bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-800 border-indigo-300 dark:from-indigo-500/10 dark:to-indigo-500/20 dark:text-indigo-100 dark:border-indigo-500/20 hover:dark:border-indigo-500/30`;
  }
  if (lowerOffer.includes('free')) {
    return `${baseClasses} bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-800 border-emerald-300 dark:from-emerald-500/10 dark:to-emerald-500/20 dark:text-emerald-100 dark:border-emerald-500/20 hover:dark:border-emerald-500/30`;
  }

  // Default styling
  return `${baseClasses} bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 border-slate-300 dark:from-slate-500/10 dark:to-slate-500/20 dark:text-slate-100 dark:border-slate-500/20 hover:dark:border-slate-500/30`;
};

/**
 * Parse urgency badge from database (supports both JSON and plain text)
 */
export const parseUrgencyBadge = (badge: string | null) => {
  if (!badge) return null;

  try {
    const parsed = JSON.parse(badge);
    return {
      emoji: parsed.emoji || '',
      text: parsed.text || ''
    };
  } catch {
    // Fallback: treat as plain text if not valid JSON
    return {
      emoji: '',
      text: badge
    };
  }
};