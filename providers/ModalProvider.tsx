'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { track } from '@/lib/analytics';

interface ModalContextType {
  isSubmitOfferModalOpen: boolean;
  openSubmitOfferModal: () => void;
  closeSubmitOfferModal: () => void;
  isFeedbackModalOpen: boolean;
  openFeedbackModal: () => void;
  closeFeedbackModal: () => void;
  isContactModalOpen: boolean;
  openContactModal: () => void;
  closeContactModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isSubmitOfferModalOpen, setIsSubmitOfferModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const openSubmitOfferModal = () => {
    track('submit_offer_modal_opened', {
      source: 'button_click',
    });
    setIsSubmitOfferModalOpen(true);
  };

  const closeSubmitOfferModal = () => {
    track('submit_offer_modal_closed', {});
    setIsSubmitOfferModalOpen(false);
  };

  const openFeedbackModal = () => {
    track('feedback_modal_opened', {
      source: 'footer_link',
    });
    setIsFeedbackModalOpen(true);
  };

  const closeFeedbackModal = () => {
    track('feedback_modal_closed', {});
    setIsFeedbackModalOpen(false);
  };

  const openContactModal = () => {
    track('contact_modal_opened', {
      source: 'footer_link',
    });
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    track('contact_modal_closed', {});
    setIsContactModalOpen(false);
  };

  return (
    <ModalContext.Provider value={{
      isSubmitOfferModalOpen,
      openSubmitOfferModal,
      closeSubmitOfferModal,
      isFeedbackModalOpen,
      openFeedbackModal,
      closeFeedbackModal,
      isContactModalOpen,
      openContactModal,
      closeContactModal
    }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
