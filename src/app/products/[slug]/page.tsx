"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import BuyerShell from "@/app/components/BuyerShell";
import { API_ENDPOINTS } from "@/lib/api";
import { formatPrice } from "@/lib/currency";
import type { RootState, AppDispatch } from "@/store";
import { setCartItems, setError as setCartError } from "@/store/slices/cartSlice";
import type { CatalogProduct, CatalogVariant } from "@/types/catalog";

type ProductResponse = {
  success: boolean;
  product?: CatalogProduct;
  message?: string;
};

type VariantsResponse = {
  success: boolean;
  variants?: CatalogVariant[];
  message?: string;
};

export default function BuyerProductDetailPage() {
  const dispatch = useDispatch<AppDispatch>();
  const buyer = useSelector((state: RootState) => state.auth.buyer);
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [variants, setVariants] = useState<CatalogVariant[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addToCartSuccess, setAddToCartSuccess] = useState(false);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const productRes = await axios.get<ProductResponse>(
          `${API_ENDPOINTS.GET_PRODUCT_BY_SLUG}/${encodeURIComponent(slug)}`,
        );

        if (!isMounted) return;

        if (!productRes.data.success || !productRes.data.product) {
          setProduct(null);
          setVariants([]);
          setError(productRes.data.message || "Product not found");
          return;
        }

        const variantsRes = await axios.get<VariantsResponse>(
          `${API_ENDPOINTS.GET_PRODUCT_VARIANTS}/${productRes.data.product._id}`,
        );
        if (!isMounted) return;

        const nextVariants = variantsRes.data.success ? variantsRes.data.variants || [] : [];

        setProduct(productRes.data.product);
        setVariants(nextVariants);
        setSelectedVariantId(nextVariants[0]?._id || "");
        setSelectedImage(0);
      } catch {
        if (!isMounted) return;
        setProduct(null);
        setVariants([]);
        setError("Could not load product");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [slug]);

    const handleAddToCart = async () => {
      if (!buyer || !product?._id) {
        // redirect unauthenticated users to login before adding to cart
        router.push("/login");
        return;
      }

      setIsAddingToCart(true);
      try {
        const userId = (buyer as any)._id || (buyer as any).id;
        const response = await axios.post(API_ENDPOINTS.ADD_TO_CART, {
          userId,
          productId: product._id,
          quantity: 1,
        });

        if (response.data.success || response.data.data?.items) {
          dispatch(setCartItems(response.data.data.items));
          setAddToCartSuccess(true);
          setTimeout(() => setAddToCartSuccess(false), 2000);
        }
      } catch (err: any) {
        dispatch(setCartError(err.message || "Failed to add to cart"));
      } finally {
        setIsAddingToCart(false);
      }
    };

  const selectedVariant = useMemo(
    () => variants.find((variant) => variant._id === selectedVariantId) || variants[0],
    [selectedVariantId, variants],
  );

  const galleryImages = useMemo(() => {
    const variantImages = selectedVariant?.images || [];
    const productImages = product?.images || [];
    const combined = [...variantImages, ...productImages].filter((image) => image.url);
    return combined.length > 0 ? combined : [{ url: "/banner/banner1.png" }];
  }, [product?.images, selectedVariant?.images]);

  const minPrice = useMemo(() => {
    const prices = variants
      .map((variant) => Number(variant.price))
      .filter((price) => Number.isFinite(price));

    if (prices.length === 0) return product?.minPrice ?? null;
    return Math.min(...prices);
  }, [product?.minPrice, variants]);

  const colors = uniqueValues(variants.map((variant) => variant.color));
  const sizes = uniqueValues(variants.map((variant) => variant.size));

  return (
    <BuyerShell showFooter>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-shop-muted transition hover:text-foreground"
        >
          <BackIcon />
          Back to products
        </Link>

        {loading ? (
          <ProductDetailSkeleton />
        ) : error || !product ? (
          <section className="mt-6 rounded-2xl border border-shop-border bg-shop-surface-raised p-10 text-center">
            <p className="text-base font-medium text-foreground">
              {error || "Product not found"}
            </p>
            <p className="mt-2 text-sm text-shop-muted">
              The product may be inactive or unavailable.
            </p>
          </section>
        ) : (
          <section className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl border border-shop-border bg-shop-surface-raised">
                <div className="aspect-square bg-shop-surface p-6 sm:p-10">
                  <img
                    src={galleryImages[selectedImage]?.url || "/banner/banner1.png"}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>

              {galleryImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {galleryImages.map((image, index) => (
                    <button
                      key={`${image.url}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-shop-surface-raised p-2 transition ${
                        selectedImage === index
                          ? "border-shop-accent"
                          : "border-shop-border hover:border-neutral-400 dark:hover:border-neutral-600"
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img
                        src={image.url || "/banner/banner1.png"}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  {product.category?.name && <MetaPill label={product.category.name} />}
                  {product.subcategory?.name && <MetaPill label={product.subcategory.name} />}
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {product.name}
                </h1>
                <p className="mt-3 text-2xl font-semibold text-foreground">
                  {formatPrice(minPrice) || "Price unavailable"}
                </p>
                {variants.length > 1 && (
                  <p className="mt-1 text-sm text-shop-muted">
                    Starting price across {variants.length} variants
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-shop-border bg-shop-surface-raised p-5">
                <h2 className="text-sm font-semibold text-foreground">Product details</h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-shop-muted">
                  {product.description || "No description added for this product yet."}
                </p>
                {getVendorName(product.vendor) && (
                  <p className="mt-4 text-sm text-shop-muted">
                    Sold by{" "}
                    <span className="font-medium text-foreground">
                      {getVendorName(product.vendor)}
                    </span>
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-shop-border bg-shop-surface-raised p-5">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-sm font-semibold text-foreground">Variants</h2>
                  <span className="text-xs text-shop-muted">
                    {variants.length} option{variants.length === 1 ? "" : "s"}
                  </span>
                </div>

                {variants.length === 0 ? (
                  <p className="mt-4 text-sm text-shop-muted">
                    No variants are available for this product yet.
                  </p>
                ) : (
                  <>
                    {(colors.length > 0 || sizes.length > 0) && (
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {colors.length > 0 && (
                          <VariantSummary title="Colors" values={colors} />
                        )}
                        {sizes.length > 0 && (
                          <VariantSummary title="Sizes" values={sizes} />
                        )}
                      </div>
                    )}

                    <div className="mt-5 space-y-3">
                      {variants.map((variant) => {
                        const active = variant._id === selectedVariant?._id;

                        return (
                          <button
                            key={variant._id}
                            type="button"
                            onClick={() => {
                              setSelectedVariantId(variant._id);
                              setSelectedImage(0);
                            }}
                            className={`flex w-full items-center justify-between gap-4 rounded-xl border p-3 text-left transition ${
                              active
                                ? "border-shop-accent bg-emerald-50 dark:bg-emerald-950/20"
                                : "border-shop-border hover:border-neutral-400 dark:hover:border-neutral-600"
                            }`}
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-foreground">
                                {[variant.color, variant.size].filter(Boolean).join(" / ") ||
                                  "Variant"}
                              </p>
                            </div>
                            <p className="shrink-0 text-sm font-semibold text-foreground">
                              {formatPrice(variant.price) || "N/A"}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                   onClick={handleAddToCart}
                   disabled={isAddingToCart}
                   className={`auth-btn-shimmer rounded-full px-6 py-3 text-sm font-semibold text-white transition ${
                     addToCartSuccess
                       ? "bg-green-600 hover:bg-green-700"
                       : "bg-shop-accent hover:bg-shop-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
                   }`}
                >
                    {isAddingToCart ? "Adding..." : addToCartSuccess ? "Added to cart ✓" : "Add to cart"}
                </button>
                <button
                  type="button"
                  className="rounded-full border border-shop-border bg-shop-surface-raised px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Buy now
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </BuyerShell>
  );
}

function uniqueValues(values: Array<string | undefined>) {
  return Array.from(
    new Set(values.map((value) => value?.trim()).filter(Boolean) as string[]),
  );
}

function getVendorName(vendor: CatalogProduct["vendor"]) {
  if (!vendor || typeof vendor === "string") return "";
  return vendor.name || "";
}

function MetaPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-shop-border bg-shop-surface-raised px-3 py-1 text-xs font-medium text-shop-muted">
      {label}
    </span>
  );
}

function VariantSummary({ title, values }: { title: string; values: string[] }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase text-shop-muted">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.map((value) => (
          <span
            key={value}
            className="rounded-full border border-shop-border px-3 py-1 text-xs font-medium text-foreground"
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <section className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
      <div className="aspect-square animate-pulse rounded-2xl border border-shop-border bg-shop-surface-raised" />
      <div className="space-y-5">
        <div className="h-8 w-3/4 animate-pulse rounded-lg bg-shop-surface-raised" />
        <div className="h-7 w-36 animate-pulse rounded-lg bg-shop-surface-raised" />
        <div className="h-40 animate-pulse rounded-2xl bg-shop-surface-raised" />
        <div className="h-64 animate-pulse rounded-2xl bg-shop-surface-raised" />
      </div>
    </section>
  );
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 19l-7-7 7-7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
