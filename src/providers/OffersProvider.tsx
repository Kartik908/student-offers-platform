/**
 * Offers Context Provider
 * Provides a single source of truth for offers data across the app
 * Prevents multiple Supabase queries by caching data
 */

import { createContext, useContext, ReactNode } from 'react';
import { useOffers as useOffersHook } from '@/hooks/useOffers';
import { Offer } from '@/types';

interface OffersContextType {
    data: Offer[];
    isLoading: boolean;
    error: Error | null;
    isError: boolean;
    isFetching: boolean;
    isSuccess: boolean;
    status: 'pending' | 'error' | 'success';
    fetchStatus: 'fetching' | 'idle';
    refresh: () => void;
}

const OffersContext = createContext<OffersContextType | undefined>(undefined);

export function OffersProvider({ children }: { children: ReactNode }) {
    // Single source of truth - only one Supabase query for entire app
    const offersData = useOffersHook();

    return (
        <OffersContext.Provider value={offersData as OffersContextType}>
            {children}
        </OffersContext.Provider>
    );
}

export function useOffers() {
    const context = useContext(OffersContext);
    if (context === undefined) {
        throw new Error('useOffers must be used within OffersProvider');
    }
    return context;
}
