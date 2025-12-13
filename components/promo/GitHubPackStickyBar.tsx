'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Github, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GitHubPackStickyBarProps {
  isActive: boolean;
}

const GitHubPackStickyBar = ({ isActive }: GitHubPackStickyBarProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isClaimed, setIsClaimed] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('github_pack_claimed') === 'true';
    }
    return false;
  });

  const handleDismiss = () => {
    sessionStorage.setItem('github_pack_bar_dismissed', 'true');
    setIsVisible(false);
    // Unmount after animation
    setTimeout(() => setShouldRender(false), 500);
  };

  useEffect(() => {
    const dismissed = sessionStorage.getItem('github_pack_bar_dismissed') === 'true';

    if (isActive && !dismissed) {
      // Mount it
      const mountTimer = setTimeout(() => setShouldRender(true), 0);
      // Slide it in after a small delay to allow mount
      const slideTimer = setTimeout(() => setIsVisible(true), 500);
      return () => {
        clearTimeout(mountTimer);
        clearTimeout(slideTimer);
      };
    } else {
      const hideTimer = setTimeout(() => setIsVisible(false), 0);
      // Unmount after transition
      const unmountTimer = setTimeout(() => setShouldRender(false), 500);
      return () => {
        clearTimeout(hideTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, [isActive]);

  const handleClaimClick = () => {
    sessionStorage.setItem('github_pack_claimed', 'true');
    setIsClaimed(true);
  };

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 inset-x-0 flex justify-center z-[70] px-4 sm:px-6 pr-20 sm:pr-24 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] pointer-events-none",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-[120%] opacity-0"
      )}
      role="region"
      aria-label="GitHub Student Pack"
    >
      <div className="relative w-full max-w-3xl sm:max-w-4xl md:max-w-5xl lg:max-w-6xl pointer-events-auto">
        {/* MAIN CARD */}
        <div className="w-full bg-gradient-to-br from-[#0C1524]/95 to-[#07101C]/80 rounded-2xl md:rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4),0_2px_8px_rgba(0,0,0,0.2)] border border-white/5 px-5 sm:px-6 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md">
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
                  className="h-9 px-4 w-full md:w-auto group/btn"
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
    </div>
  );
};

export default GitHubPackStickyBar;
