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
      className="relative flex h-14 w-12 items-center justify-center md:h-12 md:w-10"
      aria-hidden="true"
    >
      {!reducedMotion ? (
        <span className="scroll-guide-pulse-ring absolute inset-0 rounded-full" />
      ) : null}
      <svg
        viewBox="0 0 24 40"
        className={`relative h-14 w-7 text-gold drop-shadow-[0_2px_6px_rgba(74,45,110,0.35)] md:h-11 md:w-6 ${reducedMotion ? "" : "animate-scroll-guide-arrow-intense"}`}
        fill="none"
      >
        <path
          d="M4 6 L12 14 L20 6"
          stroke="currentColor"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 16 L12 24 L20 16"
          stroke="currentColor"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.88"
        />
        <path
          d="M4 26 L12 34 L20 26"
          stroke="currentColor"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.62"
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
        <>
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-24 bg-gradient-to-t from-purple-deep/35 via-purple-deep/10 to-transparent max-md:h-28 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            aria-hidden="true"
          />

          <motion.a
            href={href}
            aria-label={`${label} — jump to our story`}
            className="scroll-guide group absolute left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-1 max-md:bottom-2 md:bottom-9 md:gap-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.55, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-col items-center max-md:rounded-2xl max-md:border max-md:border-white/35 max-md:bg-purple-deep/55 max-md:px-4 max-md:py-2.5 max-md:shadow-[0_10px_32px_rgba(45,22,70,0.35)] max-md:backdrop-blur-md">
              <div className="relative flex flex-col items-center">
                <span
                  className="scroll-guide-line scroll-guide-line-intense mb-1 block h-10 w-[3px] rounded-full bg-gradient-to-b from-white/20 via-gold to-gold md:h-8 md:w-[2px]"
                  aria-hidden="true"
                />
                <span
                  className="scroll-guide-track-dot absolute top-0 h-2 w-2 rounded-full bg-gold shadow-[0_0_10px_rgba(201,162,39,0.85)]"
                  aria-hidden="true"
                />
                <ScrollChevrons reducedMotion={reducedMotion} />
              </div>

              <span className="scroll-guide-label scroll-guide-label-intense mt-1 inline-flex items-center rounded-full border border-gold/70 bg-white/92 px-4 py-1.5 font-[family-name:var(--font-sans)] text-[10px] font-bold tracking-[0.26em] text-purple-deep uppercase shadow-[0_6px_20px_rgba(74,45,110,0.22)] backdrop-blur-sm md:mt-0 md:px-5 md:py-2 md:text-xs md:tracking-[0.28em]">
                {label}
              </span>

              <span className="mt-1 font-[family-name:var(--font-sans)] text-[9px] font-semibold tracking-[0.22em] text-white/90 uppercase md:hidden">
                Swipe up for our story
              </span>
            </div>
          </motion.a>
        </>
      ) : null}
    </AnimatePresence>
  );
}
