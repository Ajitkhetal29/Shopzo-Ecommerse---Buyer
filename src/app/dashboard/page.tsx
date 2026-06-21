"use client";

import BuyerShell from "@/app/components/BuyerShell";
import Banner from "@/app/components/Banner";
import CategorySection from "@/app/components/categorySection";
import CategoryCarousel from "@/app/components/CategoryCarousel";
import ProductCarousel from "@/app/components/productCarousel";
import SingleBanner from "../components/Singlebanner";

export default function DashboardPage() {
  return (
    <BuyerShell showFooter>
      <Banner ctaHref="/products" secondaryHref="/products" />
      <CategorySection overlapBanner={false} />
      <CategoryCarousel />
      <ProductCarousel />
      <SingleBanner
        src="/banner/banner5.png"
        alt="Smart shopping made effortless"
        title="Smart shopping, simplified"
        description="Discover deals and essentials without the clutter — just what you need."
        href="/products"
      />
    </BuyerShell>
  );
}
