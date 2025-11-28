/**
 * Fallback analytics system that works even when PostHog is blocked
 */

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
  timestamp: string;
  url: string;
  userAgent: string;
  referrer: string;
}

class FallbackAnalytics {
  private events: AnalyticsEvent[] = [];
  private isPostHogBlocked = false;

  constructor() {
    this.detectPostHogStatus();
  }

  private async detectPostHogStatus() {
    try {
      // Try to reach PostHog endpoint
      const response = await fetch('/ingest/decide/?v=3', {
        method: 'GET',
        mode: 'no-cors'
      });
      this.isPostHogBlocked = false;
    } catch (error) {
      this.isPostHogBlocked = true;
    }
  }

  track(event: string, properties?: Record<string, unknown>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
    };

    // Store locally
    this.events.push(analyticsEvent);

    // Try to send to your own analytics endpoint
    this.sendToFallbackEndpoint(analyticsEvent);

    // Also try PostHog if available
    if (window.posthog && !this.isPostHogBlocked) {
      try {
        window.posthog.capture(event, properties);
      } catch (error) {
        console.warn('PostHog failed, using fallback');
      }
    }
  }

  private async sendToFallbackEndpoint(event: AnalyticsEvent) {
    // For now, just store locally since we don't have a server endpoint
    // In production, you could send to your own analytics API
    this.storeLocally(event);

    // Optional: Try to send to a third-party service that works with ad blockers
    // Example: Simple Analytics, Plausible, or your own endpoint
    if (import.meta.env.VITE_FALLBACK_ANALYTICS_URL) {
      try {
        await fetch(import.meta.env.VITE_FALLBACK_ANALYTICS_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        });
      } catch (error) {
        // Silently fail - data is already stored locally
      }
    }
  }

  private storeLocally(event: AnalyticsEvent) {
    try {
      const stored = localStorage.getItem('fallback_analytics') || '[]';
      const events = JSON.parse(stored);
      events.push(event);

      // Keep only last 100 events
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }

      localStorage.setItem('fallback_analytics', JSON.stringify(events));
    } catch (error) {
      console.warn('Failed to store analytics locally');
    }
  }

  // Get stored events for manual sending
  getStoredEvents(): AnalyticsEvent[] {
    try {
      const stored = localStorage.getItem('fallback_analytics') || '[]';
      return JSON.parse(stored);
    } catch (error) {
      return [];
    }
  }

  // Clear stored events
  clearStoredEvents() {
    localStorage.removeItem('fallback_analytics');
  }

  // Export stored events as JSON (for manual analysis)
  exportStoredEvents(): string {
    const events = this.getStoredEvents();
    return JSON.stringify(events, null, 2);
  }

  // Get analytics summary
  getAnalyticsSummary() {
    const events = this.getStoredEvents();
    const summary = {
      totalEvents: events.length,
      eventTypes: {} as Record<string, number>,
      pageViews: events.filter(e => e.event === '$pageview').length,
      uniquePages: new Set(events.filter(e => e.event === '$pageview').map(e => e.properties?.path)).size,
      timeRange: {
        first: events[0]?.timestamp,
        last: events[events.length - 1]?.timestamp,
      }
    };

    // Count event types
    events.forEach(event => {
      summary.eventTypes[event.event] = (summary.eventTypes[event.event] || 0) + 1;
    });

    return summary;
  }
}

// Create global instance
export const analytics = new FallbackAnalytics();

// Global tracking function
export const track = (event: string, properties?: Record<string, unknown>) => {
  analytics.track(event, properties);
};

// Page view tracking
export const trackPageView = (path: string) => {
  track('$pageview', { path });
};

// Declare global type for PostHog
declare global {
  interface Window {
    posthog?: unknown;
  }
}