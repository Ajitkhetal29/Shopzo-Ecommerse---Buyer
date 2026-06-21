"use client";

import Image from "next/image";
import Link from "next/link";

type BannerProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  imageSrc?: string;
  imageAlt?: string;
};

export default function Banner({
  eyebrow = "New season",
  title = "Everything you need, thoughtfully curated",
  description = "Discover quality products across every category — delivered fast, styled simply.",
  ctaLabel = "Shop now",
  ctaHref = "#",
  secondaryLabel = "Browse categories",
  secondaryHref = "#",
  imageSrc = "/banner/banner1.png",
  imageAlt = "Featured products collection",
}: BannerProps) {
  return (
    <section className="border-b border-shop-border bg-shop-surface-raised" aria-label="Featured collection">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:py-20">
        <div className="flex flex-col justify-center lg:max-w-xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-shop-muted">
            {eyebrow}
          </p>

          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {title}
          </h1>

          <p className="mt-4 max-w-md text-base leading-relaxed text-shop-muted sm:text-lg">
            {description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
            >
              {ctaLabel}
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center rounded-full border border-shop-border px-6 py-3 text-sm font-medium text-foreground transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-shop-surface sm:aspect-[5/4] lg:aspect-square">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
