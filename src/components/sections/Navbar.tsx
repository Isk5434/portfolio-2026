"use client";

import LiveClock from "@/components/ui/LiveClock";

const links = [
  { label: "Index", href: "#top" },
  { label: "Works", href: "#works" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

/**
 * Fixed editorial nav. `mix-blend-difference` keeps the white text legible
 * over the video, the light section, and the dark sections alike — it inverts
 * against whatever scrolls underneath it.
 */
export default function Navbar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 mix-blend-difference">
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 text-white md:px-8">
        <a
          href="#top"
          className="pointer-events-auto font-mono text-sm font-semibold tracking-tight"
        >
          TRYSS©
        </a>

        <div className="pointer-events-auto hidden items-center gap-7 font-mono text-[11px] uppercase tracking-[0.25em] md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition-opacity duration-300 hover:opacity-50"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="pointer-events-auto font-mono text-[11px] tracking-[0.2em]">
          <LiveClock />
        </div>
      </nav>
    </header>
  );
}
