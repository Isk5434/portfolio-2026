"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import LiveClock from "@/components/ui/LiveClock";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";

const PUBLIC_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const publicPath = (path: `/${string}`) => `${PUBLIC_BASE_PATH}${path}`;

// TODO: replace with your real email + social links.
const EMAIL = "hello@example.com";
const socials = [
  { label: "Instagram", href: "#" },
  { label: "X / Twitter", href: "#" },
  { label: "GitHub", href: "#" },
];

export default function Contact() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Guarantee muted autoplay across browsers (React's `muted` prop is flaky).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  return (
    <footer
      id="contact"
      className="relative isolate overflow-hidden bg-bg"
    >
      {/* Background video (Video Project 6) — grayscale to match the editorial palette.
          Brightened (opacity-80) so the cherry blossoms read clearly on every device. */}
      <video
        ref={videoRef}
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-80 grayscale"
        src={publicPath("/video/project6.mp4")}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      {/* Legibility scrim — darker toward the bottom for the footer text */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-bg/75 to-bg/55"
      />
      {/* Very fine halftone dot-screen over the video */}
      <div
        aria-hidden
        className="dot-screen pointer-events-none absolute inset-0 opacity-70"
      />

      <div className="relative z-10 mx-auto max-w-[1600px] px-5 pt-28 md:px-8 md:pt-40">
        <AnimatedSection>
          <AnimatedItem>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
              Contact
            </p>
          </AnimatedItem>
          <AnimatedItem>
            <a
              href={`mailto:${EMAIL}`}
              className="group mt-8 inline-flex items-start gap-2"
            >
              <h2 className="display text-[13vw] leading-[0.85] transition-colors group-hover:text-accent md:text-[9vw]">
                LET&apos;S TALK
              </h2>
              <ArrowUpRight
                weight="light"
                className="mt-2 h-8 w-8 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 md:h-14 md:w-14"
              />
            </a>
          </AnimatedItem>
          <AnimatedItem>
            <a
              href={`mailto:${EMAIL}`}
              className="mt-8 inline-block border-b border-line pb-1 font-mono text-sm tracking-wide text-fg/80 transition-colors hover:text-accent"
            >
              {EMAIL}
            </a>
          </AnimatedItem>
        </AnimatedSection>

        <div className="mt-24 flex flex-col gap-8 border-t border-line py-10 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-6 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="transition-colors hover:text-fg"
              >
                {s.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-6 font-mono text-[11px] tracking-[0.2em] text-muted">
            <LiveClock />
            <span>© {new Date().getFullYear()} @</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
