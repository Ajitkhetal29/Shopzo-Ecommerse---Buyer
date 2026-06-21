"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type MobileBottomNavProps = {
  cartCount?: number;
};

const NAV_ITEMS = [
  { id: "home", href: "/dashboard", label: "Home", icon: HomeIcon },
  { id: "search", href: null, label: "Search", icon: SearchIcon },
  { id: "cart", href: "#", label: "Cart", icon: CartIcon },
  { id: "profile", href: "/profile", label: "Profile", icon: ProfileIcon },
] as const;

export default function MobileBottomNav({ cartCount = 0 }: MobileBottomNavProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchOpen) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSearchOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [searchOpen]);

  const isActive = (href: string | null, id: string) => {
    if (id === "search") return searchOpen;
    if (!href || href === "#") return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-shop-border bg-shop-surface-raised/95 backdrop-blur-md md:hidden"
        aria-label="Mobile navigation"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2 pt-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href, item.id);
            const Icon = item.icon;

            if (item.id === "search") {
              return (
                <li key={item.id} className="flex-1">
                  <button
                    type="button"
                    onClick={() => setSearchOpen(true)}
                    className={`flex w-full flex-col items-center gap-1 px-2 py-2.5 text-[10px] font-medium transition ${
                      active ? "text-foreground" : "text-shop-muted"
                    }`}
                    aria-label="Search products"
                    aria-expanded={searchOpen}
                  >
                    <Icon className="h-5 w-5" active={active} />
                    {item.label}
                  </button>
                </li>
              );
            }

            return (
              <li key={item.id} className="flex-1">
                <Link
                  href={item.href!}
                  className={`relative flex w-full flex-col items-center gap-1 px-2 py-2.5 text-[10px] font-medium transition ${
                    active ? "text-foreground" : "text-shop-muted"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="relative">
                    <Icon className="h-5 w-5" active={active} />
                    {item.id === "cart" && cartCount > 0 && (
                      <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-shop-accent px-1 text-[9px] font-bold text-white">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {searchOpen && (
        <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true" aria-label="Search">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
          />

          <div className="relative mx-4 mt-[max(1rem,env(safe-area-inset-top))] rounded-2xl border border-shop-border bg-shop-surface-raised p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <SearchIcon className="h-5 w-5 shrink-0 text-shop-muted" active={false} />
              <input
                ref={inputRef}
                type="search"
                placeholder="Search products..."
                className="min-w-0 flex-1 bg-transparent text-base text-foreground placeholder:text-shop-muted outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="shrink-0 text-sm font-medium text-shop-muted transition hover:text-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function HomeIcon({ className, active }: { className?: string; active?: boolean }) {
  return (
    <svg className={className} fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      {active ? (
        <path d="M11.47 3.841a1.25 1.25 0 0 1 1.06 0l8.5 4.5A1.25 1.25 0 0 1 21 9.25V19a2 2 0 0 1-2 2h-4.25a.75.75 0 0 1-.75-.75V14a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v6.25a.75.75 0 0 1-.75.75H5a2 2 0 0 1-2-2V9.25a1.25 1.25 0 0 1 .47-.909l8.5-4.5z" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z" />
      )}
    </svg>
  );
}

function SearchIcon({ className, active }: { className?: string; active?: boolean }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={active ? 2.25 : 1.75}
        d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
      />
    </svg>
  );
}

function CartIcon({ className, active }: { className?: string; active?: boolean }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={active ? 2.25 : 1.75}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5M7 13l-1.293 2.293c-.63.63-.184 1.707.707 1.707H19M17 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM9 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0"
      />
    </svg>
  );
}

function ProfileIcon({ className, active }: { className?: string; active?: boolean }) {
  return (
    <svg className={className} fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      {active ? (
        <path d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm-7 19a7 7 0 0 1 14 0 .75.75 0 0 1-.75.75H5.75A.75.75 0 0 1 5 21z" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 14a4 4 0 10-8 0M5 21a7 7 0 0114 0" />
      )}
    </svg>
  );
}
