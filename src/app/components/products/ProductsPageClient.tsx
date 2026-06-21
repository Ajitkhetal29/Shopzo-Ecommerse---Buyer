"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import BuyerShell from "@/app/components/BuyerShell";
import ProductCard, { ProductCardSkeleton } from "@/app/components/ProductCard";
import CategoryTopBar from "@/app/components/products/CategoryTopBar";
import FilterSideNav, {
  FiltersTriggerButton,
} from "@/app/components/products/FilterSideNav";
import ProductFiltersPanel, {
  type FilterValues,
  type SortOption,
} from "@/app/components/products/ProductFiltersPanel";
import { API_ENDPOINTS } from "@/lib/api";
import type { CatalogProduct, Category, Subcategory } from "@/types/catalog";

const PAGE_SIZE = 20;

function sortProducts(products: CatalogProduct[], sort: SortOption) {
  const list = [...products];

  if (sort === "price_asc") {
    return list.sort(
      (a, b) => (a.minPrice ?? Number.MAX_SAFE_INTEGER) - (b.minPrice ?? Number.MAX_SAFE_INTEGER),
    );
  }

  if (sort === "price_desc") {
    return list.sort(
      (a, b) => (b.minPrice ?? -1) - (a.minPrice ?? -1),
    );
  }

  return list;
}

