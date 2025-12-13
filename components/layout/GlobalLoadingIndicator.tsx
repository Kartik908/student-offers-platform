'use client';

/**
 * A subtle global loading indicator that shows when data is being refreshed
 * Only shows when QueryClient is available (admin pages)
 */
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

// Hook that safely checks for QueryClient
function useSafeIsFetching(): number {
  try {
    // This will throw if no QueryClient is available
    useQueryClient();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useIsFetching();
  } catch {
    // No QueryClient available, return 0
    return 0;
  }
}

export const GlobalLoadingIndicator = () => {
  const isFetching = useSafeIsFetching();

  // Don't render anything if no QueryClient
  if (isFetching === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 h-0.5 bg-primary z-50 transition-all duration-300 ease-out",
        isFetching > 0 ? "opacity-100 animate-pulse" : "opacity-0"
      )}
      style={{
        backgroundImage: isFetching > 0
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