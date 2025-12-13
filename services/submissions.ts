import { supabase } from '@/lib/supabaseClient';

export interface SubmissionData {
  url: string;
  category: string;
}

export interface Submission {
  id: number;
  created_at: string;
  url: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  extracted_title?: string;
  extracted_description?: string;
  extracted_logo?: string;
}

export const submissionsService = {
  // Submit a new offer
  async submitOffer(data: SubmissionData): Promise<Submission | null> {
    const { data: submission, error } = await supabase
      .from('submissions')
      .insert([{
        url: data.url,
        category: data.category,
        // Optional: Add user metadata
        user_ip: null, // You could get this from a service
        user_agent: typeof window !== 'undefined' ? navigator.userAgent : null,
      }])
      .select()
      .single();

    if (error) {
      console.error('Submission error:', error);
      throw new Error(error.message);
    }

    return submission;
  },

  // Get all submissions (for admin dashboard)
  async getAllSubmissions(): Promise<Submission[]> {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch submissions error:', error);
      throw new Error(error.message);
    }

    return data || [];
  },

  // Update submission status (for admin review)
  async updateSubmissionStatus(
    id: number,
    status: 'approved' | 'rejected',
    adminNotes?: string
  ): Promise<Submission> {
    const { data, error } = await supabase
      .from('submissions')
      .update({
        status,
        admin_notes: adminNotes,
        reviewed_at: new Date().toISOString(),
        // You could add reviewed_by if you have user auth
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update submission error:', error);
      throw new Error(error.message);
    }

    return data;
  },

  // Get submissions by status
  async getSubmissionsByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Submission[]> {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch submissions by status error:', error);
      throw new Error(error.message);
    }

    return data || [];
  },

  // Delete submission
  async deleteSubmission(id: number): Promise<void> {
    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete submission error:', error);
      throw new Error(error.message);
    }
  }
};