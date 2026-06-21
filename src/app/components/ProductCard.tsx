"use client";

import { formatPrice } from "@/lib/currency";
import Link from "next/link";

type ProductCardProps = {
  id: string;
  slug?: string;
  name: string;
  image: string;
  price?: number | string | null;
  onClick?: () => void;
  className?: string;
  index?: number;
};

export default function ProductCard({
  id,
  slug,
  name,
  image,
  price,
  onClick,
  className = "",
  index = 0,
}: ProductCardProps) {
  const formattedPrice = formatPrice(price);
  const cardClassName =
    "product-card flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-shop-border bg-shop-surface-raised text-left shadow-sm transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-neutral-300 hover:shadow-lg active:translate-y-0 active:shadow-md dark:hover:border-neutral-600";
  const cardContent = (
    <>
      <div className="relative aspect-square w-full overflow-hidden bg-shop-surface">
        <img
          src={image || "/banner/banner1.png"}
          alt={name}
          className="h-full w-full object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-black/25" />

        <span className="pointer-events-none absolute bottom-3 right-3 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full border border-shop-border bg-shop-surface-raised/95 text-foreground opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowIcon />
        </span>
      </div>

      <div className="flex flex-col gap-1.5 border-t border-shop-border px-4 py-3.5">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground transition-colors duration-200 group-hover:text-shop-accent">
          {name}
        </h3>
        {formattedPrice ? (
          <p className="text-sm font-semibold tracking-tight text-foreground">
            {formattedPrice}
          </p>
        ) : (
          <p className="text-xs font-medium text-shop-muted transition-colors duration-200 group-hover:text-foreground">
            View product
          </p>
        )}
      </div>
    </>
  );

  return (
    <article
      className={`product-card-enter group flex w-full flex-col ${className}`}
      style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
    >
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className={cardClassName}
          aria-label={`View ${name}`}
        >
          {cardContent}
        </button>
      ) : (
        <Link href={`/products/${slug || id}`} className={cardClassName} aria-label={`View ${name}`}>
          {cardContent}
        </Link>
      )}
    </article>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 17L17 7M17 7H9M17 7v8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProductCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <article
      className="product-card-enter overflow-hidden rounded-2xl border border-shop-border bg-shop-surface-raised shadow-sm"
      style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
    >
      <div className="aspect-square animate-pulse bg-shop-surface" />
      <div className="space-y-2 border-t border-shop-border px-4 py-3.5">
        <div className="h-4 w-[80%] animate-pulse rounded-md bg-shop-surface" />
        <div className="h-4 w-1/3 animate-pulse rounded-md bg-shop-surface" />
      </div>
    </article>
  );
}
