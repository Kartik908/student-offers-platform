'use client';

// Analytics initialization for Next.js
// PostHog and Sentry are loaded via their own providers

export function initializeAnalytics() {
  // PostHog is auto-initialized via environment variables
  // Sentry is configured in instrumentation.ts
}

// Track events (wrapper for PostHog)
export function trackEvent(eventName: string, properties?: any) {
  if (typeof window !== 'undefined' && (window as any).posthog) {
    (window as any).posthog.capture(eventName, properties);
  }
}

// Track page views
export function trackPageView(path: string) {
  if (typeof window !== 'undefined' && (window as any).posthog) {
    (window as any).posthog.capture('$pageview', { path });
  }
}

// Alias for consistency with Vite version
export const track = trackEvent;

