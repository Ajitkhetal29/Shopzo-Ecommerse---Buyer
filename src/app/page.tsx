"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import CategoryCarousel from "./components/CategoryCarousel";

type CurrentUser = {
  id: string;
};

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        window.location.href = "/login";
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <main className="min-h-screen bg-shop-surface text-foreground">
      <section className="border-b border-shop-border bg-shop-surface-raised px-4 py-6 md:px-6">
        <h1 className="text-2xl font-bold text-foreground">Welcome to Shopzo</h1>
        <p className="mt-2 text-sm text-shop-muted">Logged in as: {user?.id}</p>
      </section>

      <div className="mt-3">
        <CategoryCarousel />
      </div>
    </main>
  );
}
