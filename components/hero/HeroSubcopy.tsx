/**
 * Renders the subcopy paragraph for the hero section with embedded links.
 */
import Link from "next/link";

export const HeroSubcopy = () => {
  return (
    <p className="mt-9 sm:mt-10 px-4 sm:px-0 text-[15px] sm:text-lg md:text-xl text-foreground leading-relaxed mx-auto max-w-2xl">
      Save money on the tools you already use — <Link href="/tools?q=Amazon Prime" className="font-medium text-primary hover:text-primary/90 hover:underline transition-colors">Amazon Prime</Link>, <Link href="/tools?q=Spotify" className="font-medium text-primary hover:text-primary/90 hover:underline transition-colors">Spotify</Link>, <Link href="/tools?q=Apple Education" className="font-medium text-primary hover:text-primary/90 hover:underline transition-colors">Apple</Link>, <Link href="/tools?q=Microsoft 365" className="font-medium text-primary hover:text-primary/90 hover:underline transition-colors">Microsoft 365</Link>, <Link href="/tools?q=Perplexity Pro" className="font-medium text-primary hover:text-primary/90 hover:underline transition-colors">Perplexity</Link>, and more.
    </p>
  );
};