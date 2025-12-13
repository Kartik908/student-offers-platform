'use client';

"use client"

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useModal } from "@/providers/ModalProvider";
import { Button } from "@/components/ui/button";
import { trackFormStart, trackFormCompleted } from "@/lib/trackingManager";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(1, { message: "Please select a subject" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }).max(500, { message: "Message must be less than 500 characters" }),
});

const subjects = [
  "General feedback",
  "Feature request",
  "Offer not working",
  "Report a bug",
  "Report broken link",
];

export function FeedbackModal() {
  const { isFeedbackModalOpen, closeFeedbackModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const messageLength = form.watch("message")?.length || 0;

  // Track when modal opens
  useEffect(() => {
    if (isFeedbackModalOpen) {
      trackFormStart('feedback_form');
    }
  }, [isFeedbackModalOpen]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    trackFormCompleted('feedback_form', {
      subject: values.subject,
      has_name: !!(values.firstName || values.lastName),
      message_length: values.message.length,
    });

    // Track feedback submission with PostHog
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('feedback_submitted', {
        subject: values.subject,
        has_name: !!(values.firstName || values.lastName),
        message_length: values.message.length,
        conversion_type: 'feedback',
      });
    }

    setIsSubmitting(true);
    try {
      const { feedbackService } = await import('@/services/feedback');

      await feedbackService.submitFeedback({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        subject: values.subject,
        message: values.message,
      });

      setIsSuccess(true);
    } catch (error) {
      console.error('Feedback submission failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit feedback';
      toast.error(errorMessage);

      // Track error with PostHog
      if (typeof window !== 'undefined' && window.posthog) {
        window.posthog.capture('feedback_error', {
          error_message: errorMessage,
          context: 'feedback_submission',
          form_data: { subject: values.subject },
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleClose = () => {
    closeFeedbackModal();
    setTimeout(() => {
      setIsSuccess(false);
      form.reset();
    }, 300);
  };

  if (isSuccess) {
    return (
      <Dialog open={isFeedbackModalOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-md max-h-[85vh] p-0 gap-0">
          <div className="text-center py-8 px-6">
            <div className="mb-4 text-4xl">✓</div>
            <h3 className="text-xl font-semibold mb-2">Thanks for your feedback!</h3>
            <p className="text-muted-foreground text-sm mb-6">
              We appreciate you taking the time to share your thoughts. We'll review your message and get back to you if needed.
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
    <Dialog open={isFeedbackModalOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] p-0 gap-0 flex flex-col">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 space-y-1 flex-shrink-0">
          <DialogTitle className="text-xl font-semibold">Feedback</DialogTitle>
          <p className="text-sm text-muted-foreground">Got an idea or found an issue? Help us improve Student Offers — we read every message.</p>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent flex-shrink-0" />

        {/* Form Content - Scrollable */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          <Form {...form}>
            <form id="feedback-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">First name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="First name"
                          {...field}
                          className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-0"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">Last name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Last name"
                          {...field}
                          className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-0"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      Email <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@company.com"
                        {...field}
                        className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-0"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-xs" />
                  </FormItem>
                )}
              />

              {/* Subject Field */}
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      Subject <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-muted/50 border-border text-foreground focus:border-primary focus:ring-0">
                          {field.value ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                              {field.value}
                            </span>
                          ) : (
                            <SelectValue placeholder="Choose subject" />
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="z-[200]">
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-destructive text-xs" />
                  </FormItem>
                )}
              />

              {/* Message Field */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      Message <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Leave us a message"
                        {...field}
                        rows={5}
                        className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-0 resize-none"
                      />
                    </FormControl>
                    <div className="flex justify-between items-center mt-1.5">
                      <FormMessage className="text-destructive text-xs" />
                      <span className="text-xs text-muted-foreground">{messageLength}/500</span>
                    </div>
                  </FormItem>
                )}
              />

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
            form="feedback-form"
            disabled={isSubmitting}
            className="h-10 min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Message →'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
