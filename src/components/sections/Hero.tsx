"use client";

import { useEffect, useRef, useState } from "react";
import LiveClock from "@/components/ui/LiveClock";

const FRAME_COUNT = 153;
const PUBLIC_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const framePath = (i: number) =>
  `${PUBLIC_BASE_PATH}/frame/frame_${String(i).padStart(4, "0")}.jpg`;
const MOBILE_FRAME_HEIGHT_RATIO = 0.82;
const MOBILE_FOCUS_X = 0.21;
const LETTERBOX_COLOR = "#0b0b0b";
const LOAD_HOLD_MS = 2000;
const LOAD_EXIT_MS = 1700;

// PARCO-style captions that fade in over the video at scroll thresholds.
const captions = [
  { id: "c1", show: 0.12, hide: 0.34, kicker: "01 — Motion", text: "Told in motion." },
  { id: "c2", show: 0.4, hide: 0.62, kicker: "02 — Craft", text: "Meaning in detail." },
  { id: "c3", show: 0.68, hide: 0.94, kicker: "03 — Person", text: "Made by a person." },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const tickingRef = useRef(false);
  const currentFrameRef = useRef(-1);
  const prevVisibleRef = useRef("");

  const [framesReady, setFramesReady] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);
  const [loaderLeaving, setLoaderLeaving] = useState(false);
  const [loadPct, setLoadPct] = useState(0);
  const [visible, setVisible] = useState<Set<string>>(new Set());

  // Preload every frame before the canvas starts; drive the loading bar.
  useEffect(() => {
    let count = 0;
    const imgs: HTMLImageElement[] = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const done = () => {
        count++;
        setLoadPct(count / FRAME_COUNT);
        if (count === FRAME_COUNT) setFramesReady(true);
      };
      img.onload = done;
      img.onerror = done; // never stall on a single bad frame
      img.src = framePath(i);
      imgs.push(img);
    }
    framesRef.current = imgs;
  }, []);

  useEffect(() => {
    if (!framesReady) return;

    const hold = window.setTimeout(() => {
      setLoaderLeaving(true);
    }, LOAD_HOLD_MS);
    const done = window.setTimeout(() => {
      setLoaderDone(true);
    }, LOAD_HOLD_MS + LOAD_EXIT_MS);

    return () => {
      window.clearTimeout(hold);
      window.clearTimeout(done);
    };
  }, [framesReady]);

  // Canvas engine: DPR sizing, cover-fit draw, RAF + ticking-ref scroll handler.
  useEffect(() => {
    if (!framesReady) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawFrame = (index: number) => {
      const img = framesRef.current[index];
      if (!img) return;
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      ctx.fillStyle = LETTERBOX_COLOR;
      ctx.fillRect(0, 0, cw, ch);
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = cw / ch;
      let drawW: number;
      let drawH: number;
      const portrait = cw <= 768;
      if (portrait) {
        drawH = ch * MOBILE_FRAME_HEIGHT_RATIO;
        drawW = drawH * imgRatio;
      } else if (canvasRatio > imgRatio) {
        drawW = cw;
        drawH = cw / imgRatio;
      } else {
        drawH = ch;
        drawW = ch * imgRatio;
      }
      // On phones, pull the 16:9 frame back slightly so the tall flowers stay in
      // view; the frame's own black bands blend into the canvas background.
      const focusX = portrait ? MOBILE_FOCUS_X : 0.5; // subject's horizontal centre (0 = left edge)
      const dx = cw / 2 - focusX * drawW;
      const dy = (ch - drawH) / 2;
      ctx.drawImage(img, dx, dy, drawW, drawH);
      currentFrameRef.current = index;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFrame(Math.max(0, currentFrameRef.current));
    };

    const update = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / scrollable));

      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.floor(p * FRAME_COUNT)
      );
      if (frameIndex !== currentFrameRef.current) drawFrame(frameIndex);

      // Hero title fades out across the first 8% of scroll.
      if (heroTextRef.current) {
        heroTextRef.current.style.opacity = String(Math.max(0, 1 - p / 0.08));
      }

      // Captions: only call setState when the visible set actually changes.
      const next = new Set<string>();
      for (const c of captions) if (p >= c.show && p < c.hide) next.add(c.id);
      const key = [...next].sort().join(",");
      if (key !== prevVisibleRef.current) {
        prevVisibleRef.current = key;
        setVisible(next);
      }

      tickingRef.current = false;
    };

    const onScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(update);
      }
    };

    resize();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, [framesReady]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="scroll-animation relative bg-bg"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* legibility scrim */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/75" />

        {/* Hero title — fades out on scroll via ref */}
        <div
          ref={heroTextRef}
          className="pointer-events-none absolute inset-0 flex flex-col justify-between px-5 pb-12 pt-28 md:px-8 md:pb-16"
        >
          <div />
          <div>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.35em] text-white/70">
              Portfolio — 2026
            </p>
            <h1 className="display title-butler text-[22vw] text-white md:text-[15vw]">
              PERSON
            </h1>
            <p className="mt-6 max-w-[42ch] text-sm leading-relaxed text-white/85 md:text-base">
              Every scroll turns the film one frame further —
              <br className="hidden md:block" />
              a personal portfolio about the person behind the making.
            </p>
          </div>

          <div className="flex items-end justify-between">
            {/* scroll hint */}
            <div className="flex items-center gap-3 text-white/80">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
                Scroll
              </span>
              <span className="relative flex h-9 w-5 justify-center rounded-full border border-white/40">
                <span
                  className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white"
                  style={{ animation: "hintdot 1.5s ease-in-out infinite" }}
                />
              </span>
            </div>

            {/* live ticker — PARCO countdown energy */}
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
                Based in / Japan
              </p>
              <LiveClock className="font-mono text-xs text-white md:text-sm" />
            </div>
          </div>
        </div>

        {/* Scroll captions */}
        {captions.map((c) => (
          <div
            key={c.id}
            className={`pointer-events-none absolute bottom-24 right-5 max-w-[300px] text-right transition-all duration-500 md:bottom-28 md:right-10 ${
              visible.has(c.id)
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              {c.kicker}
            </p>
            <p className="mt-2 text-2xl text-white md:text-4xl">{c.text}</p>
          </div>
        ))}

        {/* Frame preload overlay */}
        {!loaderDone && (
          <div
            className={`loader-overlay absolute inset-0 z-30 ${
              loaderLeaving ? "loader-overlay--leaving" : ""
            }`}
          >
            <div className="loader-panel absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-muted">
                Loading frames
              </p>
              <div className="mt-5 h-px w-56 overflow-hidden bg-line">
                <div
                  className="h-full bg-fg transition-[width] duration-150"
                  style={{ width: `${Math.round(loadPct * 100)}%` }}
                />
              </div>
              <p className="mt-3 font-mono text-xs tabular-nums text-fg">
                {String(Math.round(loadPct * 100)).padStart(3, "0")}%
              </p>
            </div>
            <div className="loader-vr-glow" aria-hidden="true" />
          </div>
        )}
      </div>
    </section>
  );
}
