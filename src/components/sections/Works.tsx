"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";

const PUBLIC_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const publicPath = (path: string) => `${PUBLIC_BASE_PATH}${path}`;

function moodFilter(luma: number, back = false) {
  const brightness = luma >= 125 ? 0.58 : luma >= 108 ? 0.68 : luma >= 80 ? 0.78 : 0.92;
  const backBoost = back ? 0.82 : 1;
  return `grayscale(1) brightness(${brightness * backBoost}) contrast(1.12)`;
}

// Work imagery. Luma is sampled from the source image and used to auto-darken bright images.
const works = [
  {
    n: "01",
    title: "Frame Sequence",
    cat: "Motion / Web",
    year: "2026",
    img: "/work-images/work-01.png",
    luma: 99.1,
  },
  {
    n: "02",
    title: "Editorial System",
    cat: "Art Direction",
    year: "2026",
    img: "/work-images/work-02.png",
    luma: 110.7,
  },
  {
    n: "03",
    title: "Interactive Hero",
    cat: "Creative Dev",
    year: "2025",
    img: "/work-images/work-03.png",
    luma: 36.5,
  },
  {
    n: "04",
    title: "Brand Identity",
    cat: "Identity",
    year: "2025",
    img: "/work-images/work-04.png",
    luma: 129,
  },
];

const ROTATE_MS = 4000;

// PARCO-style hero for the section: artwork cycles underneath, the title rides on top.
function FeaturedShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % works.length),
      ROTATE_MS
    );
    return () => clearInterval(id);
  }, [paused, active]);

  const current = works[active];

  return (
    <div
      className="relative aspect-[3/4] w-full overflow-hidden bg-black sm:aspect-[16/10] md:aspect-[16/7]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Cycling artwork — crossfades with a slow Ken-Burns drift */}
      {works.map((w, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={w.n}
          src={publicPath(w.img)}
          alt=""
          aria-hidden
          style={{ filter: moodFilter(w.luma) }}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1400ms] ease-out ${
            i === active ? "scale-100 opacity-[0.55]" : "scale-105 opacity-0"
          }`}
        />
      ))}

      {/* legibility scrim */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/70" />

      {/* corner editorial marks */}
      <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/70 mix-blend-difference md:left-6 md:top-6">
        Featured
      </span>
      <span className="absolute right-4 top-4 font-mono text-[10px] tabular-nums tracking-[0.3em] text-white/70 mix-blend-difference md:right-6 md:top-6">
        {current.n} / {String(works.length).padStart(2, "0")}
      </span>

      {/* Title riding over the artwork — swaps in time with the image */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.n}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.35em] text-white/75 md:mb-5 md:text-xs">
              {current.cat} — {current.year}
            </p>
            <h3 className="display text-balance text-[13vw] leading-[0.9] text-white mix-blend-difference md:text-[7.5vw]">
              {current.title}
            </h3>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prev / next — sit above the title overlay */}
      <button
        type="button"
        onClick={() => setActive((i) => (i - 1 + works.length) % works.length)}
        aria-label="Previous project"
        className="group absolute left-1 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-white/70 mix-blend-difference transition-colors hover:text-white md:left-4"
      >
        <CaretLeft
          weight="light"
          className="h-7 w-7 transition-transform duration-300 group-hover:-translate-x-0.5 md:h-9 md:w-9"
        />
      </button>
      <button
        type="button"
        onClick={() => setActive((i) => (i + 1) % works.length)}
        aria-label="Next project"
        className="group absolute right-1 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-white/70 mix-blend-difference transition-colors hover:text-white md:right-4"
      >
        <CaretRight
          weight="light"
          className="h-7 w-7 transition-transform duration-300 group-hover:translate-x-0.5 md:h-9 md:w-9"
        />
      </button>

      {/* Progress rails — click to jump */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2.5 md:bottom-8 md:gap-3">
        {works.map((w, i) => (
          <button
            key={w.n}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View ${w.title}`}
            aria-current={i === active}
            className="py-2"
          >
            <span
              className={`block h-px transition-all duration-500 ${
                i === active ? "w-9 bg-white" : "w-4 bg-white/35 hover:bg-white/70"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Works() {
  return (
    <section id="works" className="bg-bg">
      <div className="mx-auto max-w-[1600px] px-5 py-28 md:px-8 md:py-40">
        <AnimatedSection>
          <AnimatedItem className="flex items-end justify-between border-b border-line pb-6">
            <h2 className="display text-4xl md:text-6xl">Works</h2>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
              Selected — {works.length}
            </span>
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection className="mt-12">
          <AnimatedItem>
            <FeaturedShowcase />
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2">
          {works.map((w, i) => (
            <AnimatedItem key={w.n}>
              <div className="group block">
                {/* Flip card: front artwork turns around its vertical centre to the info back */}
                <div className="flip-card relative aspect-[4/3]">
                  <div
                    className="flip-card-inner absolute inset-0"
                    style={{ "--flip-delay": `${(-i * 2.25).toFixed(2)}s` } as CSSProperties}
                  >
                    {/* front — artwork */}
                    <div className="flip-face absolute inset-0 overflow-hidden bg-black">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={publicPath(w.img)}
                        alt={w.title}
                        style={{ filter: moodFilter(w.luma) }}
                        className="h-full w-full object-cover opacity-90"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-black/15 mix-blend-multiply" />
                      <span className="absolute left-4 top-4 font-mono text-xs tracking-[0.3em] text-white mix-blend-difference">
                        {w.n}
                      </span>
                    </div>
                    {/* back — same artwork, lightly faded, with project info on top */}
                    <div className="flip-face flip-face--back absolute inset-0 overflow-hidden bg-black">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={publicPath(w.img)}
                        alt=""
                        aria-hidden
                        style={{ filter: moodFilter(w.luma, true) }}
                        className="absolute inset-0 h-full w-full object-cover opacity-60"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/55" />
                      <div className="relative flex h-full flex-col justify-between p-5 text-white md:p-6">
                        <span className="font-mono text-xs tracking-[0.3em] text-white/90">
                          {w.n}
                        </span>
                        <div>
                          <h3 className="display text-2xl md:text-3xl">
                            {w.title}
                          </h3>
                          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-white/70">
                            {w.cat} — {w.year}
                          </p>
                          <span className="mt-4 inline-block font-mono text-[11px] uppercase tracking-[0.25em] text-white/85">
                            View Project →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-line pt-4">
                  <h3 className="text-xl font-medium tracking-tight transition-colors group-hover:text-accent md:text-2xl">
                    {w.title}
                  </h3>
                  <span className="font-mono text-xs tabular-nums text-muted">
                    {w.year}
                  </span>
                </div>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
                  {w.cat}
                </p>
              </div>
            </AnimatedItem>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}
