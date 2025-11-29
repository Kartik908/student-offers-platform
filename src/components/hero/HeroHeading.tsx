/**
 * Renders the main H1 heading for the hero section.
 */
export const HeroHeading = () => {
  return (
    <h1 className="hero-heading text-[clamp(2rem,8vw,3rem)] sm:text-[clamp(2.5rem,6vw,4rem)] lg:text-[clamp(3.25rem,4.5vw,4.5rem)] font-black tracking-tight leading-[0.95] sm:leading-[1] mb-2 sm:mb-3 lg:mb-4 max-w-[1000px] mx-auto text-balance">
      <span className="inline md:block">Verified Student <span className="text-primary">Discounts</span></span>{' '}
      <span className="inline md:block">You Didn't Know Existed</span>
    </h1>
  );
};