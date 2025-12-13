import { createClient } from '@supabase/supabase-js';
import { Offer } from '@/types';

// Server-side Supabase client (no session persistence)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Server-side: no session persistence
  },
});

/**
 * Server-side data fetching with ISR
 * Fetches all offers from Supabase
 */
export async function getOffers(): Promise<Offer[]> {
  try {
    const { data, error } = await supabase
      .from('offers')
      .select('id, name, offer, description, claim_url, logo, location, github_offer, is_hidden_gem, is_featured, is_underrated, has_details_modal, has_alt_links, alt_links, has_discount_codes, discount_codes, extra_info, urgency_badge, tag1, tag2, tag3, category_main, category_sub')
      .order('id')
      .limit(5000);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    if (!data) {
      console.warn('No data returned from Supabase');
      return [];
    }

    // Process the data to match Offer type
    const processedData = data.map(item => ({
      ...item,
      tags: [item.tag1, item.tag2, item.tag3].filter(tag => tag !== null && tag !== ''),
      is_hidden_gem: Boolean(item.is_hidden_gem),
      is_featured: Boolean(item.is_featured),
      is_underrated: Boolean(item.is_underrated),
    })) as Offer[];

    return processedData;
  } catch (error) {
    console.error('[getOffers] Failed to fetch offers:', error);
    return [];
  }
}
