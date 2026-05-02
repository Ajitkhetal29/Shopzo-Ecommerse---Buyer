"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

const TOP_LINKS = [
  { href: "#", label: "About us" },
  { href: "#", label: "FAQs" },
  { href: "#", label: "News & articles" },
  { href: "#", label: "Recipes" },
] as const;

const LANGUAGE_OPTIONS = [
  { value: "en-usd", label: "English (USD $)" },
  { value: "en-gbp", label: "English (GBP £)" },
  { value: "es-usd", label: "Español (USD $)" },
] as const;

type BuyerSiteHeaderProps = {
  contactEmail?: string;
  contactPhone?: string;
  cartCount?: number;
};

export default function BuyerSiteHeader({
  contactEmail = "hello@shapzo.com",
  contactPhone = "(+1) 234 567 8901",
  cartCount = 0,
}: BuyerSiteHeaderProps) {
  const [locale, setLocale] = useState<string>(LANGUAGE_OPTIONS[0].value);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/90 bg-white shadow-[0_1px_0_rgb(0_0_0/0.03)] dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
      {/* Row 1 — utility */}
      <div className="border-b border-stone-100 dark:border-zinc-800/80">
        <div className="flex w-full flex-col gap-2 px-4 py-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6 sm:gap-y-1 sm:px-6 lg:px-10">
          <nav
            className="flex flex-wrap items-center gap-x-1 gap-y-1 text-[11px] text-stone-600 sm:text-xs dark:text-zinc-400"
            aria-label="Utility links"
          >
            {TOP_LINKS.map((item, i) => (
              <span key={item.href + item.label} className="flex items-center">
                {i > 0 && (
                  <span className="mx-1.5 text-stone-300 dark:text-zinc-600" aria-hidden>
                    ·
                  </span>
                )}
                <Link
                  href={item.href}
                  className="transition hover:text-stone-900 dark:hover:text-zinc-100"
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-stone-600 sm:text-xs dark:text-zinc-400">
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-1.5 transition hover:text-stone-900 dark:hover:text-zinc-100"
            >
              <MailIcon className="h-3.5 w-3.5 shrink-0 opacity-70" />
              <span className="truncate">{contactEmail}</span>
            </a>
            <a
              href={`tel:${contactPhone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-1.5 transition hover:text-stone-900 dark:hover:text-zinc-100"
            >
              <PhoneIcon className="h-3.5 w-3.5 shrink-0 opacity-70" />
              <span>{contactPhone}</span>
            </a>
            <label className="inline-flex items-center gap-1.5">
              <GlobeIcon className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
              <span className="sr-only">Language and currency</span>
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="max-w-[11rem] cursor-pointer rounded-md border border-stone-200 bg-white py-0.5 pr-6 pl-1 text-[11px] text-stone-800 focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400 sm:text-xs dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
              >
                {LANGUAGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* Row 2 — main */}
      <div className="w-full px-4 py-3 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <div className="flex min-w-0 items-center gap-3 md:shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md bg-[#102a52] px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0d2244] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#102a52] dark:bg-[#1e3a5f] dark:hover:bg-[#102a52]"
              aria-expanded={menuOpen}
              aria-controls="buyer-mobile-drawer"
            >
              <MenuIcon className="h-5 w-5" />
              Menu
            </button>

            <Link
              href="/dashboard"
              className="flex shrink-0 items-baseline gap-0 font-semibold tracking-tight"
            >
              <span className="text-2xl text-orange-500 md:text-[1.65rem]">S</span>
              <span className="text-2xl text-[#102a52] md:text-[1.65rem] dark:text-zinc-100">
                hapzo
              </span>
              <span className="text-xl font-bold text-[#102a52] dark:text-zinc-100">.</span>
            </Link>

            <div className="ml-auto flex items-center gap-1 md:hidden">
              <IconButton label="Account" href="#">
                <UserIcon className="h-5 w-5" />
              </IconButton>
              <CartButton count={cartCount} />
            </div>
          </div>

          <div className="min-w-0 flex-1 md:order-none">
            <label className="relative block">
              <span className="sr-only">Search products</span>
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-zinc-500" />
              <input
                type="search"
                placeholder="What are you searching for?"
                className="w-full rounded-full border border-stone-200 bg-stone-50 py-2.5 pr-10 pl-10 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition focus:border-[#102a52]/40 focus:bg-white focus:ring-2 focus:ring-[#102a52]/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-500/30"
              />
            </label>
          </div>

          <div className="hidden items-center gap-1 md:flex md:shrink-0">
            <IconButton label="Account" href="#">
              <UserIcon className="h-5 w-5" />
            </IconButton>
            <CartButton count={cartCount} />
          </div>
        </div>

        {/* Placeholder drawer — wire to real nav later */}
        {menuOpen && (
          <div
            id="buyer-mobile-drawer"
            className="mt-3 rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600 md:hidden dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
            role="region"
            aria-label="Menu placeholder"
          >
            Navigation links will go here.
          </div>
        )}
      </div>
    </header>
  );
}

function IconButton({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex h-10 w-10 items-center justify-center rounded-full text-stone-700 transition hover:bg-stone-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
      aria-label={label}
    >
      {children}
    </Link>
  );
}

function CartButton({ count }: { count: number }) {
  return (
    <Link
      href="#"
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-stone-700 transition hover:bg-stone-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
      aria-label={`Shopping cart, ${count} items`}
    >
      <CartIcon className="h-5 w-5" />
      <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
        {count > 99 ? "99+" : count}
      </span>
    </Link>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 14a4 4 0 10-8 0M5 21a7 7 0 0114 0" />
    </svg>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.293 2.293c-.63.63-.184 1.707.707 1.707H19M17 17a2 2 0 104 0 2 2 0 00-4 0zM9 17a2 2 0 104 0 2 2 0 00-4 0"
      />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
