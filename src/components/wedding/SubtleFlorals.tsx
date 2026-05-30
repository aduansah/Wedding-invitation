"use client";

const petals = [
  { left: "8%", delay: "0s", duration: "18s", size: 10, tone: "#e8b4d4" },
  { left: "22%", delay: "4s", duration: "22s", size: 8, tone: "#d4af37" },
  { left: "48%", delay: "2s", duration: "20s", size: 9, tone: "#c9a0dc" },
  { left: "72%", delay: "6s", duration: "19s", size: 8, tone: "#f0d78c" },
  { left: "88%", delay: "1s", duration: "21s", size: 7, tone: "#e8b4d4" },
] as const;

const leaves = [
  { top: "18%", left: "6%", delay: "0s", rotate: -24 },
  { top: "62%", left: "90%", delay: "2.5s", rotate: 18 },
  { top: "78%", left: "14%", delay: "1.2s", rotate: -12 },
] as const;

export function SubtleFlorals() {
  return (
    <div className="subtle-florals pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden="true">
      {petals.map((petal, index) => (
        <span
          key={`petal-${index}`}
          className="floral-petal absolute top-0 rounded-full opacity-50"
          style={{
            left: petal.left,
            width: petal.size,
            height: petal.size * 1.35,
            background: `linear-gradient(180deg, ${petal.tone}, transparent)`,
            borderRadius: "50% 50% 50% 0",
            animationDuration: petal.duration,
            animationDelay: petal.delay,
          }}
        />
      ))}

      {leaves.map((leaf, index) => (
        <span
          key={`leaf-${index}`}
          className="floral-leaf absolute opacity-40"
          style={{
            top: leaf.top,
            left: leaf.left,
            animationDelay: leaf.delay,
            transform: `rotate(${leaf.rotate}deg)`,
          }}
        >
          <svg width="18" height="28" viewBox="0 0 18 28" fill="none" aria-hidden="true">
            <path
              d="M9 2 C9 2, 15 10, 14 22 C13 26, 9 26, 9 26 C9 26, 5 26, 4 22 C3 10, 9 2, 9 2 Z"
              fill="#7b9e6b"
              fillOpacity="0.85"
            />
            <path d="M9 5 L9 24" stroke="#5a7a4d" strokeWidth="0.5" opacity="0.5" />
          </svg>
        </span>
      ))}
    </div>
  );
}
