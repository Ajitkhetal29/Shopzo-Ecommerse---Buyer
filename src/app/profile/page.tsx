"use client";

import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import BuyerShell from "@/app/components/BuyerShell";
import { ThemeModeSelector } from "@/app/components/ThemeToggle";
import { API_ENDPOINTS } from "@/lib/api";
import type { AppDispatch, RootState } from "@/store";
import { setBuyer } from "@/store/slices/authSlice";

export default function ProfilePage() {
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

  return (
    <BuyerShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="max-w-xl rounded-2xl border border-shop-border bg-shop-surface-raised p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            My profile
          </h1>
          <div className="mt-6 space-y-5">
            <ProfileField label="Name" value={buyer?.name || "Loading..."} />
            <ProfileField label="Email" value={buyer?.email || "Loading..."} />
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-shop-muted">
                Appearance
              </p>
              <div className="mt-3">
                <ThemeModeSelector />
              </div>
            </div>
          </div>
        </section>
      </main>
    </BuyerShell>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-shop-muted">
        {label}
      </p>
      <p className="mt-1.5 text-base font-medium text-foreground">{value}</p>
    </div>
  );
}
