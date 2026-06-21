"use client";

import BuyerSiteFooter from "@/app/components/BuyerSiteFooter";
import BuyerSiteHeader from "@/app/components/BuyerSiteHeader";
import LatestOffersBar from "@/app/components/LatestOffersBar";
import MobileBottomNav from "@/app/components/MobileBottomNav";

type BuyerShellProps = {
  children: React.ReactNode;
  cartCount?: number;
  showFooter?: boolean;
};

export default function BuyerShell({
  children,
  cartCount = 0,
  showFooter = false,
}: BuyerShellProps) {
  return (
    <div className="min-h-screen bg-shop-surface pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
      <LatestOffersBar />
      <BuyerSiteHeader cartCount={cartCount} />
      {children}
      {showFooter && <BuyerSiteFooter />}
      <MobileBottomNav cartCount={cartCount} />
    </div>
  );
}
