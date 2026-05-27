"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { OPENER_VIDEO } from "@/lib/constants";

type VideoOpenerProps = {
  onReveal: () => void;
  onFinish?: () => void;
  onOpenStart?: () => void;
};

type OpenerPhase = "idle" | "playing" | "exit";

const SWIPE_THRESHOLD = 48;

export function VideoOpener({ onReveal, onFinish, onOpenStart }: VideoOpenerProps) {
  const [phase, setPhase] = useState<OpenerPhase>("idle");
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const showFirstFrame = () => {
      video.currentTime = 0;
      video.pause();
    };

    video.load();
    video.addEventListener("loadeddata", showFirstFrame);
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      showFirstFrame();
    }

    return () => {
      video.removeEventListener("loadeddata", showFirstFrame);
    };
  }, []);

  const finishOpener = useCallback(() => {
    setPhase("exit");
    window.setTimeout(() => {
      onFinish?.();
      document.body.style.overflow = "";
    }, 700);
  }, [onFinish]);

  const startOpener = useCallback(async () => {
    if (hasTriggered.current || phase !== "idle") return;
    hasTriggered.current = true;
    onOpenStart?.();
    setPhase("playing");

    const video = videoRef.current;
    if (!video || videoFailed) {
      onReveal();
      finishOpener();
      return;
    }

    try {
      video.currentTime = 0;
      await video.play();
    } catch {
      onReveal();
      finishOpener();
    }
  }, [finishOpener, onOpenStart, onReveal, phase, videoFailed]);

  const handleVideoEnded = useCallback(() => {
    onReveal();
    finishOpener();
  }, [finishOpener, onReveal]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    touchStart.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (phase !== "idle" || !touchStart.current) return;

    const deltaX = event.clientX - touchStart.current.x;
    const deltaY = event.clientY - touchStart.current.y;
    touchStart.current = null;

    const isSwipe =
      Math.abs(deltaY) >= SWIPE_THRESHOLD || Math.abs(deltaX) >= SWIPE_THRESHOLD;

    if (isSwipe || Math.hypot(deltaX, deltaY) < 12) {
      void startOpener();
    }
  };

  return (
    <motion.div
      className="video-opener fixed inset-0 z-[250] overflow-hidden bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "exit" ? 0 : 1 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      style={{ pointerEvents: phase === "exit" ? "none" : "auto" }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      role="button"
      tabIndex={0}
      aria-label="Tap or swipe to open the wedding invitation"
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          void startOpener();
        }
      }}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={OPENER_VIDEO.src}
        poster={OPENER_VIDEO.poster}
        playsInline
        muted={OPENER_VIDEO.muted}
        preload="auto"
        onError={() => setVideoFailed(true)}
        onEnded={handleVideoEnded}
      />

      <span className="sr-only">Tap or swipe to open</span>
    </motion.div>
  );
}
