/**
 * Utility functions for category matching using database fields
 * Categories are now generated dynamically from the database
 */
import { Offer, Category } from '@/types';
import { getCategoryIcon } from '@/data/categories';

/**
 * Normalize category string for comparison
 * Removes special characters and converts to lowercase with hyphens
 */
function normalizeCategory(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')  // Replace & with 'and'
    .replace(/[^a-z0-9\s-]/g, '')  // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-')  // Replace spaces with hyphens
    .replace(/-+/g, '-');  // Replace multiple hyphens with single hyphen
}

/**
 * Generate dynamic categories from offers
 * @param offers - Array of offers
 * @returns Array of Category objects with counts
 */
export function generateCategoriesFromOffers(offers: Offer[]): Category[] {
  // Get unique category names
  const categoryNames = new Set<string>();
  offers.forEach(offer => {
    if (offer.category_main) {
      categoryNames.add(offer.category_main);
    }
  });

  // Convert to Category objects with counts
  const categories: Category[] = Array.from(categoryNames)
    .sort()
    .map(name => {
      const id = normalizeCategory(name);
      const count = offers.filter(o => o.category_main === name).length;
      const icon = getCategoryIcon(name);

      return { id, name, icon, count };
    });

  // Deduplicate by ID (keep the first one, which is from the sorted names)
  const uniqueCategories = Array.from(new Map(categories.map(c => [c.id, c])).values());

  return uniqueCategories;
}

/**
 * Check if an offer belongs to a specific category based on category_main field
 * @param offer - The offer to check
 * @param categoryId - The category ID or name to match against
 * @returns true if the offer belongs to the category
 */
export function offerMatchesCategory(offer: Offer, categoryId: string): boolean {
  if (categoryId === 'all') return true;
  if (categoryId === 'github') return offer.github_offer;

  if (!offer.category_main) return false;

  // Match by category_main field (case-insensitive)
  const offerCategory = normalizeCategory(offer.category_main);
  const targetCategory = normalizeCategory(categoryId);

  // Debug logging in development


  return offerCategory === targetCategory;
}

/**
 * Get all offers that belong to a specific category
 * @param offers - Array of offers to filter
 * @param categoryId - The category ID to filter by
 * @returns Filtered array of offers
 */
export function getOffersByCategory(offers: Offer[], categoryId: string): Offer[] {
  if (categoryId === 'all') return offers;
  return offers.filter(offer => offerMatchesCategory(offer, categoryId));
}

/**
 * Count offers in each category
 * @param offers - Array of offers to count
 * @param categories - Array of categories
 * @returns Object mapping category IDs to counts
 */
export function getCategoryCounts(offers: Offer[], categories: Category[]): Record<string, number> {
  const counts: Record<string, number> = {};

  categories.forEach(category => {
    counts[category.id] = offers.filter(offer =>
      offerMatchesCategory(offer, category.id)
    ).length;
  });

  return counts;
}

/**
 * Get all unique categories from offers (dynamically from database)
 * @param offers - Array of offers
 * @returns Array of unique category names
 */
export function getUniqueCategoriesFromOffers(offers: Offer[]): string[] {
  const categories = new Set<string>();
  offers.forEach(offer => {
    if (offer.category_main) {
      categories.add(offer.category_main);
    }
  });
  return Array.from(categories).sort();
}

/**
 * Get all unique subcategories for a main category
 * @param offers - Array of offers
 * @param categoryId - The main category ID
 * @returns Array of unique subcategory names
 */
export function getSubcategoriesForCategory(offers: Offer[], categoryId: string): string[] {
  const subcategories = new Set<string>();
  const categoryOffers = getOffersByCategory(offers, categoryId);

  categoryOffers.forEach(offer => {
    if (offer.category_sub) {
      subcategories.add(offer.category_sub);
    }
  });

  return Array.from(subcategories).sort();
}

/**
 * Get all unique tags from a list of offers
 * @param offers - Array of offers to extract tags from
 * @returns Array of unique tags
 */
export function getTagsFromOffers(offers: Offer[]): string[] {
  const tags = new Set<string>();

  offers.forEach(offer => {
    [offer.tag1, offer.tag2, offer.tag3].forEach(tag => {
      if (tag) tags.add(tag);
    });
  });

  return Array.from(tags).sort();
}
