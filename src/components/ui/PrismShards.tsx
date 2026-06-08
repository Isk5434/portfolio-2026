import type { CSSProperties } from "react";

/**
 * Prismatic glass shards — scattered translucent triangles that revolve along
 * small circular orbits and twinkle, like crystalline fragments drifting in
 * light (Project Sekai / プロセカ vibe).
 *
 * Each chip ORBITS (its centre traces a circle) rather than spinning on its own
 * axis — the keyframe counter-rotates so the triangle keeps its orientation.
 * Geometry is deterministic so it is SSR-safe (no hydration drift); the motion
 * is CSS-driven and honours prefers-reduced-motion (see globals.css).
 */

type Props = { className?: string; style?: CSSProperties };

const fixed = (n: number) => Number(n.toFixed(2));

// Local triangle outlines (origin-centred, scaled by `s`). Sharp = tall apex +
// short base; `equ` is the heavier equilateral shape, kept small via the seeds.
const SHAPES = {
  spike: [
    [0, -1.15],
    [0.24, 0.72],
    [-0.24, 0.72],
  ],
  sliver: [
    [0, -1.1],
    [0.12, 0.86],
    [-0.12, 0.86],
  ],
  shard: [
    [0, -1],
    [0.72, 0.46],
    [-0.4, 0.68],
  ],
  equ: [
    [0, -0.82],
    [0.71, 0.41],
    [-0.71, 0.41],
  ],
} as const;

const SHAPE_KEYS = ["spike", "sliver", "shard", "equ"] as const;
type ShapeKey = (typeof SHAPE_KEYS)[number];

const SIZE_SCALE = 1.35; // overall shard size multiplier
const ORBIT_SPEED = 3; // revolve ~3× faster (smaller duration)

// Place a shape: rotate by `rot`, scale by `s`, translate to (cx, cy).
function shard(shape: ShapeKey, cx: number, cy: number, s: number, rot: number) {
  const a = (rot * Math.PI) / 180;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  return SHAPES[shape]
    .map(([lx, ly]) => {
      const x = cx + s * (lx * cos - ly * sin);
      const y = cy + s * (lx * sin + ly * cos);
      return `${fixed(x)},${fixed(y)}`;
    })
    .join(" ");
}

// cx, cy, size, rotation, shape index, gradient index, base opacity,
// orbit radius, orbit duration (s), direction (+1/-1), phase (0..1),
// twinkle duration (s)
// Orbits are kept cohesive: tight radius/period band + a single shared
// direction, so only the start phase differs (shards circle in unison).
const SEEDS: ReadonlyArray<
  [number, number, number, number, number, number, number, number, number, number, number, number]
> = [
  [80, 80, 46, 10, 0, 0, 0.5, 18, 26, 1, 0.0, 8],
  [200, 150, 30, -35, 2, 1, 0.42, 20, 28, 1, 0.45, 10],
  [150, 300, 26, 60, 1, 2, 0.4, 18, 26, 1, 0.7, 9],
  [300, 90, 50, 65, 0, 3, 0.46, 20, 28, 1, 0.2, 9],
  [330, 250, 22, 120, 3, 4, 0.4, 16, 24, 1, 0.85, 7],
  [420, 160, 34, -20, 2, 0, 0.44, 18, 26, 1, 0.55, 8],
  [470, 330, 28, 45, 1, 1, 0.38, 20, 28, 1, 0.1, 8],
  [540, 70, 48, -15, 0, 2, 0.5, 18, 26, 1, 0.6, 11],
  [610, 210, 30, 140, 2, 3, 0.44, 20, 28, 1, 0.3, 9],
  [560, 350, 18, 30, 3, 4, 0.34, 16, 24, 1, 0.9, 6],
  [700, 130, 44, 95, 0, 1, 0.48, 18, 26, 1, 0.4, 10],
  [720, 60, 16, 35, 3, 0, 0.32, 16, 24, 1, 0.05, 6],
  [680, 300, 26, -55, 2, 2, 0.4, 20, 28, 1, 0.75, 8],
  [800, 220, 32, -70, 1, 3, 0.42, 18, 26, 1, 0.15, 8],
  [860, 110, 38, 20, 0, 4, 0.46, 20, 28, 1, 0.5, 9],
  [880, 330, 20, -40, 3, 1, 0.34, 16, 24, 1, 0.65, 6],
  [960, 180, 30, -110, 1, 2, 0.4, 18, 26, 1, 0.35, 8],
  [980, 90, 38, 24, 2, 3, 0.44, 20, 28, 1, 0.8, 9],
  [1060, 260, 46, -28, 0, 4, 0.5, 18, 26, 1, 0.0, 10],
  [1120, 130, 24, 55, 1, 0, 0.38, 20, 28, 1, 0.55, 7],
  [1100, 350, 18, -18, 3, 2, 0.34, 16, 24, 1, 0.25, 6],
  [240, 230, 28, -75, 0, 3, 0.42, 18, 26, 1, 0.95, 8],
  [400, 60, 22, 150, 2, 4, 0.38, 20, 28, 1, 0.45, 7],
  [1000, 340, 30, 75, 1, 1, 0.4, 18, 26, 1, 0.15, 8],
];

// Prismatic glass gradients (Project Sekai holographic palette)
const GRADS: ReadonlyArray<readonly [string, string]> = [
  ["#2fd3e6", "#bff7ff"], // teal
  ["#ff5fb0", "#ffd6ec"], // pink
  ["#8c6dff", "#ddd3ff"], // violet
  ["#ffce5c", "#fff3cf"], // gold
  ["#57e3b0", "#d6fff0"], // mint
];

export default function PrismShards({ className = "", style }: Props) {
  return (
    <svg
      viewBox="0 0 1200 400"
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
      aria-hidden
      className={`prism-shards h-full w-full ${className}`}
      style={style}
    >
      <defs>
        {GRADS.map(([from, to], i) => (
          <linearGradient key={i} id={`shard-grad-${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} stopOpacity={0.85} />
            <stop offset="100%" stopColor={to} stopOpacity={0.08} />
          </linearGradient>
        ))}
      </defs>

      {SEEDS.map(
        ([cx, cy, s, rot, sh, g, op, orbitR, orbitDur, dir, phase, twkDur], i) => {
          const dur = fixed(orbitDur / ORBIT_SPEED);
          return (
            <g
              key={i}
              className="prism-shards__chip"
              style={
                {
                  "--o0": op,
                  "--o1": Math.min(op + 0.3, 0.95),
                  "--orbit": `${orbitR}px`,
                  animationDuration: `${dur}s, ${twkDur}s`,
                  animationDelay: `${fixed(-phase * dur)}s, ${fixed(-(i % 5) * 0.7)}s`,
                  animationDirection: `${dir > 0 ? "normal" : "reverse"}, alternate`,
                } as CSSProperties
              }
            >
              <polygon
                points={shard(SHAPE_KEYS[sh], cx, cy, s * SIZE_SCALE, rot)}
                fill={`url(#shard-grad-${g})`}
                stroke="rgba(255,255,255,0.75)"
                strokeWidth={1.1}
                strokeLinejoin="round"
              />
            </g>
          );
        },
      )}
    </svg>
  );
}
