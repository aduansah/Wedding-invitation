"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { CLOSING_MESSAGE, COUPLE, HASHTAG, WEDDING_DATES } from "@/lib/constants";
import { signalMusicPause } from "@/lib/weddingSession";

export function Footer() {
  const tapCount = useRef(0);
  const tapTimer = useRef<number | null>(null);

  const handleAdminTap = () => {
    tapCount.current += 1;

    if (tapTimer.current !== null) {
      window.clearTimeout(tapTimer.current);
    }

    tapTimer.current = window.setTimeout(() => {
      tapCount.current = 0;
    }, 900);

    if (tapCount.current >= 3) {
      tapCount.current = 0;
      signalMusicPause();
      window.open("/admin/rsvp", "_blank", "noopener,noreferrer");
    }
  };

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

          <p className="font-[family-name:var(--font-sans)] text-xl font-light leading-none tracking-[-0.06em] text-purple antialiased md:text-2xl">
            {HASHTAG}
          </p>

          <h3 className="wedding-display-title mt-4 text-3xl text-charcoal md:text-4xl">
            {COUPLE.full}
          </h3>

          <p className="mt-3 text-sm tracking-[0.3em] text-champagne uppercase">
            {WEDDING_DATES.display}
          </p>

          <div className="mx-auto my-8 h-px w-24 gold-line" />

          <p
            className="flex cursor-default items-center justify-center gap-2 text-sm text-charcoal-soft select-none"
            onClick={handleAdminTap}
          >
            Made with
            <Heart className="h-4 w-4 fill-champagne text-champagne" />
            for {COUPLE.full}
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
