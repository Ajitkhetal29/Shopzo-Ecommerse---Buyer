"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/api";
import ProductCard from "./ProductCard";
import { buildProductsHref } from "@/lib/products";

type Subcategory = { _id: string; name: string };

function pickRandomSubcategory(subcategories: Subcategory[]) {
  if (subcategories.length === 0) return null;
  return subcategories[Math.floor(Math.random() * subcategories.length)];
}

function shuffleSubcategories(subcategories: Subcategory[]) {
  return [...subcategories].sort(() => Math.random() - 0.5);
}

export default function ProductCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<{ id: string; slug: string; name: string; image: string }[]>([]);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const subRes = await axios.get(API_ENDPOINTS.GET_SUBCATEGORIES);

        if (!subRes.data.success) {
          setItems([]);
          return;
        }

        const subcategories: Subcategory[] = subRes.data.subcategories || [];
        if (subcategories.length === 0) {
          setItems([]);
          return;
        }

        for (const sub of shuffleSubcategories(subcategories)) {
          const res = await axios.get(API_ENDPOINTS.PRODUCTS_BY_SUBCATEGORY, {
            params: { subcategoryName: sub.name },
          });

          if (res.data.success && (res.data.products || []).length > 0) {
            setSubcategoryName(sub.name);
            setSubcategoryId(sub._id);
            setItems(
              res.data.products.map((p: { _id: string; slug: string; name: string; image: string }) => ({
                id: p._id,
                slug: p.slug,
                name: p.name,
                image: p.image || "/banner/banner1.png",
              }))
            );
            return;
          }
        }

        const fallback = pickRandomSubcategory(subcategories);
        if (fallback) {
          setSubcategoryName(fallback.name);
          setSubcategoryId(fallback._id);
        }
        setItems([]);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <section className="border-t border-shop-border bg-shop-surface-raised px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-shop-muted">Loading products...</p>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="border-t border-shop-border bg-shop-surface-raised px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Trending in {subcategoryName}
            </h2>
            <p className="mt-1 text-sm text-shop-muted">
              Popular picks from this category.
            </p>
          </div>
          <Link
            href={buildProductsHref({ subcategoryId: subcategoryId || undefined })}
            className="hidden shrink-0 text-sm text-shop-muted underline-offset-4 transition hover:text-foreground hover:underline sm:inline"
          >
            View all
          </Link>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item, index) => (
            <div key={item.id} className="w-44 shrink-0 sm:w-52">
              <ProductCard
                id={item.id}
                slug={item.slug}
                name={item.name}
                image={item.image}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
