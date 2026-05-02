import type { Metadata } from "next";
import AuthForm from "@/app/components/AuthFotm";

export const metadata: Metadata = {
  title: "Sign up | Shopzo Buyer",
  description: "Create your Shopzo buyer account",
};

export default function SignupPage() {
  return <AuthForm defaultMode="signup" />;
}
