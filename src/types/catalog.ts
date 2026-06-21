export type Category = {
  _id: string;
  name: string;
  slug?: string;
};

export type Subcategory = {
  _id: string;
  name: string;
  slug?: string;
  category?: Category | string;
};

export type CatalogProduct = {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  images?: { url?: string }[];
  category?: Category | null;
  subcategory?: Subcategory | null;
  vendor?: { _id: string; name?: string } | string | null;
  minPrice?: number | null;
  status?: string;
};

export type CatalogVariant = {
  _id: string;
  product?: string;
  sku?: string;
  size?: string;
  color?: string;
  price?: number | string | null;
  images?: { url?: string; public_id?: string }[];
};

export type ProductListResponse = {
  success: boolean;
  products: CatalogProduct[];
  totalCount: number;
  page: number;
  limit: number;
};

export type ProductFilters = {
  categoryId?: string;
  subcategoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
};
