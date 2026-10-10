"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { useLocale, workNumber, workOrder, type WorkId, type WorkStatus } from "@/lib/i18n";

const PUBLIC_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const publicPath = (path: string) => `${PUBLIC_BASE_PATH}${path}`;

function moodFilter(luma: number, back = false) {
  const brightness = luma >= 125 ? 0.58 : luma >= 108 ? 0.68 : luma >= 80 ? 0.78 : 0.92;
  const backBoost = back ? 0.82 : 1;
  return `grayscale(1) brightness(${brightness * backBoost}) contrast(1.12)`;
}

// Project imagery. The pictures are mood artwork (not screenshots of the
// projects); luma is sampled from each image and used to auto-darken bright ones.
// TODO(content): 公開許可が取れた画面画像があれば差し替える。
interface Project {
  period: string;
  status: WorkStatus;
  img: string;
  luma: number;
  tech: string[];
  links?: { label: string; href: string }[];
  isPrivate?: boolean;
  imgPosition?: string;
  /** Real screenshot — shown in colour instead of the grayscale mood filter. */
  color?: boolean;
  /** Where clicking the card artwork goes (the project's main public page). */
  href?: string;
}

// Makes the card artwork a link when the project has a public page.
function CardLink({ href, label, children }: { href?: string; label: string; children: ReactNode }) {
  if (!href) return <>{children}</>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="block transition-opacity duration-300 hover:opacity-85"
    >
      {children}
    </a>
  );
}

const projects: Record<WorkId, Project> = {
  "show-harness": {
    period: "2026",
    status: "done",
    img: "/work-images/work-03.png",
    luma: 36.5,
    tech: ["Python", "NumPy", "Isaac Lab", "SO-101 / LeRobot", "Docker", "pytest"],
    href: "https://showlab.github.io/Show-Harness/",
    links: [
      { label: "Project page", href: "https://showlab.github.io/Show-Harness/" },
      { label: "PR #6", href: "https://github.com/showlab/Show-Harness/pull/6" },
      { label: "Repository", href: "https://github.com/showlab/Show-Harness" },
    ],
  },
  jewelry: {
    period: "2026.04 —",
    status: "ongoing",
    img: "/work-images/work-04.png",
    luma: 129,
    tech: ["React", "Next.js", "TypeScript", "OpenAI API", "Gemini API", "MediaPipe", "Logistic Regression", "SVM", "Qdrant"],
    isPrivate: true,
  },
  roleplay: {
    period: "2026.03 —",
    status: "ongoing",
    img: "/work-images/work-02.png",
    luma: 110.7,
    tech: ["Gemini API", "Prompt Design"],
    isPrivate: true,
  },
  "physical-ai": {
    period: "2026.05 —",
    status: "ongoing",
    img: "/work-images/work-01.png",
    luma: 99.2,
    tech: ["Python", "PyTorch", "Qwen VLM", "ACT", "LoRA", "Isaac Sim", "SO-101", "Weights & Biases"],
    isPrivate: true,
  },
  "llm-finetune": {
    period: "2026",
    status: "ongoing",
    img: "/frame/frame_0040.webp",
    luma: 33,
    tech: ["Python", "PyTorch", "Transformers", "PEFT / LoRA", "SFT", "Hugging Face Hub", "Google Colab"],
  },
  maro: {
    period: "2026",
    status: "done",
    img: "/work-images/work-01.jpg",
    luma: 80,
    imgPosition: "center bottom",
    color: true,
    href: "https://maroinu.pages.dev/",
    tech: ["Next.js", "React", "TypeScript", "Three.js", "React Three Fiber", "GSAP", "microCMS", "Cloudflare Pages", "Playwright", "Vitest", "Sentry"],
    links: [
      { label: "Site", href: "https://maroinu.pages.dev/" },
      { label: "Repository", href: "https://github.com/Isk5434/MARO3" },
    ],
  },
  portfolio: {
    period: "2026",
    status: "done",
    img: "/frame/frame_0120.webp",
    luma: 32.2,
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Lenis", "GitHub Actions"],
    href: "https://github.com/Isk5434/portfolio-2026",
    links: [
      { label: "Site", href: "https://isk5434.github.io/portfolio-2026/" },
      { label: "Repository", href: "https://github.com/Isk5434/portfolio-2026" },
    ],
  },
};

const works = workOrder.map((id) => ({ id, n: workNumber(id), ...projects[id] }));

const ROTATE_MS = 4000;

