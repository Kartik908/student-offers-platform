'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const SubmitOfferModal = dynamic(() => import('@/components/forms/SubmitOfferModal').then(m => ({ default: m.SubmitOfferModal })), { ssr: false });
const FeedbackModal = dynamic(() => import('@/components/feedback/FeedbackModal').then(m => ({ default: m.FeedbackModal })), { ssr: false });
const ContactModal = dynamic(() => import('@/components/contact/ContactModal').then(m => ({ default: m.ContactModal })), { ssr: false });
const CookieConsentBanner = dynamic(() => import('@/components/layout/CookieConsentBanner'), { ssr: false });

export function ClientModals() {
  return (
    <>
      <Suspense fallback={null}>
        <SubmitOfferModal />
        <FeedbackModal />
        <ContactModal />
        <CookieConsentBanner />
      </Suspense>
    </>
  );
}
