"use client";

const flares = [
  { top: "12%", left: "10%", color: "rgba(248, 200, 210, 0.24)", size: 160, delay: "0s" },
  { top: "62%", left: "20%", color: "rgba(255, 252, 249, 0.35)", size: 180, delay: "2s" },
];

const petals = [
  { left: "12%", color: "#e8b4d4", size: 12, duration: "16s", delay: "0s" },
  { left: "48%", color: "#f9a8d4", size: 10, duration: "18s", delay: "3s" },
  { left: "78%", color: "#fda4af", size: 11, duration: "15s", delay: "1.5s" },
];

export function GlobalAmbience() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden="true">
      {flares.map((flare, i) => (
        <div
          key={`flare-${i}`}
          className="ambience-flare absolute rounded-full blur-3xl"
          style={{
            top: flare.top,
            left: flare.left,
            width: flare.size,
            height: flare.size,
            background: flare.color,
            animationDelay: flare.delay,
          }}
        />
      ))}

      {petals.map((petal, i) => (
        <span
          key={`petal-${i}`}
          className="ambience-petal absolute top-0 rounded-full opacity-60"
          style={{
            left: petal.left,
            width: petal.size,
            height: petal.size * 1.35,
            background: `linear-gradient(180deg, ${petal.color}, transparent)`,
            borderRadius: "50% 50% 50% 0",
            animationDuration: petal.duration,
            animationDelay: petal.delay,
          }}
        />
      ))}
    </div>
  );
}
