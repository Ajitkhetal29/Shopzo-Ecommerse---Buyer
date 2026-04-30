"use client";

import { useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/api";

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.post(API_ENDPOINTS.LOGOUT, {}, { withCredentials: true });
    } finally {
      window.location.href = "/login";
    }
  };

  return (
    <main className="mx-auto min-h-[60vh] max-w-7xl p-4 md:p-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Dashboard
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Buyer Dashboard</h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </section>
    </main>
  );
}
