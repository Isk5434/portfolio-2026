"use client";

import Marquee from "@/components/ui/Marquee";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";

const rowA = ["DESIGN", "MOTION", "ART DIRECTION", "WEB", "BRANDING", "3D"];
const rowB = ["NEXT.JS", "REACT", "TYPESCRIPT", "WEBGL", "FIGMA", "AFTER EFFECTS"];

const capabilities = [
  {
    k: "Design",
    d: "Art direction held together from concept and visuals through to typography.",
  },
  {
    k: "Development",
    d: "Front-end built on Next.js and React — expression and performance, in balance.",
  },
  {
    k: "Motion",
    d: "Time-based experiences shaped from frame sequences and scroll-driven motion.",
  },
];

export default function Skills() {
  return (
    <section id="skills" className="overflow-hidden border-y border-line bg-bg py-24 md:py-32">
      {/* marquee band */}
      <div className="display select-none text-5xl text-fg md:text-7xl">
        <Marquee items={rowA} duration={32} />
        <div className="mt-3 text-accent">
          <Marquee items={rowB} duration={26} reverse />
        </div>
      </div>

      {/* capabilities grid */}
      <div className="mx-auto mt-24 max-w-[1600px] px-5 md:px-8">
        <AnimatedSection className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
          {capabilities.map((c, i) => (
            <AnimatedItem key={c.k} className="bg-bg p-8 md:p-10">
              <span className="font-mono text-xs tabular-nums text-muted">
                0{i + 1}
              </span>
              <h3 className="mt-6 text-2xl font-medium tracking-tight">{c.k}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">{c.d}</p>
            </AnimatedItem>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}
