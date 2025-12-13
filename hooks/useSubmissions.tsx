'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submissionsService, type Submission } from '@/services/submissions';

// Hook to get all submissions
export const useSubmissions = () => {
  return useQuery<Submission[], Error>({
    queryKey: ['submissions'],
    queryFn: submissionsService.getAllSubmissions,
  });
};

// Hook to get submissions by status
export const useSubmissionsByStatus = (status: 'pending' | 'approved' | 'rejected') => {
  return useQuery<Submission[], Error>({
    queryKey: ['submissions', status],
    queryFn: () => submissionsService.getSubmissionsByStatus(status),
  });
};

// Hook to update submission status
export const useUpdateSubmissionStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      id, 
      status, 
      adminNotes 
    }: { 
      id: number; 
      status: 'approved' | 'rejected'; 
      adminNotes?: string; 
    }) => submissionsService.updateSubmissionStatus(id, status, adminNotes),
    onSuccess: () => {
      // Invalidate and refetch submissions
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
  });
};

// Hook to delete submission
export const useDeleteSubmission = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => submissionsService.deleteSubmission(id),
    onSuccess: () => {
      // Invalidate and refetch submissions
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
  });
};