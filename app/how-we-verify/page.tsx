import { getOffers } from '@/lib/supabase-server';
import { Metadata } from 'next';
import PageLayout from '@/components/layout/PageLayout';
import HowWeVerifyPage from '@/components/pages/HowWeVerifyPage';


export const revalidate = 60;

export const metadata: Metadata = {
  title: 'How We Verify Offers',
  description: 'Learn about our rigorous verification process. We manually review every student discount and cross-check with AI models to ensure accuracy.',
};

export default async function Page() {
  const offers = await getOffers();
  return (
    <PageLayout offers={offers}>
      <HowWeVerifyPage />
    </PageLayout>
  );
}
