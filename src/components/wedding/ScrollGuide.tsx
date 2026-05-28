"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type ScrollGuideProps = {
  visible?: boolean;
  href?: string;
  label?: string;
};

function ScrollChevrons({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div
      className="relative flex h-10 w-10 items-center justify-center"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 32"
        className={`h-10 w-6 text-purple-deep drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)] ${reducedMotion ? "" : "animate-scroll-guide-arrow"}`}
        fill="none"
      >
        <path
          d="M4 8 L12 16 L20 8"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 16 L12 24 L20 16"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.72"
        />
      </svg>
    </div>
  );
}

export function ScrollGuide({
  visible = false,
  href = "#story",
  label = "Scroll to explore",
}: ScrollGuideProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const handleScroll = () => {
      if (window.scrollY > 56) {
        setDismissed(true);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && !dismissed ? (
        <motion.a
          href={href}
          aria-label={`${label} — jump to our story`}
          className="scroll-guide group absolute bottom-6 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-2.5 md:bottom-9"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.55, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="scroll-guide-label inline-flex items-center rounded-full border border-gold/55 bg-white/88 px-5 py-2 font-[family-name:var(--font-sans)] text-[11px] font-semibold tracking-[0.28em] text-purple-deep uppercase shadow-[0_8px_24px_rgba(74,45,110,0.14)] backdrop-blur-sm md:text-xs">
            {label}
          </span>

          <div className="flex flex-col items-center">
            <span
              className="scroll-guide-line mb-1 block h-8 w-[2px] rounded-full bg-gradient-to-b from-purple-deep/25 via-gold to-gold"
              aria-hidden="true"
            />
            <ScrollChevrons reducedMotion={reducedMotion} />
          </div>
        </motion.a>
      ) : null}
    </AnimatePresence>
  );
}
