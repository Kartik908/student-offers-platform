import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CategoryCombobox } from "@/components/forms";
import { LocationCombobox } from "./LocationCombobox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export const formSchema = z.object({
    name: z.string().min(1, "Company name is required"),
    offer: z.string().min(1, "Offer description is required"),
    description: z.string().min(1, "Description is required"),
    claim_url: z.string().url("Must be a valid URL"),
    logo: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    location: z.string().min(1, "Location is required"),
    tag1: z.string().min(1, "Primary category is required"),
    tag2: z.string().optional(),
    tag3: z.string().optional(),
    github_offer: z.boolean().default(false),
    is_hidden_gem: z.boolean().default(false),
    is_featured: z.boolean().default(false),
    is_underrated: z.boolean().default(false),
    has_details_modal: z.boolean().default(false),
    extra_info: z.string().optional(),
    urgency_badge: z.string().optional(),
    // Category fields (new system)
    category_main: z.string().optional(),
    category_sub: z.string().optional(),
    // Modal fields
    has_alt_links: z.boolean().default(false),
    alt_links: z.string().optional(), // JSON string
    has_discount_codes: z.boolean().default(false),
    discount_codes: z.string().optional(), // JSON string
});

export type OfferFormValues = z.infer<typeof formSchema>;

interface OfferFormProps {
    defaultValues?: Partial<OfferFormValues>;
    onSubmit: (values: OfferFormValues) => Promise<void>;
    isSubmitting: boolean;
    submitLabel?: string;
}

export const OfferForm = ({
    defaultValues,
    onSubmit,
    isSubmitting,
    submitLabel = "Save Offer"
}: OfferFormProps) => {
    const form = useForm<OfferFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            offer: "",
            description: "",
            claim_url: "",
            logo: "",
            location: "Worldwide",
            tag1: "",
            tag2: "",
            tag3: "",
            github_offer: false,
            is_hidden_gem: false,
            is_featured: false,
            is_underrated: false,
            has_details_modal: false,
            extra_info: "",
            urgency_badge: "none",
            category_main: "",
            category_sub: "",
            has_alt_links: false,
            alt_links: "",
            has_discount_codes: false,
            discount_codes: "",
            ...defaultValues,
        },
    });

    // Reset form when defaultValues change (important for edit mode)
    useEffect(() => {
        if (defaultValues) {
            form.reset({
                ...form.getValues(),
                ...defaultValues,
            });
        }
    }, [defaultValues, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Company Name */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Name *</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., GitHub, Figma, Notion" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Offer */}
                    <FormField
                        control={form.control}
                        name="offer"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Offer *</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Free Pro Plan, 50% off" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Description */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description *</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Brief description of the service and what students get..."
                                    className="min-h-[80px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Claim URL */}
                    <FormField
                        control={form.control}
                        name="claim_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Claim URL *</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://example.com/student-discount" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Logo URL */}
                    <FormField
                        control={form.control}
                        name="logo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Logo URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://example.com/logo.png" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Location */}
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location *</FormLabel>
                                <FormControl>
                                    <LocationCombobox
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Primary Category */}
                    <FormField
                        control={form.control}
                        name="tag1"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Primary Category *</FormLabel>
                                <FormControl>
                                    <CategoryCombobox
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Secondary Category */}
                    <FormField
                        control={form.control}
                        name="tag2"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Secondary Category</FormLabel>
                                <FormControl>
                                    <CategoryCombobox
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Tertiary Category */}
                    <FormField
                        control={form.control}
                        name="tag3"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tertiary Category</FormLabel>
                                <FormControl>
                                    <CategoryCombobox
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Switches Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                        control={form.control}
                        name="github_offer"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">GitHub Offer</FormLabel>
                                    <div className="text-sm text-muted-foreground">
                                        Part of GitHub Student Pack
                                    </div>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="is_hidden_gem"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Hidden Gem</FormLabel>
                                    <div className="text-sm text-muted-foreground">
                                        Featured as hidden gem
                                    </div>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="has_details_modal"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Details Modal</FormLabel>
                                    <div className="text-sm text-muted-foreground">
                                        Show detailed info modal
                                    </div>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                {/* Switches Row 2 - Featured & Underrated */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="is_featured"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Featured Offer</FormLabel>
                                    <div className="text-sm text-muted-foreground">
                                        Show in featured section
                                    </div>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="is_underrated"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Underrated Offer</FormLabel>
                                    <div className="text-sm text-muted-foreground">
                                        Show in underrated section
                                    </div>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                {/* Category Fields (New System) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                        control={form.control}
                        name="category_main"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Main Category (New)</FormLabel>
                                <FormControl>
                                    <CategoryCombobox
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <p className="text-xs text-muted-foreground">
                                    Primary category for filtering
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="category_sub"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Subcategory</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Cloud Computing" {...field} value={field.value || ""} />
                                </FormControl>
                                <p className="text-xs text-muted-foreground">
                                    Optional subcategory
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="urgency_badge"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Urgency Badge</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Limited Time, Hot Deal" {...field} value={field.value || ""} />
                                </FormControl>
                                <p className="text-xs text-muted-foreground">
                                    Optional urgency label
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Switches Row 3 - Alternative Links & Discount Codes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="has_alt_links"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Alternative Links</FormLabel>
                                    <div className="text-sm text-muted-foreground">
                                        Has region-specific links
                                    </div>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="has_discount_codes"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Discount Codes</FormLabel>
                                    <div className="text-sm text-muted-foreground">
                                        Has specific promo codes
                                    </div>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                {/* Conditional JSON Fields */}
                {/* eslint-disable-next-line react-hooks/incompatible-library */}
                {form.watch("has_alt_links") && (
                    <FormField
                        control={form.control}
                        name="alt_links"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Alternative Links (JSON)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder='{"US": "https://example.com/us", "EU": "https://example.com/eu"}'
                                        className="min-h-[80px] font-mono text-sm"
                                        {...field}
                                    />
                                </FormControl>
                                <p className="text-xs text-muted-foreground">
                                    JSON object with country codes as keys and URLs as values
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {form.watch("has_discount_codes") && (
                    <FormField
                        control={form.control}
                        name="discount_codes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Discount Codes (JSON)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder='[{"code": "STUDENT50", "description": "50% off for students"}]'
                                        className="min-h-[80px] font-mono text-sm"
                                        {...field}
                                    />
                                </FormControl>
                                <p className="text-xs text-muted-foreground">
                                    JSON array of objects with "code" and "description" fields
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Extra Info */}
                <FormField
                    control={form.control}
                    name="extra_info"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Extra Information</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Additional details for the modal (if enabled above)..."
                                    className="min-h-[80px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {submitLabel === "Save Offer" ? "Saving..." : "Adding..."}
                        </>
                    ) : (
                        submitLabel
                    )}
                </Button>
            </form>
        </Form>
    );
};
