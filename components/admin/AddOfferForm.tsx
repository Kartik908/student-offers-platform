import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { OfferForm, OfferFormValues } from "./OfferForm";

export const AddOfferForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: OfferFormValues) {
    setIsSubmitting(true);
    try {
      // Parse JSON fields
      let altLinksJson = null;
      let discountCodesJson = null;

      if (values.has_alt_links && values.alt_links) {
        try {
          altLinksJson = JSON.parse(values.alt_links);
        } catch {
          throw new Error("Invalid JSON format for alternative links");
        }
      }

      if (values.has_discount_codes && values.discount_codes) {
        try {
          discountCodesJson = JSON.parse(values.discount_codes);
        } catch {
          throw new Error("Invalid JSON format for discount codes");
        }
      }

      const insertData = {
        name: values.name,
        offer: values.offer,
        description: values.description,
        claim_url: values.claim_url,
        logo: values.logo || null,
        location: values.location,
        tag1: values.tag1,
        tag2: values.tag2 || null,
        tag3: values.tag3 || null,
        github_offer: values.github_offer,
        is_hidden_gem: values.is_hidden_gem,
        is_featured: values.is_featured,
        is_underrated: values.is_underrated,
        has_details_modal: values.has_details_modal,
        extra_info: values.extra_info || null,
        urgency_badge: values.urgency_badge === 'none' ? null : values.urgency_badge,
        category_main: values.category_main || null,
        category_sub: values.category_sub || null,
        has_alt_links: values.has_alt_links,
        alt_links: altLinksJson,
        has_discount_codes: values.has_discount_codes,
        discount_codes: discountCodesJson,
      };

      const { error } = await supabase
        .from('offers')
        .insert([insertData])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast.success("Offer added successfully!");
      // We don't have direct access to form reset here easily without lifting state or using a ref,
      // but for now, a page reload or just clearing the form via key change could work.
      // However, to keep it simple and robust, we can just reload the window or let the user navigate away.
      // Better yet, we can pass a key to OfferForm to force re-render on success.
      window.location.reload();

    } catch (error) {
      console.error('Failed to add offer:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to add offer: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Offer</CardTitle>
      </CardHeader>
      <CardContent>
        <OfferForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Add Offer"
        />
      </CardContent>
    </Card>
  );
};