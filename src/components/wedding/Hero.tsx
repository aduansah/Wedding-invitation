"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ScrollGuide } from "./ScrollGuide";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COUPLE, WEDDING_DATES, WEDDING_IMAGES } from "@/lib/constants";
import { useCountdown } from "@/hooks/useCountdown";
import { StoryAscentImage } from "./StoryAscentImage";

gsap.registerPlugin(ScrollTrigger);

const countdownItems = [
  { label: "Days", key: "days" as const },
  { label: "Hours", key: "hours" as const },
  { label: "Minutes", key: "minutes" as const },
  { label: "Seconds", key: "seconds" as const },
];

const revealMotion = {
  duration: 0.42,
  ease: [0.22, 1, 0.36, 1] as const,
  delay: 0,
};

export function Hero({
  revealed = false,
  scrollReady = false,
}: {
  revealed?: boolean;
  scrollReady?: boolean;
}) {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const countdown = useCountdown(WEDDING_DATES.countdown);

  useEffect(() => {
    if (!scrollReady) return;

    const ctx = gsap.context(() => {
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: 10,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }
    }, heroRef);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [scrollReady]);

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative isolate min-h-[100svh] w-full overflow-visible pb-[min(26vh,200px)] md:pb-[min(34vh,280px)]"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{ backgroundImage: `url("${WEDDING_IMAGES.heroBackground}")` }}
        aria-hidden="true"
      />

      <div className="absolute top-[44%] left-1/2 z-20 w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 px-6 text-center md:top-[46%]">
        <motion.p
          className="mb-1 font-[family-name:var(--font-sans)] text-[11px] font-medium tracking-[0.24em] text-purple-deep/90 uppercase md:text-xs"
          initial={{ opacity: 0, y: 12 }}
          animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={revealMotion}
        >
          Together with our Families
        </motion.p>

        <motion.h1
          className="mx-auto flex w-full max-w-3xl flex-wrap items-baseline justify-center gap-x-2.5 gap-y-0 text-center font-[family-name:var(--font-playfair)] text-4xl leading-[1.12] text-purple-deep md:gap-x-3 md:text-6xl lg:text-[3.75rem]"
          initial={{ opacity: 0, y: 36 }}
          animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
          transition={revealMotion}
        >
          <span>{COUPLE.groom}</span>
          <span className="font-normal italic text-gold">&</span>
          <span>{COUPLE.bride}</span>
        </motion.h1>

        <div className="mt-12 md:mt-14">
          <motion.p
            className="font-[family-name:var(--font-script)] text-4xl leading-none text-purple-deep md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 16 }}
            animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            A Celebration of Love
          </motion.p>

          <motion.p
            className="mt-1 wedding-display-title text-xl tracking-[0.1em] text-purple-deep md:text-2xl"
            initial={{ opacity: 0, y: 12 }}
            animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={revealMotion}
          >
            Saturday, July 18, 2026
          </motion.p>
        </div>

        <motion.div
          className="mx-auto mt-10 grid max-w-lg grid-cols-4 gap-3 md:mt-12 md:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={revealMotion}
        >
          {countdownItems.map((item, index) => (
            <motion.div
              key={item.key}
              className="rounded-xl border border-gold/40 bg-white/45 px-2 py-4 backdrop-blur-[2px] md:px-4 md:py-5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={revealMotion}
            >
              <span className="wedding-display-title text-2xl text-purple-deep md:text-4xl">
                {String(countdown[item.key]).padStart(2, "0")}
              </span>
              <p className="mt-1 font-[family-name:var(--font-sans)] text-[11px] font-semibold tracking-widest text-purple-deep/90 uppercase md:text-sm">
                {item.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {!countdown.isComplete && (
          <motion.p
            className="relative z-20 mt-4 font-[family-name:var(--font-sans)] text-[11px] font-medium tracking-[0.35em] text-purple-deep/80 uppercase md:text-xs"
            initial={{ opacity: 0 }}
            animate={revealed ? { opacity: 1 } : { opacity: 0 }}
            transition={revealMotion}
          >
            Until our wedding day
          </motion.p>
        )}
      </div>

      <StoryAscentImage containerRef={heroRef} active={scrollReady} />

      <ScrollGuide visible={revealed} href="#story" />
    </section>
  );
}
