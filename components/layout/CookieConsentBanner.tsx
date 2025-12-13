'use client';

import React, { useState, useEffect } from "react";
import { Settings2, Cookie } from "lucide-react";
import { usePostHog } from 'posthog-js/react';
import {
  CookiePreferences,
  getCookiePreferences,
  saveConsentPreferences,
  hasConsent,
} from '../../lib/consentManager';
import {
  enablePostHogFeatures
} from '../../lib/posthogConsent';

const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(getCookiePreferences());
  const [isLoading, setIsLoading] = useState(false);
  const posthog = usePostHog();

  useEffect(() => {
    // Check if user has already made a choice
    if (!hasConsent()) {
      // Track banner shown event (minimal, necessary tracking)
      if (posthog) {
        try {
          posthog.capture('cookie_banner_shown', {
            timestamp: new Date().toISOString(),
            path: window.location.pathname,
          });
        } catch (error) {
          console.warn('Failed to track banner shown:', error);
        }
      }

      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 1500);
    } else {
      // Load saved preferences
      setPreferences(getCookiePreferences());
    }

    // Listen for storage changes (cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cookie_preferences' && e.newValue) {
        try {
          const newPrefs = JSON.parse(e.newValue);
          setPreferences(newPrefs);
        } catch (error) {
          console.warn('Failed to sync preferences across tabs:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [posthog]);

  const handleAcceptAll = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const allPrefs: CookiePreferences = {
        necessary: true,
        functional: true,
        analytics: true,
        marketing: true,
      };

      // Save preferences and consent
      saveConsentPreferences(allPrefs, 'accept_all');
      setPreferences(allPrefs);

      // Enable PostHog features
      if (posthog) {
        enablePostHogFeatures(posthog, allPrefs, 'accept_all');
      }

      setShowBanner(false);
    } catch (error) {
      console.error('Failed to accept all cookies:', error);
      if (posthog) {
        console.error('Failed to accept necessary consent:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNecessaryOnly = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const necessaryPrefs: CookiePreferences = {
        necessary: true,
        functional: false,
        analytics: false,
        marketing: false,
      };

      // Save preferences and consent
      saveConsentPreferences(necessaryPrefs, 'necessary_only');
      setPreferences(necessaryPrefs);

      // Enable only necessary PostHog features (minimal)
      if (posthog) {
        enablePostHogFeatures(posthog, necessaryPrefs, 'necessary_only');
      }

      setShowBanner(false);
    } catch (error) {
      console.error('Failed to set necessary only:', error);
      if (posthog) {
        console.error('Failed to accept necessary consent:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      // Save custom preferences
      saveConsentPreferences(preferences, 'custom');

      // Enable PostHog features based on custom preferences
      if (posthog) {
        enablePostHogFeatures(posthog, preferences, 'custom');
      }

      setShowModal(false);
      setShowBanner(false);

      // Show brief success feedback
      // Could add a toast notification here
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);

    // Track modal opened for UX analytics (minimal, necessary)
    if (posthog) {
      try {
        posthog.capture('consent_opened', {
          timestamp: new Date().toISOString(),
          source: 'cookie_banner',
        });
      } catch (error) {
        console.warn('Failed to track modal open:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Reset preferences to saved state if user cancels
    setPreferences(getCookiePreferences());
  };

  return (
    <>
      {showBanner && (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 rounded-2xl sm:rounded-full border border-white/50 dark:border-white/10 bg-gradient-to-b from-white/90 to-white/50 dark:from-neutral-900/90 dark:to-neutral-900/50 backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-black/20 ring-1 ring-black/5 dark:ring-white/10 px-4 sm:px-5 lg:px-6 py-3 sm:py-3 w-[95%] sm:w-[90%] lg:w-[85%] max-w-4xl z-[80]">
          <div className="flex items-center gap-2 sm:gap-3 text-neutral-900 dark:text-gray-100 text-center sm:text-left justify-center sm:justify-start">
            <div className="p-1.5 sm:p-2 bg-black/5 dark:bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Cookie className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-900 dark:text-white" />
            </div>
            <p className="text-xs sm:text-sm leading-tight font-medium dark:font-normal">🍪 We use cookies to improve your experience across the site.</p>
          </div>
          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-1.5 sm:gap-2 w-full sm:w-auto mt-1 sm:mt-0">
            <button
              onClick={handleOpenModal}
              disabled={isLoading}
              className="rounded-full border border-black/10 dark:border-white/20 p-1.5 sm:p-2 text-neutral-700 dark:text-gray-100 hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Manage Preferences"
              aria-label="Manage cookie preferences"
            >
              <Settings2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={handleNecessaryOnly}
              disabled={isLoading}
              className="rounded-full border border-black/10 dark:border-white/20 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm text-neutral-700 dark:text-gray-100 hover:bg-black/5 dark:hover:bg-white/10 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Saving...' : 'Necessary Only'}
            </button>
            <button
              onClick={handleAcceptAll}
              disabled={isLoading}
              className="rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium hover:bg-neutral-800 dark:hover:bg-gray-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {isLoading ? 'Saving...' : 'Accept All'}
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-md px-4 py-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
          aria-describedby="cookie-modal-description"
        >
          <div className="bg-white/70 dark:bg-neutral-900/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-5 lg:p-6 w-full max-w-xs sm:max-w-md relative border border-white/20 dark:border-white/10 max-h-[90vh] overflow-y-auto">
            <h2 id="cookie-modal-title" className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Manage Cookie Preferences
            </h2>
            <p id="cookie-modal-description" className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 leading-snug">
              Choose which types of cookies you want to allow. You can change your preferences anytime.
            </p>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {[
                {
                  key: "necessary" as keyof CookiePreferences,
                  label: "Necessary (Always On)",
                  desc: "Essential for security, accessibility, and site functionality.",
                  disabled: true,
                },
                {
                  key: "functional" as keyof CookiePreferences,
                  label: "Functional Cookies",
                  desc: "Remember preferences like language and theme to enhance experience.",
                },
                {
                  key: "analytics" as keyof CookiePreferences,
                  label: "Analytics Cookies",
                  desc: "Help improve usability and performance through anonymous insights.",
                },
                {
                  key: "marketing" as keyof CookiePreferences,
                  label: "Marketing Cookies",
                  desc: "Enable personalized offers and ads based on your interests.",
                },
              ].map((cookie) => (
                <div key={cookie.key} className="flex items-start justify-between gap-2 sm:gap-3">
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm block mb-0.5">{cookie.label}</span>
                    <p className="text-gray-600 dark:text-gray-400 text-xs leading-snug pr-1">{cookie.desc}</p>
                  </div>
                  <div className="relative mt-1">
                    <input
                      type="checkbox"
                      checked={preferences[cookie.key]}
                      disabled={cookie.disabled}
                      onChange={(e) => setPreferences({ ...preferences, [cookie.key]: e.target.checked })}
                      className="sr-only"
                      id={`cookie-${cookie.key}`}
                    />
                    <label
                      htmlFor={`cookie-${cookie.key}`}
                      className={`
                        w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-200 flex-shrink-0
                        ${preferences[cookie.key]
                          ? 'bg-black border-black'
                          : 'bg-white border-gray-300 hover:border-gray-400'
                        }
                        ${cookie.disabled ? 'cursor-not-allowed opacity-60' : ''}
                      `}
                    >
                      {preferences[cookie.key] && (
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 sm:mt-5 lg:mt-6">
              <button
                onClick={handleCloseModal}
                disabled={isLoading}
                className="rounded-full border border-white/30 dark:border-gray-600 bg-white/40 dark:bg-gray-700/60 px-3 sm:px-4 py-1.5 text-xs sm:text-sm hover:bg-white/60 dark:hover:bg-gray-600/80 text-gray-900 dark:text-gray-200 order-2 sm:order-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="rounded-full bg-black/85 dark:bg-white/90 px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-white dark:text-black hover:bg-black dark:hover:bg-white order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Declare global functions for TypeScript
declare global {
  interface Window {
    posthogConsentGiven?: () => void;
    posthogConsentRejected?: () => void;
  }
}

export default CookieConsentBanner;