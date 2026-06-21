"use client";

import { useEffect } from "react";

type FilterSideNavProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  activeFilterCount?: number;
};

export default function FilterSideNav({
  open,
  onClose,
  children,
  activeFilterCount = 0,
}: FilterSideNavProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-hidden={!open}
        aria-label="Product filters"
        className={`fixed inset-y-0 left-0 z-50 flex w-full max-w-[320px] flex-col border-r border-shop-border bg-shop-surface shadow-xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "pointer-events-none -translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-shop-border px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Filters</h2>
            {activeFilterCount > 0 && (
              <p className="mt-0.5 text-xs text-shop-muted">
                {activeFilterCount} active
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="rounded-full border border-shop-border p-2 text-foreground transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-4">
          {children}
        </div>
      </aside>
    </>
  );
}

export function FiltersTriggerButton({
  onClick,
  activeFilterCount = 0,
}: {
  onClick: () => void;
  activeFilterCount?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-shop-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
    >
      <FilterIcon />
      Filters
      {activeFilterCount > 0 && (
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-900 px-1.5 text-[11px] font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900">
          {activeFilterCount}
        </span>
      )}
    </button>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h16M7 12h10M10 18h4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
