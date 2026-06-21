"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { AppDispatch, RootState } from "@/store";
import ThemeToggle from "@/app/components/ThemeToggle";
import { logout, setBuyer } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/api";

type BuyerSiteHeaderProps = {
  cartCount?: number;
};

export default function BuyerSiteHeader({ cartCount = 0 }: BuyerSiteHeaderProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const buyer = useSelector((state: RootState) => state.auth.buyer);

  useEffect(() => {
    if (buyer) return;

    let isMounted = true;

    const verifyAuth = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.CURRENT_USER, {
          withCredentials: true,
        });

        if (isMounted && res.data.success && res.data.user) {
          dispatch(setBuyer(res.data.user));
        } else if (isMounted) {
          router.push("/login");
        }
      } catch {
        if (isMounted) {
          router.push("/login");
        }
      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [buyer, dispatch, router]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.post(API_ENDPOINTS.LOGOUT, {}, { withCredentials: true });
    } finally {
      dispatch(logout());
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-shop-border bg-shop-surface-raised/90 backdrop-blur-md">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="/dashboard"
            className="group flex shrink-0 items-center"
            aria-label="Shopzo home"
          >
            <Image
              src="/shopzo_logo_tp.png"
              alt="Shopzo"
              width={118}
              height={40}
              priority
              className="h-7 w-auto object-contain transition-opacity duration-200 group-hover:opacity-80 sm:h-8"
            />
          </Link>

          <div className="hidden min-w-0 flex-1 md:block">
            <label className="relative block">
              <span className="sr-only">Search products</span>
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-shop-muted" />
              <input
                type="search"
                placeholder="Search products..."
                className="w-full rounded-full border border-shop-border bg-shop-surface py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-shop-muted outline-none transition focus:border-neutral-400 focus:bg-shop-surface-raised dark:focus:border-neutral-600"
              />
            </label>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
            <ThemeToggle />
            <div className="hidden items-center gap-0.5 sm:gap-1 md:flex">
              <ProfileMenu
                buyerName={buyer?.name}
                buyerEmail={buyer?.email}
                loading={loading}
                onProfile={() => router.push("/profile")}
                onLogout={handleLogout}
              />
              <CartButton count={cartCount} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function ProfileMenu({
  buyerName,
  buyerEmail,
  loading,
  onProfile,
  onLogout,
}: {
  buyerName?: string;
  buyerEmail?: string;
  loading: boolean;
  onProfile: () => void;
  onLogout: () => void;
}) {
  const initial = buyerName?.charAt(0).toUpperCase() || "U";
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const closeProfileMenu = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeProfileMenu);
    return () => document.removeEventListener("mousedown", closeProfileMenu);
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
        aria-label="Open profile menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-xs font-medium text-white dark:bg-neutral-100 dark:text-neutral-900">
          {initial}
        </span>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-11 z-50 w-52 rounded-xl border border-shop-border bg-shop-surface-raised p-1.5 shadow-lg"
        >
          {(buyerName || buyerEmail) && (
            <div className="border-b border-shop-border px-3 py-2.5">
              {buyerName && (
                <p className="truncate text-sm font-medium text-foreground">{buyerName}</p>
              )}
              {buyerEmail && (
                <p className="truncate text-xs text-shop-muted">{buyerEmail}</p>
              )}
            </div>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onProfile();
            }}
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <UserIcon className="h-4 w-4 text-shop-muted" />
            My profile
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            disabled={loading}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            <LogoutIcon className="h-4 w-4" />
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      )}
    </div>
  );
}

function CartButton({ count }: { count: number }) {
  return (
    <Link
      href="#"
      className="relative flex h-9 w-9 items-center justify-center rounded-full text-foreground transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
      aria-label={`Shopping cart, ${count} items`}
    >
      <CartIcon className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-shop-accent px-1 text-[10px] font-semibold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 14a4 4 0 10-8 0M5 21a7 7 0 0114 0" />
    </svg>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12H4m7-4-4 4 4 4m3-12h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
    </svg>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5M7 13l-1.293 2.293c-.63.63-.184 1.707.707 1.707H19M17 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM9 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0"
      />
    </svg>
  );
}
