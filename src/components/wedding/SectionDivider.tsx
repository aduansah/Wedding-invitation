"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { WEDDING_IMAGES } from "@/lib/constants";

type SectionDividerProps = {
  variant?: "simple" | "ornate" | "floral";
};

export function SectionDivider({ variant = "simple" }: SectionDividerProps) {
  const reducedMotion = useReducedMotion() ?? false;

  if (variant === "floral") {
    return (
      <div
        className="relative w-full overflow-hidden py-1 md:py-3"
        aria-hidden="true"
      >
        <motion.div
          className="relative mx-auto h-10 w-full max-w-6xl overflow-hidden md:h-12 lg:h-14"
          initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="absolute inset-0"
            animate={reducedMotion ? undefined : { x: ["-3%", "3%", "-3%"] }}
            transition={{
              duration: 11,
              repeat: reducedMotion ? 0 : Infinity,
              ease: "easeInOut",
            }}
          >
            <Image
              src={WEDDING_IMAGES.sectionBorder}
              alt=""
              fill
              sizes="100vw"
              quality={80}
              className="scale-[2.35] object-cover object-[center_46%] md:scale-[2.5] lg:scale-[2.65]"
              aria-hidden="true"
            />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (variant === "ornate") {
    return (
      <div className="flex items-center justify-center gap-4 py-8">
        <div className="h-px w-16 gold-line md:w-24" />
        <motion.span
          className="font-[family-name:var(--font-playfair)] text-lg text-gold"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          ✦
        </motion.span>
        <div className="h-px w-16 gold-line md:w-24" />
      </div>
    );
  }

  return (
    <div className="flex justify-center py-6">
      <div className="h-px w-32 gold-line md:w-48" />
    </div>
  );
}
