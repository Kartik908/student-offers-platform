'use client';

/**
 * Renders the 'Submit an Offer' Call-to-Action section.
 */
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useModal } from "@/providers/ModalProvider";

export const SubmitCTA = () => {
  const { openSubmitOfferModal } = useModal();

  return (
    <section className="py-8 md:py-12">
      <div className="container">
        <div className="relative bg-gradient-to-b from-card/60 to-card/90 backdrop-blur-sm p-10 md:p-12 rounded-2xl shadow-xl border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">
          {/* Subtle top glow */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <div className="flex items-center gap-8 text-center md:text-left">
            {/* Icon with glow effect */}
            <div className="hidden md:flex h-16 w-16 rounded-xl bg-primary/10 items-center justify-center flex-shrink-0 relative">
              <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl" />
              <Plus className="relative h-8 w-8 text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Know a student discount we missed? 👀</h2>
              <p className="text-slate-400 text-sm md:text-base">Help other students save — submit an offer we should add.</p>
            </div>
          </div>

          <Button onClick={openSubmitOfferModal} size="lg" className="flex-shrink-0 h-12 px-6 text-primary-foreground">
            Submit an Offer →
          </Button>
        </div>
      </div>
    </section>
  );
};