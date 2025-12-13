'use client';

/**
 * Offers Context Provider for Next.js
 * Wraps server-fetched data for client components
 */

import { createContext, useContext, ReactNode, useState } from 'react';
import { Offer } from '@/types';

interface OffersContextType {
    data: Offer[];
    isLoading: boolean;
    error: Error | null;
    refresh: () => void;
}

const OffersContext = createContext<OffersContextType | undefined>(undefined);

export function OffersProvider({ 
  children, 
  initialOffers = [] 
}: { 
  children: ReactNode;
  initialOffers?: Offer[];
}) {
    // In Next.js, we receive data from server, no need to fetch
    const [data] = useState<Offer[]>(initialOffers);
    
    const value: OffersContextType = {
        data,
        isLoading: false, // Server already fetched
        error: null,
        refresh: () => {
            // In production, this would trigger a router.refresh()
            if (typeof window !== 'undefined') {
                window.location.reload();
            }
        }
    };

    return (
        <OffersContext.Provider value={value}>
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
