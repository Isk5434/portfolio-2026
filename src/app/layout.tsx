import type { Metadata } from "next";
import { Geist, Geist_Mono, Poly } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { LocaleProvider } from "@/lib/i18n";

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
  title: "Usa Ishikawa (石川 潮早) — AI / Full-Stack Engineer | Portfolio 2026",
  description:
    "Portfolio of Usa Ishikawa (石川 潮早), a university student engineer at Nagoya City University working on LLMs, web applications, and Physical AI — projects, open-source contributions, and awards.",
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
      // Default locale is English; LocaleProvider updates this when switched.
      lang="en"
      // `translate="no"` + the `notranslate` class stop Chrome's "Translate this
      // page?" prompt and any automatic translation (the site has its own JA / EN toggle).
      translate="no"
      // Lenis tags <html> with `lenis` classes on mount, and browser extensions
      // inject attributes here too — both run before React hydrates, so the
      // <html> attributes legitimately differ. Scoped to this element only.
      suppressHydrationWarning
      className={`notranslate ${geistSans.variable} ${geistMono.variable} ${poly.variable} antialiased`}
    >
      <body>
        <LocaleProvider>
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
        </LocaleProvider>
      </body>
    </html>
  );
}
