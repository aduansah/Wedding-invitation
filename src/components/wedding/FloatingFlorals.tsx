"use client";

import { motion } from "framer-motion";

const corners = [
  { className: "top-0 left-0 text-purple/35", delay: 0, rotate: 0 },
  { className: "top-0 right-0 text-blush/40", delay: 1, rotate: 90 },
  { className: "bottom-0 left-0 text-gold/30", delay: 0.5, rotate: -90 },
  { className: "bottom-0 right-0 text-lavender/35", delay: 1.5, rotate: 180 },
];

function FloralCorner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10 110C10 80 30 60 50 50C35 45 20 30 15 10C40 15 55 30 60 50C70 30 85 15 110 10C105 30 90 45 75 50C95 60 110 80 110 110"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
      <circle cx="55" cy="58" r="4" fill="currentColor" opacity="0.35" />
      <circle cx="68" cy="50" r="3" fill="currentColor" opacity="0.25" />
    </svg>
  );
}

export function FloatingFlorals() {
  return (
    <>
      {corners.map((corner, i) => (
        <motion.div
          key={i}
          className={`pointer-events-none fixed z-[3] ${corner.className}`}
          style={{ transform: `rotate(${corner.rotate}deg)` }}
          animate={{ y: [0, -10, 0], opacity: [0.5, 0.9, 0.5] }}
          transition={{
            duration: 7 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: corner.delay,
          }}
        >
          <FloralCorner className="h-24 w-24 md:h-36 md:w-36" />
        </motion.div>
      ))}
    </>
  );
}
