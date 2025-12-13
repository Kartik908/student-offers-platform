/**
 * Minimal initial loading screen with smooth animations
 */
import { GraduationCap } from "lucide-react";

export const InitialLoader = () => {
  return (
    <div
      className="fixed inset-0 bg-background flex items-center justify-center z-50"
      role="status"
      aria-busy="true"
      aria-label="Loading application"
    >
      <div className="flex flex-col items-center gap-5 animate-fadeInSlow">
        {/* Animated Icon */}
        <div className="text-primary animate-softBounce" aria-hidden="true">
          <GraduationCap className="w-12 h-12" strokeWidth={1.8} />
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold text-primary tracking-tight">
          Student Offers
        </h1>

        {/* Pulse dots */}
        <div className="flex gap-2 mt-1" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          <span className="h-2 w-2 rounded-full bg-primary/80 animate-pulse [animation-delay:150ms]"></span>
          <span className="h-2 w-2 rounded-full bg-primary/60 animate-pulse [animation-delay:300ms]"></span>
        </div>

        {/* Caption */}
        <p className="text-sm text-muted-foreground mt-2">
          Loading amazing offers…
        </p>
      </div>
    </div>
  );
};