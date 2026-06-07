"use client";

import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Live local date/time ticker — gives the page the kinetic energy of the
 * PARCO person2026 countdown. Renders a stable placeholder on the server to
 * avoid hydration mismatch, then starts ticking after mount.
 */
export default function LiveClock({
  showDate = true,
  className = "",
}: {
  showDate?: boolean;
  className?: string;
}) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const date = now
    ? `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}`
    : "----.--.--";
  const time = now
    ? `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    : "--:--:--";

  return (
    <span className={`tabular-nums ${className}`} suppressHydrationWarning>
      {showDate ? `${date} ${time}` : time}
    </span>
  );
}