function countActiveFilters(filters: {
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  categoryId?: string;
  subcategoryId?: string;
}) {
  let count = 0;
  if (filters.minPrice || filters.maxPrice) count += 1;
  if (filters.sort && filters.sort !== "newest") count += 1;
  if (filters.categoryId) count += 1;
  if (filters.subcategoryId) count += 1;
  return count;
}

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryId = searchParams.get("categoryId") || undefined;
  const subcategoryId = searchParams.get("subcategoryId") || undefined;
  const minPrice = searchParams.get("minPrice") || undefined;
  const maxPrice = searchParams.get("maxPrice") || undefined;
  const sort = (searchParams.get("sort") as SortOption) || "newest";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const [categories, setCategories] = useState<Category[]>([]);
  const [allSubcategories, setAllSubcategories] = useState<Subcategory[]>([]);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const subcategories = useMemo(
    () =>
      categoryId
        ? allSubcategories.filter((subcategory) => {
            const categoryRef = subcategory.category;
            if (!categoryRef) return false;
            if (typeof categoryRef === "string") return categoryRef === categoryId;
            return categoryRef._id === categoryId;
          })
        : [],
    [allSubcategories, categoryId],
  );

  const sortedProducts = useMemo(
    () => sortProducts(products, sort),
    [products, sort],
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const activeFilterCount = countActiveFilters({
    minPrice,
    maxPrice,
    sort,
    categoryId,
    subcategoryId,
  });

  const activeCategoryName = useMemo(
    () => categories.find((category) => category._id === categoryId)?.name,
    [categories, categoryId],
  );

  const activeSubcategoryName = useMemo(
    () => subcategories.find((subcategory) => subcategory._id === subcategoryId)?.name,
    [subcategories, subcategoryId],
  );

  const pageTitle = useMemo(() => {
    if (activeSubcategoryName) return activeSubcategoryName;
    if (activeCategoryName) return activeCategoryName;
    return "All products";
  }, [activeCategoryName, activeSubcategoryName]);

  const filterValues: FilterValues = {
    sort,
    minPrice,
    maxPrice,
    categoryId,
    subcategoryId,
  };

  const updateFilters = useCallback(
    (next: {
      categoryId?: string;
      subcategoryId?: string;
      minPrice?: string;
      maxPrice?: string;
      sort?: SortOption;
      page?: number;
    }) => {
      const params = new URLSearchParams();

      const nextCategoryId =
        "categoryId" in next ? next.categoryId : categoryId;
      const nextSubcategoryId =
        "subcategoryId" in next ? next.subcategoryId : subcategoryId;
      const nextMinPrice = "minPrice" in next ? next.minPrice : minPrice;
      const nextMaxPrice = "maxPrice" in next ? next.maxPrice : maxPrice;
      const nextSort = "sort" in next ? next.sort : sort;
      const nextPage = next.page ?? 1;

      if (nextCategoryId) params.set("categoryId", nextCategoryId);
      if (nextSubcategoryId) params.set("subcategoryId", nextSubcategoryId);
      if (nextMinPrice) params.set("minPrice", nextMinPrice);
      if (nextMaxPrice) params.set("maxPrice", nextMaxPrice);
      if (nextSort && nextSort !== "newest") params.set("sort", nextSort);
      if (nextPage > 1) params.set("page", String(nextPage));

      const query = params.toString();
      router.push(query ? `/products?${query}` : "/products");
    },
    [router, categoryId, subcategoryId, minPrice, maxPrice, sort],
  );

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const [categoriesRes, subcategoriesRes] = await Promise.all([
          axios.get(API_ENDPOINTS.GET_CATEGORIES),
          axios.get(API_ENDPOINTS.GET_SUBCATEGORIES),
        ]);

        if (categoriesRes.data.success) {
          setCategories(categoriesRes.data.categories || []);
        }

        if (subcategoriesRes.data.success) {
          setAllSubcategories(subcategoriesRes.data.subcategories || []);
        }
      } catch {
        setCategories([]);
        setAllSubcategories([]);
      }
    };

    loadCatalog();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(API_ENDPOINTS.GET_PRODUCTS, {
          params: {
            page,
            limit: PAGE_SIZE,
            categoryId,
            subcategoryId,
            minPrice,
            maxPrice,
          },
        });

        if (res.data.success) {
          setProducts(res.data.products || []);
          setTotalCount(res.data.totalCount || 0);
        } else {
          setProducts([]);
          setTotalCount(0);
          setError("Could not load products");
        }
      } catch {
        setProducts([]);
        setTotalCount(0);
        setError("Could not load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [page, categoryId, subcategoryId, minPrice, maxPrice]);

  return (
    <BuyerShell>
      <CategoryTopBar
        categories={categories}
        subcategories={subcategories}
        activeCategoryId={categoryId}
        activeSubcategoryId={subcategoryId}
        onCategoryChange={(nextCategoryId) =>
          updateFilters({ categoryId: nextCategoryId, subcategoryId: undefined })
        }
        onSubcategoryChange={(nextSubcategoryId) =>
          updateFilters({ subcategoryId: nextSubcategoryId })
        }
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {pageTitle}
            </h1>
            <p className="mt-1 text-sm text-shop-muted">
              {loading
                ? "Loading products..."
                : `${totalCount} product${totalCount === 1 ? "" : "s"} found`}
            </p>
          </div>

          <FiltersTriggerButton
            onClick={() => setFiltersOpen(true)}
            activeFilterCount={activeFilterCount}
          />
        </div>

        <section>
          {error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, index) => (
                <ProductCardSkeleton key={index} index={index} />
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="rounded-2xl border border-shop-border bg-shop-surface-raised p-10 text-center">
              <p className="text-base font-medium text-foreground">
                No products match your filters
              </p>
              <p className="mt-2 text-sm text-shop-muted">
                Try another category or adjust your filters.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
                {sortedProducts.map((product, index) => {
                  const imageUrl =
                    product.images?.[0]?.url || "/banner/banner1.png";

                  return (
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      slug={product.slug}
                      name={product.name}
                      image={imageUrl}
                      price={product.minPrice}
                      index={index}
                    />
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => updateFilters({ page: page - 1 })}
                    className="rounded-full border border-shop-border px-4 py-2 text-sm font-medium text-foreground transition enabled:hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:enabled:hover:bg-neutral-800"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-shop-muted">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => updateFilters({ page: page + 1 })}
                    className="rounded-full border border-shop-border px-4 py-2 text-sm font-medium text-foreground transition enabled:hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:enabled:hover:bg-neutral-800"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <FilterSideNav
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        activeFilterCount={activeFilterCount}
      >
        <ProductFiltersPanel
          open={filtersOpen}
          categories={categories}
          subcategories={allSubcategories}
          values={filterValues}
          onApply={(filters) => {
            updateFilters(filters);
            setFiltersOpen(false);
          }}
          onClear={() => {
            updateFilters({
              categoryId: undefined,
              subcategoryId: undefined,
              minPrice: undefined,
              maxPrice: undefined,
              sort: "newest",
            });
            setFiltersOpen(false);
          }}
        />
      </FilterSideNav>
    </BuyerShell>
  );
}

export default function ProductsPageClient() {
  return (
    <Suspense
      fallback={
        <BuyerShell>
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <p className="text-sm text-shop-muted">Loading products...</p>
          </main>
        </BuyerShell>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
