import { getOffers } from '@/lib/supabase-server';
import { Suspense } from 'react';
import { Metadata } from 'next';
import PageLayout from '@/components/layout/PageLayout';
import AllToolsPage from '@/components/pages/AllToolsPage';
import { OfferStructuredData } from '@/components/seo/OfferStructuredData';

// Using Node.js runtime for compression
export const revalidate = 14400;

export const metadata: Metadata = {
  title: 'All Tools | Student Offers',
  description: 'Browse all verified student discounts and offers.',
};

export default async function ToolsPage() {
  const offers = await getOffers();

  return (
    <>
      <OfferStructuredData offers={offers} limit={50} />
      <PageLayout offers={offers}>
        <Suspense fallback={<div className="container py-20 text-center">Loading...</div>}>
          <AllToolsPage offers={offers} />
        </Suspense>
      </PageLayout>
    </>
  );
}
