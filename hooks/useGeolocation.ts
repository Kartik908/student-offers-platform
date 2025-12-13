'use client';
import { useState, useEffect } from 'react';

interface GeolocationData {
  isIndia: boolean;
  isLoading: boolean;
  countryCode: string | null;
}

/**
 * Hook to detect user's country based on IP address
 * Uses Vercel's x-vercel-ip-country header via /api/geo endpoint
 */
export function useGeolocation(): GeolocationData {
  const [isIndia, setIsIndia] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [countryCode, setCountryCode] = useState<string | null>(null);

  useEffect(() => {
    const detectLocation = async () => {
      // Defer execution to avoid blocking critical path
      if (document.readyState !== 'complete') {
        await new Promise(resolve => window.addEventListener('load', resolve, { once: true }));
      }

      try {
        // In development (localhost), /api/geo might not be available unless using 'vercel dev'
        // So we fallback to 'IN' (India) for testing purposes if the fetch fails

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
    };

    detectLocation();
  }, []);

  return { isIndia, isLoading, countryCode };
}
