"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

type CelebrationBurstProps = {
  active: boolean;
  onComplete?: () => void;
};

type Balloon = {
  id: number;
  left: number;
  color: string;
  size: number;
  delay: number;
  drift: number;
};

const balloonColors = [
  "#f472b6",
  "#fb7185",
  "#fda4af",
  "#d4af37",
  "#a78bfa",
  "#7ec8e3",
  "#f9a8d4",
  "#fcd34d",
];

const confettiColors = [
  "#f472b6",
  "#fb7185",
  "#d4af37",
  "#a78bfa",
  "#7ec8e3",
  "#fda4af",
  "#fcd34d",
  "#c084fc",
];

function BalloonShape({ color, size }: { color: string; size: number }) {
  return (
    <svg
      width={size}
      height={size * 1.35}
      viewBox="0 0 40 54"
      aria-hidden="true"
      className="drop-shadow-md"
    >
      <ellipse cx="20" cy="18" rx="16" ry="20" fill={color} opacity="0.92" />
      <ellipse cx="15" cy="12" rx="5" ry="7" fill="#fff" opacity="0.35" />
      <path
        d="M20 36 Q18 42 20 48 Q22 42 20 36"
        fill={color}
        opacity="0.85"
      />
      <line
        x1="20"
        y1="48"
        x2="20"
        y2="54"
        stroke={color}
        strokeWidth="1.2"
        opacity="0.7"
      />
    </svg>
  );
}

export function CelebrationBurst({ active, onComplete }: CelebrationBurstProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  const balloons = useMemo<Balloon[]>(
    () =>
      Array.from({ length: 9 }, (_, id) => ({
        id,
        left: 4 + Math.random() * 92,
        color: balloonColors[id % balloonColors.length],
        size: 28 + Math.random() * 22,
        delay: Math.random() * 0.15,
        drift: (Math.random() - 0.5) * 80,
      })),
    [],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!active) return;

    setVisible(true);
    let interval: number | undefined;
    let hideTimer: number | undefined;
    let cancelled = false;

    void import("canvas-confetti").then(({ default: confetti }) => {
      if (cancelled) return;

      const burst = (originX: number, angle: number) => {
        confetti({
          particleCount: 42,
          angle,
          spread: 62,
          startVelocity: 42,
          decay: 0.9,
          gravity: 0.9,
          ticks: 220,
          origin: { x: originX, y: 0.55 },
          colors: confettiColors,
          shapes: ["circle", "square"],
          scalar: 1.05,
        });
      };

      burst(0.12, 65);
      burst(0.88, 115);
      confetti({
        particleCount: 120,
        spread: 100,
        startVelocity: 38,
        decay: 0.91,
        gravity: 0.85,
        ticks: 200,
        origin: { x: 0.5, y: 0.45 },
        colors: confettiColors,
        shapes: ["circle", "square"],
      });

      interval = window.setInterval(() => {
        confetti({
          particleCount: 8,
          spread: 80,
          startVelocity: 26,
          origin: { x: Math.random(), y: Math.random() * 0.4 + 0.1 },
          colors: confettiColors,
          ticks: 160,
        });
      }, 90);

      hideTimer = window.setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 1100);
    });

    return () => {
      cancelled = true;
      if (interval !== undefined) window.clearInterval(interval);
      if (hideTimer !== undefined) window.clearTimeout(hideTimer);
    };
  }, [active, onComplete]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[500] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          aria-hidden="true"
        >
          {balloons.map((balloon) => (
            <motion.div
              key={balloon.id}
              className="absolute bottom-0"
              style={{ left: `${balloon.left}%` }}
              initial={{ y: "12vh", x: 0, opacity: 0, scale: 0.7 }}
              animate={{
                y: "-108vh",
                x: balloon.drift,
                opacity: [0, 1, 1, 0],
                scale: [0.7, 1, 1.05, 0.95],
              }}
              transition={{
                duration: 1.05,
                delay: balloon.delay,
                ease: [0.22, 0.8, 0.24, 1],
              }}
            >
              <BalloonShape color={balloon.color} size={balloon.size} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
