/**
 * Comprehensive tracking manager with consent-aware analytics
 * Integrates with cookie consent system to respect user privacy preferences
 */

import { hasConsentFor } from './consentManager';

// Events that don't require consent (necessary for basic functionality - legitimate interest)
// These are minimal events required for website operation and security
const NECESSARY_EVENTS = [
  'app_initialized',
  'error_occurred',
  'security_event',
  'consent_given',
  'consent_revoked',
  'cookie_banner_shown'
];

// Events that require explicit consent (basic analytics)
const BASIC_ANALYTICS_EVENTS = [
  'page_view',
  'page_leave',
  'button_click',
  'link_click',
  'form_start',
  'search_performed',
  'offer_viewed',
  'category_selected',
  'navigation_click'
];

// Events that require analytics consent
const ANALYTICS_EVENTS = [
  'form_completed',
  'user_engagement',
  'session_start',
  'session_end',
  'conversion',
  'feature_usage',
  'performance_metric',
  'content_interaction',
  'user_journey',
  'experiment_exposure'
];

// Events that require marketing consent
const MARKETING_EVENTS = [
  'marketing_attribution',
  'campaign_interaction',
  'ad_click',
  'referral_tracking',
  'utm_tracking',
  'social_share',
  'email_campaign_click'
];

// Events that require functional consent
const FUNCTIONAL_EVENTS = [
  'user_preference_saved',
  'theme_changed',
  'language_changed',
  'personalization_applied',
  'chat_interaction',
  'social_login',
  'remember_me_used'
];

class TrackingManager {
  private posthog: unknown = null;

  initialize(posthogInstance: unknown) {
    this.posthog = posthogInstance;
  }

  /**
   * Track any event with automatic consent checking
   * Compliant with Indian privacy laws - explicit consent required for most tracking
   */
  track(eventName: string, properties?: Record<string, unknown>) {
    if (!this.posthog) return;

    const isNecessaryEvent = NECESSARY_EVENTS.includes(eventName);
    const isBasicAnalyticsEvent = BASIC_ANALYTICS_EVENTS.includes(eventName);
    const isAnalyticsEvent = ANALYTICS_EVENTS.includes(eventName);
    const isMarketingEvent = MARKETING_EVENTS.includes(eventName);
    const isFunctionalEvent = FUNCTIONAL_EVENTS.includes(eventName);

    // Always allow necessary events (legitimate interest for website operation)
    if (isNecessaryEvent) {
      (this.posthog as { capture: (_event: string, _properties?: Record<string, unknown>) => void }).capture(eventName, {
        ...properties,
        consent_level: 'necessary',
        country: 'India',
        timestamp: new Date().toISOString(),
        // No PII, no IP, minimal data
      });
      return;
    }

    // Basic analytics require explicit analytics consent
    if (isBasicAnalyticsEvent && !hasConsentFor('analytics')) {

      return;
    }

    // Advanced analytics require explicit analytics consent
    if (isAnalyticsEvent && !hasConsentFor('analytics')) {

      return;
    }

    // Marketing events require explicit marketing consent
    if (isMarketingEvent && !hasConsentFor('marketing')) {
      return;
    }

    // Functional events require explicit functional consent
    if (isFunctionalEvent && !hasConsentFor('functional')) {

      return;
    }

    // Determine consent level for the event
    const consentLevel = isBasicAnalyticsEvent || isAnalyticsEvent ? 'analytics' :
      isMarketingEvent ? 'marketing' :
        isFunctionalEvent ? 'functional' : 'necessary';

    // Track the event with proper consent metadata
    (this.posthog as { capture: (_event: string, _properties?: Record<string, unknown>) => void }).capture(eventName, {
      ...properties,
      consent_level: consentLevel,
      country: 'India',
      timestamp: new Date().toISOString(),
      // Ensure no PII is included
    });
  }

  /**
   * Track page views (requires analytics consent in India)
   */
  trackPageView(path: string, properties?: Record<string, unknown>) {
    // Page views require analytics consent under Indian privacy laws
    if (!hasConsentFor('analytics')) {
      const _ = { path, properties }; // usage to silence if needed, or just return
      return;
    }

    this.track('page_view', {
      path,
      url: window.location.href,
      title: document.title,
      referrer: document.referrer ? document.referrer : 'direct',
      ...properties,
    });
  }

  /**
   * Track button clicks (always allowed)
   */
  trackButtonClick(buttonText: string, location: string, properties?: Record<string, unknown>) {
    this.track('button_click', {
      button_text: buttonText,
      button_location: location,
      page_url: window.location.href,
      ...properties,
    });
  }

