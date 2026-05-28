"use client";

import { useCallback, useEffect, useImperativeHandle, useRef, useState, forwardRef } from "react";
import { createPortal } from "react-dom";
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
    const isPlayingRef = useRef(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasAudio, setHasAudio] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    const ensureSource = useCallback(() => {
      const audio = audioRef.current;
      if (!audio || audio.src) return;

      audio.src = WEDDING_AUDIO.src;
      audio.load();
    }, []);

    const play = useCallback(() => {
      const audio = audioRef.current;
      if (!audio || !hasAudio) return;

      if (!audio.paused && isPlayingRef.current) return;

      ensureSource();

      const playPromise = audio.play();
      if (playPromise === undefined) {
        isPlayingRef.current = true;
        setIsPlaying(true);
        return;
      }

      playPromise
        .then(() => {
          isPlayingRef.current = true;
          setIsPlaying(true);
        })
        .catch(() => setHasAudio(false));
    }, [ensureSource, hasAudio]);

    const pause = useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.pause();
      isPlayingRef.current = false;
      setIsPlaying(false);
    }, []);

    useImperativeHandle(ref, () => ({ play, pause }), [play, pause]);

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const handleError = () => setHasAudio(false);
      const handlePlay = () => {
        isPlayingRef.current = true;
        setIsPlaying(true);
      };
      const handlePause = () => {
        isPlayingRef.current = false;
        setIsPlaying(false);
      };

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

    const button =
      hasAudio && (revealed || isPlaying) ? (
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={isPlaying ? "Mute background music" : "Play background music"}
          className="fixed right-4 bottom-4 z-[300] flex h-9 w-9 items-center justify-center rounded-full border border-gold/35 bg-white/92 text-gold shadow-md backdrop-blur-sm transition-colors hover:border-purple hover:text-purple md:right-5 md:bottom-5"
        >
          {isPlaying ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Music className="h-4 w-4 opacity-75" />
          )}
        </button>
      ) : null;

    return (
      <>
        <audio ref={audioRef} loop preload="none" playsInline />
        {mounted && button ? createPortal(button, document.body) : null}
      </>
    );
  },
);
