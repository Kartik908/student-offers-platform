/**
 * Configuration for custom offer modals
 * Define which offers should use custom modals and their database fields
 */

export interface CustomModalConfig {
  offerIdentifier: string; // Normalized offer name or ID
  enabled: boolean;
  customFields?: string[]; // Additional database fields to fetch
  modalType: 'perplexity' | 'github' | 'template' | string;
}

/**
 * Custom modal configurations
 * Add new entries here to enable custom modals for specific offers
 */
export const CUSTOM_MODAL_CONFIGS: CustomModalConfig[] = [
  // Google AI Pro uses SearchBarModal (exact match only)
  {
    offerIdentifier: 'google-ai-pro',
    enabled: true,
    modalType: 'searchbar',
    customFields: ['extra_info'],
  },
  
  // Add more custom modal configs here
  // {
  //   offerIdentifier: 'github-student-pack',
  //   enabled: true,
  //   modalType: 'github',
  //   customFields: ['extra_info', 'alt_links'],
  // },
];

/**
 * Get custom modal config for an offer
 */
export function getCustomModalConfig(offerName: string): CustomModalConfig | null {
  const normalized = offerName.toLowerCase().replace(/\s+/g, '-');
  return CUSTOM_MODAL_CONFIGS.find(
    config => config.enabled && normalized.includes(config.offerIdentifier)
  ) || null;
}

/**
 * Check if an offer should use a custom modal
 */
export function shouldUseCustomModal(offerName: string): boolean {
  return getCustomModalConfig(offerName) !== null;
}
