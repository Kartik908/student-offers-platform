

/**
 * Renders the grid of category chips on the homepage.
 */
import { Category } from "@/types";
import { CategoryChip } from "./CategoryChip";

interface CategoryGridProps {
  categories: Category[];
  categoryCounts: Record<string, number>;
}

export const CategoryGrid = ({ categories, categoryCounts }: CategoryGridProps) => {
  return (
    <section className="py-8 sm:py-10 md:py-12">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">Browse by Category</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category) => (
            <CategoryChip
              key={category.id}
              category={category}
              count={categoryCounts[category.id] || 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};