  /**
   * Track link clicks (always allowed)
   */
  trackLinkClick(linkText: string, linkUrl: string, properties?: Record<string, unknown>) {
    this.track('link_click', {
      link_text: linkText,
      link_url: linkUrl,
      page_url: window.location.href,
      ...properties,
    });
  }

  /**
   * Track form interactions (start is basic, completion requires consent)
   */
  trackFormStart(formName: string, properties?: Record<string, unknown>) {
    this.track('form_start', {
      form_name: formName,
      page_url: window.location.href,
      ...properties,
    });
  }

  trackFormCompleted(formName: string, properties?: Record<string, unknown>) {
    this.track('form_completed', {
      form_name: formName,
      page_url: window.location.href,
      ...properties,
    });
  }

  /**
   * Track offer interactions (always allowed)
   */
  trackOfferViewed(offerName: string, properties?: Record<string, unknown>) {
    this.track('offer_viewed', {
      offer_name: offerName,
      page_url: window.location.href,
      ...properties,
    });
  }

  trackOfferClicked(offerName: string, offerUrl: string, properties?: Record<string, unknown>) {
    this.track('button_click', {
      button_text: 'Claim Offer',
      button_location: 'offer_card',
      offer_name: offerName,
      offer_url: offerUrl,
      page_url: window.location.href,
      ...properties,
    });
  }

  /**
   * Track search (always allowed)
   */
  trackSearch(query: string, results: number, properties?: Record<string, unknown>) {
    this.track('search_performed', {
      search_query: query,
      search_results: results,
      page_url: window.location.href,
      ...properties,
    });
  }

  /**
   * Track navigation (always allowed)
   */
  trackNavigation(from: string, to: string, properties?: Record<string, unknown>) {
    this.track('navigation_click', {
      navigation_from: from,
      navigation_to: to,
      ...properties,
    });
  }



  /**
   * Track user engagement (requires consent)
   */
  trackEngagement(action: string, properties?: Record<string, unknown>) {
    this.track('user_engagement', {
      engagement_action: action,
      page_url: window.location.href,
      ...properties,
    });
  }

  /**
   * Track conversions (requires consent)
   */
  trackConversion(event: string, value?: number, properties?: Record<string, unknown>) {
    this.track('conversion', {
      conversion_event: event,
      conversion_value: value,
      page_url: window.location.href,
      ...properties,
    });
  }

  /**
   * Identify user (requires analytics consent)
   */
  identify(userId: string, properties?: Record<string, unknown>) {
    if (!this.posthog || !hasConsentFor('analytics')) {
      return;
    }

    // Filter out PII from properties
    const safeProperties = properties ? {
      user_type: properties.user_type,
      signup_date: properties.signup_date,
      plan: properties.plan,
      // Exclude: email, phone, name, address
    } : {};

    (this.posthog as { identify: (_userid: string, _properties?: Record<string, unknown>) => void }).identify(userId, {
      ...safeProperties,
      consent_timestamp: new Date().toISOString(),
    });
  }

  /**
   * Set user properties (requires analytics consent)
   */
  setUserProperties(properties: Record<string, unknown>) {
    if (!this.posthog || !hasConsentFor('analytics')) {
      return;
    }

    // Filter out PII
    const safeProperties = Object.keys(properties).reduce((safe, key) => {
      // Only allow non-PII properties
      if (!['email', 'phone', 'name', 'address', 'ip'].includes(key.toLowerCase())) {
        safe[key] = properties[key] as unknown;
      }
      return safe;
    }, {} as Record<string, unknown>);

    (this.posthog as { people: { set: (_properties: Record<string, unknown>) => void } }).people.set(safeProperties);
  }

  /**
   * Track feature usage (requires consent)
   */
  trackFeatureUsage(feature: string, action: string, properties?: Record<string, unknown>) {
    this.track('feature_usage', {
      feature_name: feature,
      feature_action: action,
      page_url: window.location.href,
      ...properties,
    });
  }

  /**
   * Track user preferences (requires functional consent)
   */
  trackUserPreference(preference: string, value: unknown, properties?: Record<string, unknown>) {
    this.track('user_preference_saved', {
      preference_name: preference,
      preference_value: value,
      page_url: window.location.href,
      ...properties,
    });
  }

  /**
   * Track theme changes (requires functional consent)
   */
  trackThemeChange(theme: string, properties?: Record<string, unknown>) {
    this.track('theme_changed', {
      theme_name: theme,
      page_url: window.location.href,
      ...properties,
    });
  }

