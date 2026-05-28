"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { CLOSING_MESSAGE, COUPLE, HASHTAG, WEDDING_DATES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="sea-section relative border-t border-[#f0c4d0] px-6 py-10 md:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="wedding-display-title text-2xl leading-relaxed text-charcoal md:text-4xl">
            {CLOSING_MESSAGE}
          </p>

          <div className="mx-auto my-8 h-px w-24 gold-line" />

          <p className="font-[family-name:var(--font-poppins)] text-xl font-light leading-none tracking-[-0.06em] text-purple antialiased md:text-2xl">
            {HASHTAG}
          </p>

          <h3 className="wedding-display-title mt-4 text-3xl text-charcoal md:text-4xl">
            {COUPLE.full}
          </h3>

          <p className="mt-3 text-sm tracking-[0.3em] text-champagne uppercase">
            {WEDDING_DATES.display}
          </p>

          <div className="mx-auto my-8 h-px w-24 gold-line" />

          <p className="flex items-center justify-center gap-2 text-sm text-charcoal-soft">
            Made with
            <Heart className="h-4 w-4 fill-champagne text-champagne" />
            for {COUPLE.full}
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
