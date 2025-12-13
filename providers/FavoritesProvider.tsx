'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Offer } from '@/types';

interface FavoritesContextType {
  favorites: Offer[];
  addToFavorites: (_offer: Offer) => void;
  removeFromFavorites: (_offerId: number) => void;
  isFavorite: (_offerId: number) => boolean;
  clearAllFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Offer[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('studentoffers_favorites');
      if (stored) {
        try {
          // eslint-disable-next-line
          setFavorites(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse favorites:', e);
        }
      }
    }
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('studentoffers_favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  const addToFavorites = (offer: Offer) => {
    setFavorites(prev => {
      // Don't add if already exists
      if (prev.some(fav => fav.id === offer.id)) {
        return prev;
      }
      return [...prev, offer];
    });
  };

  const removeFromFavorites = (offerId: number) => {
    setFavorites(prev => prev.filter(fav => fav.id !== offerId));
  };

  const isFavorite = (offerId: number) => {
    return favorites.some(fav => fav.id === offerId);
  };

  const clearAllFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      clearAllFavorites,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}
