"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OPENER_VIDEO } from "@/lib/constants";

type VideoOpenerProps = {
  onReveal: () => void;
  onFinish?: () => void;
  onOpenStart?: () => void;
};

type OpenerPhase = "idle" | "playing" | "exit";

const REVEAL_LEAD_SECONDS = 0.65;
const EXIT_MS = 780;
const VIDEO_DISSOLVE_S = 0.72;
const OVERLAY_FADE_DELAY_S = 0.12;
const FRAME_READY_TIMEOUT_MS = 2800;
const DISSOLVE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

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

const featherBursts = Array.from({ length: 12 }, (_, index) => ({
  angle: index * 30,
  distance: 72 + (index % 3) * 28,
  delay: index * 0.028,
  tone: index % 3 === 0 ? "#7b4ba8" : index % 3 === 1 ? "#d4af37" : "#f5efe6",
}));

function fireOpenerConfetti() {
  void import("canvas-confetti").then(({ default: confetti }) => {
    const softBurst = (
      options: Parameters<typeof confetti>[0],
      delayMs = 0,
    ) => {
      window.setTimeout(() => {
        confetti({
          decay: 0.94,
          gravity: 0.62,
          ticks: 280,
          shapes: ["circle"],
          scalar: 0.82,
          drift: 0.25,
          ...options,
        });
      }, delayMs);
    };

    softBurst({
      particleCount: 34,
      spread: 62,
      startVelocity: 18,
      origin: { x: 0.5, y: 0.54 },
      colors: OPENER_CONFETTI,
    });

    softBurst(
      {
        particleCount: 22,
        angle: 64,
        spread: 48,
        startVelocity: 22,
        origin: { x: 0.1, y: 0.58 },
        colors: OPENER_CONFETTI,
      },
      160,
    );

    softBurst(
      {
        particleCount: 22,
        angle: 116,
        spread: 48,
        startVelocity: 22,
        origin: { x: 0.9, y: 0.58 },
        colors: OPENER_CONFETTI,
      },
      160,
    );

    softBurst(
      {
        particleCount: 28,
        spread: 88,
        startVelocity: 14,
        origin: { x: 0.5, y: 0.46 },
        colors: OPENER_CONFETTI,
      },
      360,
    );
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
              opacity: [0, 0.55, 0.38, 0],
              scale: [0.45, 0.95, 0.82, 0.62],
              rotate: feather.angle - 50,
            }}
            transition={{
              duration: 1.05,
              delay: feather.delay,
              ease: DISSOLVE_EASE,
            }}
          >
            <BurstFeather tone={feather.tone} />
          </motion.div>
        );
      })}
    </div>
  );
}

