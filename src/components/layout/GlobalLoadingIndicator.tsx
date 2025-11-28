/**
 * A subtle global loading indicator that shows when data is being refreshed
 */
import { useIsFetching } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

export const GlobalLoadingIndicator = () => {
  const isFetching = useIsFetching();

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 h-0.5 bg-primary z-50 transition-all duration-300 ease-out",
        isFetching > 0 ? "opacity-100 animate-pulse" : "opacity-0"
      )}
      style={{
        background: isFetching > 0 
          ? 'linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)' 
          : undefined,
        backgroundSize: '200% 100%',
        animation: isFetching > 0 
          ? 'loading-bar 2s ease-in-out infinite' 
          : undefined,
      }}
    />
  );
};