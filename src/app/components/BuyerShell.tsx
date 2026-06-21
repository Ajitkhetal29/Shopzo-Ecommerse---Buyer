"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/store";
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
  cartCount,
  showFooter = false,
}: BuyerShellProps) {
  const storeCartCount = useSelector((state: RootState) => state.cart.items.length);
  const finalCartCount = typeof cartCount === "number" ? cartCount : storeCartCount;

  return (
    <div className="min-h-screen bg-shop-surface pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
      <LatestOffersBar />
      <BuyerSiteHeader cartCount={finalCartCount} />
      {children}
      {showFooter && <BuyerSiteFooter />}
      <MobileBottomNav cartCount={finalCartCount} />
    </div>
  );
}
