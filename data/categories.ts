/**
 * Dynamic Category System
 * 
 * Categories are now generated dynamically from the database (category_main field).
 * This file only provides icon mappings for known categories.
 * 
 * The actual categories are fetched from Supabase using:
 * SELECT DISTINCT category_main FROM offers;
 */
import { type LucideIcon } from "lucide-react";
import { type Category } from "@/types";
import {
  Code,
  Palette,
  Bot,
  GraduationCap,
  Briefcase,
  Database,
  Cloud,
  Clapperboard,
  Headphones,
  ShoppingBag,
  ShieldCheck,
  Wrench,
  BarChart2,
  TrendingUp,
  UtensilsCrossed,
  HeartPulse,
  Sparkles,
  BadgePercent,
  Plane,
  Sliders,
  Video,
  FilePen,
  Store,
  Zap,
  Home,
} from "lucide-react";

/**
 * Icon mapping for categories
 * Maps category names to Lucide icons
 */
export const categoryIcons: Record<string, LucideIcon> = {
  "AI Tools": Bot,
  "Audio & Music": Headphones,
  "Business & Finance": Briefcase,
  "Cloud & Hosting": Cloud,
  "Data & Analytics": BarChart2,
  "Data & Research": Database,
  "Design & UI/UX": Palette,
  "Developer Tools": Code,
  "Entertainment": Clapperboard,
  "Food & Beverage": UtensilsCrossed,
  "Hardware & Engineering": Wrench,
  "Health & Wellness": HeartPulse,
  "Learning & Education": GraduationCap,
  "Lifestyle": Home,
  "Marketing & SEO": TrendingUp,
  "Platforms & Marketplaces": Store,
  "Productivity": Zap,
  "Security & Privacy": ShieldCheck,
  "Shopping & Lifestyle": ShoppingBag,
  "Student Discount Platforms": BadgePercent,
  "Travel & Mobility": Plane,
  "Utilities": Sliders,
  "Video & Animation": Video,
  "Writing & Content": FilePen,
};

/**
 * Static categories for instant rendering
 * Categories are based on actual data from Supabase (category_main field)
 * Only the structure is static - counts are calculated dynamically
 */
export const STATIC_CATEGORIES = [
  { id: "ai-tools", name: "AI Tools" },
  { id: "audio-and-music", name: "Audio & Music" },
  { id: "business-and-finance", name: "Business & Finance" },
  { id: "cloud-and-hosting", name: "Cloud & Hosting" },
  { id: "data-and-analytics", name: "Data & Analytics" },
  { id: "design-and-uiux", name: "Design & UI/UX" },
  { id: "developer-tools", name: "Developer Tools" },
  { id: "entertainment", name: "Entertainment" },
  { id: "food-and-beverage", name: "Food & Beverage" },
  { id: "hardware-and-engineering", name: "Hardware & Engineering" },
  { id: "health-and-wellness", name: "Health & Wellness" },
  { id: "learning-and-education", name: "Learning & Education" },
  { id: "lifestyle", name: "Lifestyle" },
  { id: "marketing-and-seo", name: "Marketing & SEO" },
  { id: "platforms-and-marketplaces", name: "Platforms & Marketplaces" },
  { id: "productivity", name: "Productivity" },
  { id: "security-and-privacy", name: "Security & Privacy" },
  { id: "shopping-and-lifestyle", name: "Shopping & Lifestyle" },
  { id: "student-discount-platforms", name: "Student Discount Platforms" },
  { id: "travel-and-mobility", name: "Travel & Mobility" },
  { id: "utilities", name: "Utilities" },
  { id: "video-and-animation", name: "Video & Animation" },
  { id: "writing-and-content", name: "Writing & Content" },
];

/**
 * Get static categories with icons
 * Combines static category data with icon mappings for instant display
 */
export function getStaticCategoriesWithIcons(): Category[] {
  return STATIC_CATEGORIES.map(cat => ({
    ...cat,
    icon: getCategoryIcon(cat.name),
    count: 0, // Count will be updated dynamically
  }));
}

/**
 * Get icon name for a category
 * Returns default icon name if category not found
 */
export const getCategoryIcon = (categoryName: string): string => {
  const iconMap: Record<string, string> = {
    "AI Tools": "Bot",
    "Audio & Music": "Headphones",
    "Business & Finance": "Briefcase",
    "Cloud & Hosting": "Cloud",
    "Data & Analytics": "BarChart2",
    "Data & Research": "Database",
    "Design & UI/UX": "Palette",
    "Developer Tools": "Code",
    "Entertainment": "Clapperboard",
    "Food & Beverage": "UtensilsCrossed",
    "Hardware & Engineering": "Wrench",
    "Health & Wellness": "HeartPulse",
    "Learning & Education": "GraduationCap",
    "Lifestyle": "Home",
    "Marketing & SEO": "TrendingUp",
    "Platforms & Marketplaces": "Store",
    "Productivity": "Zap",
    "Security & Privacy": "ShieldCheck",
    "Shopping & Lifestyle": "ShoppingBag",
    "Student Discount Platforms": "BadgePercent",
    "Travel & Mobility": "Plane",
    "Utilities": "Sliders",
    "Video & Animation": "Video",
    "Writing & Content": "FilePen",
  };
  return iconMap[categoryName] || "Package";
};

/**
 * Default icon for unknown categories
 */
export const defaultCategoryIcon = Sparkles;