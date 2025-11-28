import { useState, useEffect } from 'react';

interface GeolocationData {
  isIndia: boolean;
  isLoading: boolean;
  countryCode: string | null;
}

/**
 * Hook to detect user's country based on IP address
 * Uses ipapi.co for geolocation detection
 */
export function useGeolocation(): GeolocationData {
  const [isIndia, setIsIndia] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [countryCode, setCountryCode] = useState<string | null>(null);

  useEffect(() => {
    const detectLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        const data = await response.json();
        const code = data.country_code;
        setCountryCode(code);
        setIsIndia(code === 'IN');
      } catch (error) {
        console.error('Failed to detect location:', error);
        // Default to showing India content if detection fails
        setIsIndia(true);
        setCountryCode(null);
      } finally {
        setIsLoading(false);
      }
    };

    detectLocation();
  }, []);

  return { isIndia, isLoading, countryCode };
}
