import type { CSSProperties } from "react";

/**
 * Decorative celestial dial — a dotted ring with tick marks, curved text,
 * crescent moons and a central sunburst. Purely ornamental (PARCO / astrology
 * style). The outer dial and inner sun rotate slowly in opposite directions;
 * the spin is CSS-driven and honours prefers-reduced-motion (see globals.css).
 *
 * Geometry is computed deterministically so it is SSR-safe (no hydration drift).
 */

const C = 200; // centre of the 400×400 viewBox

function fixed(n: number) {
  return Number(n.toFixed(3));
}

function pt(r: number, deg: number): readonly [number, number] {
  const a = ((deg - 90) * Math.PI) / 180; // 0° points up, grows clockwise
  return [fixed(C + r * Math.cos(a)), fixed(C + r * Math.sin(a))];
}

// 60 radial ticks, every 5th drawn longer (clock-face cadence)
const TICKS = Array.from({ length: 60 }, (_, i) => {
  const deg = i * 6;
  const major = i % 5 === 0;
  const [x1, y1] = pt(major ? 183 : 187, deg);
  const [x2, y2] = pt(194, deg);
  return { x1, y1, x2, y2, major };
});

// 36-spoke sunburst, alternating long / short rays
const RAYS = Array.from({ length: 36 }, (_, i) => {
  const deg = i * 10;
  const [x1, y1] = pt(15, deg);
  const [x2, y2] = pt(i % 2 === 0 ? 110 : 76, deg);
  return { x1, y1, x2, y2 };
});

// crescent moons sitting on the dotted ring at the four diagonals
const CRESCENTS = [45, 135, 225, 315].map((deg) => {
  const [cx, cy] = pt(180, deg);
  return { cx, cy, rot: deg - 90 };
});

// tiny accent dots at the cardinal points
const DOTS = [0, 90, 180, 270].map((deg) => pt(180, deg));

function crescentPath(cx: number, cy: number, r = 13, bulge = 0.55) {
  return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r * bulge} ${r} 0 1 0 ${cx} ${cy - r} Z`;
}

const TR = 156; // curved-text radius
const TEXT_PATH = `M 200 ${200 - TR} A ${TR} ${TR} 0 1 1 200 ${200 + TR} A ${TR} ${TR} 0 1 1 200 ${200 - TR}`;
const TEXT_LEN = fixed(2 * Math.PI * TR);
const LABEL = "✦  @  ·  CREATIVE STUDIO  ·  TO CREATE IS TO CARE  ·  MMXXVI  ";

type Props = { className?: string; style?: CSSProperties };

export default function CelestialRing({ className = "", style }: Props) {
  return (
    <svg
      viewBox="0 0 400 400"
      role="presentation"
      aria-hidden
      className={`celestial-ring h-auto w-full ${className}`}
      style={{ color: "#a9844f", ...style }}
    >
      {/* ── Outer dial: rotates slowly clockwise ───────────────────── */}
      <g className="celestial-ring__spin">
        <circle
          cx={C}
          cy={C}
          r={196}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          opacity={0.45}
        />
        <circle
          cx={C}
          cy={C}
          r={180}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray="0.5 7.5"
          opacity={0.6}
        />

        {TICKS.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke="currentColor"
            strokeWidth={t.major ? 1.2 : 0.7}
            opacity={t.major ? 0.6 : 0.4}
          />
        ))}

        <circle
          cx={C}
          cy={C}
          r={132}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          opacity={0.35}
        />

        {/* curved label stretched evenly around the full circle */}
        <defs>
          <path id="celestial-text-path" d={TEXT_PATH} />
        </defs>
        <text
          fill="currentColor"
          fontSize={11}
          letterSpacing={1}
          opacity={0.7}
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          <textPath
            href="#celestial-text-path"
            startOffset={0}
            textLength={TEXT_LEN}
            lengthAdjust="spacing"
          >
            {LABEL}
          </textPath>
        </text>

        {CRESCENTS.map((m, i) => (
          <path
            key={i}
            d={crescentPath(m.cx, m.cy)}
            transform={`rotate(${m.rot} ${m.cx} ${m.cy})`}
            fill="currentColor"
            opacity={0.8}
          />
        ))}

        {DOTS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={2.4} fill="currentColor" opacity={0.7} />
        ))}
      </g>

      {/* ── Inner sun: counter-rotates ─────────────────────────────── */}
      <g className="celestial-ring__sun">
        {RAYS.map((r, i) => (
          <line
            key={i}
            x1={r.x1}
            y1={r.y1}
            x2={r.x2}
            y2={r.y2}
            stroke="currentColor"
            strokeWidth={1}
            opacity={0.4}
          />
        ))}
        <circle cx={C} cy={C} r={3} fill="currentColor" opacity={0.8} />
      </g>
    </svg>
  );
}