// PARCO-style hero for the section: artwork cycles underneath, the title rides on top.
function FeaturedShowcase() {
  const { t } = useLocale();
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
  const copy = t.works.items[current.id];

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
          style={{ filter: w.color ? "none" : moodFilter(w.luma), objectPosition: w.imgPosition }}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1400ms] ease-out ${
            i === active ? "scale-100 opacity-[0.55]" : "scale-105 opacity-0"
          }`}
        />
      ))}

      {/* legibility scrim */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/70" />

      {/* corner editorial marks */}
      <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/70 mix-blend-difference md:left-6 md:top-6">
        {t.works.featured}
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
              {copy.cat} — {t.works.status[current.status]}
            </p>
            <h3 className="display text-balance text-[10vw] leading-[0.95] text-white mix-blend-difference md:text-[6vw]">
              {copy.title}
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

      {/* Whole banner opens the current project's page (prev/next and rails sit above it) */}
      {current.href && (
        <a
          href={current.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={copy.title}
          className="absolute inset-0 z-10"
        />
      )}

      {/* Progress rails — click to jump */}
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 md:bottom-8 md:gap-3">
        {works.map((w, i) => (
          <button
            key={w.n}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View ${t.works.items[w.id].title}`}
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
  const { t } = useLocale();
  return (
    <section id="works" className="bg-bg">
      <div className="mx-auto max-w-[1600px] px-5 py-28 md:px-8 md:py-40">
        <AnimatedSection>
          <AnimatedItem className="flex items-end justify-between border-b border-line pb-6">
            <h2 className="display text-4xl md:text-6xl">Works</h2>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
              {t.works.selected} — {works.length}
            </span>
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection className="mt-12">
          <AnimatedItem>
            <FeaturedShowcase />
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2">
          {works.map((w, i) => {
            const copy = t.works.items[w.id];
            return (
              <AnimatedItem key={w.id}>
                <article id={`work-${w.n}`} className="scroll-mt-24">
                  {/* Flip card: front artwork turns around its vertical centre to the info back */}
                  <CardLink href={w.href} label={copy.title}>
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
                            alt=""
                            aria-hidden
                            style={{ filter: w.color ? "none" : moodFilter(w.luma), objectPosition: w.imgPosition }}
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
                            style={{ filter: w.color ? "none" : moodFilter(w.luma, true), objectPosition: w.imgPosition }}
                            className="absolute inset-0 h-full w-full object-cover opacity-60"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/55" />
                          <div className="relative flex h-full flex-col justify-between p-5 text-white md:p-6">
                            <span className="font-mono text-xs tracking-[0.3em] text-white/90">
                              {w.n}
                            </span>
                            <div>
                              <h3 className="display text-2xl md:text-3xl">{copy.title}</h3>
                              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-white/70">
                                {copy.cat} — {t.works.status[w.status]}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardLink>

                  <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-line pt-4">
                    <h3 className="text-xl font-medium tracking-tight md:text-2xl">
                      {w.href ? (
                        <a href={w.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">
                          {copy.title}
                        </a>
                      ) : (
                        copy.title
                      )}
                    </h3>
                    <span className="shrink-0 font-mono text-xs tabular-nums text-muted">{w.period}</span>
                  </div>
                  <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
                    <span>{copy.cat}</span>
                    <span
                      className={`border px-2 py-0.5 tracking-[0.15em] ${
                        w.status === "ongoing" ? "border-accent/60 text-accent" : "border-line text-fg/70"
                      }`}
                    >
                      {t.works.status[w.status]}
                    </span>
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-fg/80 md:text-base">{copy.summary}</p>

                  <details className="group mt-5 border-t border-line">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-mono text-[11px] uppercase tracking-[0.25em] text-fg/80 transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
                      {t.works.details}
                      <span aria-hidden className="text-base transition-transform duration-300 group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <dl className="space-y-5 pb-6 text-sm leading-relaxed text-fg/80">
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                          {t.works.labels.problem}
                        </dt>
                        <dd className="mt-2">{copy.problem}</dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                          {t.works.labels.role}
                        </dt>
                        <dd className="mt-2">
                          <ul className="space-y-1.5">
                            {copy.role.map((r) => (
                              <li
                                key={r}
                                className="relative pl-4 before:absolute before:left-0 before:top-[0.75em] before:h-px before:w-2 before:bg-fg/40"
                              >
                                {r}
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                          {t.works.labels.tech}
                        </dt>
                        <dd className="mt-2 flex flex-wrap gap-1.5">
                          {w.tech.map((tech) => (
                            <span key={tech} className="border border-line px-2 py-0.5 font-mono text-[11px] text-fg/75">
                              {tech}
                            </span>
                          ))}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                          {t.works.labels.result}
                        </dt>
                        <dd className="mt-2">{copy.result}</dd>
                      </div>
                      {w.links && (
                        <div>
                          <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                            {t.works.labels.links}
                          </dt>
                          <dd className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                            {w.links.map((l) => (
                              <a
                                key={l.href}
                                href={l.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 border-b border-line pb-0.5 font-mono text-xs text-fg transition-colors hover:text-accent"
                              >
                                {l.label}
                                <ArrowUpRight weight="light" className="h-3.5 w-3.5" />
                              </a>
                            ))}
                          </dd>
                        </div>
                      )}
                      {w.isPrivate && <p className="text-xs text-muted">{t.works.privateNote}</p>}
                    </dl>
                  </details>
                </article>
              </AnimatedItem>
            );
          })}
        </AnimatedSection>
      </div>
    </section>
  );
}
