'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { ModalProvider } from '@/providers/ModalProvider';
import { FavoritesProvider } from '@/providers/FavoritesProvider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { GlobalLoadingIndicator } from '@/components/layout/GlobalLoadingIndicator';

// Vercel Analytics - ALWAYS load (essential, no cookies, privacy-friendly)
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Code split heavy components - loaded after main content
const ClientModals = dynamic(() => import('@/components/layout/ClientModals').then(m => ({ default: m.ClientModals })), { ssr: false });
const ScrollToTop = dynamic(() => import('@/components/ui/scroll-to-top').then(m => ({ default: m.ScrollToTop })), { ssr: false });
const DeferredPostHog = dynamic(() => import('@/components/analytics/DeferredPostHog').then(m => ({ default: m.DeferredPostHog })), { ssr: false });

export function GlobalProviders({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {/* Vercel Analytics - always on */}
            <Analytics />
            <SpeedInsights />

            <GlobalLoadingIndicator />

            <FavoritesProvider>
                <ModalProvider>
                    <TooltipProvider>
                        {/* Children render immediately - not wrapped by deferred components */}
                        {children}

                        {/* These load after main content */}
                        <DeferredPostHog>{null}</DeferredPostHog>
                        <ClientModals />
                        <Toaster />
                    </TooltipProvider>
                </ModalProvider>
            </FavoritesProvider>

            <ScrollToTop />
        </ThemeProvider>
    );
}


