'use client';

import { ArrowUpRight } from "lucide-react";

/**
 * Auto-Adaptive Glassmorphism Claim Button
 * - Automatically adjusts appearance depending on light/dark mode
 * - Keeps consistent glow, blur, border strength, text contrast
 * - Works on dark cards, light cards, mid-tone cards
 */

interface GlassClaimButtonProps {
  label?: string;
  loading?: boolean;
  success?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export function GlassClaimButton({
  label = "Claim Offer",
  loading = false,
  success = false,
  onClick,
  href,
  className = ""
}: GlassClaimButtonProps) {
  const buttonContent = (
    <>
      {/* Inner label + adaptive icon */}
      <span className="relative z-10 flex items-center gap-2">
        {!loading && !success && <span>{label}</span>}
        {loading && <span className="animate-pulse">Loading…</span>}
        {success && <span>✓ Claimed</span>}

        {/* Arrow / Spinner / Success icon */}
        {!loading && !success && (
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        )}
        {loading && (
          <span className="inline-block w-3 h-3 border-2 border-blue-500/40 border-t-blue-600 rounded-full animate-spin" />
        )}
        {success && <span className="text-green-400">✓</span>}
      </span>

      {/* Glow Layer */}
      <span className="absolute inset-0 rounded-lg bg-blue-400/20 blur-xl opacity-0 group-hover:opacity-60 transition-opacity pointer-events-none" />

      {/* Shimmer Layer */}
      {loading && (
        <span className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none opacity-50">
          <span className="absolute left-[-50%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
        </span>
      )}
    </>
  );

  const buttonClasses = `
    relative w-full rounded-lg backdrop-blur-xl
    transition-all py-2.5 px-4 flex items-center justify-center gap-2
    active:scale-[0.96]
    border text-sm font-medium shadow-lg
    group
    /* Light Mode Base - Soft Tinted Blue */
    bg-primary/10 border-primary/20 text-primary shadow-sm
    hover:bg-primary/20 hover:shadow-md hover:border-primary/30
    
    /* Dark Mode Override - Brand Blue Glass */
    dark:bg-gradient-to-br dark:from-primary/30 dark:to-primary/20 
    dark:border-primary/50 dark:text-primary-foreground
    dark:shadow-primary/30 dark:hover:from-primary/40 dark:hover:to-primary/30 
    dark:hover:shadow-primary/50 dark:hover:border-primary/60
    /* Dark Mode Interior Glow */
    dark:shadow-[inset_0_1px_3px_rgba(59,130,246,0.15)]
    dark:hover:shadow-[inset_0_1px_3px_rgba(59,130,246,0.25)]
    /* Disabled state */
    ${loading || success ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
    ${className}
  `;

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={buttonClasses}
      >
        {buttonContent}
      </a>
    );
  }

  return (
    <button
      disabled={loading || success}
      onClick={onClick}
      className={buttonClasses}
    >
      {buttonContent}
    </button>
  );
}
