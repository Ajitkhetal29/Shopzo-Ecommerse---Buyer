"use client";

import Image from "next/image";
import Link from "next/link";

type SingleBannerProps = {
  src?: string;
  alt?: string;
  href?: string;
  title?: string;
  description?: string;
};

const DEFAULT_IMAGE = "/banner/cat_explore.png";

export default function SingleBanner({
  src = DEFAULT_IMAGE,
  alt = "Explore every category",
  href = "#",
  title = "Explore every category",
  description = "Find something new across our full catalog.",
}: SingleBannerProps = {}) {
  const content = (
    <section className="bg-shop-surface px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-2xl border border-shop-border bg-shop-surface-raised">
          <div className="grid items-center gap-6 p-6 sm:p-8 lg:grid-cols-2 lg:gap-10 lg:p-10">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {title}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-shop-muted sm:text-base">
                {description}
              </p>
              <span className="mt-6 inline-flex items-center text-sm font-medium text-foreground underline-offset-4 group-hover:underline">
                Explore now →
              </span>
            </div>

            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-shop-surface">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  if (href) {
    return (
      <Link href={href} className="group block" aria-label={alt}>
        {content}
      </Link>
    );
  }

  return content;
}
