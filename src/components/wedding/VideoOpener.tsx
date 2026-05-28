"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { OPENER_VIDEO, WEDDING_IMAGES } from "@/lib/constants";

type VideoOpenerProps = {
  onReveal: () => void;
  onFinish?: () => void;
  onOpenStart?: () => void;
};

type OpenerPhase = "idle" | "playing" | "exit";

const SWIPE_THRESHOLD = 48;
const REVEAL_LEAD_SECONDS = 0.55;
const EXIT_MS = 320;

const OPENER_CONFETTI = [
  "#d4af37",
  "#f0d78c",
  "#c9a962",
  "#7b4ba8",
  "#9b6fc4",
  "#5a3580",
  "#a78bfa",
  "#e8d5a3",
];

const featherBursts = Array.from({ length: 16 }, (_, index) => ({
  angle: index * 22.5,
  distance: 110 + (index % 4) * 36,
  delay: index * 0.012,
  tone: index % 3 === 0 ? "#7b4ba8" : index % 3 === 1 ? "#d4af37" : "#f5efe6",
}));

function fireOpenerConfetti() {
  void import("canvas-confetti").then(({ default: confetti }) => {
    confetti({
      particleCount: 100,
      spread: 118,
      startVelocity: 52,
      decay: 0.88,
      gravity: 0.92,
      ticks: 190,
      origin: { x: 0.5, y: 0.5 },
      colors: OPENER_CONFETTI,
      shapes: ["circle", "square"],
      scalar: 1.05,
    });

    confetti({
      particleCount: 36,
      angle: 58,
      spread: 68,
      startVelocity: 44,
      origin: { x: 0.06, y: 0.55 },
      colors: OPENER_CONFETTI,
    });

    confetti({
      particleCount: 36,
      angle: 122,
      spread: 68,
      startVelocity: 44,
      origin: { x: 0.94, y: 0.55 },
      colors: OPENER_CONFETTI,
    });
  });
}

function BurstFeather({ tone }: { tone: string }) {
  return (
    <svg width="22" height="34" viewBox="0 0 24 40" fill="none" aria-hidden="true">
      <path
        d="M12 2 C12 2, 18 14, 16 28 C15 34, 12 38, 12 38 C12 38, 9 34, 8 28 C6 14, 12 2, 12 2 Z"
        fill={tone}
        fillOpacity="0.9"
        stroke={tone}
        strokeWidth="0.5"
        strokeOpacity="0.55"
      />
      <path d="M12 6 L12 36" stroke={tone} strokeWidth="0.6" opacity="0.45" />
    </svg>
  );
}

function OpenerFeatherBurst({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
      {featherBursts.map((feather, index) => {
        const radians = (feather.angle * Math.PI) / 180;
        const targetX = Math.cos(radians) * feather.distance;
        const targetY = Math.sin(radians) * feather.distance;

        return (
          <motion.div
            key={index}
            className="absolute"
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.35, rotate: feather.angle - 90 }}
            animate={{
              x: targetX,
              y: targetY,
              opacity: [0, 1, 0.85, 0],
              scale: [0.35, 1.15, 0.95, 0.7],
              rotate: feather.angle - 50,
            }}
            transition={{
              duration: 0.58,
              delay: feather.delay,
              ease: [0.16, 0.84, 0.22, 1],
            }}
          >
            <BurstFeather tone={feather.tone} />
          </motion.div>
        );
      })}
    </div>
  );
}

