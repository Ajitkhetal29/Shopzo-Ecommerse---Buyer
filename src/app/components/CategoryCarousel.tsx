"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/api";
import { buildProductsHref } from "@/lib/products";

type Category = {
  _id: string;
  name: string;
  slug: string;
};

export default function CategoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(API_ENDPOINTS.GET_CATEGORIES);

        if (res.data.success) {
          setCategories(res.data.categories || []);
        } else {
          setError("Could not load categories");
        }
      } catch {
        setError("Could not load categories");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <section className="border-t border-shop-border bg-shop-surface px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-shop-muted">Loading categories...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="border-t border-shop-border bg-shop-surface px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="border-t border-shop-border bg-shop-surface px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-shop-muted">No categories found yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-shop-border bg-shop-surface px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Categories
          </h2>
          <p className="mt-1 text-sm text-shop-muted">
            Browse by what you&apos;re looking for.
          </p>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((category) => (
            <Link
              key={category._id}
              href={buildProductsHref({ categoryId: category._id })}
              className="shrink-0 rounded-full border border-shop-border bg-shop-surface-raised px-5 py-2.5 text-sm font-medium text-foreground transition hover:border-neutral-400 hover:bg-neutral-100 dark:hover:border-neutral-600 dark:hover:bg-neutral-800"
              aria-label={`Browse ${category.name}`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
