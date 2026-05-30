"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const NUDGE_DELAY_MS = 1200;
const NUDGE_DOWN_MS = 520;
const NUDGE_BACK_MS = 680;
const NUDGE_DISTANCE = 132;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function animateScrollTo(targetY: number, durationMs: number): Promise<void> {
  return new Promise((resolve) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min(1, (now - startTime) / durationMs);
      const eased = easeInOutCubic(progress);
      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(step);
  });
}

type ScrollNudgeProps = {
  enabled?: boolean;
};

export function ScrollNudge({ enabled = false }: ScrollNudgeProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const ranRef = useRef(false);

  useEffect(() => {
    if (!enabled || reducedMotion || ranRef.current) return;
    if (window.scrollY > 8) return;

    let cancelled = false;
    const delayTimer = window.setTimeout(async () => {
      if (cancelled || ranRef.current || window.scrollY > 8) return;

      ranRef.current = true;

      await animateScrollTo(NUDGE_DISTANCE, NUDGE_DOWN_MS);
      if (cancelled) return;

      await animateScrollTo(0, NUDGE_BACK_MS);
    }, NUDGE_DELAY_MS);

    const cancelOnUserScroll = () => {
      if (window.scrollY > 12) {
        cancelled = true;
        ranRef.current = true;
        window.clearTimeout(delayTimer);
      }
    };

    window.addEventListener("scroll", cancelOnUserScroll, { passive: true });

    return () => {
      cancelled = true;
      window.clearTimeout(delayTimer);
      window.removeEventListener("scroll", cancelOnUserScroll);
    };
  }, [enabled, reducedMotion]);

  return null;
}
