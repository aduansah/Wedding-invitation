"use client";

import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { VideoOpener } from "./VideoOpener";
import { MagicalFauna, type FaunaPhase } from "./MagicalFauna";
import { ScrollProgress } from "./ScrollProgress";
import { WeddingMusic, type WeddingMusicHandle } from "./WeddingMusic";
import { GlobalAmbience } from "./GlobalAmbience";
import { FloatingFlorals } from "./FloatingFlorals";
import { Hero } from "./Hero";
import { OurStory } from "./OurStory";
import { EventTimeline } from "./EventTimeline";
import { Location } from "./Location";
import { Gallery } from "./Gallery";
import { RSVP } from "./RSVP";
import { Footer } from "./Footer";
import { SectionDivider } from "./SectionDivider";

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
      <MagicalFauna phase={faunaPhase} prominent={!introDone} />
      <GlobalAmbience />
      <WeddingMusic ref={musicRef} revealed={isRevealed} />

      <main className="relative z-[2] m-0 block w-full p-0">
        <ScrollProgress />
        <FloatingFlorals />

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

      <AnimatePresence>
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
      </AnimatePresence>
    </>
  );
}
