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
import {
  Code,
  Palette,
  Bot,
  Box,
  Gamepad2,
  GraduationCap,
  Briefcase,
  Database,
  Cloud,
  Globe,
  Clapperboard,
  Headphones,
  ShoppingBag,
  CreditCard,
  ShieldCheck,
  MessageSquare,
  Wrench,
  BarChart2,
  TrendingUp,
  UtensilsCrossed,
  HeartPulse,
  Package,
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
 * Get icon for a category name
 * Returns default icon if category not found
 */
export const getCategoryIcon = (categoryName: string): LucideIcon => {
  return categoryIcons[categoryName] || Package;
};

/**
 * Default icon for unknown categories
 */
export const defaultCategoryIcon = Sparkles;