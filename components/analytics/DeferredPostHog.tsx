'use client';

import { useEffect, useState } from 'react';
import { PostHogProvider as OriginalPostHogProvider } from '@/providers/PostHogProvider';
import { hasConsentFor } from '@/lib/consentManager';

/**
 * Deferred PostHog loader - loads analytics only after:
 * 1. Page is interactive
 * 2. User has given analytics consent
 * This improves performance and respects privacy
 */
export function DeferredPostHog({ children }: { children: React.ReactNode }) {
    const [shouldLoad, setShouldLoad] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return; // Prevent SSR execution

        // Only load if user has given analytics consent
        const hasAnalyticsConsent = hasConsentFor('analytics');

        if (hasAnalyticsConsent) {
            // Wait for page to be interactive before loading analytics
            const timer = setTimeout(() => {
                setShouldLoad(true);
            }, 2000); // 2 second delay to prioritize initial render

            return () => clearTimeout(timer);
        }

        // Listen for consent changes (when user accepts cookies)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'cookie_preferences' && hasConsentFor('analytics')) {
                setTimeout(() => setShouldLoad(true), 500);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [mounted]);

    if (!shouldLoad) {
        // Render children without PostHog until consent is given
        return <>{children}</>;
    }

    return <OriginalPostHogProvider>{children}</OriginalPostHogProvider>;
}
