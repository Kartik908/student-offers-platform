/**
 * PostHog Consent Integration
 * Manages PostHog features based on user consent preferences
 */

import { PostHog } from 'posthog-js';
import {
  CookiePreferences,
  ConsentMethod,
  hasConsentFor,
  getConsentEventProps
} from './consentManager';

// Event buffer for consent events before PostHog is ready
let eventBuffer: Array<{ event: string; properties: Record<string, unknown> }> = [];
let isPostHogReady = false;

/**
 * Initialize PostHog in dormant mode (no tracking until consent)
 */
export function initializePostHogDormant(posthog: PostHog, apiKey: string): void {
  try {
    posthog.init(apiKey, {
      api_host: 'https://us.i.posthog.com',
      person_profiles: 'never', // Privacy-first: no person profiles by default
      autocapture: false, // Disabled until consent
      capture_pageview: false, // Disabled until consent
      disable_session_recording: true, // Disabled until consent
      loaded: (ph) => {
        isPostHogReady = true;
        // Process any buffered events
        flushEventBuffer(ph);
      },
      // Privacy settings
      mask_all_element_attributes: true,
      mask_all_text: true,
      respect_dnt: true,
      opt_out_capturing_by_default: true, // Start opted out
    });
  } catch (error) {
    console.error('Failed to initialize PostHog:', error);
  }
}

/**
 * Enable PostHog features based on consent preferences
 * Compliant with Indian privacy laws and GDPR
 */
export function enablePostHogFeatures(
  posthog: PostHog,
  preferences: CookiePreferences,
  method: ConsentMethod
): void {
  if (!posthog) {
    console.warn('PostHog not available');
    return;
  }

  try {
    // Always capture the consent event first (legitimate interest for compliance)
    captureConsentEvent(posthog, preferences, method);

    // NECESSARY: Always enabled for basic functionality
    posthog.set_config({
      opt_out_capturing_by_default: false, // Allow necessary events
    });

    // ANALYTICS: Enable detailed tracking only with explicit consent
    if (preferences.analytics) {
      posthog.set_config({
        autocapture: true, // Enable automatic event capture
        capture_pageview: true, // Enable page view tracking
        ip: false, // Still no IP tracking even with consent
      });

      captureEvent(posthog, 'analytics_enabled', {
        method,
        consent_level: 'analytics',
        timestamp: new Date().toISOString(),
      });
    }

    // FUNCTIONAL: Enable session recording and enhanced features
    if (preferences.functional) {
      posthog.set_config({
        disable_session_recording: false,
        mask_all_text: false, // Allow text recording for UX improvement
        mask_all_element_attributes: false, // Allow attribute capture
      });

      posthog.startSessionRecording();

      captureEvent(posthog, 'session_recording_started', {
        method,
        consent_level: 'functional',
        timestamp: new Date().toISOString(),
      });
    }

    // MARKETING: Enable user identification and attribution
    if (preferences.marketing) {
      posthog.set_config({
        person_profiles: 'identified_only', // Allow person profiles for marketing
        cross_subdomain_cookie: true, // Enable cross-domain tracking
      });

      captureEvent(posthog, 'marketing_enabled', {
        method,
        consent_level: 'marketing',
        timestamp: new Date().toISOString(),
      });
    }

  } catch (error) {
    console.error('Failed to enable PostHog features:', error);
  }
}

/**
 * Disable PostHog features when consent is revoked
 */
export function disablePostHogFeatures(posthog: PostHog): void {
  if (!posthog) return;

  try {
    // Capture revocation event before disabling
    captureEvent(posthog, 'consent_revoked', {
      reason: 'user_action',
      timestamp: new Date().toISOString(),
    });

    // Stop session recording
    posthog.stopSessionRecording();

    // Disable all features
    posthog.set_config({
      autocapture: false,
      capture_pageview: false,
      disable_session_recording: true,
      opt_out_capturing_by_default: true,
      person_profiles: 'never',
    });

    // Opt out of capturing
    posthog.opt_out_capturing();

    // Reset user identification
    posthog.reset();
  } catch (error) {
    console.error('Failed to disable PostHog features:', error);
  }
}

/**
 * Capture consent given event
 */
function captureConsentEvent(
  posthog: PostHog,
  preferences: CookiePreferences,
  method: ConsentMethod
): void {
  const eventProps = getConsentEventProps(preferences, method);
  captureEvent(posthog, 'consent_given', eventProps);
}

/**
 * Safe event capture with buffering
 */
function captureEvent(posthog: PostHog, event: string, properties: Record<string, unknown>): void {
  if (!isPostHogReady) {
    // Buffer the event until PostHog is ready
    eventBuffer.push({ event, properties });
    return;
  }

  try {
    posthog.capture(event, properties);
  } catch (error) {
    console.error('Failed to capture event:', error);
  }
}

/**
 * Flush buffered events when PostHog becomes ready
 */
function flushEventBuffer(posthog: PostHog): void {
  if (eventBuffer.length === 0) return;

  eventBuffer.forEach(({ event, properties }) => {
    try {
      posthog.capture(event, properties);
    } catch (error) {
      console.error('Failed to flush buffered event:', error);
    }
  });

  eventBuffer = [];
}

/**
 * Track page view (only if analytics consent given)
 */
export function trackPageView(posthog: PostHog, path: string): void {
  if (!hasConsentFor('analytics') || typeof window === 'undefined') return;

  captureEvent(posthog, 'page_view', {
    path,
    url: window.location.href,
    timestamp: new Date().toISOString(),
  });
}



/**
 * Track marketing attribution (only if marketing consent given)
 */
export function trackMarketingAttribution(
  posthog: PostHog,
  source: string,
  medium?: string,
  campaign?: string
): void {
  if (!hasConsentFor('marketing')) return;

  captureEvent(posthog, 'marketing_attribution', {
    source,
    medium,
    campaign,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Identify user (only if analytics consent given and user is authenticated)
 */
export function identifyUser(posthog: PostHog, userId: string, properties?: Record<string, unknown>): void {
  if (!hasConsentFor('analytics')) return;

  try {
    // Only identify with non-PII properties
    const safeProperties = properties ? {
      // Filter out PII - only include safe properties
      user_type: properties.user_type,
      signup_date: properties.signup_date,
      plan: properties.plan,
      // Do NOT include: email, phone, name, address
    } : {};

    posthog.identify(userId, safeProperties);
  } catch (error) {
    console.error('Failed to identify user:', error);
  }
}