"use client";

import { motion } from "framer-motion";

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
        strokeWidth="0.8"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M25 95C35 75 45 65 55 60C48 58 40 50 38 40C46 42 52 48 55 58C62 48 72 42 82 40C80 50 72 58 65 60C75 65 85 75 95 95"
        stroke="currentColor"
        strokeWidth="0.6"
        fill="none"
        opacity="0.3"
      />
      <circle cx="55" cy="58" r="3" fill="currentColor" opacity="0.25" />
      <circle cx="65" cy="52" r="2" fill="currentColor" opacity="0.2" />
      <circle cx="48" cy="52" r="2" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

export function FloatingFlorals() {
  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-10 text-champagne/30"
        animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <FloralCorner className="h-24 w-24 md:h-32 md:w-32" />
      </motion.div>

      <motion.div
        className="pointer-events-none fixed top-0 right-0 z-10 text-champagne/30"
        animate={{ y: [0, -10, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{ transform: "scaleX(-1)" }}
      >
        <FloralCorner className="h-24 w-24 md:h-32 md:w-32" />
      </motion.div>

      <motion.div
        className="pointer-events-none fixed bottom-0 left-0 z-10 text-champagne/25"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        style={{ transform: "scaleY(-1)" }}
      >
        <FloralCorner className="h-20 w-20 md:h-28 md:w-28" />
      </motion.div>

      <motion.div
        className="pointer-events-none fixed right-0 bottom-0 z-10 text-champagne/25"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        style={{ transform: "scale(-1)" }}
      >
        <FloralCorner className="h-20 w-20 md:h-28 md:w-28" />
      </motion.div>
    </>
  );
}
