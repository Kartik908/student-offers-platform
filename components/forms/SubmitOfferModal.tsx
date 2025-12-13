'use client';

"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useModal } from "@/providers/ModalProvider";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CategoryCombobox } from "./CategoryCombobox";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { submissionsService } from "@/services/submissions";

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL starting with https://" }),
  category: z.string().min(1, { message: "Select a category to continue" }),
});

export function SubmitOfferModal() {
  const { isSubmitOfferModalOpen, closeSubmitOfferModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      category: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Track form submission
    trackEvent("submit_offer_form_submitted", {
      url: values.url,
      category: values.category,
      has_url: !!values.url,
      has_category: !!values.category,
    });

    setIsSubmitting(true);
    try {
      // Submit to Supabase
      await submissionsService.submitOffer({
        url: values.url,
        category: values.category,
      });

      setIsSuccess(true);
      // Remove toast since modal shows success message
    } catch (error) {
      console.error('Submission failed:', error);
      // Show more specific error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to submit: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleClose = () => {
    closeSubmitOfferModal();
    setTimeout(() => {
      setIsSuccess(false);
      form.reset();
    }, 300);
  };

  if (isSuccess) {
    return (
      <Dialog open={isSubmitOfferModalOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-md max-h-[85vh] p-0 gap-0">
          <div className="text-center py-8 px-6">
            <div className="mb-4 text-4xl">✓</div>
            <h3 className="text-xl font-semibold mb-2">You're awesome! Offer submitted.</h3>
            <p className="text-muted-foreground text-sm mb-6">
              We'll review the offer and list it if it qualifies. Thanks for helping fellow students save!
            </p>
            <Button
              onClick={handleClose}
              className="min-w-[120px]"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }


  return (
    <Dialog open={isSubmitOfferModalOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] p-0 gap-0 flex flex-col">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 space-y-1 flex-shrink-0">
          <DialogTitle className="text-xl font-semibold">Share a Student Offer</DialogTitle>
          <p className="text-sm text-muted-foreground">Help other students save — submit a useful discount in seconds.</p>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent flex-shrink-0" />

        {/* Form Content - Scrollable */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          <Form {...form}>
            <form id="submit-offer-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* URL Field */}
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      Offer URL <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/student-discount"
                        {...field}
                        className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-0"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-xs" />
                  </FormItem>
                )}
              />

              {/* Category Field */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      Choose a category <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <CategoryCombobox
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-xs" />
                  </FormItem>
                )}
              />

              {/* Footer Note */}
              <p className="text-xs text-muted-foreground">
                We'll review and add it if it meets our guidelines. Thank you!
              </p>
            </form>
          </Form>

        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent flex-shrink-0" />

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 flex-shrink-0">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="h-10 px-4 hover:bg-muted/50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="submit-offer-form"
            disabled={isSubmitting}
            className="h-10 min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Offer →'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}