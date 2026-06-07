"use client";

/** Seamless infinite marquee. Items are duplicated and the track slides -50%. */
export default function Marquee({
  items,
  reverse = false,
  duration = 30,
  className = "",
}: {
  items: string[];
  reverse?: boolean;
  duration?: number;
  className?: string;
}) {
  return (
    <div className="marquee">
      <div
        className="marquee-track"
        style={
          {
            "--marquee-duration": `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        {[...items, ...items].map((label, i) => (
          <span key={i} className={`inline-flex items-center ${className}`}>
            <span className="mx-7">{label}</span>
            <span className="text-accent">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
