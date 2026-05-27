"use client";

import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { EnvelopeReveal } from "./EnvelopeReveal";
import { MagicalFauna, type FaunaPhase } from "./MagicalFauna";
import { ScrollProgress } from "./ScrollProgress";
import { WeddingMusic, type WeddingMusicHandle } from "./WeddingMusic";
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
  const [envelopeDone, setEnvelopeDone] = useState(false);
  const musicRef = useRef<WeddingMusicHandle>(null);

  const faunaPhase: FaunaPhase = envelopeDone
    ? "hero"
    : isRevealed
      ? "opening"
      : "envelope";

  return (
    <>
      <MagicalFauna phase={faunaPhase} prominent={!envelopeDone} />

      <main className="relative m-0 block w-full p-0">
        <ScrollProgress />
        <FloatingFlorals />
        <WeddingMusic ref={musicRef} revealed={isRevealed} />

        <Hero revealed={isRevealed} />

        <SectionDivider variant="ornate" />

        <OurStory />

        <SectionDivider variant="ornate" />

        <EventTimeline />

        <SectionDivider variant="ornate" />

        <Location />

        <SectionDivider variant="ornate" />

        <Gallery />

        <SectionDivider variant="ornate" />

        <RSVP />

        <Footer />
      </main>

      <AnimatePresence>
        {!envelopeDone && (
          <EnvelopeReveal
            key="envelope"
            onOpenStart={() => {
              void musicRef.current?.play();
            }}
            onReveal={() => setIsRevealed(true)}
            onFinish={() => setEnvelopeDone(true)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
