/**
 * A sticky bar promoting the GitHub Student Pack on relevant pages.
 */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Github, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GitHubPackStickyBarProps {
  isActive: boolean;
}

const GitHubPackStickyBar = ({ isActive }: GitHubPackStickyBarProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [nudge, setNudge] = useState(false);
  const nudgedRef = useRef(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('github_pack_bar_dismissed') === 'true';
    const claimed = sessionStorage.getItem('github_pack_claimed') === 'true';

    setIsDismissed(dismissed);
    setIsClaimed(claimed);

    if (isActive && !dismissed) {
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isActive]);

  // Auto-dismiss after claiming
  useEffect(() => {
    if (isClaimed) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isClaimed]);

  useEffect(() => {
    if (!isActive || nudgedRef.current || isClaimed) {
      return;
    }

    const setupObserver = () => {
      const cards = document.querySelectorAll('.offer-card-wrapper');
      const nudgeTargetIndex = 8;
      if (cards.length <= nudgeTargetIndex) {
        return;
      }
      const nudgeTarget = cards[nudgeTargetIndex];

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setNudge(true);
            nudgedRef.current = true;
            observer.disconnect();
          }
        },
        { threshold: 0.5 }
      );

      observer.observe(nudgeTarget);
      return () => observer.disconnect();
    };

    const timeoutId = setTimeout(setupObserver, 100);
    return () => clearTimeout(timeoutId);
  }, [isActive, isClaimed]);

  useEffect(() => {
    if (nudge) {
      const timer = setTimeout(() => setNudge(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [nudge]);

  const handleDismiss = () => {
    sessionStorage.setItem('github_pack_bar_dismissed', 'true');
    setIsVisible(false);
    setIsDismissed(true);
  };

  const handleClaimClick = () => {
    sessionStorage.setItem('github_pack_claimed', 'true');
    setIsClaimed(true);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: "120%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "120%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 inset-x-0 flex justify-center z-[70] px-4 sm:px-6 pr-20 sm:pr-24"
          aria-live="polite"
          role="region"
          aria-label="GitHub Student Pack"
        >
          <div className="relative w-full max-w-3xl sm:max-w-4xl md:max-w-5xl lg:max-w-6xl">
            {/* MAIN CARD */}
            <div className="w-full bg-gradient-to-br from-[#0C1524]/95 to-[#07101C]/80 rounded-2xl md:rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4),0_2px_8px_rgba(0,0,0,0.2)] border border-white/5 px-5 sm:px-6 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
              {isClaimed ? (
                <div className="flex items-center justify-center text-center w-full">
                  <p className="font-medium text-white">
                    Pack claimed! Continue browsing all included offers.
                  </p>
                </div>
              ) : (
                <>
                  {/* LEFT CONTENT */}
                  <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
                    <div className="bg-slate-800/50 p-2.5 sm:p-3.5 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-black/40 ring-1 ring-white/10">
                      <Github className="h-6 w-6 sm:h-7 sm:w-7 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-white text-lg sm:text-xl font-semibold leading-tight">
                        Unlock $200k+ in value with the GitHub Student Pack
                      </h2>
                      <div className="flex items-center gap-1 bg-emerald-900/50 text-emerald-300 text-xs font-medium px-2 py-0.5 rounded-full ring-1 ring-emerald-500/20 w-fit mt-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Verified</span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT CTA */}
                  <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto md:flex-shrink-0">
                    <Button
                      asChild
                      onClick={handleClaimClick}
                      className={cn(
                        "h-9 px-4 w-full md:w-auto group/btn",
                        nudge && "animate-pulse-once"
                      )}
                    >
                      <a
                        href="https://education.github.com/pack"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5"
                      >
                        Claim the Pack <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                      </a>
                    </Button>
                    <p className="text-slate-400 text-xs text-center md:text-right w-full">
                      Requires student verification — Free
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* FIXED CLOSE BUTTON — OUTSIDE card, floating on right */}
            <button
              onClick={handleDismiss}
              aria-label="Close"
              className="absolute -right-3 -top-3 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 border border-white/10 text-slate-300 hover:bg-black/60 hover:text-white transition-all backdrop-blur-xl shadow-[0_4px_12px_rgba(0,0,0,0.5),0_2px_4px_rgba(0,0,0,0.3)]"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GitHubPackStickyBar;
