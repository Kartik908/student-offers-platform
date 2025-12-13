import { useState } from "react";
import { Offer } from "@/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { OfferForm, OfferFormValues } from "./OfferForm";
import { useUpdateOffer } from "@/hooks/useOffersAdmin";
import { toast } from "sonner";

interface EditOfferDialogProps {
    offer: Offer | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const EditOfferDialog = ({ offer, open, onOpenChange }: EditOfferDialogProps) => {
    const updateOffer = useUpdateOffer();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values: OfferFormValues) => {
        if (!offer) return;

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

            const updateData = {
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

            // Convert null to undefined for type compatibility
            const updates = {
                ...updateData,
                logo: updateData.logo === null ? undefined : updateData.logo
            };

            await updateOffer.mutateAsync({
                id: offer.id,
                updates
            });

            toast.success("Offer updated successfully");
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to update offer:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            toast.error(`Failed to update offer: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Prepare default values from offer
    const defaultValues: Partial<OfferFormValues> | undefined = offer ? {
        name: offer.name,
        offer: offer.offer,
        description: offer.description || "",
        claim_url: offer.claim_url,
        logo: offer.logo || "",
        location: offer.location,
        tag1: offer.tags?.[0] || "",
        tag2: offer.tags?.[1] || "",
        tag3: offer.tags?.[2] || "",
        github_offer: offer.github_offer,
        is_hidden_gem: offer.is_hidden_gem,
        is_featured: offer.is_featured,
        is_underrated: offer.is_underrated,
        has_details_modal: offer.has_details_modal,
        extra_info: offer.extra_info || "",
        urgency_badge: offer.urgency_badge || "none",
        category_main: offer.category_main || "",
        category_sub: offer.category_sub || "",
        has_alt_links: offer.has_alt_links,
        alt_links: offer.alt_links ? JSON.stringify(offer.alt_links, null, 2) : "",
        has_discount_codes: offer.has_discount_codes,
        discount_codes: offer.discount_codes ? JSON.stringify(offer.discount_codes, null, 2) : "",
    } : undefined;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Offer</DialogTitle>
                    <DialogDescription>
                        Make changes to the offer details below.
                    </DialogDescription>
                </DialogHeader>

                {offer && (
                    <OfferForm
                        defaultValues={defaultValues}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                        submitLabel="Save Changes"
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};
