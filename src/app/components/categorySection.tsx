"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/api";
import CategoryCard from "./categoryCard";

type ShowcaseSection = {
  category: { _id: string; name: string; slug: string };
  products: {
    _id: string;
    name: string;
    images?: { url?: string }[];
    subcategory?: { name: string } | null;
  }[];
};

export default function CategorySection({
  overlapBanner = true,
}: {
  overlapBanner?: boolean;
}) {
  const [sections, setSections] = useState<ShowcaseSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadShowcase = async () => {
      try {
        setIsLoading(true);
        setError("");
        const res = await axios.get(API_ENDPOINTS.HOME_SHOWCASE);
        if (res.data.success) {
          setSections(res.data.sections || []);
        } else {
          setError("Could not load categories");
        }
      } catch {
        setError("Could not load categories");
      } finally {
        setIsLoading(false);
      }
    };

    loadShowcase();
  }, []);

  if (isLoading) {
    return (
      <section className="bg-shop-surface px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-shop-muted">Loading collections...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-shop-surface px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  if (sections.length === 0) {
    return (
      <section className="bg-shop-surface px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-shop-muted">No products found yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`bg-shop-surface px-4 py-10 sm:px-6 lg:px-8 ${
        overlapBanner ? "mt-2 md:-mt-12" : ""
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Collections
          </h2>
          <p className="mt-1 text-sm text-shop-muted">
            Curated picks across our top categories.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {sections.map((section) => (
            <CategoryCard
              key={section.category._id}
              title={section.category.name}
              categoryId={section.category._id}
              products={section.products}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
