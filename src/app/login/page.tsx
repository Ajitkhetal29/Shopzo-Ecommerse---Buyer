import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Sign in | Shopzo Buyer",
  description: "Sign in to your Shopzo buyer account",
};

export default function LoginPage() {
  return <LoginClient />;
}
