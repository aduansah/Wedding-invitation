"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GALLERY_IMAGES } from "@/lib/constants";
import { AnimatedHeading } from "./AnimatedHeading";

export function Gallery() {
  const [mobileIndex, setMobileIndex] = useState(0);

  const nextSlide = () => {
    setMobileIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
  };

  const prevSlide = () => {
    setMobileIndex(
      (prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length,
    );
  };

  return (
    <section id="gallery" className="section-padding relative bg-cream">
      <div className="mx-auto max-w-6xl">
        <AnimatedHeading title="Moments We Treasure" subtitle="Gallery" />

        {/* Mobile swipe gallery */}
        <div className="relative mb-10 md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={mobileIndex}
              className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-xl"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) nextSlide();
                else if (info.offset.x > 80) prevSlide();
              }}
            >
              <Image
                src={GALLERY_IMAGES[mobileIndex].src}
                alt={GALLERY_IMAGES[mobileIndex].alt}
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={prevSlide}
            className="absolute top-1/2 left-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-charcoal shadow-md backdrop-blur-sm"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="absolute top-1/2 right-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-charcoal shadow-md backdrop-blur-sm"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="mt-4 flex justify-center gap-2">
            {GALLERY_IMAGES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setMobileIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === mobileIndex
                    ? "w-6 bg-champagne"
                    : "w-1.5 bg-champagne/30"
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop masonry gallery */}
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
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute right-0 bottom-0 left-0 translate-y-full p-4 transition-transform duration-500 group-hover:translate-y-0">
                <p className="font-[family-name:var(--font-playfair)] text-sm text-white italic">
                  {image.alt}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
