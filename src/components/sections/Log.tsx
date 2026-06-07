"use client";

import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";

// PARCO person2026's "Process Log" — timestamped notes on the making of this site.
const entries = [
  {
    ts: "2026.01.12 / 02:14",
    msg: "Started shaping the portfolio. Decided to let the video lead — one page, one story.",
  },
  {
    ts: "2026.02.03 / 23:40",
    msg: "Tested breaking the footage into a numbered frame sequence. Landed on 153.",
  },
  {
    ts: "2026.03.21 / 11:48",
    msg: "Wired up scroll-synced canvas rendering. Smoothed it out with RAF + a ticking ref.",
  },
  {
    ts: "2026.06.07 / 10:54",
    msg: "Rebuilt the whole thing as high-contrast editorial. — to be continued.",
  },
];

export default function Log() {
  return (
    <section id="log" className="bg-bg">
      <div className="mx-auto max-w-[1600px] px-5 py-28 md:px-8 md:py-40">
        <AnimatedSection>
          <AnimatedItem className="flex items-end justify-between border-b border-line pb-6">
            <h2 className="display text-4xl md:text-6xl">Process Log</h2>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
              The making of
            </span>
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection className="mt-8">
          {entries.map((e) => (
            <AnimatedItem
              key={e.ts}
              className="grid gap-2 border-b border-line py-7 md:grid-cols-[220px_1fr] md:gap-8"
            >
              <span className="font-mono text-xs tabular-nums tracking-wider text-accent">
                {e.ts}
              </span>
              <p className="max-w-[60ch] text-base leading-relaxed text-fg/85 md:text-lg">
                {e.msg}
              </p>
            </AnimatedItem>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}
