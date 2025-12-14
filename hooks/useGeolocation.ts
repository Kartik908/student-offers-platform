'use client';

import { useGeolocationContext } from '@/providers/GeolocationProvider';

interface GeolocationData {
  isIndia: boolean;
  isLoading: boolean;
  countryCode: string | null;
}

/**
 * Hook to detect user's country based on IP address
 * 
 * NOTE: This is now a wrapper around useGeolocationContext.
 * The actual geo detection happens in GeolocationProvider at app mount.
 * This ensures all components share the same geo state.
 */
export function useGeolocation(): GeolocationData {
  return useGeolocationContext();
}

