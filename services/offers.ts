import { supabase } from '@/lib/supabaseClient';
import { Offer } from '@/types';

export const offersService = {
  // Get all offers
  async getAllOffers(): Promise<Offer[]> {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch offers error:', error);
      throw new Error(error.message);
    }

    // Process the raw data from Supabase to match the Offer type
    const processedData = data.map(item => ({
      ...item,
      tags: [item.tag1, item.tag2, item.tag3].filter(tag => tag !== null && tag !== ''),
    }));

    return processedData as Offer[];
  },

  // Delete offer
  async deleteOffer(id: number): Promise<void> {
    const { error } = await supabase
      .from('offers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete offer error:', error);
      throw new Error(error.message);
    }
  },

  // Update offer
  async updateOffer(id: number, updates: Partial<Offer>): Promise<Offer> {
    const { data, error } = await supabase
      .from('offers')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Update offer error:', error);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      throw new Error('Offer not found or permission denied');
    }

    return data[0] as Offer;
  }
};