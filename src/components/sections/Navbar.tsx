"use client";

import LiveClock from "@/components/ui/LiveClock";
import { useLocale } from "@/lib/i18n";

const linkHrefs = ["#top", "#about", "#works", "#experience", "#achievements", "#contact"] as const;

/**
 * Fixed editorial nav. `mix-blend-difference` keeps the white text legible
 * over the video, the light section, and the dark sections alike — it inverts
 * against whatever scrolls underneath it.
 */
export default function Navbar() {
  const { locale, setLocale, t } = useLocale();
  const links = [
    t.nav.links.index,
    t.nav.links.about,
    t.nav.links.works,
    t.nav.links.experience,
    t.nav.links.achievements,
    t.nav.links.contact,
  ];

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 mix-blend-difference">
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 text-white md:px-8">
        <a
          href="#top"
          className="pointer-events-auto font-mono text-sm font-semibold tracking-tight"
        >
          U.ISHIKAWA©
        </a>

        <div className="pointer-events-auto hidden items-center gap-6 font-mono text-[11px] uppercase tracking-[0.25em] lg:flex">
          {links.map((label, i) => (
            <a
              key={linkHrefs[i]}
              href={linkHrefs[i]}
              className="transition-opacity duration-300 hover:opacity-50"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="pointer-events-auto flex items-center gap-5">
          <button
            type="button"
            onClick={() => setLocale(locale === "ja" ? "en" : "ja")}
            aria-label="Switch language"
            className="font-mono text-[11px] tracking-[0.2em] transition-opacity duration-300 hover:opacity-50"
          >
            <span className={locale === "ja" ? "" : "opacity-40"}>JA</span>
            <span className="opacity-40"> / </span>
            <span className={locale === "en" ? "" : "opacity-40"}>EN</span>
          </button>
          <div className="hidden font-mono text-[11px] tracking-[0.2em] sm:block">
            <LiveClock />
          </div>
        </div>
      </nav>
    </header>
  );
}
