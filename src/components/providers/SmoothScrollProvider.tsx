"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Physics-based smooth scroll (Lenis), wrapping the whole app at the root.
 * Safari-safe defaults: gentle lerp, no syncTouch. `anchors` makes in-page
 * #links scroll smoothly. The frame-sequence canvas listens to native scroll
 * events, which Lenis still dispatches — no special bridge needed.
 *
 * Append `?nolenis` to the URL to fall back to native scrolling (useful for
 * automated screenshots, debugging, and reduced-motion testing).
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [smooth, setSmooth] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!params.has("nolenis") && !reduce) return;
    const id = window.setTimeout(() => setSmooth(false), 0);
    return () => window.clearTimeout(id);
  }, []);

  if (!smooth) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        anchors: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
