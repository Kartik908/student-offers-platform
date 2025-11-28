import { supabase } from '@/lib/supabaseClient';

export interface FeedbackSubmission {
  firstName?: string;
  lastName?: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const feedbackService = {
  /**
   * Submit feedback to Supabase
   */
  async submitFeedback(data: FeedbackSubmission) {
    try {
      const { data: result, error } = await supabase
        .from('feedback')
        .insert([
          {
            first_name: data.firstName || null,
            last_name: data.lastName || null,
            email: data.email,
            subject: data.subject,
            message: data.message,
          },
        ]);

      if (error) {
        console.error('Feedback submission error:', error);
        throw new Error(error.message || 'Failed to submit feedback');
      }

      return result;
    } catch (error) {
      console.error('Feedback submission failed:', error);
      throw error;
    }
  },

  /**
   * Submit contact message to Supabase
   */
  async submitContact(data: ContactSubmission) {
    try {
      const { data: result, error } = await supabase
        .from('contact')
        .insert([
          {
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
          },
        ]);

      if (error) {
        console.error('Contact submission error:', error);
        throw new Error(error.message || 'Failed to submit contact message');
      }

      return result;
    } catch (error) {
      console.error('Contact submission failed:', error);
      throw error;
    }
  },

  /**
   * Get all feedback (admin only)
   */
  async getAllFeedback() {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message || 'Failed to fetch feedback');
      }

      return data;
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
      throw error;
    }
  },

  /**
   * Get all contact messages (admin only)
   */
  async getAllContacts() {
    try {
      const { data, error } = await supabase
        .from('contact')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message || 'Failed to fetch contact messages');
      }

      return data;
    } catch (error) {
      console.error('Failed to fetch contact messages:', error);
      throw error;
    }
  },

  /**
   * Update feedback status (admin only)
   */
  async updateFeedbackStatus(id: string, status: 'new' | 'in_progress' | 'resolved' | 'archived', notes?: string) {
    try {
      const updateData: { status: string; notes?: string } = { status };
      if (notes !== undefined) {
        updateData.notes = notes;
      }

      const { data, error } = await supabase
        .from('feedback')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to update feedback');
      }

      return data;
    } catch (error) {
      console.error('Failed to update feedback:', error);
      throw error;
    }
  },

  /**
   * Update contact status (admin only)
   */
  async updateContactStatus(id: string, status: 'new' | 'in_progress' | 'resolved' | 'archived', notes?: string) {
    try {
      const updateData: { status: string; notes?: string } = { status };
      if (notes !== undefined) {
        updateData.notes = notes;
      }

      const { data, error } = await supabase
        .from('contact')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to update contact');
      }

      return data;
    } catch (error) {
      console.error('Failed to update contact:', error);
      throw error;
    }
  },

  /**
   * Delete feedback (admin only)
   */
  async deleteFeedback(id: string) {
    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message || 'Failed to delete feedback');
      }

      return true;
    } catch (error) {
      console.error('Failed to delete feedback:', error);
      throw error;
    }
  },

  /**
   * Delete contact (admin only)
   */
  async deleteContact(id: string) {
    try {
      const { error } = await supabase
        .from('contact')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message || 'Failed to delete contact');
      }

      return true;
    } catch (error) {
      console.error('Failed to delete contact:', error);
      throw error;
    }
  },
};
