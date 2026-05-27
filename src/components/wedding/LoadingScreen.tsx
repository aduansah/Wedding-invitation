"use client";

import { motion } from "framer-motion";
import { COUPLE } from "@/lib/constants";

type LoadingScreenProps = {
  onComplete: () => void;
};

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#a67449]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2.2, duration: 0.8, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center"
      >
        <motion.p
          className="mb-4 font-[family-name:var(--font-playfair)] text-sm tracking-[0.4em] text-champagne uppercase"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Save the Date
        </motion.p>

        <motion.div
          className="relative mb-6 flex items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <span className="font-[family-name:var(--font-playfair)] text-5xl text-ivory md:text-6xl">
            M
          </span>
          <motion.span
            className="text-gold text-2xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            ♥
          </motion.span>
          <span className="font-[family-name:var(--font-playfair)] text-5xl text-ivory md:text-6xl">
            P
          </span>
        </motion.div>

        <motion.p
          className="font-[family-name:var(--font-playfair)] text-xl tracking-wide text-champagne-light italic md:text-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {COUPLE.full}
        </motion.p>

        <motion.div
          className="mx-auto mt-8 h-px w-24 gold-line"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        />
      </motion.div>
    </motion.div>
  );
}
