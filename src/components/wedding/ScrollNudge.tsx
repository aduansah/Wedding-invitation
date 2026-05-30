"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const NUDGE_DELAY_MS = 6000;
const ARROWS_LEAD_MS = 1200;
const NUDGE_DOWN_MS = 1600;
const NUDGE_HOLD_MS = 280;
const NUDGE_BACK_MS = 1500;

function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function getNudgeDistance(): number {
  return Math.round(Math.min(window.innerHeight * 0.2, 180));
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function animateScrollTo(
  targetY: number,
  durationMs: number,
  ease: (t: number) => number,
): Promise<void> {
  return new Promise((resolve) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min(1, (now - startTime) / durationMs);
      window.scrollTo(0, startY + distance * ease(progress));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(step);
  });
}

function GentleScrollArrows({ active }: { active: boolean }) {
  return (
    <div
      className={`flex flex-col items-center ${active ? "animate-scroll-nudge-arrows" : "opacity-70"}`}
      aria-hidden="true"
    >
      <ChevronDown className="h-4 w-4 text-purple-deep/50 drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]" strokeWidth={2.25} />
      <ChevronDown className="-mt-3 h-4 w-4 text-purple-deep/35 drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]" strokeWidth={2.25} />
    </div>
  );
}

type ScrollNudgeProps = {
  enabled?: boolean;
};

export function ScrollNudge({ enabled = false }: ScrollNudgeProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const ranRef = useRef(false);
  const nudgingRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [arrowsVisible, setArrowsVisible] = useState(false);
  const [nudgeActive, setNudgeActive] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!enabled || reducedMotion || ranRef.current) return;
    if (window.scrollY > 8) return;

    let cancelled = false;
    let delayTimer = 0;
    let arrowsTimer = 0;

    const hideArrows = () => {
      setArrowsVisible(false);
      setNudgeActive(false);
    };

    const cancelNudge = () => {
      if (nudgingRef.current) return;
      cancelled = true;
      ranRef.current = true;
      hideArrows();
    };

    const cancelOnUserIntent = () => {
      if (nudgingRef.current) return;
      cancelNudge();
    };

    const cancelOnUserScroll = () => {
      if (nudgingRef.current) return;
      if (window.scrollY > 8) {
        cancelNudge();
        window.clearTimeout(delayTimer);
        window.clearTimeout(arrowsTimer);
      }
    };

    const runNudge = async () => {
      if (cancelled || ranRef.current || window.scrollY > 8) return;

      ranRef.current = true;
      nudgingRef.current = true;
      setNudgeActive(true);

      const distance = getNudgeDistance();

      try {
        await animateScrollTo(distance, NUDGE_DOWN_MS, easeInOutSine);
        if (cancelled) return;

        await wait(NUDGE_HOLD_MS);
        if (cancelled) return;

        await animateScrollTo(0, NUDGE_BACK_MS, easeInOutSine);
      } finally {
        nudgingRef.current = false;
        setNudgeActive(false);
        window.setTimeout(hideArrows, 700);
      }
    };

    arrowsTimer = window.setTimeout(() => {
      if (!cancelled && !ranRef.current) {
        setArrowsVisible(true);
      }
    }, Math.max(0, NUDGE_DELAY_MS - ARROWS_LEAD_MS));

    delayTimer = window.setTimeout(() => {
      void runNudge();
    }, NUDGE_DELAY_MS);

    window.addEventListener("wheel", cancelOnUserIntent, { passive: true });
    window.addEventListener("touchmove", cancelOnUserIntent, { passive: true });
    window.addEventListener("keydown", cancelOnUserIntent);
    window.addEventListener("scroll", cancelOnUserScroll, { passive: true });

    return () => {
      cancelled = true;
      window.clearTimeout(delayTimer);
      window.clearTimeout(arrowsTimer);
      hideArrows();
      window.removeEventListener("wheel", cancelOnUserIntent);
      window.removeEventListener("touchmove", cancelOnUserIntent);
      window.removeEventListener("keydown", cancelOnUserIntent);
      window.removeEventListener("scroll", cancelOnUserScroll);
    };
  }, [enabled, reducedMotion]);

  const arrows =
    mounted && arrowsVisible && !reducedMotion ? (
      <AnimatePresence>
        <motion.div
          className="pointer-events-none fixed bottom-[4.75rem] left-1/2 z-[290] -translate-x-1/2 md:hidden"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <GentleScrollArrows active={nudgeActive} />
        </motion.div>
      </AnimatePresence>
    ) : null;

  return arrows ? createPortal(arrows, document.body) : null;
}
