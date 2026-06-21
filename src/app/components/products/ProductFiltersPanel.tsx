"use client";

import { useEffect, useMemo, useState } from "react";
import type { Category, Subcategory } from "@/types/catalog";

export type SortOption = "newest" | "price_asc" | "price_desc";

export type FilterValues = {
  sort?: SortOption;
  minPrice?: string;
  maxPrice?: string;
  categoryId?: string;
  subcategoryId?: string;
};

type ProductFiltersPanelProps = {
  open: boolean;
  categories: Category[];
  subcategories: Subcategory[];
  values: FilterValues;
  onApply: (filters: FilterValues) => void;
  onClear: () => void;
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

const PRICE_PRESETS = [
  { label: "Under Rs 500", minPrice: "", maxPrice: "500" },
  { label: "Rs 500 – 2,000", minPrice: "500", maxPrice: "2000" },
  { label: "Rs 2,000 – 10,000", minPrice: "2000", maxPrice: "10000" },
  { label: "Over Rs 10,000", minPrice: "10000", maxPrice: "" },
];

export default function ProductFiltersPanel({
  open,
  categories,
  subcategories,
  values,
  onApply,
  onClear,
}: ProductFiltersPanelProps) {
  const [local, setLocal] = useState<FilterValues>(values);
  const [openSections, setOpenSections] = useState({
    sort: true,
    price: true,
    category: true,
    subcategory: true,
  });

  useEffect(() => {
    if (open) {
      setLocal(values);
    }
  }, [open, values]);

  const filteredSubcategories = useMemo(() => {
    if (!local.categoryId) return subcategories;
    return subcategories.filter((subcategory) => {
      const categoryRef = subcategory.category;
      if (!categoryRef) return true;
      if (typeof categoryRef === "string") return categoryRef === local.categoryId;
      return categoryRef._id === local.categoryId;
    });
  }, [subcategories, local.categoryId]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const setPricePreset = (minPrice: string, maxPrice: string) => {
    setLocal((prev) => ({ ...prev, minPrice, maxPrice }));
  };

  const isPresetActive = (minPrice: string, maxPrice: string) =>
    (local.minPrice || "") === minPrice && (local.maxPrice || "") === maxPrice;

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-3">
        <FilterSection
          title="Sort by"
          open={openSections.sort}
          onToggle={() => toggleSection("sort")}
        >
          <div className="space-y-2">
            {SORT_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent px-2 py-2 transition hover:bg-shop-surface-raised"
              >
                <input
                  type="radio"
                  name="sort"
                  checked={(local.sort || "newest") === option.value}
                  onChange={() =>
                    setLocal((prev) => ({ ...prev, sort: option.value }))
                  }
                  className="h-4 w-4 accent-neutral-900 dark:accent-neutral-100"
                />
                <span className="text-sm text-foreground">{option.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection
          title="Price range"
          open={openSections.price}
          onToggle={() => toggleSection("price")}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {PRICE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setPricePreset(preset.minPrice, preset.maxPrice)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    isPresetActive(preset.minPrice, preset.maxPrice)
                      ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                      : "border-shop-border bg-shop-surface-raised text-foreground hover:border-neutral-400"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-xs text-shop-muted">Min</span>
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={local.minPrice || ""}
                  onChange={(event) =>
                    setLocal((prev) => ({ ...prev, minPrice: event.target.value }))
                  }
                  className="w-full rounded-xl border border-shop-border bg-shop-surface px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-neutral-400"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs text-shop-muted">Max</span>
                <input
                  type="number"
                  min={0}
                  placeholder="Any"
                  value={local.maxPrice || ""}
                  onChange={(event) =>
                    setLocal((prev) => ({ ...prev, maxPrice: event.target.value }))
                  }
                  className="w-full rounded-xl border border-shop-border bg-shop-surface px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-neutral-400"
                />
              </label>
            </div>
          </div>
        </FilterSection>

        <FilterSection
          title="Category"
          open={openSections.category}
          onToggle={() => toggleSection("category")}
        >
          <div className="max-h-48 space-y-1 overflow-y-auto pr-1">
            <FilterRadio
              label="All categories"
              checked={!local.categoryId}
              onChange={() =>
                setLocal((prev) => ({
                  ...prev,
                  categoryId: undefined,
                  subcategoryId: undefined,
                }))
              }
            />
            {categories.map((category) => (
              <FilterRadio
                key={category._id}
                label={category.name}
                checked={local.categoryId === category._id}
                onChange={() =>
                  setLocal((prev) => ({
                    ...prev,
                    categoryId: category._id,
                    subcategoryId: undefined,
                  }))
                }
              />
            ))}
          </div>
        </FilterSection>

        {local.categoryId && filteredSubcategories.length > 0 && (
          <FilterSection
            title="Subcategory"
            open={openSections.subcategory}
            onToggle={() => toggleSection("subcategory")}
          >
            <div className="max-h-48 space-y-1 overflow-y-auto pr-1">
              <FilterRadio
                label="All subcategories"
                checked={!local.subcategoryId}
                onChange={() =>
                  setLocal((prev) => ({ ...prev, subcategoryId: undefined }))
                }
              />
              {filteredSubcategories.map((subcategory) => (
                <FilterRadio
                  key={subcategory._id}
                  label={subcategory.name}
                  checked={local.subcategoryId === subcategory._id}
                  onChange={() =>
                    setLocal((prev) => ({
                      ...prev,
                      subcategoryId: subcategory._id,
                    }))
                  }
                />
              ))}
            </div>
          </FilterSection>
        )}
      </div>

      <div className="mt-auto space-y-2 border-t border-shop-border pt-4">
        <button
          type="button"
          onClick={() =>
            onApply({
              sort: local.sort || "newest",
              minPrice: local.minPrice?.trim() || undefined,
              maxPrice: local.maxPrice?.trim() || undefined,
              categoryId: local.categoryId,
              subcategoryId: local.subcategoryId,
            })
          }
          className="w-full rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
        >
          Apply filters
        </button>
        <button
          type="button"
          onClick={onClear}
          className="w-full rounded-full border border-shop-border px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-shop-border bg-shop-surface-raised">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <span
          className={`text-shop-muted transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <ChevronIcon />
        </span>
      </button>
      {open && <div className="border-t border-shop-border px-4 pb-4 pt-3">{children}</div>}
    </div>
  );
}

function FilterRadio({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-shop-surface">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-neutral-900 dark:accent-neutral-100"
      />
      <span className="text-sm text-foreground">{label}</span>
    </label>
  );
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
