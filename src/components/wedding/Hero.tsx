"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COUPLE, WEDDING_DATES, WEDDING_IMAGES } from "@/lib/constants";
import { useCountdown } from "@/hooks/useCountdown";
import { HeroLightFlares } from "./HeroLightFlares";

gsap.registerPlugin(ScrollTrigger);

const countdownItems = [
  { label: "Days", key: "days" as const },
  { label: "Hours", key: "hours" as const },
  { label: "Minutes", key: "minutes" as const },
  { label: "Seconds", key: "seconds" as const },
];

export function Hero({ revealed = false }: { revealed?: boolean }) {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const countdown = useCountdown(WEDDING_DATES.countdown);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative -mt-0 flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-[#9c6b43]"
    >
      <div ref={bgRef} className="absolute inset-0 top-0 scale-105 translate-y-[2%]">
        <Image
          src={WEDDING_IMAGES.hero}
          alt="Michael and Precious wedding celebration"
          fill
          priority
          className="object-cover object-[center_52%] md:object-[center_48%]"
          sizes="100vw"
        />

        {/* Warm caramel overlays — matched to studio photo background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#a67449] from-0% via-[#9c6b43]/80 via-[15%] via-[#9c6b43]/45 via-[32%] to-transparent to-[62%]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_38%,rgba(255,220,180,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(139,90,52,0.22)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[55%] via-cream/35 via-[88%] to-cream" />
      </div>

      <HeroLightFlares />

      {/* Subtle fauna glow continuation on hero — main fauna layer sits at z-8 in WeddingPage */}
      {revealed && (
        <div className="pointer-events-none absolute inset-0 z-[6] bg-[radial-gradient(ellipse_at_30%_20%,rgba(212,175,55,0.04)_0%,transparent_50%)]" />
      )}

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 text-center text-ivory">
        <motion.p
          className="mb-8 text-[11px] tracking-[0.45em] text-champagne-light/90 uppercase md:text-xs"
          initial={{ opacity: 0, y: 16 }}
          animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ delay: 0.4, duration: 0.9 }}
        >
          Together with our Families
        </motion.p>

        <motion.h1
          className="font-[family-name:var(--font-playfair)] text-6xl leading-[1.05] tracking-[0.04em] drop-shadow-[0_8px_40px_rgba(0,0,0,0.55)] md:text-8xl lg:text-[7.5rem]"
          initial={{ opacity: 0, y: 36, filter: "blur(10px)" }}
          animate={
            revealed
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 36, filter: "blur(10px)" }
          }
          transition={{ delay: 0.55, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, x: -20 }}
            animate={revealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: 0.7, duration: 0.9 }}
          >
            {COUPLE.groom}
          </motion.span>
          <span className="mx-3 text-champagne-light italic md:mx-5">&</span>
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, x: 20 }}
            animate={revealed ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ delay: 0.9, duration: 0.9 }}
          >
            {COUPLE.bride}
          </motion.span>
        </motion.h1>

        <motion.div
          className="mx-auto my-8 h-px w-32 bg-gradient-to-r from-transparent via-champagne to-transparent md:w-44"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={revealed ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ delay: 1.05, duration: 0.9 }}
        />

        <motion.p
          className="font-[family-name:var(--font-playfair)] text-2xl tracking-[0.12em] text-champagne-light md:text-3xl"
          initial={{ opacity: 0, y: 12 }}
          animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {WEDDING_DATES.display}
        </motion.p>

        <motion.div
          className="mx-auto mt-10 grid max-w-lg grid-cols-4 gap-3 md:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 1.35, duration: 0.8 }}
        >
          {countdownItems.map((item, index) => (
            <motion.div
              key={item.key}
              className="rounded-xl border border-champagne/25 bg-black/25 px-2 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-md md:px-4 md:py-5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ delay: 1.45 + index * 0.08, duration: 0.5 }}
            >
              <span className="font-[family-name:var(--font-playfair)] text-2xl text-ivory md:text-4xl">
                {String(countdown[item.key]).padStart(2, "0")}
              </span>
              <p className="mt-1 text-[10px] tracking-widest text-champagne-light/80 uppercase md:text-xs">
                {item.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {!countdown.isComplete && (
          <motion.p
            className="mt-4 text-[10px] tracking-[0.35em] text-white/50 uppercase"
            initial={{ opacity: 0 }}
            animate={revealed ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1.85, duration: 0.6 }}
          >
            Until our wedding day
          </motion.p>
        )}
      </div>

      <motion.a
        href="#story"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/60 transition-colors hover:text-champagne-light"
        initial={{ opacity: 0 }}
        animate={revealed ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        aria-label="Scroll to our story"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">Discover</span>
        <ChevronDown className="h-6 w-6 animate-scroll-bounce" />
      </motion.a>
    </section>
  );
}
