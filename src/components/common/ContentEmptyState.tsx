/**
 * ContentEmptyState
 * 
 * Purpose: Renders a reusable empty state message for various content areas (e.g., search results, favorites).
 * Used in: AllTools.tsx, Favorites.tsx
 * Context: Offers, Favorites
 */
import { LucideIcon } from "lucide-react";

interface ContentEmptyStateProps {
  Icon: LucideIcon;
  title: string;
  message: string;
}

export const ContentEmptyState = ({ Icon, title, message }: ContentEmptyStateProps) => {
  return (
    <div className="text-center py-20 border-2 border-dashed rounded-lg mt-6">
      <Icon className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold text-center">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground text-center mx-auto max-w-md">{message}</p>
    </div>
  );
};