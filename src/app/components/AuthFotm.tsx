"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/api";

type AuthMode = "login" | "signup";

const delay = (ms: number): React.CSSProperties =>
  ({ ["--ae-delay"]: `${ms}ms` } as React.CSSProperties);

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3.5 py-3 text-[15px] text-slate-950 placeholder:text-slate-400 outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/10";

const labelClass =
  "mb-1.5 block text-sm font-medium text-slate-800 dark:text-zinc-300";

const shopperStats = [
  { value: "24h", label: "delivery windows" },
  { value: "4.8", label: "buyer rating" },
  { value: "8k+", label: "local products" },
];

const categoryTiles = [
  { name: "Fresh picks", color: "bg-emerald-600", icon: <LeafIcon /> },
  { name: "Daily style", color: "bg-cyan-600", icon: <BagIcon /> },
  { name: "Home finds", color: "bg-amber-500", icon: <HomeIcon /> },
  { name: "Fast deals", color: "bg-rose-500", icon: <BoltIcon /> },
];

export default function AuthPage({
  defaultMode = "login",
}: {
  defaultMode?: AuthMode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isSignUp =
    pathname === "/signup"
      ? true
      : pathname === "/login"
        ? false
        : defaultMode === "signup";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const passwordStrength = useMemo(() => {
    const checks = [
      formData.password.length >= 8,
      /[A-Z]/.test(formData.password),
      /[0-9]/.test(formData.password),
      /[^A-Za-z0-9]/.test(formData.password),
    ];

    return checks.filter(Boolean).length;
  }, [formData.password]);

  useEffect(() => {
    setError("");
  }, [pathname]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const switchMode = (next: AuthMode) => {
    setError("");
    router.push(next === "signup" ? "/signup" : "/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords don't match.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.post(
          API_ENDPOINTS.REGISTER,
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          },
          { withCredentials: true }
        );

        if (res.status === 201) {
          window.location.href = "/dashboard";
        }
      } catch (error: unknown) {
        const message =
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : error instanceof Error
              ? error.message
              : "Failed to create account. Please try again.";
        setError(message);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await axios.post(
          API_ENDPOINTS.LOGIN,
          {
            email: formData.email,
            password: formData.password,
          },
          { withCredentials: true }
        );

        if (res.status === 200) {
          window.location.href = "/dashboard";
        }
      } catch (error: unknown) {
        const message =
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : error instanceof Error
              ? error.message
              : "Failed to sign in. Please try again.";
        setError(message);
      } finally {
        setLoading(false);
      }
    }
  };

  const heading = isSignUp ? "Create your buyer account" : "Welcome back";
  const subheading = isSignUp
    ? "Set up your Shopzo profile and start building your cart."
    : "Sign in to continue shopping, track orders, and manage saved carts.";
  const ctaLabel = loading
    ? isSignUp
      ? "Creating account..."
      : "Signing in..."
    : isSignUp
      ? "Create account"
      : "Sign in";

  return (
    <div className="min-h-dvh bg-[#f7f4ee] text-slate-950 dark:bg-zinc-950 dark:text-zinc-50">
      <ThemeToggle />
      <main className="grid min-h-dvh lg:grid-cols-[minmax(0,0.92fr)_minmax(560px,1.08fr)]">
        <section className="relative hidden overflow-hidden bg-slate-950 text-white lg:block">
          <div className="absolute inset-0 auth-market-pattern opacity-75" aria-hidden />
          <div className="relative flex h-full min-h-[720px] flex-col justify-between px-10 py-8 xl:px-14">
            <div className="auth-enter" style={delay(0)}>
              <Link
                href="/"
                className="inline-flex items-center rounded-md bg-white px-3 py-2 shadow-sm transition-transform duration-200 hover:scale-[1.02]"
              >
                <Image src="/shopzo_logo.png" alt="Shopzo" width={118} height={44} priority />
              </Link>
            </div>

            <div className="max-w-xl">
              <p
                className="auth-enter text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300"
                style={delay(70)}
              >
                Buyer platform
              </p>
              <h1
                className="auth-enter mt-4 text-5xl font-semibold leading-[1.02] tracking-normal xl:text-6xl"
                style={delay(120)}
              >
                Everything you need for smarter everyday shopping.
              </h1>
              <p
                className="auth-enter mt-5 max-w-lg text-base leading-7 text-slate-300"
                style={delay(170)}
              >
                Browse curated categories, compare local deals, and keep every order moving from one focused buyer account.
              </p>

              <div className="auth-enter mt-9 grid grid-cols-2 gap-3" style={delay(220)}>
                {categoryTiles.map((tile) => (
                  <div
                    key={tile.name}
                    className="flex min-h-24 items-center gap-3 rounded-md border border-white/10 bg-white/[0.06] p-4 backdrop-blur"
                  >
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${tile.color} text-white`}>
                      {tile.icon}
                    </span>
                    <span className="text-sm font-semibold text-slate-100">
                      {tile.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="auth-enter grid grid-cols-3 gap-4 border-t border-white/10 pt-6" style={delay(270)}>
              {shopperStats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-semibold text-white">{stat.value}</div>
                  <div className="mt-1 text-xs leading-5 text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative flex min-h-dvh items-center justify-center px-5 py-20 sm:px-8 lg:px-12">
          <div className="w-full max-w-[460px]">
            <div className="auth-enter mb-8 flex items-center justify-between gap-4 lg:hidden" style={delay(0)}>
              <Link
                href="/"
                className="inline-flex rounded-md bg-white px-2.5 py-2 shadow-sm ring-1 ring-black/5 dark:bg-white"
              >
                <Image src="/shopzo_logo.png" alt="Shopzo" width={108} height={40} priority />
              </Link>
            </div>

            <div className="auth-enter" style={delay(40)}>
              <div className="inline-flex rounded-md border border-slate-200 bg-white p-1 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className={`rounded px-4 py-2 text-sm font-semibold transition ${
                    !isSignUp
                      ? "bg-slate-950 text-white shadow-sm dark:bg-zinc-50 dark:text-zinc-950"
                      : "text-slate-600 hover:text-slate-950 dark:text-zinc-400 dark:hover:text-zinc-50"
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className={`rounded px-4 py-2 text-sm font-semibold transition ${
                    isSignUp
                      ? "bg-slate-950 text-white shadow-sm dark:bg-zinc-50 dark:text-zinc-950"
                      : "text-slate-600 hover:text-slate-950 dark:text-zinc-400 dark:hover:text-zinc-50"
                  }`}
                >
                  Sign up
                </button>
              </div>

              <h2 className="mt-8 text-3xl font-semibold tracking-normal text-slate-950 dark:text-zinc-50 sm:text-4xl">
                {heading}
              </h2>
              <p className="mt-3 text-[15px] leading-6 text-slate-600 dark:text-zinc-400">
                {subheading}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-enter mt-8 space-y-4" style={delay(90)}>
              {isSignUp && (
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={isSignUp}
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Alex Morgan"
                    className={inputClass}
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-800 dark:text-zinc-300">
                    Password
                  </label>
                  {!isSignUp && (
                    <Link
                      href="#"
                      className="text-sm font-medium text-slate-500 underline-offset-4 transition hover:text-slate-950 hover:underline dark:text-zinc-400 dark:hover:text-zinc-50"
                    >
                      Forgot?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`${inputClass} pr-11`}
                  />
                  <PasswordToggle
                    visible={showPassword}
                    onToggle={() => setShowPassword((v) => !v)}
                  />
                </div>

                {isSignUp && (
                  <div className="mt-2 grid grid-cols-4 gap-1.5" aria-hidden>
                    {[0, 1, 2, 3].map((index) => (
                      <span
                        key={index}
                        className={`h-1 rounded-full ${
                          passwordStrength > index
                            ? "bg-emerald-600 dark:bg-cyan-400"
                            : "bg-slate-200 dark:bg-zinc-800"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {isSignUp && (
                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required={isSignUp}
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      className={`${inputClass} pr-11 ${
                        error === "Passwords don't match."
                          ? "border-red-500 focus:border-red-600 focus:ring-red-500/10 dark:border-red-400 dark:focus:border-red-300 dark:focus:ring-red-400/10"
                          : ""
                      }`}
                    />
                    <PasswordToggle
                      visible={showConfirmPassword}
                      onToggle={() => setShowConfirmPassword((v) => !v)}
                    />
                  </div>
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-200"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="auth-btn-shimmer w-full rounded-md bg-slate-950 px-4 py-3 text-[15px] font-semibold text-white shadow-lg shadow-slate-950/10 transition-[transform,box-shadow,background-color] duration-200 hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-950/15 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55 disabled:active:scale-100 dark:bg-zinc-50 dark:text-zinc-950 dark:shadow-black/30 dark:hover:bg-zinc-200"
              >
                <span className="relative z-10">{ctaLabel}</span>
              </button>
            </form>

            <p className="auth-enter mt-6 text-center text-sm text-slate-600 dark:text-zinc-400" style={delay(130)}>
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="font-semibold text-slate-950 underline-offset-4 hover:underline dark:text-zinc-50"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  New to Shopzo?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("signup")}
                    className="font-semibold text-slate-950 underline-offset-4 hover:underline dark:text-zinc-50"
                  >
                    Create an account
                  </button>
                </>
              )}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));

    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) {
    return (
      <div
        className="fixed right-4 top-4 z-50 h-10 w-10 shrink-0 rounded-md border border-transparent bg-transparent"
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-800 shadow-md transition-[transform,background-color,box-shadow] duration-200 hover:scale-105 hover:bg-slate-50 hover:shadow-lg active:scale-95 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function PasswordToggle({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
      aria-label={visible ? "Hide password" : "Show password"}
    >
      {visible ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  );
}

function MoonIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
      />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 19c9 0 14-5 14-14-9 0-14 5-14 14zm0 0 8-8" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 7h12l-1 13H7L6 7zm3 0a3 3 0 0 1 6 0" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m4 11 8-7 8 7v9H6v-9zm6 9v-6h4v6" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m13 2-8 12h6l-1 8 9-13h-6l0-7z" />
    </svg>
  );
}
