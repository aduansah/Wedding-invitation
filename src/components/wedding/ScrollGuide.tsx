"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

type ScrollGuideProps = {
  visible?: boolean;
  href?: string;
  label?: string;
};

export function ScrollGuide({
  visible = false,
  href = "#story",
  label = "Scroll to explore",
}: ScrollGuideProps) {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const handleScroll = () => {
      if (window.scrollY > 56) {
        setDismissed(true);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visible]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {visible && !dismissed ? (
        <motion.a
          href={href}
          aria-label={`${label} — jump to our story`}
          className="scroll-hint-btn fixed bottom-4 left-4 z-[300] flex items-center gap-1 rounded-full border border-gold/45 bg-white/88 px-3 py-2 font-[family-name:var(--font-sans)] text-[9px] font-semibold tracking-[0.14em] text-purple-deep/90 uppercase shadow-sm backdrop-blur-sm transition-colors hover:border-purple-deep/35 md:hidden"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.45, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <span>{label}</span>
          <span className="flex flex-col items-center -space-y-2" aria-hidden="true">
            <ChevronDown className="h-3 w-3 text-gold/70" strokeWidth={2.25} />
            <ChevronDown className="h-3 w-3 text-gold/45" strokeWidth={2.25} />
          </span>
        </motion.a>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
