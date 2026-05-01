"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
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
        setError("Passwords do not match.");
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

      return;
    }

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
  };

  return (
    <main className="min-h-dvh overflow-hidden bg-[#f6f7fb] text-slate-950">
      <div className="grid min-h-dvh lg:grid-cols-[1.05fr_0.95fr]">
        <aside className="relative hidden min-h-dvh overflow-hidden bg-[#122318] px-16 py-14 text-white lg:flex lg:flex-col lg:justify-center">
          <div className="absolute left-16 top-14 h-2 w-20 rounded-full bg-[#58c27d]" />
          <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-[#58c27d]/10" />
          <div className="absolute bottom-14 left-16 h-px w-48 bg-white/14" />

          <div className="max-w-md">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.22em] text-[#58c27d]">
              Buyer Portal
            </p>
            <h1 className="text-7xl font-semibold leading-none tracking-tight">
              Shopzo
            </h1>
            <p className="mt-6 max-w-sm text-xl leading-8 text-white/72">
              Shop smart. Checkout faster.
            </p>
          </div>
        </aside>

        <section className="flex min-h-dvh items-center justify-center bg-[#f6f7fb] px-5 py-5 sm:px-8 lg:px-12">
          <div className="w-full max-w-[390px]">
            <div className="mb-6 flex justify-center">
              <Image
                src="/shopzo_logo.png"
                alt="Shopzo"
                width={150}
                height={58}
                priority
                className="h-auto w-32"
              />
            </div>

            <div className="mb-5 flex rounded-lg bg-white p-1 shadow-sm ring-1 ring-slate-200">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setError("");
                }}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
                  !isSignUp
                    ? "bg-[#58c27d] text-[#102016]"
                    : "text-slate-500 hover:text-slate-900"
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
                className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
                  isSignUp
                    ? "bg-[#58c27d] text-[#102016]"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Sign Up
              </button>
            </div>

            <h2 className="text-[22px] font-semibold leading-tight text-slate-950">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h2>
            <p className="mb-5 mt-1 text-sm text-slate-500">
              {isSignUp ? "Start shopping with Shopzo." : "Sign in to continue."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {isSignUp && (
                <Field label="Full Name" htmlFor="name">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={isSignUp}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={inputClassName}
                  />
                </Field>
              )}

              <Field label="Email" htmlFor="email">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={inputClassName}
                  autoComplete="email"
                />
              </Field>

              <Field label="Password" htmlFor="password">
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`${inputClassName} pr-12`}
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                  />
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </IconButton>
                </div>
              </Field>

              {isSignUp && (
                <Field label="Confirm Password" htmlFor="confirmPassword">
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required={isSignUp}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`${inputClassName} pr-12 ${
                        error ? "border-red-500 focus:border-red-500" : ""
                      }`}
                      autoComplete="new-password"
                    />
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </IconButton>
                  </div>
                </Field>
              )}

              {!isSignUp && (
                <div className="flex justify-end">
                  <Link
                    href="#"
                    className="text-sm text-slate-500 transition hover:text-slate-950"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#13231a] py-2.5 font-semibold text-white transition hover:bg-[#1d3528] disabled:cursor-not-allowed disabled:opacity-60"
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
    </main>
  );
}

const inputClassName =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#58c27d] focus:ring-2 focus:ring-[#58c27d]/20";

function Field({
  children,
  htmlFor,
  label,
}: {
  children: React.ReactNode;
  htmlFor: string;
  label: string;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function IconButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-950"
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

function Eye() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  );
}

function EyeOff() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
      />
    </svg>
  );
}
