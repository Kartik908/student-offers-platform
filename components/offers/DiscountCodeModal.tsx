/**
 * Discount Code Modal - Shows discount codes with consistent styling
 * Matches the design system of other modals (ExtraInfoModal, SearchBarModal, etc.)
 */
import { useMemo } from "react";
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Copy } from "lucide-react";
import { Offer } from "@/types";
import { toast } from "sonner";

interface DiscountCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: Offer;
}

export default function DiscountCodeModal({ isOpen, onClose, offer }: DiscountCodeModalProps) {
  const coupons = useMemo(() => {
    if (!offer.has_discount_codes || !offer.discount_codes) return [];
    return Array.isArray(offer.discount_codes) ? offer.discount_codes : [];
  }, [offer.discount_codes, offer.has_discount_codes]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied "${code}" to clipboard!`);
  };

  const handleContinueToOffer = () => {
    if (offer.claim_url) {
      window.open(offer.claim_url, '_blank', 'noopener,noreferrer');
      onClose();
    }
  };

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

        {/* Discount Codes Section */}
        <div className="px-6 py-5 space-y-4">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <span>🎟️</span>
            Discount Codes
          </h2>
          <div className="space-y-4">
            {coupons.map((coupon) => (
              <div
                key={coupon.code}
                className="relative p-5 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors group"
              >
                {/* Coupon decorative circles */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full border-r border-border/50" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full border-l border-border/50" />

                <div className="flex items-start justify-between gap-4 ml-2 mr-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xl sm:text-2xl tracking-tight text-primary mb-1.5 font-mono select-all">
                      {coupon.code}
                    </p>
                    <p className="text-sm text-foreground/70 font-medium leading-relaxed">
                      {coupon.description}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-10 w-10 flex-shrink-0 shadow-sm border border-border/50"
                    onClick={() => handleCopy(coupon.code)}
                    aria-label={`Copy code ${coupon.code}`}
                    title="Copy code"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
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
            className="h-10 min-w-[140px]"
          >
            Continue to Offer
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
