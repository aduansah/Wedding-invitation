"use client";

import { motion } from "framer-motion";

const flares = [
  {
    className: "top-[8%] left-[12%] h-48 w-48 bg-amber-100/25",
    duration: 9,
    delay: 0,
  },
  {
    className: "top-[18%] right-[8%] h-56 w-56 bg-champagne/20",
    duration: 11,
    delay: 1.5,
  },
  {
    className: "top-[42%] left-[55%] h-72 w-72 bg-gold/15",
    duration: 13,
    delay: 0.8,
  },
  {
    className: "bottom-[28%] left-[18%] h-40 w-40 bg-amber-200/20",
    duration: 10,
    delay: 2,
  },
  {
    className: "top-[30%] left-[38%] h-32 w-32 bg-white/10",
    duration: 7,
    delay: 1,
  },
];

export function HeroLightFlares() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[6] overflow-hidden">
      {flares.map((flare, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full blur-3xl ${flare.className}`}
          animate={{
            opacity: [0.15, 0.55, 0.2],
            scale: [1, 1.25, 1],
            x: [0, index % 2 === 0 ? 24 : -20, 0],
            y: [0, index % 2 === 0 ? -16 : 12, 0],
          }}
          transition={{
            duration: flare.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: flare.delay,
          }}
        />
      ))}

      <motion.div
        className="absolute top-[22%] left-1/2 h-px w-[min(70vw,520px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-champagne-light/50 to-transparent"
        animate={{ opacity: [0.1, 0.45, 0.1], scaleX: [0.85, 1, 0.85] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="hero-lens-flare absolute top-[26%] left-1/2 h-24 w-24 -translate-x-1/2 rounded-full"
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.9, 1.15, 0.9] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
    </div>
  );
}
