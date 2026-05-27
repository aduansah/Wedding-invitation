"use client";

import { useCallback, useEffect, useImperativeHandle, useRef, useState, forwardRef } from "react";
import { motion } from "framer-motion";
import { Music, VolumeX } from "lucide-react";
import { WEDDING_AUDIO } from "@/lib/constants";

export type WeddingMusicHandle = {
  play: () => void;
  pause: () => void;
};

type WeddingMusicProps = {
  revealed?: boolean;
};

export const WeddingMusic = forwardRef<WeddingMusicHandle, WeddingMusicProps>(
  function WeddingMusic({ revealed = false }, ref) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasAudio, setHasAudio] = useState(true);

    const play = useCallback(() => {
      const audio = audioRef.current;
      if (!audio || !hasAudio) return;

      if (!audio.paused && isPlaying) return;

      const playPromise = audio.play();
      if (playPromise === undefined) {
        setIsPlaying(true);
        return;
      }

      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => setHasAudio(false));
    }, [hasAudio, isPlaying]);

    const pause = useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.pause();
      setIsPlaying(false);
    }, []);

    useImperativeHandle(ref, () => ({ play, pause }), [play, pause]);

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const handleError = () => setHasAudio(false);
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      audio.addEventListener("error", handleError);
      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);

      return () => {
        audio.removeEventListener("error", handleError);
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
      };
    }, []);

    const toggleMusic = () => {
      if (isPlaying) {
        pause();
        return;
      }
      play();
    };

    return (
      <>
        <audio ref={audioRef} loop preload="auto" playsInline src={WEDDING_AUDIO.src} />

        {hasAudio && (revealed || isPlaying) && (
          <motion.button
            type="button"
            onClick={toggleMusic}
            aria-label={isPlaying ? "Mute background music" : "Play background music"}
            className="glow-button fixed z-[100] flex h-12 w-12 items-center justify-center rounded-full border border-champagne/30 bg-white/80 text-champagne shadow-lg backdrop-blur-md transition-colors hover:border-gold hover:text-gold md:h-14 md:w-14"
            style={{
              right: "max(1rem, env(safe-area-inset-right))",
              bottom: "max(1rem, env(safe-area-inset-bottom))",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, type: "spring" }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Music className="h-5 w-5 opacity-70" />
            )}
          </motion.button>
        )}
      </>
    );
  },
);
