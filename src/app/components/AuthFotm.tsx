"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/api";

type AuthMode = "login" | "signup";

const delay = (ms: number): React.CSSProperties =>
  ({ ["--ae-delay"]: `${ms}ms` } as React.CSSProperties);

const inputClass =
  "w-full rounded-lg border border-stone-200 bg-white/90 px-3 py-2 text-[15px] text-stone-900 placeholder:text-stone-400 outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-stone-900 focus:ring-2 focus:ring-orange-500/25 dark:border-zinc-600 dark:bg-zinc-950/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-200 dark:focus:ring-sky-500/25";

const labelClass =
  "mb-1 block text-sm font-medium text-stone-800 dark:text-zinc-300";

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

  return (
    <div className="relative h-dvh max-h-dvh overflow-hidden bg-gradient-to-br from-[#faf9f7] via-[#f5f4f1] to-[#ebe7e0] text-stone-900 dark:from-zinc-950 dark:via-zinc-950 dark:to-black dark:text-zinc-100">
      <ThemeToggle />
      <div className="mx-auto grid h-full max-w-6xl min-h-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <aside className="relative hidden min-h-0 flex-col justify-between overflow-hidden border-r border-stone-200/80 dark:border-zinc-700 lg:flex">
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#f3f1ec] via-[#ebe8e2] to-[#e3ded6] dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_15%_-5%,rgba(249,115,22,0.17),transparent),radial-gradient(ellipse_70%_50%_at_95%_100%,rgba(56,189,248,0.14),transparent)] opacity-95 dark:opacity-[0.38]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.42] mix-blend-overlay [background-image:url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%20256%20256%22%3E%3Cfilter%20id=%22n%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.9%22%20numOctaves=%224%22%20stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20filter=%22url(%23n)%22/%3E%3C/svg%3E')] dark:opacity-[0.22] dark:mix-blend-soft-light"
            aria-hidden
          />
          <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-between px-10 py-8">
            <div className="shrink-0">
              <div className="auth-enter inline-block rounded-xl bg-white/85 p-2 shadow-sm ring-1 ring-black/5 dark:bg-white/95 dark:ring-white/10" style={delay(0)}>
                <Link href="/" className="inline-block">
                  <Image src="/shopzo_logo.png" alt="Shopzo" width={120} height={46} priority />
                </Link>
              </div>
              <div className="auth-enter mt-7" style={delay(85)}>
                <h2 className="text-4xl font-semibold tracking-[-0.02em] text-stone-900 dark:text-zinc-50">
                  Shopzo
                </h2>
                <div
                  className="mt-4 h-0.5 w-14 rounded-full bg-gradient-to-r from-orange-500 via-orange-400 to-sky-500 shadow-[0_0_20px_rgba(249,115,22,0.25)]"
                  aria-hidden
                />
                <p className="mt-4 text-[13px] font-medium leading-relaxed tracking-[0.06em] text-stone-600 dark:text-zinc-400">
                  explore more ... shop more
                </p>
              </div>
            </div>
            <p className="auth-enter shrink-0 text-xs text-stone-500 dark:text-zinc-500" style={delay(160)}>
              copyrigts @shozp.com
            </p>
          </div>
        </aside>

        <section className="relative flex h-full min-h-0 items-center justify-center overflow-hidden bg-gradient-to-b from-transparent via-transparent to-stone-200/25 px-5 pb-6 pt-14 dark:to-black/30 sm:px-10">
          <div className="auth-form-shell auth-enter mx-auto w-full max-w-[400px] shrink-0 px-6 py-7 sm:px-8 sm:py-8" style={delay(45)}>
            <div className="auth-enter mb-5 flex justify-center sm:mb-6" style={delay(95)}>
              <Link
                href="/"
                className="inline-block rounded-lg bg-white/90 p-1.5 shadow-sm ring-1 ring-black/[0.06] transition-transform duration-300 hover:scale-[1.02] dark:bg-white/95 dark:ring-white/10"
              >
                <Image src="/shopzo_logo.png" alt="Shopzo" width={112} height={42} priority />
              </Link>
            </div>
            <div
              className="auth-enter mx-auto mb-6 h-0.5 w-16 rounded-full bg-gradient-to-r from-orange-500 to-sky-500 opacity-90 shadow-[0_0_16px_rgba(56,189,248,0.2)]"
              style={delay(115)}
              aria-hidden
            />
            <form onSubmit={handleSubmit} className="auth-enter space-y-3.5" style={delay(150)}>
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
                  Email
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
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    value={formData.password}
                    onChange={handleChange}
                    className={`${inputClass} pr-11`}
                  />
                  <PasswordToggle
                    visible={showPassword}
                    onToggle={() => setShowPassword((v) => !v)}
                  />
                </div>
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
                      className={`${inputClass} pr-11 ${
                        error === "Passwords don't match."
                          ? "border-red-400 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:border-red-400 dark:focus:ring-red-400"
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

              {!isSignUp && (
                <div className="flex justify-end">
                  <Link
                    href="#"
                    className="text-sm text-stone-600 underline-offset-4 transition hover:text-stone-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-200"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="auth-btn-shimmer w-full rounded-lg bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 py-2.5 text-[15px] font-semibold text-white shadow-md transition-[transform,box-shadow] duration-200 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 dark:from-zinc-100 dark:via-white dark:to-zinc-100 dark:text-zinc-900 dark:shadow-[0_4px_24px_rgba(255,255,255,0.08)] dark:hover:shadow-[0_8px_28px_rgba(255,255,255,0.12)]"
              >
                <span className="relative z-10">
                  {loading
                    ? isSignUp
                      ? "Creating account…"
                      : "Signing in…"
                    : isSignUp
                      ? "Create account"
                      : "Sign in"}
                </span>
              </button>

              <p className="pt-1 text-center text-sm text-stone-600 dark:text-zinc-400">
                {isSignUp ? (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("login")}
                      className="font-medium text-stone-900 underline-offset-4 hover:underline dark:text-zinc-100"
                    >
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    New here?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("signup")}
                      className="font-medium text-stone-900 underline-offset-4 hover:underline dark:text-zinc-100"
                    >
                      Create an account
                    </button>
                  </>
                )}
              </p>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="fixed right-4 top-4 z-50 h-10 w-10 shrink-0 rounded-full border border-transparent bg-transparent"
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-stone-200/90 bg-white/90 text-stone-800 shadow-md backdrop-blur-md transition-[transform,background-color,box-shadow] duration-300 hover:scale-105 hover:bg-white hover:shadow-lg active:scale-95 motion-safe:active:rotate-12 dark:border-zinc-600 dark:bg-zinc-800/90 dark:text-zinc-100 dark:hover:bg-zinc-800"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
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
      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-stone-700 dark:text-zinc-500 dark:hover:text-zinc-300"
      aria-label={visible ? "Hide password" : "Show password"}
    >
      {visible ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  );
}

function EyeIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
      />
    </svg>
  );
}
