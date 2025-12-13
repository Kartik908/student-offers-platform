'use client';
/**
 * React hook for consent management
 * Provides easy access to consent state and actions
 */

import { useState, useEffect } from 'react';
import { usePostHog } from 'posthog-js/react';
import {
  CookiePreferences,
  ConsentMethod,
  getCookiePreferences,
  hasConsent,
  hasConsentFor,
  saveConsentPreferences,
  revokeConsent as revokeConsentManager,
  getConsentStatus
} from '../lib/consentManager';
import { disablePostHogFeatures } from '../lib/posthogConsent';

export function useConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences>(() => {
    // SSR-safe initialization
    if (typeof window === 'undefined') {
      return { necessary: true, functional: false, analytics: false, marketing: false };
    }
    return getCookiePreferences();
  });
  const [consentGiven, setConsentGiven] = useState(() => {
    // SSR-safe initialization
    if (typeof window === 'undefined') {
      return false;
    }
    return hasConsent();
  });
  const posthog = usePostHog();

  // Initialize client-side values after hydration
  useEffect(() => {
    // Set actual values after hydration
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreferences(getCookiePreferences());
    setConsentGiven(hasConsent());
  }, []);

  // Sync with localStorage changes (cross-tab)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cookie_preferences' || e.key === 'analytics_consent') {
        setPreferences(getCookiePreferences());
        setConsentGiven(hasConsent());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateConsent = (newPreferences: CookiePreferences, method: ConsentMethod) => {
    saveConsentPreferences(newPreferences, method);
    setPreferences(newPreferences);
    setConsentGiven(true);
  };

  const revokeConsent = () => {
    if (posthog) {
      disablePostHogFeatures(posthog);
    }
    revokeConsentManager();
    setPreferences(getCookiePreferences());
    setConsentGiven(false);
  };

  const hasConsentForType = (type: keyof CookiePreferences) => {
    return hasConsentFor(type);
  };

  return {
    preferences,
    consentGiven,
    consentStatus: typeof window === 'undefined' ? null : getConsentStatus(),
    hasConsentFor: hasConsentForType,
    updateConsent,
    revokeConsent,
  };
}