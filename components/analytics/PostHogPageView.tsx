'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { hasConsentFor } from '@/lib/consentManager';

import { Suspense } from 'react';

function PostHogPageViewContent(): null {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const posthog = usePostHog();

    useEffect(() => {
        // Only track if analytics consent is given
        if (pathname && posthog && hasConsentFor('analytics')) {
            let url = window.origin + pathname;
            if (searchParams && searchParams.toString()) {
                url = url + `?${searchParams.toString()}`;
            }

            // Capture pageview
            posthog.capture('$pageview', {
                $current_url: url,
            });
        }
    }, [pathname, searchParams, posthog]);

    return null;
}

export function PostHogPageView() {
    return (
        <Suspense fallback={null}>
            <PostHogPageViewContent />
        </Suspense>
    );
}
