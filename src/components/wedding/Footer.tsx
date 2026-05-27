"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { COUPLE, WEDDING_DATES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="relative border-t border-champagne/15 bg-cream px-6 py-16 md:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="font-[family-name:var(--font-playfair)] text-3xl text-charcoal md:text-4xl">
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

          <p className="mt-6 text-xs tracking-widest text-charcoal-soft/60 uppercase">
            #MichaelAndPrecious2026
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
