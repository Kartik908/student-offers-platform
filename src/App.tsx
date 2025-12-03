import { Toaster as Sonner } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { usePostHog } from "posthog-js/react";
import { track, trackPageView, trackingManager } from "@/lib/trackingManager";
import "@/lib/complianceChecker"; // Auto-run compliance checks in development
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PageLayout from "./components/layout/PageLayout";
import { lazy, Suspense, useEffect, useState } from "react";
import { FavoritesProvider } from "./providers/FavoritesProvider";
import { OffersProvider } from "./providers/OffersProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import ScrollToTop from "./components/utils/ScrollToTop";
import { ModalProvider } from "./providers/ModalProvider";
import { useDeferredAnalytics } from "./hooks/useDeferredAnalytics";

import { InitialLoader } from "./components/layout/InitialLoader";
import { ErrorBoundary, SkipToContent } from "./components/common";

// Lazy load modals (only load when opened)
const SubmitOfferModal = lazy(() => import("./components/forms/SubmitOfferModal").then(m => ({ default: m.SubmitOfferModal })));
const FeedbackModal = lazy(() => import("./components/feedback/FeedbackModal").then(m => ({ default: m.FeedbackModal })));
const ContactModal = lazy(() => import("./components/contact/ContactModal").then(m => ({ default: m.ContactModal })));
const CookieConsentBanner = lazy(() => import("./components/layout/CookieConsentBanner"));

// Lazy load non-critical pages
// Lazy load non-critical pages
const Admin = lazy(() => import("./pages/Admin"));

// Preloadable AllTools
const importAllTools = () => import("./pages/AllTools");
const AllTools = lazy(importAllTools);

const Favorites = lazy(() => import("./pages/Favorites"));
const HowWeVerify = lazy(() => import("./pages/HowWeVerify"));
// Import PrivacyCookiesTerms directly instead of lazy loading
import PrivacyCookiesTerms from "./pages/PrivacyCookiesTerms";

// Preload critical data
import { preloadCriticalData } from "./lib/preloader";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      networkMode: 'online',
    },
  },
});



// Component to track page views (works even when PostHog is blocked)
const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      trackPageView(location.pathname);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [location]);

  return null;
};

const AppContent = () => {
  // Show preloader only on first homepage load in this session
  const [isInitializing, setIsInitializing] = useState(() => {
    const hasLoadedBefore = sessionStorage.getItem('app_loaded');
    const isHomepage = window.location.pathname === '/';
    return !hasLoadedBefore && isHomepage;
  });
  const posthog = usePostHog();
  const analyticsReady = useDeferredAnalytics();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Handle preloader if showing
        if (isInitializing) {
          const preloadTimer = setTimeout(() => {
            setIsInitializing(false);
            sessionStorage.setItem('app_loaded', 'true');
          }, 1000);

          preloadCriticalData()
            .then(() => {
              clearTimeout(preloadTimer);
              setIsInitializing(false);
              sessionStorage.setItem('app_loaded', 'true');
            })
            .catch(err => {
              console.error('Preload failed:', err);
              clearTimeout(preloadTimer);
              setIsInitializing(false);
              sessionStorage.setItem('app_loaded', 'true');
            });
        } else {
          // Preload data in background if not showing preloader
          preloadCriticalData().catch(err => console.error('Preload failed:', err));
        }

        if (posthog) {
          // Initialize basic tracking system
          trackingManager.initialize(posthog);

          track('app_initialized', {
            url: window.location.href,
          });

          // Track UTM parameters - load in background
          import('@/lib/trackingManager').then(({ trackUTMParameters }) => {
            trackUTMParameters();
          });
        }
      } catch (error) {
        console.error('Initialization failed:', error);
      }
    };

    initializeApp();

    // Prevent scroll restoration during initial load
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Re-enable after content loads
    const scrollTimer = setTimeout(() => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    }, 2000);

    // Preload AllTools page when the browser is idle
    // This ensures zero impact on initial load performance
    const preloadAllTools = () => {
      if ('requestIdleCallback' in window) {
        // @ts-ignore - requestIdleCallback is not yet in standard TS lib
        window.requestIdleCallback(() => {
          importAllTools();
        }, { timeout: 5000 });
      } else {
        // Fallback for browsers that don't support requestIdleCallback
        setTimeout(() => {
          importAllTools();
        }, 2000);
      }
    };

    // Wait a bit after mount before even requesting idle callback
    // to let high-priority hydration finish
    const initialTimer = setTimeout(preloadAllTools, 1000);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(scrollTimer);
    };
  }, [posthog, isInitializing]);

  // Show preloader if initializing
  if (isInitializing) {
    return <InitialLoader />;
  }


  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      storageKey="vite-ui-theme"
      enableSystem={true}
      disableTransitionOnChange={false}
    >
      {/* Defer analytics until page is interactive */}
      {analyticsReady && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
      <SkipToContent />
      <div>
        <TooltipProvider>
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <PageTracker />
            <ScrollToTop />
            <OffersProvider>
              <FavoritesProvider>

                <ModalProvider>
                  <ErrorBoundary>
                    <Routes>
                      <Route path="/" element={<PageLayout />}>
                        <Route index element={<Index />} />
                        <Route path="tools" element={
                          <Suspense fallback={null}>
                            <AllTools />
                          </Suspense>
                        } />
                        <Route path="favorites" element={
                          <Suspense fallback={null}>
                            <Favorites />
                          </Suspense>
                        } />
                        <Route path="how-we-verify" element={
                          <Suspense fallback={null}>
                            <HowWeVerify />
                          </Suspense>
                        } />
                        <Route path="privacy-cookies-terms" element={<PrivacyCookiesTerms />} />

                        <Route path="*" element={<NotFound />} />
                      </Route>
                      <Route path="admin" element={
                        <Suspense fallback={<InitialLoader />}>
                          <Admin />
                        </Suspense>
                      } />
                    </Routes>
                  </ErrorBoundary>
                  <Suspense fallback={null}>
                    <SubmitOfferModal />
                    <FeedbackModal />
                    <ContactModal />
                  </Suspense>
                </ModalProvider>

              </FavoritesProvider>
            </OffersProvider>
          </BrowserRouter>
          <Suspense fallback={null}>
            <CookieConsentBanner />
          </Suspense>

        </TooltipProvider>
      </div>
    </ThemeProvider>
  );
};

import { HelmetProvider } from 'react-helmet-async';

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AppContent />
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
