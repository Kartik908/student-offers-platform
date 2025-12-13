/**
 * Renders the trust badges (e.g., offer count, update frequency) for the hero section.
 */
import { CheckCircle2, Sparkles } from "lucide-react";

interface HeroBadgesProps {
  offerCount: number;
}

export const HeroBadges = ({ offerCount }: HeroBadgesProps) => {
  return (
    <div className="grid grid-cols-1 px-4 sm:px-0 mt-10 sm:mt-12 text-center sm:text-left gap-4 sm:gap-6 sm:grid-cols-3">
      <div className="flex items-center justify-center sm:justify-start group cursor-default transition-all duration-200 hover:scale-[1.02] bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] rounded-xl px-4 py-3 backdrop-blur-md">
        <CheckCircle2 className="h-[18px] w-[18px] flex-shrink-0 text-emerald-500/90 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:text-emerald-500" />
        <p className="ml-3 text-[13px] font-medium text-muted-foreground transition-colors duration-200 group-hover:text-foreground">{offerCount ? `${offerCount}+` : '240+'} verified offers</p>
      </div>
      <div className="flex items-center justify-center sm:justify-start group cursor-default transition-all duration-200 hover:scale-[1.02] bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] rounded-xl px-4 py-3 backdrop-blur-md">
        <Sparkles className="h-[18px] w-[18px] flex-shrink-0 text-amber-500/90 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:text-amber-500" />
        <p className="ml-3 text-[13px] font-medium text-muted-foreground transition-colors duration-200 group-hover:text-foreground">Only fresh, valid discounts</p>
      </div>
      <div className="flex items-center justify-center sm:justify-start group cursor-default transition-all duration-200 hover:scale-[1.02] bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] rounded-xl px-4 py-3 backdrop-blur-md">
        <CheckCircle2 className="h-[18px] w-[18px] flex-shrink-0 text-primary/90 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:text-primary" />
        <p className="ml-3 text-[13px] font-medium text-muted-foreground transition-colors duration-200 group-hover:text-foreground">Updated regularly</p>
      </div>
    </div>
  );
};