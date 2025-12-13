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
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(1, { message: "Please select a subject" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }).max(500, { message: "Message must be less than 500 characters" }),
});

const subjects = [
  "Partnership Inquiry",
  "Sponsorship Opportunity",
  "Collaboration Proposal",
  "Media / Press Contact",
  "Other Business Inquiry",
];

export function ContactModal() {
  const { isContactModalOpen, closeContactModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const messageLength = form.watch("message")?.length || 0;

  // Track when modal opens
  useEffect(() => {
    if (isContactModalOpen) {
      trackFormStart('contact_form');
    }
  }, [isContactModalOpen]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    trackFormCompleted('contact_form', {
      subject: values.subject,
      message_length: values.message.length,
    });

    setIsSubmitting(true);
    try {
      const { feedbackService } = await import('@/services/feedback');

      await feedbackService.submitContact({
        name: values.name,
        email: values.email,
        subject: values.subject,
        message: values.message,
      });

      setIsSuccess(true);
    } catch (error) {
      console.error('Contact submission failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleClose = () => {
    closeContactModal();
    setTimeout(() => {
      setIsSuccess(false);
      form.reset();
    }, 300);
  };

  if (isSuccess) {
    return (
      <Dialog open={isContactModalOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-md max-h-[85vh] p-0 gap-0">
          <div className="text-center py-8 px-6">
            <div className="mb-4 text-4xl">✓</div>
            <DialogTitle className="text-xl font-semibold mb-2">Message sent successfully!</DialogTitle>
            <p className="text-muted-foreground text-sm mb-6">
              Thanks for reaching out. We'll review your message and get back to you soon.
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
    <Dialog open={isContactModalOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] p-0 gap-0 flex flex-col">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 space-y-1 flex-shrink-0">
          <DialogTitle className="text-xl font-semibold">Contact Us</DialogTitle>
          <p className="text-sm text-muted-foreground">We'd love to collaborate — get in touch with our team.</p>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent flex-shrink-0" />

        {/* Form Content - Scrollable */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          <Form {...form}>
            <form id="contact-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Alex Carter"
                        {...field}
                        className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-0"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-xs" />
                  </FormItem>
                )}
              />

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
                        placeholder="alex@company.com"
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
                            <SelectValue placeholder="Choose a reason" />
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
                        placeholder="Tell us about your proposal or idea"
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
            form="contact-form"
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
