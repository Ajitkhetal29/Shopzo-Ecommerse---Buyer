"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { useTheme } from "next-themes";

const TOP_LINKS = [
  { href: "#", label: "About us" },
  { href: "#", label: "FAQs" },
  { href: "#", label: "News & articles" },
  { href: "#", label: "Recipes" },
] as const;

const LANGUAGE_OPTIONS = [
  { value: "en-usd", label: "English (USD $)" },
  { value: "en-gbp", label: "English (GBP GBP)" },
  { value: "es-usd", label: "Spanish (USD $)" },
] as const;

type BuyerSiteHeaderProps = {
  contactEmail?: string;
  contactPhone?: string;
  cartCount?: number;
};

export default function BuyerSiteHeader({
  contactEmail = "hello@shopzo.com",
  contactPhone = "(+1) 234 567 8901",
  cartCount = 0,
}: BuyerSiteHeaderProps) {
  const [locale, setLocale] = useState<string>(LANGUAGE_OPTIONS[0].value);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="border-b border-slate-100 bg-[#f7f4ee] dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex w-full flex-col gap-2 px-4 py-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6 sm:gap-y-1 sm:px-6 lg:px-10">
          <nav
            className="flex flex-wrap items-center gap-x-1 gap-y-1 text-[11px] text-slate-600 sm:text-xs dark:text-zinc-400"
            aria-label="Utility links"
          >
            {TOP_LINKS.map((item, i) => (
              <span key={item.href + item.label} className="flex items-center">
                {i > 0 && (
                  <span className="mx-1.5 text-slate-300 dark:text-zinc-700" aria-hidden>
                    /
                  </span>
                )}
                <Link
                  href={item.href}
                  className="transition hover:text-slate-950 dark:hover:text-zinc-100"
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 sm:text-xs dark:text-zinc-400">
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-1.5 transition hover:text-slate-950 dark:hover:text-zinc-100"
            >
              <MailIcon className="h-3.5 w-3.5 shrink-0 opacity-70" />
              <span className="truncate">{contactEmail}</span>
            </a>
            <a
              href={`tel:${contactPhone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-1.5 transition hover:text-slate-950 dark:hover:text-zinc-100"
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
                className="max-w-[11rem] cursor-pointer rounded-md border border-slate-200 bg-white py-0.5 pl-1 pr-6 text-[11px] text-slate-800 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 sm:text-xs dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/10"
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

      <div className="w-full px-4 py-3 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <div className="flex min-w-0 items-center gap-3 md:shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md bg-slate-950 px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
              aria-expanded={menuOpen}
              aria-controls="buyer-mobile-drawer"
            >
              <MenuIcon className="h-5 w-5" />
              Menu
            </button>

            <Link
              href="/dashboard"
              className="group flex h-10 shrink-0 items-center rounded-md px-1.5 transition hover:bg-slate-100 dark:hover:bg-zinc-900"
              aria-label="Shopzo dashboard"
            >
              <Image
                src="/shopzo_logo_tp.png"
                alt="Shopzo"
                width={118}
                height={40}
                priority
                className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </Link>

            <div className="ml-auto flex items-center gap-1 md:hidden">
              <IconButton label="Account" href="#">
                <UserIcon className="h-5 w-5" />
              </IconButton>
              <CartButton count={cartCount} />
              <ThemeToggleButton />
            </div>
          </div>

          <div className="min-w-0 flex-1 md:order-none">
            <label className="relative block">
              <span className="sr-only">Search products</span>
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
              <input
                type="search"
                placeholder="Search products, brands, and categories"
                className="w-full rounded-md border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm text-slate-950 placeholder:text-slate-400 outline-none transition focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/10"
              />
            </label>
          </div>

          <div className="hidden items-center gap-1 md:flex md:shrink-0">
            <IconButton label="Account" href="#">
              <UserIcon className="h-5 w-5" />
            </IconButton>
            <CartButton count={cartCount} />
            <ThemeToggleButton />
          </div>
        </div>

        {menuOpen && (
          <div
            id="buyer-mobile-drawer"
            className="mt-3 rounded-md border border-slate-200 bg-[#f7f4ee] p-4 text-sm text-slate-600 md:hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
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
      className="flex h-10 w-10 items-center justify-center rounded-md text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
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
      className="relative flex h-10 w-10 items-center justify-center rounded-md text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
      aria-label={`Shopping cart, ${count} items`}
    >
      <CartIcon className="h-5 w-5" />
      <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white dark:bg-cyan-500 dark:text-zinc-950">
        {count > 99 ? "99+" : count}
      </span>
    </Link>
  );
}

function ThemeToggleButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));

    return () => cancelAnimationFrame(frame);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-emerald-700/30 hover:bg-slate-50 hover:text-slate-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-cyan-400/40 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
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
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5M7 13l-1.293 2.293c-.63.63-.184 1.707.707 1.707H19M17 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM9 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0"
      />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 0 1 2 2v1a2 2 0 0 0 2 2 2 2 0 0 1 2 2v2.945M8 3.935V5.5A2.5 2.5 0 0 0 10.5 8h.5a2 2 0 0 1 2 2 2 2 0 1 0 4 0 2 2 0 0 1 2-2h1.064M15 20.488V18a2 2 0 0 1 2-2h3.064M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364-.707-.707M6.343 6.343l-.707-.707m12.728 0-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"
      />
    </svg>
  );
}
