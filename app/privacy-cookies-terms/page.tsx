import { getOffers } from '@/lib/supabase-server';
import { Metadata } from 'next';
import PageLayout from '@/components/layout/PageLayout';
import PrivacyCookiesTermsPage from '@/components/pages/PrivacyCookiesTermsPage';


export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Privacy Policy, Cookies & Terms',
  description: 'Read our privacy policy, cookie usage, and terms of service. We value your privacy and data security.',
};

export default async function Page() {
  const offers = await getOffers();
  return (
    <PageLayout offers={offers}>
      <PrivacyCookiesTermsPage />
    </PageLayout>
  );
}