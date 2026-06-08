"use client";

import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import PrismShards from "@/components/ui/PrismShards";

const index = [
  ["Name", "@"],
  ["Role", "Designer / Creative Developer"],
  ["Based", "Japan"],
  ["Focus", "Web · Motion · Art Direction"],
  ["Since", "2026"],
];

const PUBLIC_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const publicPath = (path: `/${string}`) => `${PUBLIC_BASE_PATH}${path}`;

/** Inverted (light) section — the B&W flip that gives the page editorial rhythm. */
export default function About() {
  return (
    <section id="about" className="relative isolate overflow-hidden bg-bg-light text-fg-dark">
      <div className="relative z-10 mx-auto max-w-[1600px] px-5 py-28 md:px-8 md:py-40">
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
                Hi — I&apos;m @. [ write your introduction here ] Working
                across film, motion, and the web, I design the moments where a
                viewer&apos;s feelings shift. This very site takes a single
                video, breaks it into 153 frames, and renders them in sync with
                your scroll.
              </p>
            </AnimatedItem>

            <AnimatedItem>
              <div className="about-index-panel relative mt-14 overflow-hidden border-y border-black/10">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${publicPath("/flower-white.png")})`,
                    filter: "contrast(1.12) brightness(0.94)",
                  }}
                  aria-hidden="true"
                />
                <div className="sunlight-overlay absolute inset-0" aria-hidden="true" />
                <div className="dot-screen absolute inset-0 opacity-45" aria-hidden="true" />
                <div
                  className="absolute inset-0 z-[8] bg-bg-light/45 backdrop-blur-[2px]"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute inset-0 z-[12] opacity-90 mix-blend-screen"
                  aria-hidden="true"
                >
                  <PrismShards />
                </div>
                <dl className="relative z-20 divide-y divide-black/15 bg-bg-light/38">
                  {index.map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-baseline justify-between gap-6 px-4 py-4 md:px-5"
                    >
                      <dt className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-fg-dark/75">
                        {k}
                      </dt>
                      <dd className="text-right text-sm font-semibold text-fg-dark md:text-base">
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </AnimatedItem>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
