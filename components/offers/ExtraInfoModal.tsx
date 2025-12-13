/**
 * Extra Info Modal for offers with additional information
 * Shows extra_info content from database in a clean, consistent design
 */
import React from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { Offer } from "@/types";

interface ExtraInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: Offer;
}

// Helper function to detect and linkify URLs in text
function linkifyText(text: string | null | undefined) {
  if (!text) return null;

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline break-all"
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export default function ExtraInfoModal({ isOpen, onClose, offer }: ExtraInfoModalProps) {
  const handleContinueToOffer = () => {
    if (offer.claim_url) {
      window.open(offer.claim_url, '_blank', 'noopener,noreferrer');
      onClose();
    }
  };

  if (!offer.extra_info) {
    return null;
  }

  // Parse extra_info - support both old string format and new JSON format
  let importantNotes: Array<{ text: string; link_label?: string | null; link_url?: string | null }> = [];

  try {
    const parsed = JSON.parse(offer.extra_info);
    if (parsed.important_notes && Array.isArray(parsed.important_notes)) {
      importantNotes = parsed.important_notes;
    } else {
      // Fallback to old format
      importantNotes = [{ text: offer.extra_info, link_label: null, link_url: null }];
    }
  } catch {
    // Not JSON, use as plain text
    importantNotes = [{ text: offer.extra_info, link_label: null, link_url: null }];
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 gap-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            {offer.logo && (
              <div className="relative h-10 w-10 flex-shrink-0 rounded-xl overflow-hidden border border-border/50 bg-background shadow-sm">
                {offer.logo.endsWith('.mp4') || offer.logo.endsWith('.webm') ? (
                  <video
                    src={offer.logo}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <Image
                    src={offer.logo}
                    alt={`${offer.name} logo`}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-semibold truncate leading-tight">
                Claim: {offer.name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground truncate">
                View offer details and continue to claim.
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Important Notes Section */}
        <div className="px-6 py-5 space-y-4">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <span>ℹ️</span>
            Important Notes
          </h2>
          <div className="space-y-3">
            {importantNotes.map((note, index) => {
              if (!note.text) return null;

              return (
                <div key={index} className="px-4 pt-4 pb-2 rounded-xl bg-primary/5 border border-primary/10 text-sm text-foreground/90 leading-relaxed shadow-sm">
                  <p className="whitespace-pre-wrap break-words">
                    <span className="inline-block mr-2 text-lg leading-none">👉</span>
                    {linkifyText(note.text)}
                  </p>
                  {note.link_url && note.link_label && (
                    <a
                      href={note.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 mt-2 mb-1 text-primary font-medium no-underline hover:no-underline p-1.5 hover:bg-primary/10 rounded-md w-fit transition-colors"
                    >
                      <span className="inline-block no-underline">🔗</span>
                      <span className="underline hover:no-underline">{note.link_label}</span>
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-10 px-4 hover:bg-muted/50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleContinueToOffer}
            className="h-10 min-w-[140px] group"
          >
            Continue to Offer
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
