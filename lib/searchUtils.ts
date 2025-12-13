/**
 * Advanced weighted search scoring for offers
 * Implements field-weighted relevance ranking with fuzzy matching and synonyms
 */
import { Offer } from '@/types';

/**
 * Synonym mapping for common search terms
 * Maps search terms to related keywords
 */
const SEARCH_SYNONYMS: Record<string, string[]> = {
  // Broad categories - only map to generic terms, not specific products
  'notes': ['note', 'notebook', 'writing'],
  'note': ['notes', 'notebook', 'writing'],
  'design': ['ui', 'ux', 'prototype', 'creative'],
  'ui': ['interface', 'design', 'ux'],
  'ux': ['experience', 'design', 'ui'],
  'code': ['coding', 'development', 'programming'],
  'coding': ['code', 'development', 'programming'],
  'cloud': ['server', 'hosting', 'deploy'],
  'hosting': ['server', 'cloud', 'deploy'],
  'chat': ['messaging', 'communication'],
  'video': ['calling', 'meeting', 'conference'],
  'security': ['privacy', 'protection', 'password'],
  'ai': ['artificial intelligence', 'ml', 'machine learning', 'bot'],
  'bot': ['ai', 'automated'],
  'trial': ['free', 'demo'],
  'free': ['trial', 'no cost', 'student'],
};

/**
 * Normalize search query
 */
export function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special chars except hyphens
    .replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Escape special characters for RegExp
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * Calculate Levenshtein distance for fuzzy matching
 * Returns the minimum number of edits needed to transform one string into another
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Calculate fuzzy match score (0-1, higher is better)
 * Uses Levenshtein distance with length normalization
 */
function fuzzyMatchScore(query: string, target: string): number {
  if (query === target) return 1;
  if (target.includes(query)) return 0.9; // Substring match is very good

  const distance = levenshteinDistance(query, target);
  const maxLength = Math.max(query.length, target.length);

  // Normalize: 1 - (distance / maxLength)
  const similarity = 1 - (distance / maxLength);

  // Only consider it a fuzzy match if similarity is above threshold
  return similarity > 0.7 ? similarity : 0;
}

/**
 * Get expanded search terms including synonyms
 */
function getExpandedSearchTerms(query: string): string[] {
  const normalizedQuery = normalizeQuery(query);
  const terms = [normalizedQuery];

  // Add synonyms if they exist
  if (SEARCH_SYNONYMS[normalizedQuery]) {
    terms.push(...SEARCH_SYNONYMS[normalizedQuery]);
  }

  // Also check if query contains any synonym keys
  // Use word boundary check to avoid false positives (e.g. "email" matching "ai")
  Object.entries(SEARCH_SYNONYMS).forEach(([key, synonyms]) => {
    // Escape regex special characters in key
    const escapedKey = escapeRegExp(key);
    const regex = new RegExp(`\\b${escapedKey}\\b`, 'i');

    if (regex.test(normalizedQuery) && !terms.includes(key)) {
      terms.push(...synonyms);
    }
  });

  return [...new Set(terms)]; // Remove duplicates
}

/**
 * Calculate weighted search score for an offer with fuzzy matching and synonyms
 * Higher score = more relevant
 * 
 * Score weights:
 * - name exact: 100
 * - name starts with: 80
 * - name contains: 60
 * - name fuzzy match: 40-50 (based on similarity)
 * - offer contains: 45
 * - category_main contains: 40
 * - category_sub contains: 35
 * - tags contain: 30 (each matching tag)
 * - synonym match: 20-25
 * - description contains: 10 (fallback only)
 */
