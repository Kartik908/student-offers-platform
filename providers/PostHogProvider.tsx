'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';
import { hasConsent, getCookiePreferences } from '@/lib/consentManager';
import { enablePostHogFeatures } from '@/lib/posthogConsent';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
      const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

      if (key && host) {
        // Initialize PostHog in privacy-first mode
        posthog.init(key, {
          api_host: host,
          person_profiles: 'never', // Privacy-first: no person profiles by default
          autocapture: false, // Disabled until consent
          capture_pageview: false, // Manual page view tracking
          disable_session_recording: true, // Disabled until consent
          opt_out_capturing_by_default: true, // Start opted out
          mask_all_element_attributes: true,
          mask_all_text: true,
          respect_dnt: true,
          loaded: (ph) => {
            // Development mode: opt out completely
            if (process.env.NODE_ENV === 'development') {
              ph.opt_out_capturing();
              return;
            }

            // Check if user has given consent
            if (hasConsent()) {
              const preferences = getCookiePreferences();
              enablePostHogFeatures(ph, preferences, 'custom');
            }
          },
        });
      }
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
