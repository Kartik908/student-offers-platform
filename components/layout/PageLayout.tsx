/**
 * The main layout structure for all pages, including header and footer.
 * Server Component for better performance
 */
import React from 'react';
import SiteHeader from '@/components/nav/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import { OffersProvider } from '@/providers/OffersProvider';
import { Offer } from '@/types';

interface PageLayoutProps {
  children: React.ReactNode;
  offers: Offer[];
}

export default function PageLayout({ children, offers }: PageLayoutProps) {
  return (
    <OffersProvider initialOffers={offers}>
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <div className="flex-1 w-full">
          {children}
        </div>
        <SiteFooter />
      </div>
    </OffersProvider>
  );
};