function OpenerInstruction({ ready }: { ready: boolean }) {
  return (
    <motion.div
      key="opener-instruction"
      className="pointer-events-none absolute inset-x-0 bottom-[12%] z-[25] flex flex-col items-center gap-3 px-6 md:bottom-[14%]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.5, delay: 0.25, ease: DISSOLVE_EASE }}
    >
      <motion.div
        className="rounded-full border border-gold/55 bg-white/90 px-5 py-2.5 shadow-[0_10px_28px_rgba(74,45,110,0.16)] backdrop-blur-sm md:px-6 md:py-3"
        animate={ready ? { scale: [1, 1.03, 1] } : undefined}
        transition={ready ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        <p className="text-center font-[family-name:var(--font-sans)] text-[11px] font-semibold tracking-[0.26em] text-purple-deep uppercase md:text-xs">
          {ready ? "Tap to open your invitation" : "Preparing your invitation"}
        </p>
      </motion.div>

      {ready ? (
        <motion.div
          className="flex flex-col items-center gap-1"
          aria-hidden="true"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="block h-8 w-[2px] rounded-full bg-gradient-to-b from-purple-deep/20 via-gold to-gold/80" />
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-purple-deep" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
            <path
              d="M12 8v8M8.5 12.5 12 16l3.5-3.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="font-[family-name:var(--font-sans)] text-[10px] font-medium tracking-[0.22em] text-purple-deep/75 uppercase">
            Tap anywhere
          </p>
        </motion.div>
      ) : null}
    </motion.div>
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
  const framePrimed = useRef(false);
  const phaseRef = useRef<OpenerPhase>("idle");

  phaseRef.current = phase;

  const dismissBootScreen = useCallback(() => {
    document.documentElement.setAttribute("data-opener-ready", "");
    setFrameReady(true);
  }, []);

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

    video.preload = "auto";
    video.load();

    const primeFirstFrame = () => {
      if (framePrimed.current || hasTriggered.current || phaseRef.current !== "idle") return;
      framePrimed.current = true;

      video.pause();
      if (video.currentTime < 0.001) {
        try {
          video.currentTime = 0.001;
        } catch {
          // Some browsers reject seeks before metadata is ready.
        }
      }
      dismissBootScreen();
    };

    const handleError = () => {
      setVideoFailed(true);
      dismissBootScreen();
    };

    const readyTimeout = window.setTimeout(() => {
      dismissBootScreen();
    }, FRAME_READY_TIMEOUT_MS);

    video.addEventListener("loadeddata", primeFirstFrame);
    video.addEventListener("canplaythrough", primeFirstFrame, { once: true });
    video.addEventListener("error", handleError);

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      primeFirstFrame();
    }

    return () => {
      window.clearTimeout(readyTimeout);
      video.removeEventListener("loadeddata", primeFirstFrame);
      video.removeEventListener("canplaythrough", primeFirstFrame);
      video.removeEventListener("error", handleError);
    };
  }, [dismissBootScreen]);

  useEffect(() => {
    if (!frameReady) return;
    void import("canvas-confetti");
  }, [frameReady]);

  const beginRevealTransition = useCallback(() => {
    if (hasTransitioned.current) return;
    hasTransitioned.current = true;

    const video = videoRef.current;
    if (video) {
      video.pause();
    }

    setShowBurst(true);
    requestAnimationFrame(() => {
      fireOpenerConfetti();
    });
    setPhase("exit");
    onReveal();
    window.scrollTo(0, 0);

    window.setTimeout(() => {
      onFinish?.();
      window.scrollTo(0, 0);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }, EXIT_MS);
  }, [onFinish, onReveal]);

  const startOpener = useCallback(async () => {
    if (hasTriggered.current || phaseRef.current !== "idle") return;
    hasTriggered.current = true;
    phaseRef.current = "playing";
    dismissBootScreen();
    setPhase("playing");

    const video = videoRef.current;
    if (!video || videoFailed) {
      onOpenStart?.();
      beginRevealTransition();
      return;
    }

    const tryPlay = async () => {
      video.currentTime = 0;
      await video.play();
    };

    try {
      await tryPlay();
      onOpenStart?.();
    } catch {
      try {
        await tryPlay();
        onOpenStart?.();
      } catch {
        beginRevealTransition();
      }
    }
  }, [beginRevealTransition, dismissBootScreen, onOpenStart, videoFailed]);

  const openInvitation = useCallback(() => {
    void startOpener();
  }, [startOpener]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (phaseRef.current !== "idle" || hasTriggered.current || !frameReady) return;
    touchStart.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = () => {
    if (phaseRef.current !== "idle" || !touchStart.current || hasTriggered.current || !frameReady) return;

    touchStart.current = null;
    openInvitation();
  };

  const handlePointerCancel = () => {
    touchStart.current = null;
  };

  useEffect(() => {
    if (phase !== "playing") return;

    const watchdog = window.setTimeout(() => {
      beginRevealTransition();
    }, 12000);

    return () => {
      window.clearTimeout(watchdog);
    };
  }, [beginRevealTransition, phase]);

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
    <motion.div
      className="video-opener fixed inset-0 z-[250] overflow-hidden"
      style={{ pointerEvents: phase === "exit" ? "none" : "auto" }}
      animate={{ opacity: phase === "exit" ? 0 : 1 }}
      transition={{
        duration: VIDEO_DISSOLVE_S,
        delay: phase === "exit" ? OVERLAY_FADE_DELAY_S : 0,
        ease: DISSOLVE_EASE,
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      role="button"
      tabIndex={0}
      aria-label="Open the wedding invitation"
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          if (frameReady) openInvitation();
        }
      }}
    >
      <motion.div
        className="absolute inset-0 z-10"
        initial={{ opacity: 1, scale: 1 }}
        animate={{
          opacity: phase === "exit" ? 0 : 1,
          scale: phase === "exit" ? 1.02 : 1,
        }}
        transition={{ duration: VIDEO_DISSOLVE_S, ease: DISSOLVE_EASE }}
      >
        <video
          ref={videoRef}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          src={OPENER_VIDEO.src}
          playsInline
          muted={OPENER_VIDEO.muted}
          preload="auto"
          disablePictureInPicture
          onError={() => {
            setVideoFailed(true);
            dismissBootScreen();
          }}
          onEnded={handleVideoEnded}
          onTimeUpdate={handleTimeUpdate}
        />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background:
            "radial-gradient(circle at 50% 52%, rgba(244, 236, 220, 0.55) 0%, rgba(212, 175, 55, 0.12) 38%, transparent 72%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "exit" ? [0, 0.42, 0] : 0 }}
        transition={{ duration: 1.05, ease: DISSOLVE_EASE, times: [0, 0.38, 1] }}
        aria-hidden="true"
      />

      <OpenerFeatherBurst active={showBurst} />

      <AnimatePresence>
        {phase === "idle" ? <OpenerInstruction ready={frameReady} /> : null}
      </AnimatePresence>

      <span className="sr-only">
        {frameReady
          ? "Tap anywhere to open the wedding invitation"
          : "Wedding invitation loading"}
      </span>
    </motion.div>
  );
}
