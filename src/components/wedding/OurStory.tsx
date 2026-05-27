"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { STORY_TEXT, WEDDING_IMAGES } from "@/lib/constants";
import { AnimatedHeading } from "./AnimatedHeading";
import { SectionDivider } from "./SectionDivider";

export function OurStory() {
  return (
    <section id="story" className="section-padding relative bg-warm-white">
      <div className="mx-auto max-w-6xl">
        <AnimatedHeading title="Our Story" subtitle="A Love Written in Time" />

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <Image
              src={WEDDING_IMAGES.story}
              alt="Michael and Precious"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute right-4 bottom-4 left-4 glass-card rounded-xl p-4">
              <p className="font-[family-name:var(--font-playfair)] text-lg text-charcoal italic">
                &ldquo;Forever starts with a single heartbeat.&rdquo;
              </p>
            </div>
          </motion.div>

          <motion.div
            className="glass-card rounded-2xl p-8 md:p-12"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          >
            <p className="mb-6 font-[family-name:var(--font-playfair)] text-2xl leading-relaxed text-charcoal md:text-3xl">
              {STORY_TEXT}
            </p>

            <SectionDivider variant="ornate" />

            <p className="text-base leading-relaxed text-charcoal-soft md:text-lg">
              Every chapter of our journey has been guided by faith, laughter, and
              unwavering devotion. We are humbled and overjoyed to share this sacred
              moment with the people who have shaped our lives with love.
            </p>

            <motion.div
              className="mt-8 flex items-center gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="h-px flex-1 gold-line" />
              <span className="font-[family-name:var(--font-playfair)] text-champagne text-xl">
                M ♥ P
              </span>
              <div className="h-px flex-1 gold-line" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
