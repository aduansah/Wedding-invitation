"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COUPLE } from "@/lib/constants";

type EnvelopeRevealProps = {
  onReveal: () => void;
  onFinish?: () => void;
  /** Called synchronously on tap — use to start audio within the user gesture */
  onOpenStart?: () => void;
};

type OpenPhase = "closed" | "seal" | "flap" | "letter" | "exit";

export function EnvelopeReveal({ onReveal, onFinish, onOpenStart }: EnvelopeRevealProps) {
  const [phase, setPhase] = useState<OpenPhase>("closed");
  const touchStart = useRef({ x: 0, y: 0, time: 0 });
  const hasTriggered = useRef(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const runOpenSequence = useCallback(() => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;

    onOpenStart?.();

    setPhase("seal");
    setTimeout(() => setPhase("flap"), 400);
    setTimeout(() => setPhase("letter"), 1050);
    setTimeout(() => {
      setPhase("exit");
      onReveal();
    }, 1950);
    setTimeout(() => {
      onFinish?.();
      document.body.style.overflow = "";
    }, 2700);
  }, [onReveal, onFinish, onOpenStart]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const elapsed = Date.now() - touchStart.current.time;

    if (
      Math.hypot(dx, dy) > 30 ||
      dy < -20 ||
      (Math.hypot(dx, dy) < 12 && elapsed < 400)
    ) {
      runOpenSequence();
    }
  };

  const isOpening = phase !== "closed";
  const isExit = phase === "exit";

  return (
    <motion.div
      className="envelope-stage fixed inset-0 z-[200] flex touch-none select-none flex-col items-center justify-center bg-transparent"
      role="button"
      tabIndex={0}
      aria-label="Tap or swipe to open wedding invitation"
      onClick={runOpenSequence}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") runOpenSequence();
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      initial={{ opacity: 1 }}
      animate={{ opacity: isExit ? 0 : 1 }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#ebe4d8] via-[#f5efe6] to-[#e8dfd2]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.55)_0%,transparent_60%)]" />

      <motion.div
        className="envelope-scene relative"
        animate={
          isExit
            ? { scale: 0.92, y: -24, opacity: 0 }
            : { scale: 1, y: [0, -4, 0], opacity: 1 }
        }
        transition={
          isExit
            ? { duration: 0.75, ease: [0.4, 0, 0.2, 1] }
            : { y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }
        }
      >
        <div className="envelope-shadow absolute -bottom-6 left-1/2 h-8 w-[88%] -translate-x-1/2 rounded-[50%] bg-black/15 blur-xl" />

        <div className="envelope-3d relative h-[240px] w-[min(88vw,340px)] md:h-[260px] md:w-[360px]">
          <div className="envelope-back absolute inset-0 rounded-sm" />

          <motion.div
            className="envelope-letter absolute right-3 left-3 z-[1] rounded-sm"
            initial={{ y: 10, scale: 0.96 }}
            animate={
              phase === "letter" || phase === "exit"
                ? { y: -108, scale: 1 }
                : phase === "flap"
                  ? { y: -18, scale: 0.98 }
                  : { y: 10, scale: 0.96 }
            }
            transition={{ duration: 0.9, ease: [0.33, 1, 0.68, 1] }}
          >
            <div className="envelope-letter-inner flex h-[200px] flex-col items-center justify-center px-6 text-center md:h-[220px]">
              <p className="text-[10px] tracking-[0.4em] text-champagne uppercase">
                Wedding Invitation
              </p>
              <p className="mt-3 font-[family-name:var(--font-playfair)] text-2xl text-charcoal italic md:text-3xl">
                {COUPLE.full}
              </p>
              <div className="my-4 h-px w-16 gold-line" />
              <p className="text-[10px] tracking-[0.25em] text-charcoal-soft uppercase">
                You&apos;re Invited
              </p>
            </div>
          </motion.div>

          <div className="envelope-fold-left absolute top-0 bottom-0 left-0 z-[2] w-[52%]" />
          <div className="envelope-fold-right absolute top-0 right-0 bottom-0 z-[2] w-[52%]" />
          <div className="envelope-pocket absolute right-0 bottom-0 left-0 z-[3] h-[68%] rounded-b-sm" />

          <motion.div
            className="envelope-flap absolute top-0 right-0 left-0 z-[5] h-[54%]"
            style={{ transformOrigin: "top center" }}
            animate={{
              rotateX:
                phase === "flap" || phase === "letter" || phase === "exit" ? 180 : 0,
            }}
            transition={{ duration: 0.9, ease: [0.45, 0.05, 0.15, 1] }}
          >
            <div className="envelope-flap-face envelope-flap-front absolute inset-0" />
            <div className="envelope-flap-face envelope-flap-back absolute inset-0" />
          </motion.div>

          <motion.div
            className="envelope-seal absolute top-[38%] left-1/2 z-[6] flex h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full md:h-[56px] md:w-[56px]"
            animate={
              isOpening
                ? { scale: [1, 1.06, 0], opacity: [1, 1, 0], rotate: [0, -8, 14] }
                : { scale: 1, opacity: 1, rotate: 0 }
            }
            transition={{ duration: 0.42, ease: "easeOut" }}
          >
            <span className="font-[family-name:var(--font-playfair)] text-sm text-ivory/95 italic md:text-base">
              M&amp;P
            </span>
          </motion.div>

          <div className="pointer-events-none absolute right-3 bottom-3 left-3 z-[4] h-[55%] rounded-b-sm border border-champagne/25" />
        </div>
      </motion.div>

      <AnimatePresence>
        {!isOpening && (
          <motion.div
            className="pointer-events-none absolute bottom-[12%] flex flex-col items-center px-6 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.p
              className="text-[10px] tracking-[0.35em] text-charcoal-soft/80 uppercase md:text-xs"
              animate={{ opacity: [0.45, 0.95, 0.45] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              Tap or swipe to open
            </motion.p>
            <motion.div
              className="mt-4 text-champagne"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 5v14M5 12l7-7 7 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
