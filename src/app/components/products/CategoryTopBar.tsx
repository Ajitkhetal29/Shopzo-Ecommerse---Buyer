"use client";

import type { Category, Subcategory } from "@/types/catalog";

type CategoryTopBarProps = {
  categories: Category[];
  subcategories: Subcategory[];
  activeCategoryId?: string;
  activeSubcategoryId?: string;
  onCategoryChange: (categoryId?: string) => void;
  onSubcategoryChange: (subcategoryId?: string) => void;
};

function pillClass(isActive: boolean) {
  return isActive
    ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
    : "border-shop-border bg-shop-surface-raised text-foreground hover:border-neutral-400 hover:bg-neutral-100 dark:hover:border-neutral-600 dark:hover:bg-neutral-800";
}

export default function CategoryTopBar({
  categories,
  subcategories,
  activeCategoryId,
  activeSubcategoryId,
  onCategoryChange,
  onSubcategoryChange,
}: CategoryTopBarProps) {
  return (
    <div className="sticky top-0 z-20 border-b border-shop-border bg-shop-surface/95 backdrop-blur supports-[backdrop-filter]:bg-shop-surface/80">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-1 flex items-center justify-between gap-4">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-shop-muted">
            Browse
          </p>
          {(activeCategoryId || activeSubcategoryId) && (
            <button
              type="button"
              onClick={() => {
                onCategoryChange(undefined);
                onSubcategoryChange(undefined);
              }}
              className="text-xs font-medium text-shop-muted underline-offset-4 transition hover:text-foreground hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => {
              onCategoryChange(undefined);
              onSubcategoryChange(undefined);
            }}
            className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition ${pillClass(!activeCategoryId)}`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              type="button"
              onClick={() => onCategoryChange(category._id)}
              className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition ${pillClass(activeCategoryId === category._id)}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {activeCategoryId && subcategories.length > 0 && (
          <div className="mt-3 flex gap-2 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => onSubcategoryChange(undefined)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition ${pillClass(!activeSubcategoryId)}`}
            >
              All in category
            </button>
            {subcategories.map((subcategory) => (
              <button
                key={subcategory._id}
                type="button"
                onClick={() => onSubcategoryChange(subcategory._id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition ${pillClass(activeSubcategoryId === subcategory._id)}`}
              >
                {subcategory.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
