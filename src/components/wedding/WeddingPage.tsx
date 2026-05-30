"use client";

import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { VideoOpener } from "./VideoOpener";
import { ScrollProgress } from "./ScrollProgress";
import { WeddingMusic, type WeddingMusicHandle } from "./WeddingMusic";
import { SubtleFlorals } from "./SubtleFlorals";
import { ScrollNudge } from "./ScrollNudge";
import { prefetchOpenerPlaybackAssets } from "@/lib/prefetchAssets";
import { isIntroComplete, markIntroComplete } from "@/lib/weddingSession";
import { Hero } from "./Hero";
import { OurStory } from "./OurStory";
import { SectionDivider } from "./SectionDivider";

const EventTimeline = dynamic(
  () => import("./EventTimeline").then((m) => ({ default: m.EventTimeline })),
  { loading: () => <div className="min-h-[40vh]" aria-hidden="true" /> },
);
const Location = dynamic(
  () => import("./Location").then((m) => ({ default: m.Location })),
  { loading: () => <div className="min-h-[40vh]" aria-hidden="true" /> },
);
const Gallery = dynamic(
  () => import("./Gallery").then((m) => ({ default: m.Gallery })),
  { loading: () => <div className="min-h-[40vh]" aria-hidden="true" /> },
);
const RSVP = dynamic(
  () => import("./RSVP").then((m) => ({ default: m.RSVP })),
  { loading: () => <div className="min-h-[40vh]" aria-hidden="true" /> },
);
const Footer = dynamic(
  () => import("./Footer").then((m) => ({ default: m.Footer })),
  { loading: () => <div className="min-h-[24vh]" aria-hidden="true" /> },
);

export function WeddingPage() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [scrollNudgeEnabled, setScrollNudgeEnabled] = useState(false);
  const musicRef = useRef<WeddingMusicHandle>(null);

  useLayoutEffect(() => {
    if (isIntroComplete()) {
      setIsRevealed(true);
      setIntroDone(true);
    }
    setSessionChecked(true);
  }, []);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    prefetchOpenerPlaybackAssets();
  }, []);

  useEffect(() => {
    if (!introDone) return;

    window.scrollTo(0, 0);
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "auto";
    }
  }, [introDone]);

  const handleVideoPlaying = () => {
    musicRef.current?.play();
  };

  const handleIntroFinish = () => {
    markIntroComplete();
    setIntroDone(true);
    setScrollNudgeEnabled(true);
  };

  if (!sessionChecked) {
    return null;
  }

  return (
    <>
      <WeddingMusic ref={musicRef} revealed={isRevealed} resumeOnReturn={introDone && isRevealed} />

      {introDone ? <SubtleFlorals /> : null}
      <ScrollNudge enabled={scrollNudgeEnabled && introDone} />

      {isRevealed ? (
        <main className="wedding-main relative z-[2] m-0 block w-full p-0">
          <ScrollProgress />

          <Hero revealed scrollReady={introDone} />

          {introDone ? (
            <>
              <OurStory />
              <SectionDivider variant="floral" />
              <EventTimeline />
              <SectionDivider variant="floral" />
              <Location />
              <SectionDivider variant="floral" />
              <Gallery />
              <SectionDivider variant="floral" />
              <RSVP />
              <Footer />
            </>
          ) : null}
        </main>
      ) : null}

      {!introDone ? (
        <VideoOpener
          onOpenStart={prefetchOpenerPlaybackAssets}
          onVideoPlaying={handleVideoPlaying}
          onReveal={() => setIsRevealed(true)}
          onFinish={handleIntroFinish}
        />
      ) : null}
    </>
  );
}
