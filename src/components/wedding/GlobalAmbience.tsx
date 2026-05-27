"use client";

import { motion } from "framer-motion";

const petals = [
  { left: "8%", color: "#e8b4d4", size: 14, delay: 0, duration: 14 },
  { left: "22%", color: "#c9a962", size: 10, delay: 2, duration: 18 },
  { left: "38%", color: "#b794f6", size: 12, delay: 1, duration: 16 },
  { left: "55%", color: "#f9a8d4", size: 11, delay: 3, duration: 15 },
  { left: "72%", color: "#fcd34d", size: 9, delay: 0.5, duration: 17 },
  { left: "88%", color: "#d8b4fe", size: 13, delay: 2.5, duration: 19 },
  { left: "15%", color: "#fda4af", size: 8, delay: 4, duration: 13 },
  { left: "65%", color: "#fde68a", size: 10, delay: 1.5, duration: 20 },
];

const flares = [
  { top: "12%", left: "10%", color: "rgba(248, 200, 210, 0.24)", size: 180 },
  { top: "35%", left: "78%", color: "rgba(252, 238, 230, 0.3)", size: 220 },
  { top: "62%", left: "20%", color: "rgba(255, 252, 249, 0.4)", size: 200 },
  { top: "80%", left: "70%", color: "rgba(249, 168, 212, 0.18)", size: 160 },
];

export function GlobalAmbience() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {flares.map((flare, i) => (
        <motion.div
          key={`flare-${i}`}
          className="absolute rounded-full blur-3xl"
          style={{
            top: flare.top,
            left: flare.left,
            width: flare.size,
            height: flare.size,
            background: flare.color,
          }}
          animate={{
            opacity: [0.2, 0.55, 0.25],
            scale: [1, 1.2, 1],
            x: [0, i % 2 === 0 ? 20 : -15, 0],
          }}
          transition={{ duration: 8 + i, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {petals.map((petal, i) => (
        <motion.span
          key={`petal-${i}`}
          className="absolute top-0 rounded-full opacity-60"
          style={{
            left: petal.left,
            width: petal.size,
            height: petal.size * 1.4,
            background: `linear-gradient(180deg, ${petal.color}, transparent)`,
            borderRadius: "50% 50% 50% 0",
          }}
          animate={{
            y: ["-5vh", "105vh"],
            x: [0, i % 2 === 0 ? 30 : -25, 10],
            rotate: [0, 180, 360],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
