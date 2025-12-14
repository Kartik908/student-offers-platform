'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Offer } from '@/types';
import { getPreloadedOffers } from '@/lib/preloader';
import { useGeolocationContext } from '@/providers/GeolocationProvider';

/**
 * Check if an offer should be filtered based on region
 */
const shouldFilterOffer = (offer: Offer, isIndia: boolean): boolean => {
  const offerName = offer.name.toLowerCase();

  // Perplexity x Airtel is India-only
  if (offerName.includes('perplexity') && offerName.includes('airtel')) {
    return !isIndia;
  }

  return false;
};

export const useOffers = () => {
  const [data, setData] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { isIndia, isLoading: geoLoading } = useGeolocationContext();

  const refresh = () => {

    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const fetchOffers = async () => {
      // Check for preloaded data first
      const preloadedData = getPreloadedOffers();
      if (preloadedData && preloadedData.length > 0) {

        setData(preloadedData);
        setIsLoading(false);
        return;
      }


      setIsLoading(true);
      setError(null);

      try {
        const { data: rawData, error: supabaseError } = await supabase
          .from('offers')
          .select('id, name, offer, description, claim_url, logo, location, github_offer, is_hidden_gem, is_featured, is_underrated, has_details_modal, has_alt_links, alt_links, has_discount_codes, discount_codes, extra_info, urgency_badge, tag1, tag2, tag3, category_main, category_sub')
          .order('id')
          .limit(5000); // Increased limit to fetch all offers


        if (supabaseError) {
          throw new Error(`Supabase error: ${supabaseError.message}`);
        }

        if (!rawData) {
          console.warn('⚠️ No data returned from Supabase');
          setData([]);
          return;
        }

        // Process the raw data from Supabase to match the Offer type
        const processedData = rawData.map(item => ({
          ...item,
          tags: [item.tag1, item.tag2, item.tag3].filter(tag => tag !== null && tag !== ''),
          is_hidden_gem: Boolean(item.is_hidden_gem),
          is_featured: Boolean(item.is_featured),
          is_underrated: Boolean(item.is_underrated),
        })) as Offer[];

        // Filter region-specific offers based on user location
        const filteredData = processedData.filter(offer => !shouldFilterOffer(offer, isIndia));


        setData(filteredData);
      } catch (fetchError) {
        console.error('❌ Fetch error:', fetchError);
        setError(fetchError as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, [refreshTrigger, isIndia, geoLoading]); // Re-fetch when refreshTrigger or location changes

  return {
    data,
    isLoading,
    error,
    isError: !!error,
    isFetching: isLoading,
    isSuccess: !isLoading && !error && data.length > 0,
    status: isLoading ? 'pending' : error ? 'error' : 'success',
    fetchStatus: isLoading ? 'fetching' : 'idle',
    refresh, // Expose refresh function
  };
};