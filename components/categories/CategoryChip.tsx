'use client';

/**
 * Renders a single category chip, used within the CategoryGrid.
 */
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/types";
import { trackEvent } from "@/lib/analytics";
import * as LucideIcons from "lucide-react";

interface CategoryChipProps {
  category: Category;
  count: number;
}

export const CategoryChip = ({ category, count }: CategoryChipProps) => {
  const handleCategoryClick = () => {
    trackEvent("category_click", { category: category.name });
  };

  // Resolve icon component from string name
  const IconComponent = (LucideIcons as any)[category.icon] || LucideIcons.Package;

  return (
    <Link
      href={`/tools?category=${category.id}`}
      key={category.id}
      className="relative py-4 px-3 md:py-5 md:px-6 bg-muted rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 ease-out flex flex-col items-center justify-center group min-h-[100px] text-center hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]"
      onClick={handleCategoryClick}
    >
      {count > 0 && (
        <Badge variant="secondary" className="absolute top-2 right-2 px-1.5 text-xs font-semibold transition-transform duration-300 group-hover:scale-110">
          {count}
        </Badge>
      )}
      <IconComponent className="h-7 w-7 mb-3 text-muted-foreground group-hover:text-primary-foreground transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110" />
      <span className="font-medium text-sm transition-transform duration-300">{category.name}</span>
    </Link>
  );
};