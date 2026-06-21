"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";

type ShowcaseProduct = {
  _id: string;
  name: string;
  slug?: string;
  images?: { url?: string }[];
  subcategory?: { name: string } | null;
};

export default function CategoryCard({
  title,
  products,
  categoryId,
}: {
  title: string;
  products: ShowcaseProduct[];
  categoryId?: string;
}) {
  return (
    <article className="rounded-2xl border border-shop-border bg-shop-surface-raised p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
          {title}
        </h2>
        <Link
          href={categoryId ? `/products?categoryId=${categoryId}` : "/products"}
          className="shrink-0 text-sm text-shop-muted underline-offset-4 transition hover:text-foreground hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((item, index) => {
          const imageUrl = item.images?.[0]?.url || "/banner/banner1.png";

          return (
            <ProductCard
              key={item._id}
              id={item._id}
              slug={item.slug}
              name={item.subcategory?.name || item.name}
              image={imageUrl}
              index={index}
            />
          );
        })}
      </div>
    </article>
  );
}
