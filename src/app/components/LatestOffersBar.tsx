"use client";

import { useCallback, useEffect, useState } from "react";

/** Placeholder copy — swap for API data later */
export const DEFAULT_LATEST_OFFERS: string[] = [
  "Fast & free tracked delivery on orders over £35",
  "New customers: extra 10% off your first order with code WELCOME10",
  "Flash weekend — up to 40% off selected groceries",
  "Shop seasonal bundles & save more on pantry staples",
  "Members get early access to deals every Tuesday",
];

type LatestOffersBarProps = {
  offers?: string[];
  /** Set to `false` to disable auto-rotation */
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
      className={`flex w-full items-stretch bg-[#102a52] text-white dark:bg-[#0d2244] ${className}`}
    >
      <button
        type="button"
        onClick={() => go(-1)}
        className="flex w-11 shrink-0 items-center justify-center transition-colors hover:bg-white/10 focus-visible:relative focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white/80 sm:w-12"
        aria-label="Previous offer"
      >
        <ChevronLeft className="h-5 w-5 opacity-90" />
      </button>

      <div className="flex min-h-[42px] min-w-0 flex-1 items-center justify-center px-3 py-2 sm:min-h-[44px] sm:px-4">
        <p
          key={index}
          aria-live="polite"
          className="w-full text-center text-[13px] font-medium leading-snug tracking-tight sm:text-sm md:text-[15px]"
        >
          {message}
        </p>
      </div>

      <button
        type="button"
        onClick={() => go(1)}
        className="flex w-11 shrink-0 items-center justify-center transition-colors hover:bg-white/10 focus-visible:relative focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white/80 sm:w-12"
        aria-label="Next offer"
      >
        <ChevronRight className="h-5 w-5 opacity-90" />
      </button>
    </div>
  );
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 18l6-6-6-6" />
    </svg>
  );
}
