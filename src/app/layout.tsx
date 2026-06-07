import type { Metadata } from "next";
import { Geist, Geist_Mono, Poly } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poly = Poly({
  variable: "--font-poly",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TRYSS — Portfolio 2026",
  description:
    "A frame-by-frame personal portfolio — a single film, taken apart and replayed as you scroll.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // Lenis tags <html> with `lenis` classes on mount, and browser extensions
      // inject attributes here too — both run before React hydrates, so the
      // <html> attributes legitimately differ. Scoped to this element only.
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${poly.variable} antialiased`}
    >
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
