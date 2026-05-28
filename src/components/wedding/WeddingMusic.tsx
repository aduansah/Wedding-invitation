"use client";

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from "react";
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

let sharedAudioElement: HTMLAudioElement | null = null;

export const WeddingMusic = forwardRef<WeddingMusicHandle, WeddingMusicProps>(
  function WeddingMusic({ revealed = false }, ref) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const autoPlayedRef = useRef(false);
    const playPendingRef = useRef(false);
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
      if (!audio || !hasAudio || playPendingRef.current) return;

      if (sharedAudioElement && sharedAudioElement !== audio && !sharedAudioElement.paused) {
        sharedAudioElement.pause();
        sharedAudioElement.currentTime = 0;
      }

      if (!audio.paused) {
        setIsPlaying(true);
        return;
      }

      playPendingRef.current = true;
      ensureSource();

      const playPromise = audio.play();
      if (playPromise === undefined) {
        sharedAudioElement = audio;
        playPendingRef.current = false;
        setIsPlaying(true);
        return;
      }

      playPromise
        .then(() => {
          sharedAudioElement = audio;
          setIsPlaying(true);
        })
        .catch(() => setHasAudio(false))
        .finally(() => {
          playPendingRef.current = false;
        });
    }, [ensureSource, hasAudio]);

    const pause = useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.pause();
      setIsPlaying(false);
    }, []);

    useImperativeHandle(ref, () => ({ play, pause }), [play, pause]);

    useEffect(() => {
      if (!revealed || autoPlayedRef.current) return;
      autoPlayedRef.current = true;
      play();
    }, [play, revealed]);

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
        if (sharedAudioElement === audio) {
          sharedAudioElement = null;
        }
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
