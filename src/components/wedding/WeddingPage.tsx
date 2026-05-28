"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { VideoOpener } from "./VideoOpener";
import { MagicalFauna, type FaunaPhase } from "./MagicalFauna";
import { ScrollProgress } from "./ScrollProgress";
import { WeddingMusic, type WeddingMusicHandle } from "./WeddingMusic";
import { GlobalAmbience } from "./GlobalAmbience";
import { FloatingFlorals } from "./FloatingFlorals";
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
  const musicRef = useRef<WeddingMusicHandle>(null);

  const faunaPhase: FaunaPhase = introDone
    ? "hero"
    : isRevealed
      ? "opening"
      : "intro";

  return (
    <>
      <MagicalFauna phase={faunaPhase} prominent={!introDone && !isRevealed} />
      {introDone && <GlobalAmbience />}
      <WeddingMusic ref={musicRef} revealed={isRevealed} />

      <main className="relative z-[2] m-0 block w-full p-0">
        <ScrollProgress />
        {introDone && <FloatingFlorals />}

        <Hero revealed={isRevealed} />

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
      </main>

      {!introDone && (
        <VideoOpener
          key="video-opener"
          onOpenStart={() => {
            musicRef.current?.play();
          }}
          onReveal={() => setIsRevealed(true)}
          onFinish={() => setIntroDone(true)}
        />
      )}
    </>
  );
}
