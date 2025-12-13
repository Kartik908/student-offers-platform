'use client';
/**
 * Deferred Analytics Loader
 * Loads analytics scripts after page is interactive to improve initial load performance
 */

import { useEffect, useState } from 'react';

export function useDeferredAnalytics() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Wait for page to be interactive before loading analytics
        if (document.readyState === 'complete') {
            // Page already loaded
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsReady(true);
        } else {
            // Wait for load event
            const handleLoad = () => setIsReady(true);
            window.addEventListener('load', handleLoad);
            return () => window.removeEventListener('load', handleLoad);
        }
    }, []);

    return isReady;
}
