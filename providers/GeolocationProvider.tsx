'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface GeolocationContextType {
    isIndia: boolean;
    isLoading: boolean;
    countryCode: string | null;
}

const GeolocationContext = createContext<GeolocationContextType>({
    isIndia: false,
    isLoading: true,
    countryCode: null,
});

/**
 * GeolocationProvider
 * 
 * Fetches user's country code immediately on mount.
 * This runs at the root level so geo data is ready before any component needs it.
 */
export function GeolocationProvider({ children }: { children: React.ReactNode }) {
    const [isIndia, setIsIndia] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [countryCode, setCountryCode] = useState<string | null>(null);

    const detectLocation = useCallback(async () => {
        try {
            const response = await fetch('/api/geo', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Geo API error: ${response.status}`);
            }

            const data = await response.json();
            const code = data.country_code;
            setCountryCode(code);
            setIsIndia(code === 'IN');
        } catch (error) {
            console.warn('Geolocation detection failed (using fallback):', error);
            // Default to showing India content if detection fails
            // This ensures local dev works fine even if /api/geo isn't running
            setIsIndia(true);
            setCountryCode('IN');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // Start fetching immediately - no need to wait for document ready
        detectLocation();
    }, [detectLocation]);

    return (
        <GeolocationContext.Provider value={{ isIndia, isLoading, countryCode }}>
            {children}
        </GeolocationContext.Provider>
    );
}

/**
 * Hook to access geolocation data from context
 */
export function useGeolocationContext(): GeolocationContextType {
    const context = useContext(GeolocationContext);
    return context;
}
