"use client";

import { useCallback, useEffect, useImperativeHandle, useRef, useState, forwardRef } from "react";
import { motion } from "framer-motion";
import { Music, VolumeX } from "lucide-react";
import { WEDDING_AUDIO } from "@/lib/constants";

export type WeddingMusicHandle = {
  play: () => Promise<void>;
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

    const play = useCallback(async () => {
      const audio = audioRef.current;
      if (!audio || !hasAudio) return;

      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setHasAudio(false);
      }
    }, [hasAudio]);

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

    const toggleMusic = async () => {
      if (isPlaying) {
        pause();
        return;
      }
      await play();
    };

    return (
      <>
        <audio ref={audioRef} loop preload="auto" src={WEDDING_AUDIO.src} />

        {hasAudio && (
          <motion.button
            type="button"
            onClick={toggleMusic}
            aria-label={isPlaying ? "Pause background music" : "Play background music"}
            className="glow-button fixed right-5 bottom-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-champagne/30 bg-white/80 text-champagne shadow-lg backdrop-blur-md transition-colors hover:border-gold hover:text-gold md:right-8 md:bottom-8 md:h-14 md:w-14"
            initial={{ opacity: 0, scale: 0 }}
            animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ delay: 2.2, duration: 0.5, type: "spring" }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? (
              <Music className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5 opacity-70" />
            )}
          </motion.button>
        )}
      </>
    );
  },
);
