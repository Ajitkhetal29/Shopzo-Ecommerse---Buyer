import type { Metadata } from "next";
import AuthForm from "@/components/AuthFotm";

export const metadata: Metadata = {
  title: "Sign in | Shopzo Buyer",
  description: "Sign in to your Shopzo buyer account",
};

export default function LoginPage() {
  return <AuthForm defaultMode="login" />;
}
