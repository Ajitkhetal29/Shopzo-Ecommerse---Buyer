"use client";

import { useCallback, useEffect, useState } from "react";

export const DEFAULT_LATEST_OFFERS: string[] = [
  "Free delivery on orders over Rs 999",
  "10% off your first order with code WELCOME10",
  "Up to 40% off selected items this weekend",
];

type LatestOffersBarProps = {
  offers?: string[];
  autoRotateMs?: number | false;
  className?: string;
};

export default function LatestOffersBar({
  offers = DEFAULT_LATEST_OFFERS,
  autoRotateMs = 6000,
  className = "",
}: LatestOffersBarProps) {
  const [index, setIndex] = useState(0);
  const count = offers.length;

  const go = useCallback(
    (dir: -1 | 1) => {
      if (count === 0) return;
      setIndex((i) => (i + dir + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (count <= 1 || autoRotateMs === false) return;
    const id = window.setInterval(() => go(1), autoRotateMs);
    return () => window.clearInterval(id);
  }, [count, autoRotateMs, go]);

  if (count === 0) return null;

  const message = offers[index] ?? "";

  return (
    <div
      data-offers-bar
      role="region"
      aria-roledescription="carousel"
      aria-label="Latest offers"
      className={`border-b border-shop-border bg-shop-surface ${className}`}
    >
      <div className="mx-auto flex max-w-7xl items-center px-4 py-2.5 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => go(-1)}
          className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-shop-muted transition hover:bg-neutral-100 hover:text-foreground dark:hover:bg-neutral-800"
          aria-label="Previous offer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <p
          key={index}
          aria-live="polite"
          className="min-w-0 flex-1 text-center text-xs text-shop-muted sm:text-sm"
        >
          {message}
        </p>

        <button
          type="button"
          onClick={() => go(1)}
          className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-shop-muted transition hover:bg-neutral-100 hover:text-foreground dark:hover:bg-neutral-800"
          aria-label="Next offer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="m9 18 6-6-6-6" />
    </svg>
  );
}
