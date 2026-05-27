"use client";

import { motion } from "framer-motion";
import { AnimatedHeading } from "./AnimatedHeading";

const textReveal = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export function OurStory() {
  return (
    <section id="story" className="sea-section section-padding relative overflow-hidden pt-20 md:pt-36">
      <div className="relative mx-auto max-w-5xl">
        <AnimatedHeading title="Our Story" subtitle="Forever Starts Here" script />

        <motion.div
          className="relative z-10 mx-auto max-w-3xl px-2 text-center md:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.p
            custom={0.05}
            variants={textReveal}
            className="mx-auto max-w-xl font-[family-name:var(--font-poppins)] text-base leading-relaxed text-charcoal-soft md:text-lg"
          >
            Two hearts, one beautiful journey — and we cannot wait to celebrate this chapter
            with the people who mean the most to us.
          </motion.p>
        </motion.div>

        <motion.div
          className="relative z-20 mx-auto mt-8 max-w-2xl md:mt-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          <motion.div
            custom={0.35}
            variants={textReveal}
            className="glass-card rounded-2xl border border-gold/25 bg-white/75 p-8 text-center md:p-10"
          >
            <div className="mx-auto mb-6 h-px w-24 gold-line" />

            <motion.div
              custom={0.5}
              variants={textReveal}
              className="flex items-center justify-center gap-4"
            >
              <div className="h-px w-12 gold-line md:w-20" />
              <span className="wedding-display-title text-3xl text-purple md:text-4xl">
                M ♥ P
              </span>
              <div className="h-px w-12 gold-line md:w-20" />
            </motion.div>

            <motion.p
              custom={0.65}
              variants={textReveal}
              className="mt-6 font-[family-name:var(--font-poppins)] text-sm tracking-[0.2em] text-purple uppercase"
            >
              With love & gratitude
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
