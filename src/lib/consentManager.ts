/**
 * Consent Management System
 * Handles cookie preferences, localStorage, and PostHog integration
 */

export interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export type ConsentMethod = 'accept_all' | 'necessary_only' | 'custom';
export type ConsentStatus = 'all' | 'necessary' | 'custom' | 'revoked' | null;

// Storage keys
const STORAGE_KEYS = {
  COOKIE_PREFERENCES: 'cookie_preferences',
  ANALYTICS_CONSENT: 'analytics_consent',
} as const;

// Default preferences
const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

/**
 * Get current cookie preferences from localStorage
 */
export function getCookiePreferences(): CookiePreferences {
  // SSR guard
  if (typeof window === 'undefined') {
    return DEFAULT_PREFERENCES;
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COOKIE_PREFERENCES);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_PREFERENCES, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to parse cookie preferences:', error);
  }
  return DEFAULT_PREFERENCES;
}

/**
 * Get current consent status from localStorage
 */
export function getConsentStatus(): ConsentStatus {
  // SSR guard
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    return localStorage.getItem(STORAGE_KEYS.ANALYTICS_CONSENT) as ConsentStatus;
  } catch (error) {
    console.warn('Failed to get consent status:', error);
    return null;
  }
}

/**
 * Check if user has given any consent
 */
export function hasConsent(): boolean {
  const status = getConsentStatus();
  return status !== null && status !== 'revoked';
}

/**
 * Check if specific consent type is granted
 */
export function hasConsentFor(type: keyof CookiePreferences): boolean {
  if (type === 'necessary') return true; // Always allowed
  
  const preferences = getCookiePreferences();
  return preferences[type] === true;
}

/**
 * Save cookie preferences and consent status
 */
export function saveConsentPreferences(
  preferences: CookiePreferences,
  method: ConsentMethod
): void {
  // SSR guard
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    // Save preferences
    localStorage.setItem(
      STORAGE_KEYS.COOKIE_PREFERENCES,
      JSON.stringify(preferences)
    );

    // Determine consent status
    let status: ConsentStatus;
    if (method === 'accept_all') {
      status = 'all';
    } else if (method === 'necessary_only') {
      status = 'necessary';
    } else {
      status = 'custom';
    }

    localStorage.setItem(STORAGE_KEYS.ANALYTICS_CONSENT, status);

    // Emit storage event for cross-tab sync
    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEYS.COOKIE_PREFERENCES,
      newValue: JSON.stringify(preferences),
    }));

  } catch (error) {
    console.error('Failed to save consent preferences:', error);
  }
}

/**
 * Revoke all consent and clear preferences
 */
export function revokeConsent(): void {
  // SSR guard
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(STORAGE_KEYS.ANALYTICS_CONSENT, 'revoked');
    localStorage.setItem(
      STORAGE_KEYS.COOKIE_PREFERENCES,
      JSON.stringify(DEFAULT_PREFERENCES)
    );

    // Emit storage event
    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEYS.ANALYTICS_CONSENT,
      newValue: 'revoked',
    }));

  } catch (error) {
    console.error('Failed to revoke consent:', error);
  }
}

/**
 * Clear all consent data (for testing)
 */
export function clearConsentData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.COOKIE_PREFERENCES);
    localStorage.removeItem(STORAGE_KEYS.ANALYTICS_CONSENT);
  } catch (error) {
    console.error('Failed to clear consent data:', error);
  }
}

/**
 * Get consent event properties for PostHog
 */
export function getConsentEventProps(
  preferences: CookiePreferences,
  method: ConsentMethod
) {
  // SSR-safe browser object access
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
  const screenResolution = typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : 'unknown';
  
  return {
    method,
    preferences,
    country: 'India', // Could be dynamic based on geolocation
    timestamp: new Date().toISOString(),
    user_agent: userAgent,
    screen_resolution: screenResolution,
  };
}