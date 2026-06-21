export function buildProductsHref(filters: {
  categoryId?: string;
  subcategoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}) {
  const params = new URLSearchParams();
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  if (filters.subcategoryId) params.set("subcategoryId", filters.subcategoryId);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.sort && filters.sort !== "newest") params.set("sort", filters.sort);
  const query = params.toString();
  return query ? `/products?${query}` : "/products";
}
