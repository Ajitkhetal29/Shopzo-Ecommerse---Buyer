"use client";

import Image from "next/image";
import Link from "next/link";

const FOOTER_LINKS = [
  { href: "#", label: "About" },
  { href: "#", label: "Help" },
  { href: "#", label: "Shipping" },
  { href: "#", label: "Returns" },
  { href: "#", label: "Privacy" },
  { href: "#", label: "Terms" },
] as const;

type BuyerSiteFooterProps = {
  contactEmail?: string;
};

export default function BuyerSiteFooter({
  contactEmail = "hello@shopzo.com",
}: BuyerSiteFooterProps) {
  return (
    <footer className="mt-16 border-t border-shop-border bg-shop-surface-raised">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 text-center sm:items-start sm:text-left">
          <Link href="/dashboard" aria-label="Shopzo home">
            <Image
              src="/shopzo_logo_tp.png"
              alt="Shopzo"
              width={100}
              height={34}
              className="h-7 w-auto opacity-90"
            />
          </Link>

          <nav
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:justify-start"
            aria-label="Footer navigation"
          >
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-shop-muted transition hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="text-sm text-shop-muted">
            Questions?{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="text-foreground underline-offset-4 transition hover:underline"
            >
              {contactEmail}
            </a>
          </p>
        </div>

        <div className="mt-10 border-t border-shop-border pt-6 text-center text-xs text-shop-muted sm:text-left">
          <p>&copy; {new Date().getFullYear()} Shopzo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
