"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { VideoOpener } from "./VideoOpener";
import { MagicalFauna, type FaunaPhase } from "./MagicalFauna";
import { ScrollProgress } from "./ScrollProgress";
import { WeddingMusic } from "./WeddingMusic";
import { GlobalAmbience } from "./GlobalAmbience";
import { FloatingFlorals } from "./FloatingFlorals";
import { WEDDING_IMAGES } from "@/lib/constants";
import { prefetchOpenerPlaybackAssets } from "@/lib/prefetchAssets";
import { Hero } from "./Hero";
import { OurStory } from "./OurStory";
import { SectionDivider } from "./SectionDivider";
import { StoryAscentImage } from "./StoryAscentImage";

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
  const storyAscentRef = useRef<HTMLDivElement>(null);

  const faunaPhase: FaunaPhase = isRevealed ? "hero" : "intro";

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!introDone) return;
    document.documentElement.removeAttribute("data-intro-pending");
    document.documentElement.removeAttribute("data-opener-ready");
    document.getElementById("intro-boot-screen")?.remove();

    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "auto";
      }
    });
  }, [introDone]);

  useEffect(() => {
    if (!isRevealed) return;
    window.scrollTo(0, 0);
  }, [isRevealed]);

  return (
    <>
      <MagicalFauna phase={faunaPhase} prominent={!isRevealed} />
      {introDone && <GlobalAmbience />}
      <WeddingMusic revealed={isRevealed} />

      {isRevealed ? (
        <main
          className="wedding-main relative z-[2] m-0 block w-full p-0"
          aria-hidden={false}
        >
          <ScrollProgress />
          {introDone && <FloatingFlorals />}

          <Hero revealed scrollReady={introDone} />

          {introDone ? (
            <>
              <div ref={storyAscentRef} className="relative overflow-visible">
                <OurStory />

                <SectionDivider variant="floral" />

                <div className="relative z-30 h-[min(24vh,188px)] overflow-visible md:h-[min(28vh,220px)]">
                  <StoryAscentImage
                    containerRef={storyAscentRef}
                    src={WEDDING_IMAGES.heroPhoto}
                    alt="Michael and Precious"
                    variant="storyCard"
                    active
                  />
                </div>
              </div>

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

      {!introDone && (
        <VideoOpener
          key="video-opener"
          onOpenStart={prefetchOpenerPlaybackAssets}
          onReveal={() => {
            setIsRevealed(true);
            document.documentElement.removeAttribute("data-intro-pending");
          }}
          onFinish={() => setIntroDone(true)}
        />
      )}
    </>
  );
}
