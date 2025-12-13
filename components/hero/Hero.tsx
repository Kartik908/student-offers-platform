

import { HeroHeading } from "./HeroHeading";
import { HeroSubcopy } from "./HeroSubcopy";
import { HeroCTA } from "./HeroCTA";
import { HeroBadges } from "./HeroBadges";
import { HeroBackgrounds } from "./HeroBackgrounds";

interface HeroProps {
  offerCount: number;
}

export const Hero = ({ offerCount }: HeroProps) => {
  return (
    <section className="relative min-h-[500px] lg:min-h-[600px] pt-12 pb-14 sm:pt-16 sm:pb-18 md:pt-16 md:pb-16 lg:pt-20 lg:pb-20 xl:pt-24 xl:pb-22 flex items-center justify-center bg-background overflow-hidden">

      {/* Premium Hybrid Background (Mesh + Grid + Noise) */}
      <HeroBackgrounds />

      {/* Centered Content Container */}
      <div className="relative z-20 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-[52rem] mx-auto text-center">
          <HeroHeading />
          <HeroSubcopy />
          <HeroCTA />
          <HeroBadges offerCount={offerCount} />
        </div>
      </div>
    </section>
  );
};