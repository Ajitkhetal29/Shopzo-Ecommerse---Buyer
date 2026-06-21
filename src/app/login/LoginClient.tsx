"use client";

import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { API_ENDPOINTS } from "@/lib/api";
import { AuthThemeToggle } from "@/app/components/ThemeToggle";
import { AppDispatch } from "@/store";
import { setBuyer } from "@/store/slices/authSlice";

const benefits = [
  "Track active orders",
  "Save carts and addresses",
  "Access member deals",
];

const categories = [
  { name: "Groceries", value: "2.4k items", tone: "bg-emerald-500" },
  { name: "Fashion", value: "New drops", tone: "bg-cyan-500" },
  { name: "Home", value: "Daily finds", tone: "bg-amber-500" },
];

export default function LoginClient() {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(API_ENDPOINTS.LOGIN, { email, password }, { withCredentials: true });
      if (res.status === 200 && res.data?.user) {
        dispatch(setBuyer(res.data.user));
        window.location.href = "/dashboard";
      }
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : err instanceof Error
            ? err.message
            : "Failed to sign in. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh bg-[#f5f7fb] text-slate-950 dark:bg-zinc-950 dark:text-white">
      <AuthThemeToggle />
      <div className="grid min-h-dvh lg:grid-cols-[minmax(0,0.95fr)_minmax(520px,1.05fr)]">
        <section className="relative hidden overflow-hidden bg-slate-950 text-white lg:block">
          <div className="absolute inset-0 buyer-login-backdrop" aria-hidden />
          <div className="relative flex h-full min-h-[720px] flex-col justify-between px-10 py-8 xl:px-14">
            <Link href="/" className="inline-flex w-fit rounded-lg bg-white px-3 py-2 shadow-sm">
              <Image src="/shopzo_logo.png" alt="Shopzo" width={118} height={44} priority />
            </Link>

            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Buyer account</p>
              <h1 className="mt-4 text-5xl font-semibold leading-[1.03] tracking-normal xl:text-6xl">
                Your cart, orders, and deals in one place.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
                Sign in to continue shopping across Shopzo, manage saved addresses, and follow each delivery from checkout to doorstep.
              </p>

              <div className="mt-9 grid grid-cols-3 gap-3">
                {categories.map((item) => (
                  <div key={item.name} className="rounded-lg border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                    <span className={`block h-2 w-10 rounded-full ${item.tone}`} />
                    <p className="mt-4 text-sm font-semibold text-white">{item.name}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <Metric value="24h" label="quick delivery" />
              <Metric value="8k+" label="local products" />
              <Metric value="4.8" label="buyer rating" />
            </div>
          </div>
        </section>

        <section className="flex min-h-dvh items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-[460px]">
            <Link href="/" className="mb-8 inline-flex rounded-lg bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200 lg:hidden">
              <Image src="/shopzo_logo.png" alt="Shopzo" width={112} height={42} priority />
            </Link>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/5 dark:border-white/10 dark:bg-zinc-900 sm:p-7">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
                  Welcome back
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 dark:text-white">
                  Sign in to Shopzo
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                  Continue shopping, check delivery updates, and manage your buyer profile.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-800 dark:text-zinc-200">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-[15px] text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-400/10"
                  />
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between gap-3">
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-800 dark:text-zinc-200">
                      Password
                    </label>
                    <Link href="/signup" className="text-sm font-medium text-slate-500 transition hover:text-slate-950 dark:text-zinc-400 dark:hover:text-white">
                      New account?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError("");
                      }}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 pr-12 text-[15px] text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-400/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                {error ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-xl bg-slate-950 px-4 text-[15px] font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <div className="mt-6 grid gap-2">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 dark:bg-zinc-950 dark:text-zinc-300">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
                      <CheckIcon />
                    </span>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-slate-600 dark:text-zinc-400">
              New to Shopzo?{" "}
              <Link href="/signup" className="font-semibold text-slate-950 underline-offset-4 hover:underline dark:text-white">
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs leading-5 text-slate-400">{label}</p>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="m5 13 4 4L19 7" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.5 12C3.7 8 7.5 5 12 5s8.3 3 9.5 7c-1.2 4-5 7-9.5 7s-8.3-3-9.5-7Z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="m3 3 18 18M10.6 10.6A3 3 0 0 0 13.4 13.4M9.9 5.2A10.7 10.7 0 0 1 12 5c4.5 0 8.3 3 9.5 7a11.8 11.8 0 0 1-2.4 4M6.3 6.8A11.5 11.5 0 0 0 2.5 12c1.2 4 5 7 9.5 7 1.1 0 2.1-.2 3.1-.5" />
    </svg>
  );
}
