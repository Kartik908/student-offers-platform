/**
 * Renders the subcopy paragraph for the hero section with embedded links.
 */
import { Link } from "react-router-dom";

export const HeroSubcopy = () => {
  return (
    <p className="mt-6 sm:mt-7 text-base sm:text-lg md:text-xl text-foreground leading-relaxed mx-auto max-w-2xl">
      Save money on the tools you already use — <Link to="/tools?q=Amazon Prime" className="font-medium text-primary hover:text-primary/90 hover:underline transition-colors">Amazon Prime</Link>, <Link to="/tools?q=Spotify" className="font-medium text-primary hover:text-primary/90 hover:underline transition-colors">Spotify</Link>, <Link to="/tools?q=Apple Education" className="font-medium text-primary hover:text-primary/90 hover:underline transition-colors">Apple</Link>, <Link to="/tools?q=Microsoft 365" className="font-medium text-primary hover:text-primary/90 hover:underline transition-colors">Microsoft 365</Link>, <Link to="/tools?q=Perplexity Pro" className="font-medium text-primary hover:text-primary/90 hover:underline transition-colors">Perplexity</Link>, <Link to="/tools?q=Google AI Pro" className="font-medium text-primary hover:text-primary/90 hover:underline transition-colors">Google Gemini</Link>, and more.
    </p>
  );
};