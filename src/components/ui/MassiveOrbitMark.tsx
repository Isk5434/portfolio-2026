import type { CSSProperties } from "react";

/**
 * Oversized abstract orbit for clipped panel decoration.
 * No moons, radial ticks, curved type, or sunburst, so it reads separately from
 * the smaller celestial dial used near the heading.
 */

type Props = {
  className?: string;
  style?: CSSProperties;
};

const C = 200;
const RINGS = [
  { r: 190, width: 3.5, dash: "260 70 46 120", opacity: 0.7 },
  { r: 164, width: 1.5, dash: "34 26 210 54", opacity: 0.45 },
  { r: 132, width: 5, dash: "150 240", opacity: 0.2 },
  { r: 96, width: 1.25, dash: "20 18", opacity: 0.36 },
];

const NODES = [
  { x: 72, y: 156, r: 5 },
  { x: 232, y: 36, r: 3 },
  { x: 352, y: 244, r: 6 },
  { x: 126, y: 334, r: 4 },
];

export default function MassiveOrbitMark({ className = "", style }: Props) {
  return (
    <svg
      viewBox="0 0 400 400"
      role="presentation"
      aria-hidden
      className={`massive-orbit h-auto w-full ${className}`}
      style={{ color: "#352109", ...style }}
    >
      <g className="massive-orbit__turn">
        {RINGS.map((ring) => (
          <circle
            key={ring.r}
            cx={C}
            cy={C}
            r={ring.r}
            fill="none"
            stroke="currentColor"
            strokeWidth={ring.width}
            strokeLinecap="butt"
            strokeDasharray={ring.dash}
            opacity={ring.opacity}
          />
        ))}
        <ellipse
          cx={C}
          cy={C}
          rx={186}
          ry={104}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          opacity={0.44}
          transform={`rotate(-24 ${C} ${C})`}
        />
        <ellipse
          cx={C}
          cy={C}
          rx={118}
          ry={198}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.2}
          opacity={0.32}
          transform={`rotate(31 ${C} ${C})`}
        />
      </g>

      <g className="massive-orbit__counter">
        <path
          d="M 42 236 C 112 126, 236 82, 360 112"
          fill="none"
          stroke="currentColor"
          strokeWidth={9}
          strokeLinecap="butt"
          opacity={0.16}
        />
        <path
          d="M 58 276 C 154 380, 296 366, 356 258"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="butt"
          opacity={0.46}
        />
        {NODES.map((node) => (
          <circle
            key={`${node.x}-${node.y}`}
            cx={node.x}
            cy={node.y}
            r={node.r}
            fill="currentColor"
            opacity={0.46}
          />
        ))}
      </g>
    </svg>
  );
}
