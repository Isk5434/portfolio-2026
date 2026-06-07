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
  // Tell Chrome & co. not to offer / auto-run page translation.
  other: {
    google: "notranslate",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // `translate="no"` + the `notranslate` class stop Chrome's "Translate this
      // page?" prompt and any automatic translation of the (English) content.
      translate="no"
      // Lenis tags <html> with `lenis` classes on mount, and browser extensions
      // inject attributes here too — both run before React hydrates, so the
      // <html> attributes legitimately differ. Scoped to this element only.
      suppressHydrationWarning
      className={`notranslate ${geistSans.variable} ${geistMono.variable} ${poly.variable} antialiased`}
    >
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>

        {/* Landscape guard — phones must stay in portrait to view the site. */}
        <div
          className="rotate-lock"
          role="alertdialog"
          aria-label="Please rotate your device to portrait"
        >
          <svg
            className="rotate-lock__icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="7" y="2" width="10" height="20" rx="2.2" />
            <line x1="11" y1="18.5" x2="13" y2="18.5" />
          </svg>
          <p className="rotate-lock__title">画面を縦にしてご覧ください</p>
          <p className="rotate-lock__hint">Please rotate to portrait</p>
        </div>
      </body>
    </html>
  );
}
