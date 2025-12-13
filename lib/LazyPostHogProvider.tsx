/**
 * Lazy PostHog Provider
 * Loads PostHog only after page is interactive to improve initial load performance
 */

import { ReactNode, useEffect, useState } from 'react';
import { PostHogProvider } from 'posthog-js/react';
import posthog from 'posthog-js';
import { hasConsent, getCookiePreferences } from './consentManager';
import { enablePostHogFeatures } from './posthogConsent';

interface LazyPostHogProviderProps {
    children: ReactNode;
}

export function LazyPostHogProvider({ children }: LazyPostHogProviderProps) {
    const [isPostHogReady, setIsPostHogReady] = useState(false);

    useEffect(() => {
        // Wait for page to be interactive before initializing PostHog
        const initializePostHog = () => {
            if (typeof window === 'undefined') return;

            // Initialize PostHog
            posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
                api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,

                // Privacy-first initialization - compliant with Indian privacy laws
                person_profiles: 'never',
                autocapture: false,
                capture_pageview: false,
                disable_session_recording: true,
                opt_out_capturing_by_default: true,

                // Enhanced privacy settings for India compliance
                mask_all_element_attributes: true,
                mask_all_text: true,
                respect_dnt: true,
                ip: false,
                property_blacklist: ['$ip', '$geoip_country_name', '$geoip_city_name'],

                // Security and compliance
                secure_cookie: true,
                cross_subdomain_cookie: false,
                persistence: 'localStorage',

                debug: process.env.NODE_ENV === 'development',

                loaded: (posthogInstance) => {
                    // Check if user has already given consent
                    if (hasConsent()) {
                        const preferences = getCookiePreferences();
                        const method = localStorage.getItem('analytics_consent') === 'all' ? 'accept_all' :
                            localStorage.getItem('analytics_consent') === 'necessary' ? 'necessary_only' : 'custom';

                        // Re-enable features based on saved preferences
                        enablePostHogFeatures(posthogInstance, preferences, method as 'accept_all' | 'necessary_only' | 'custom');
                    } else {
                        // Before consent: Only track absolutely necessary events for basic functionality
                        posthogInstance.capture('app_initialized', {
                            path: window.location.pathname,
                            timestamp: new Date().toISOString(),
                            country: 'India',
                            consent_status: 'pending',
                        });
                    }

                    setIsPostHogReady(true);
                },
            });
        };

        // Defer initialization until page is interactive
        if (document.readyState === 'complete') {
            // Page already loaded - wait longer to ensure it's off critical path
            setTimeout(initializePostHog, 1500);
        } else {
            // Wait for load event
            const handleLoad = () => {
                // Delay PostHog initialization to keep it off critical rendering path
                setTimeout(initializePostHog, 1500);
            };
            window.addEventListener('load', handleLoad);
            return () => window.removeEventListener('load', handleLoad);
        }
    }, []);

    // Render children immediately, PostHog will be available after page load
    if (!isPostHogReady) {
        return <>{children}</>;
    }

    return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