export function calculateSearchScore(offer: Offer, query: string): number {
  const normalizedQuery = normalizeQuery(query);

  if (!normalizedQuery) return 0;

  let score = 0;
  const searchTerms = getExpandedSearchTerms(query);
  const primaryTerm = searchTerms[0]; // Original query
  const synonymTerms = searchTerms.slice(1); // Synonym expansions

  // Name matching (highest priority)
  const name = offer.name.toLowerCase();
  const nameWords = name.split(/\s+/); // Split into words for fuzzy matching

  if (name === primaryTerm) {
    score += 100;
  } else if (name.startsWith(primaryTerm)) {
    score += 80;
  } else if (name.includes(primaryTerm)) {
    score += 60;
  } else {
    // Fuzzy matching on full name
    const fullNameFuzzyScore = fuzzyMatchScore(primaryTerm, name);
    if (fullNameFuzzyScore > 0) {
      score += Math.floor(fullNameFuzzyScore * 50); // 35-50 points for fuzzy match
    }

    // Also check fuzzy matching against individual words in the name
    // This catches typos like "microsft" → "Microsoft"
    let bestWordFuzzyScore = 0;
    nameWords.forEach(word => {
      const wordFuzzyScore = fuzzyMatchScore(primaryTerm, word);
      if (wordFuzzyScore > bestWordFuzzyScore) {
        bestWordFuzzyScore = wordFuzzyScore;
      }
    });

    if (bestWordFuzzyScore > 0) {
      score += Math.floor(bestWordFuzzyScore * 55); // 38-55 points for word fuzzy match
    }
  }

  // Check synonyms in name
  synonymTerms.forEach(synonym => {
    if (name.includes(synonym)) {
      score += 25;
    }
  });

  // Offer text (short promo) - high priority
  const offerText = offer.offer.toLowerCase();
  if (offerText.includes(primaryTerm)) {
    score += 45;
  }

  // Check synonyms in offer text
  synonymTerms.forEach(synonym => {
    if (offerText.includes(synonym)) {
      score += 20;
    }
  });

  // Category main - high priority
  if (offer.category_main) {
    const categoryMain = offer.category_main.toLowerCase();
    if (categoryMain.includes(primaryTerm)) {
      score += 40;
    }
    // Check synonyms
    synonymTerms.forEach(synonym => {
      if (categoryMain.includes(synonym)) {
        score += 20;
      }
    });
  }

  // Category sub - high priority (subcategory boost)
  if (offer.category_sub) {
    const categorySub = offer.category_sub.toLowerCase();
    if (categorySub.includes(primaryTerm)) {
      score += 35;
    }
    // Check synonyms
    synonymTerms.forEach(synonym => {
      if (categorySub.includes(synonym)) {
        score += 18;
      }
    });
  }

  // Tags - medium priority (check each tag, add score for each match)
  if (offer.tags && offer.tags.length > 0) {
    offer.tags.forEach(tag => {
      const tagLower = tag.toLowerCase();
      // Exact tag match
      if (tagLower === primaryTerm) {
        score += 35;
      }
      // Tag contains query
      else if (tagLower.includes(primaryTerm)) {
        score += 30;
      }
      // Query contains tag (e.g., searching "github" matches "GitHub" tag)
      // Only if tag is a discrete word in query to avoid noise
      else if (new RegExp(`\\b${escapeRegExp(tagLower)}\\b`).test(primaryTerm)) {
        score += 25;
      }

      // Check synonyms in tags
      synonymTerms.forEach(synonym => {
        if (tagLower.includes(synonym)) {
          score += 15;
        }
      });
    });
  }

  // Description - lowest priority (fallback only)
  if (offer.description) {
    const description = offer.description.toLowerCase();
    if (description.includes(primaryTerm)) {
      score += 10;
    }
    // Check synonyms in description
    synonymTerms.forEach(synonym => {
      if (description.includes(synonym)) {
        score += 5;
      }
    });
  }

  return score;
}

/**
 * Search and rank offers by relevance
 * Only returns offers with score > 0
 */
export function searchOffers(offers: Offer[], query: string): Offer[] {
  if (!query || query.trim().length === 0) {
    return offers;
  }

  // Calculate scores for all offers
  const scoredOffers = offers
    .map(offer => ({
      offer,
      score: calculateSearchScore(offer, query)
    }))
    .filter(item => item.score > 0) // Only include matches
    .sort((a, b) => {
      // Sort by score descending
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // If scores are equal, prefer shorter names
      return a.offer.name.length - b.offer.name.length;
    });

  // Calculate dynamic threshold
  // If the top result has a high score, filter out results that are much less relevant (e.g., < 25% of top score)
  // This removes "noise" matches (like generic tag matches) when there's a strong specific match
  if (scoredOffers.length > 0) {
    const topScore = scoredOffers[0].score;
    // Lower threshold for shorter queries as they are naturally broader
    const thresholdRatio = query.length < 3 ? 0.1 : 0.25;
    const threshold = topScore * thresholdRatio;

    return scoredOffers
      .filter(item => item.score >= threshold)
      .map(item => item.offer);
  }

  return scoredOffers.map(item => item.offer);
}
