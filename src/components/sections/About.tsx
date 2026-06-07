"use client";

import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";

const index = [
  ["Name", "TRYSS"],
  ["Role", "Designer / Creative Developer"],
  ["Based", "Japan"],
  ["Focus", "Web · Motion · Art Direction"],
  ["Since", "2026"],
];

/** Inverted (light) section — the B&W flip that gives the page editorial rhythm. */
export default function About() {
  return (
    <section id="about" className="bg-bg-light text-fg-dark">
      <div className="mx-auto max-w-[1600px] px-5 py-28 md:px-8 md:py-40">
        <AnimatedSection className="grid gap-12 md:grid-cols-[0.6fr_1.4fr]">
          <AnimatedItem>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-fg-dark/50">
              About
            </p>
          </AnimatedItem>

          <div>
            <AnimatedItem>
              <h2 className="display max-w-[16ch] text-4xl md:text-6xl lg:text-7xl">
                To create is
                <br />
                to care for people.
              </h2>
            </AnimatedItem>

            <AnimatedItem>
              <p className="mt-10 max-w-[54ch] text-base leading-relaxed text-fg-dark/70 md:text-lg">
                Hi — I&apos;m TRYSS. [ write your introduction here ] Working
                across film, motion, and the web, I design the moments where a
                viewer&apos;s feelings shift. This very site takes a single
                video, breaks it into 153 frames, and renders them in sync with
                your scroll.
              </p>
            </AnimatedItem>

            <AnimatedItem>
              <dl className="mt-14 divide-y divide-black/10 border-y border-black/10">
                {index.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-6 py-4"
                  >
                    <dt className="font-mono text-[11px] uppercase tracking-[0.25em] text-fg-dark/45">
                      {k}
                    </dt>
                    <dd className="text-right text-sm font-medium md:text-base">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </AnimatedItem>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