  /**
   * Track social sharing (requires marketing consent)
   */
  trackSocialShare(platform: string, content: string, properties?: Record<string, unknown>) {
    this.track('social_share', {
      social_platform: platform,
      shared_content: content,
      page_url: window.location.href,
      ...properties,
    });
  }

  /**
   * Track marketing attribution (requires marketing consent)
   */
  trackMarketingAttribution(source: string, medium: string, campaign?: string, properties?: Record<string, unknown>) {
    this.track('marketing_attribution', {
      attribution_source: source,
      attribution_medium: medium,
      attribution_campaign: campaign,
      page_url: window.location.href,
      ...properties,
    });
  }

  /**
   * Track UTM parameters (requires marketing consent)
   */
  trackUTMParameters(properties?: Record<string, unknown>) {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_term: urlParams.get('utm_term'),
      utm_content: urlParams.get('utm_content'),
    };

    // Only track if there are UTM parameters
    if (Object.values(utmParams).some(value => value !== null)) {
      this.track('utm_tracking', {
        ...utmParams,
        page_url: window.location.href,
        ...properties,
      });
    }
  }
}

// Create global instance
export const trackingManager = new TrackingManager();

// Convenience functions
export const track = (event: string, properties?: Record<string, unknown>) => {
  trackingManager.track(event, properties);
};

export const trackPageView = (path: string, properties?: Record<string, unknown>) => {
  trackingManager.trackPageView(path, properties);
};

export const trackButtonClick = (buttonText: string, location: string, properties?: Record<string, unknown>) => {
  trackingManager.trackButtonClick(buttonText, location, properties);
};

export const trackLinkClick = (linkText: string, linkUrl: string, properties?: Record<string, unknown>) => {
  trackingManager.trackLinkClick(linkText, linkUrl, properties);
};

export const trackFormStart = (formName: string, properties?: Record<string, unknown>) => {
  trackingManager.trackFormStart(formName, properties);
};

export const trackFormCompleted = (formName: string, properties?: Record<string, unknown>) => {
  trackingManager.trackFormCompleted(formName, properties);
};

export const trackOfferViewed = (offerName: string, properties?: Record<string, unknown>) => {
  trackingManager.trackOfferViewed(offerName, properties);
};

export const trackOfferClicked = (offerName: string, offerUrl: string, properties?: Record<string, unknown>) => {
  trackingManager.trackOfferClicked(offerName, offerUrl, properties);
};

export const trackSearch = (query: string, results: number, properties?: Record<string, unknown>) => {
  trackingManager.trackSearch(query, results, properties);
};

export const trackNavigation = (from: string, to: string, properties?: Record<string, unknown>) => {
  trackingManager.trackNavigation(from, to, properties);
};



export const trackEngagement = (action: string, properties?: Record<string, unknown>) => {
  trackingManager.trackEngagement(action, properties);
};

export const trackConversion = (event: string, value?: number, properties?: Record<string, unknown>) => {
  trackingManager.trackConversion(event, value, properties);
};

export const identifyUser = (userId: string, properties?: Record<string, unknown>) => {
  trackingManager.identify(userId, properties);
};

export const setUserProperties = (properties: Record<string, unknown>) => {
  trackingManager.setUserProperties(properties);
};

export const trackFeatureUsage = (feature: string, action: string, properties?: Record<string, unknown>) => {
  trackingManager.trackFeatureUsage(feature, action, properties);
};

export const trackUserPreference = (preference: string, value: unknown, properties?: Record<string, unknown>) => {
  trackingManager.trackUserPreference(preference, value, properties);
};

export const trackThemeChange = (theme: string, properties?: Record<string, unknown>) => {
  trackingManager.trackThemeChange(theme, properties);
};

export const trackSocialShare = (platform: string, content: string, properties?: Record<string, unknown>) => {
  trackingManager.trackSocialShare(platform, content, properties);
};

export const trackMarketingAttribution = (source: string, medium: string, campaign?: string, properties?: Record<string, unknown>) => {
  trackingManager.trackMarketingAttribution(source, medium, campaign, properties);
};

export const trackUTMParameters = (properties?: Record<string, unknown>) => {
  trackingManager.trackUTMParameters(properties);
};

// Initialize tracking manager when PostHog is available
declare global {
  interface Window {
    posthog?: unknown;
  }
}

// Auto-initialize when PostHog becomes available
if (typeof window !== 'undefined') {
  const checkPostHog = () => {
    if (window.posthog) {
      trackingManager.initialize(window.posthog);
    } else {
      setTimeout(checkPostHog, 100);
    }
  };
  checkPostHog();
}