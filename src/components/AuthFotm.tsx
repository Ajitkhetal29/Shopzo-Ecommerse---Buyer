"use client";

import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/api";

type AuthMode = "login" | "signup";

export default function AuthPage({
  defaultMode = "login",
}: {
  defaultMode?: AuthMode;
}) {
  const [isSignUp, setIsSignUp] = useState(defaultMode === "signup");
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords don't match!");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.post(
          `${API_ENDPOINTS.REGISTER}`,
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          },
          {
            withCredentials: true,
          }
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
          `${API_ENDPOINTS.LOGIN}`,
          {
            email: formData.email,
            password: formData.password,
          },
          {
            withCredentials: true,
          }
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
    <div className="min-h-screen bg-slate-100">
      <div className="bg-[#0f172a] px-4 py-2 text-center text-sm font-medium text-slate-100">
        Fresh deals every day. Secure buyer login.
      </div>
      <div className="mx-auto grid min-h-[calc(100vh-40px)] max-w-7xl gap-0 pt-3 lg:grid-cols-2 lg:pt-6">
        <aside className="hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <Image src="/shopzo_logo_tp.png" alt="Shopzo" width={180} height={68} priority />
            <p className="mt-8 inline-flex rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-semibold text-cyan-200">
              Buyer Experience
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-tight">
              Grocery-style shopping flow with modern ecommerce UX.
            </h2>
            <p className="mt-4 max-w-md text-sm text-slate-200">
              Continue with your wishlist, track orders, and shop top categories in one place.
            </p>
          </div>
          <div className="space-y-3 text-sm text-slate-200">
            <p>• Fast account setup in under 30 seconds</p>
            <p>• Personalized product feed after login</p>
            <p>• Cart and order history synced across devices</p>
          </div>
        </aside>

        <section className="flex items-center justify-center p-5 sm:p-8">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <Image src="/shopzo_logo.png" alt="Shopzo" width={140} height={54} priority />
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                Buyer Portal
              </p>
            </div>

            <div className="mb-6 flex rounded-full bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setError("");
                }}
                className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
                  !isSignUp ? "bg-white text-slate-900 shadow" : "text-slate-500"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setError("");
                }}
                className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
                  isSignUp ? "bg-white text-slate-900 shadow" : "text-slate-500"
                }`}
              >
                Sign Up
              </button>
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mb-6 mt-1 text-sm text-slate-600">
              {isSignUp
                ? "Start shopping with curated categories and quick checkout."
                : "Sign in to continue where you left off."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required={isSignUp}
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <div className="relative w-full">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 pr-12 text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Confirm Password
              </label>
              <div className="relative w-full">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required={isSignUp}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full rounded-xl border px-4 py-2.5 pr-12 text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 transition ${
                    error
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-300 focus:ring-indigo-600"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 transition"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {error && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </p>
              )}
            </div>
          )}

          {!isSignUp && (
            <div className="flex justify-end">
              <Link
                href="#"
                className="text-sm text-slate-600 transition hover:text-slate-900"
              >
                Forgot password?
              </Link>
            </div>
          )}

          {error && !isSignUp && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? isSignUp
                ? "Creating account..."
                : "Signing in..."
              : isSignUp
                ? "Create Account"
                : "Sign In"}
          </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
