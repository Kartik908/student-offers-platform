export interface Category {
  id: string;
  name: string;
  icon: string; // Icon name instead of component
  count?: number; // Optional: number of offers in this category
}

// Support both old format (string URLs) and new format (rich objects)
export type AltLink = Record<string, string | AltLinkDetails>;

export interface AltLinkDetails {
  url: string;
  offer_text: string;
  flag?: string | null;
  pricing?: string | null;
  discount_code?: string | null;
  requirements?: string | null;
  how_to_claim?: string | null;
  important_notes?: string | null;
}

export interface DiscountCode {
  code: string;
  description: string;
}

export interface Offer {
  id: number;
  name: string;
  tags: string[];
  offer: string;
  description: string;
  claim_url: string;
  logo: string;
  location: string;
  github_offer: boolean;
  is_hidden_gem: boolean;
  is_featured: boolean;
  // The raw fields from Supabase
  tag1: string | null;
  tag2: string | null;
  tag3: string | null;
  // Category fields
  category_main: string | null;
  category_sub: string | null;
  // New fields for modal/expanded view
  has_details_modal: boolean;
  has_alt_links: boolean;
  alt_links: AltLink | null;
  has_discount_codes: boolean;
  discount_codes: DiscountCode[] | null;
  extra_info: string | null;
  urgency_badge: string | null;
  is_underrated: boolean;
  slug?: string;
}