import { createRoot } from "react-dom/client";
import { PostHogProvider } from "posthog-js/react";
import App from "./App.tsx";
import "./globals.css";
import { hasConsent, getCookiePreferences } from "./lib/consentManager";
import { enablePostHogFeatures } from "./lib/posthogConsent";

// Environment variables are loaded automatically by Vite

createRoot(document.getElementById("root")!).render(
  <PostHogProvider
    apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
    options={{
      api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,

      // Privacy-first initialization - compliant with Indian privacy laws
      person_profiles: 'never', // No personal profiles until explicit consent
      autocapture: false, // No automatic event capture
      capture_pageview: false, // No automatic page views
      disable_session_recording: true, // No session recording
      opt_out_capturing_by_default: true, // Start opted out

      // Enhanced privacy settings for India compliance
      mask_all_element_attributes: true, // Mask all HTML attributes
      mask_all_text: true, // Mask all text content
      respect_dnt: true, // Respect Do Not Track headers
      ip: false, // Disable IP collection entirely
      property_blacklist: ['$ip', '$geoip_country_name', '$geoip_city_name'], // Block geo data

      // Security and compliance
      secure_cookie: true, // Use secure cookies
      cross_subdomain_cookie: false, // No cross-domain tracking
      persistence: 'localStorage', // Use localStorage instead of cookies when possible

      debug: import.meta.env.MODE === "development",

      loaded: (posthog) => {
        // Check if user has already given consent
        if (hasConsent()) {
          const preferences = getCookiePreferences();
          const method = localStorage.getItem('analytics_consent') === 'all' ? 'accept_all' :
            localStorage.getItem('analytics_consent') === 'necessary' ? 'necessary_only' : 'custom';

          // Re-enable features based on saved preferences
          enablePostHogFeatures(posthog, preferences, method as 'accept_all' | 'necessary_only' | 'custom');
        } else {
          // Before consent: Only track absolutely necessary events for basic functionality
          // These are allowed under legitimate interest for essential website operation
          posthog.capture('app_initialized', {
            path: window.location.pathname,
            timestamp: new Date().toISOString(),
            country: 'India', // Static, no IP tracking
            consent_status: 'pending',
            // No personal data, IP masking, no fingerprinting
          });
        }
      },
    }}
  >
    <App />
  </PostHogProvider>
);