/**
 * Renders the trust badges (e.g., offer count, update frequency) for the hero section.
 */
import { CheckCircle2, Sparkles } from "lucide-react";

interface HeroBadgesProps {
  offerCount: number;
}

export const HeroBadges = ({ offerCount }: HeroBadgesProps) => {
  return (
    <div className="grid grid-cols-1 px-8 sm:px-20 mt-10 sm:mt-12 text-center sm:text-left gap-x-10 gap-y-6 sm:grid-cols-3 sm:px-0">
      <div className="flex items-center justify-center sm:justify-start group cursor-default transition-all duration-200 hover:scale-[1.02]">
        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-500/80 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:text-emerald-500" />
        <p className="ml-3 text-sm text-muted-foreground transition-colors duration-200 group-hover:text-foreground">{offerCount ? `${offerCount}+` : '240+'} verified offers</p>
      </div>
      <div className="flex items-center justify-center sm:justify-start group cursor-default transition-all duration-200 hover:scale-[1.02]">
        <Sparkles className="h-5 w-5 flex-shrink-0 text-amber-500/80 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:text-amber-500" />
        <p className="ml-3 text-sm text-muted-foreground transition-colors duration-200 group-hover:text-foreground">Only fresh, valid discounts</p>
      </div>
      <div className="flex items-center justify-center sm:justify-start group cursor-default transition-all duration-200 hover:scale-[1.02]">
        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary/80 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:text-primary" />
        <p className="ml-3 text-sm text-muted-foreground transition-colors duration-200 group-hover:text-foreground">Updated regularly</p>
      </div>
    </div>
  );
};