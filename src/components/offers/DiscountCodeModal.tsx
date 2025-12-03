/**
 * Discount Code Modal - Shows discount codes with consistent styling
 * Matches the design system of other modals (ExtraInfoModal, SearchBarModal, etc.)
 */
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
  const coupons = offer.discount_codes || [];

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
        <DialogHeader className="px-6 pt-6 pb-4 space-y-1">
          <DialogTitle className="text-xl font-semibold">
            Claim: {offer.name}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            View offer details and continue to claim.
          </p>
        </DialogHeader>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Discount Codes Section */}
        <div className="px-6 py-5 space-y-4">
          <h2 className="text-lg font-medium">
            <span className="inline-block mr-2">🎟️</span>
            Discount Codes
          </h2>
          <div className="space-y-3">
            {coupons.map((coupon) => (
              <div
                key={coupon.code}
                className="px-4 py-4 rounded-xl bg-card/50 border border-border"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono font-semibold text-base text-foreground mb-1">
                      {coupon.code}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {coupon.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 flex-shrink-0 hover:bg-accent"
                    onClick={() => handleCopy(coupon.code)}
                    aria-label={`Copy code ${coupon.code}`}
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
            variant="secondary"
            onClick={onClose}
            className="bg-card/50 hover:bg-card/70 border border-border"
          >
            Cancel
          </Button>
          <Button
            onClick={handleContinueToOffer}
            className="min-w-[140px]"
          >
            Continue to Offer
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
