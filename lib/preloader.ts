import { supabase } from '@/lib/supabaseClient';
import { Offer } from '@/types';

// Cache for preloaded data
let preloadedOffers: Offer[] | null = null;
let preloadPromise: Promise<Offer[]> | null = null;

// Preload critical data as soon as possible (client-side only)
export const preloadCriticalData = async () => {
  // SSR Edge Case: Ensure client-side only
  if (typeof window === 'undefined') {
    return [];
  }

  if (preloadPromise) {
    return preloadPromise;
  }

  preloadPromise = (async (): Promise<Offer[]> => {
    try {

      const { data, error } = await supabase
        .from('offers')
        .select('id, name, offer, description, claim_url, logo, location, github_offer, is_hidden_gem, is_featured, is_underrated, has_details_modal, has_alt_links, alt_links, has_discount_codes, discount_codes, extra_info, urgency_badge, tag1, tag2, tag3, category_main, category_sub')
        .order('id')
        .limit(5000); // Increased limit to fetch all offers


      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        console.warn('⚠️ Preloader: No data returned');
        return [];
      }

      const processedData = data.map(item => ({
        ...item,
        tags: [item.tag1, item.tag2, item.tag3].filter(tag => tag !== null && tag !== ''),
        is_hidden_gem: Boolean(item.is_hidden_gem),
        is_featured: Boolean(item.is_featured),
        is_underrated: Boolean(item.is_underrated),
      })) as Offer[];


      preloadedOffers = processedData;

      // Memory Clean-Up: Use global cache for hot reload resilience
      if (typeof window !== 'undefined') {
        window.__offersCache__ = window.__offersCache__ || new Map();
        window.__offersCache__.set('offers', processedData);
      }

      return processedData;
    } catch (error) {
      console.error('❌ Preloader: Failed to preload data:', error);
      return [];
    }
  })();

  return preloadPromise;
};

// Get preloaded data if available
export const getPreloadedOffers = (): Offer[] | null => {
  // Check memory first
  if (preloadedOffers) {

    return preloadedOffers;
  }

  // Fallback to global cache
  if (typeof window !== 'undefined' && window.__offersCache__) {
    const cached = window.__offersCache__.get('offers');
    if (cached) {

      preloadedOffers = cached;
      return cached;
    }
  }


  return null;
};

// Clear preloaded data
export const clearPreloadedData = () => {

  preloadedOffers = null;
  preloadPromise = null;

  // Clear global cache
  if (typeof window !== 'undefined' && window.__offersCache__) {
    window.__offersCache__.clear();
  }
};

// Force refresh data from Supabase (bypasses cache)
export const forceRefreshOffers = async (): Promise<Offer[]> => {

  clearPreloadedData();
  return preloadCriticalData();
};