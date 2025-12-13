'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { offersService } from '@/services/offers';
import { Offer } from '@/types';

// Hook to get all offers for admin
export const useOffersAdmin = () => {
  return useQuery<Offer[], Error>({
    queryKey: ['offers-admin'],
    queryFn: offersService.getAllOffers,
  });
};

// Hook to delete offer
export const useDeleteOffer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => offersService.deleteOffer(id),
    onSuccess: () => {
      // Invalidate and refetch offers
      queryClient.invalidateQueries({ queryKey: ['offers-admin'] });
      queryClient.invalidateQueries({ queryKey: ['offers'] }); // Also refresh main offers
    },
  });
};

// Hook to update offer
export const useUpdateOffer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Offer> }) => 
      offersService.updateOffer(id, updates),
    onSuccess: () => {
      // Invalidate and refetch offers
      queryClient.invalidateQueries({ queryKey: ['offers-admin'] });
      queryClient.invalidateQueries({ queryKey: ['offers'] }); // Also refresh main offers
    },
  });
};