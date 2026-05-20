import type { Metadata } from "next";
import { ThemeProvider } from "@/app/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shopzo Buyer",
  description: "Shopzo buyer portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