export function VideoOpener({ onReveal, onFinish, onOpenStart }: VideoOpenerProps) {
  const [phase, setPhase] = useState<OpenerPhase>("idle");
  const [showBurst, setShowBurst] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [frameReady, setFrameReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const hasTriggered = useRef(false);
  const hasTransitioned = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.background = "var(--sea-white)";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.background = "";
      document.documentElement.removeAttribute("data-opener-ready");
    };
  }, []);

  useEffect(() => {
    if (!frameReady) return;
    document.documentElement.setAttribute("data-opener-ready", "");
  }, [frameReady]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const showFirstFrame = () => {
      const revealFrame = () => {
        video.pause();
        setFrameReady(true);
      };

      if (video.currentTime > 0.001) {
        revealFrame();
        return;
      }

      const handleSeeked = () => {
        video.removeEventListener("seeked", handleSeeked);
        revealFrame();
      };

      video.addEventListener("seeked", handleSeeked);
      video.currentTime = 0.001;
    };

    const handleLoadedData = () => {
      showFirstFrame();
    };

    video.addEventListener("loadeddata", handleLoadedData);
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      showFirstFrame();
    }

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
    };
  }, []);

  const beginRevealTransition = useCallback(() => {
    if (hasTransitioned.current) return;
    hasTransitioned.current = true;

    const video = videoRef.current;
    if (video) {
      video.pause();
    }

    onReveal();
    setShowBurst(true);
    fireOpenerConfetti();
    setPhase("exit");
    window.scrollTo(0, 0);

    window.setTimeout(() => {
      onFinish?.();
      window.scrollTo(0, 0);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }, EXIT_MS);
  }, [onFinish, onReveal]);

  const startOpener = useCallback(async () => {
    if (hasTriggered.current || phase !== "idle") return;
    hasTriggered.current = true;
    setPhase("playing");

    const video = videoRef.current;
    if (!video || videoFailed) {
      beginRevealTransition();
      return;
    }

    try {
      video.currentTime = 0;
      await video.play();
    } catch {
      beginRevealTransition();
    }
  }, [beginRevealTransition, phase, videoFailed]);

  const tryStartFromGesture = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (phase !== "idle" || !touchStart.current) return;

      const deltaX = event.clientX - touchStart.current.x;
      const deltaY = event.clientY - touchStart.current.y;
      touchStart.current = null;

      const isSwipe =
        Math.abs(deltaY) >= SWIPE_THRESHOLD || Math.abs(deltaX) >= SWIPE_THRESHOLD;

      if (isSwipe || Math.hypot(deltaX, deltaY) < 12) {
        void startOpener();
      }
    },
    [phase, startOpener],
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (phase !== "idle") return;

    touchStart.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
    onOpenStart?.();
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    tryStartFromGesture(event);
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    tryStartFromGesture(event);
  };

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || hasTransitioned.current) return;

    const remaining = video.duration - video.currentTime;
    if (remaining <= REVEAL_LEAD_SECONDS) {
      beginRevealTransition();
    }
  }, [beginRevealTransition]);

  const handleVideoEnded = useCallback(() => {
    beginRevealTransition();
  }, [beginRevealTransition]);

  return (
    <div
      className="video-opener fixed inset-0 z-[250] overflow-hidden"
      style={{ pointerEvents: phase === "exit" ? "none" : "auto" }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      role="button"
      tabIndex={0}
      aria-label="Open the wedding invitation"
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenStart?.();
          void startOpener();
        }
      }}
    >
      <div
        className="absolute inset-0 z-0 bg-[var(--sea-white)] bg-cover bg-center bg-no-repeat"
        style={
          phase === "exit"
            ? { backgroundImage: `url("${WEDDING_IMAGES.heroBackground}")` }
            : undefined
        }
        aria-hidden="true"
      />

      {phase !== "exit" && (
        <motion.div
          className="absolute inset-0 z-10"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "playing" ? 1 : 1 }}
          exit={{ opacity: 0 }}
        >
          <video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${frameReady || videoFailed ? "opacity-100" : "opacity-0"}`}
            src={OPENER_VIDEO.src}
            poster={OPENER_VIDEO.poster}
            playsInline
            muted={OPENER_VIDEO.muted}
            preload="auto"
            onError={() => {
              setVideoFailed(true);
              setFrameReady(true);
            }}
            onEnded={handleVideoEnded}
            onTimeUpdate={handleTimeUpdate}
          />
        </motion.div>
      )}

      <OpenerFeatherBurst active={showBurst} />

      <span className="sr-only">Open the wedding invitation</span>
    </div>
  );
}
