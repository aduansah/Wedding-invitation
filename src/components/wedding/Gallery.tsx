"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GALLERY_IMAGES } from "@/lib/constants";
import { AnimatedHeading } from "./AnimatedHeading";

const slideEase = [0.45, 0.05, 0.15, 1] as const;

export function Gallery() {
  const [mobileIndex, setMobileIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((next: number, dir: number) => {
    setDirection(dir);
    setMobileIndex(next);
  }, []);

  const nextSlide = useCallback(() => {
    goTo((mobileIndex + 1) % GALLERY_IMAGES.length, 1);
  }, [goTo, mobileIndex]);

  const prevSlide = useCallback(() => {
    goTo((mobileIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length, -1);
  }, [goTo, mobileIndex]);

  useEffect(() => {
    const timer = window.setInterval(nextSlide, 6000);
    return () => window.clearInterval(timer);
  }, [nextSlide]);

  return (
    <section id="gallery" className="sea-section section-padding relative">
      <div className="mx-auto max-w-6xl">
        <AnimatedHeading title="Moments We Treasure" subtitle="Gallery" script />

        <div className="relative mb-10 md:hidden">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#fceee6] shadow-[0_20px_50px_rgba(200,125,149,0.15)]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={mobileIndex}
                custom={direction}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.04, x: direction > 0 ? 24 : -24 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 1.02, x: direction > 0 ? -24 : 24 }}
                transition={{ duration: 0.85, ease: slideEase }}
              >
                <Image
                  src={GALLERY_IMAGES[mobileIndex].src}
                  alt={GALLERY_IMAGES[mobileIndex].alt}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  quality={75}
                  priority={mobileIndex === 0}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={prevSlide}
            className="absolute top-1/2 left-3 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-charcoal/70 shadow-sm backdrop-blur-sm transition hover:bg-white"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="absolute top-1/2 right-3 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-charcoal/70 shadow-sm backdrop-blur-sm transition hover:bg-white"
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="mt-5 flex justify-center gap-2">
            {GALLERY_IMAGES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i, i > mobileIndex ? 1 : -1)}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === mobileIndex ? "w-7 bg-[#e8a0b4]" : "w-1.5 bg-[#e8a0b4]/30"
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="masonry-grid hidden md:block">
          {GALLERY_IMAGES.map((image, index) => (
            <motion.div
              key={image.src}
              className={`masonry-item group relative overflow-hidden rounded-xl shadow-md ${
                image.span === "tall"
                  ? "aspect-[3/4]"
                  : image.span === "wide"
                    ? "aspect-[16/10]"
                    : "aspect-square"
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 33vw"
                quality={75}
                loading={index > 2 ? "lazy" : undefined}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
