"use client";

import { motion } from "framer-motion";

type SectionDividerProps = {
  variant?: "simple" | "ornate";
};

export function SectionDivider({ variant = "simple" }: SectionDividerProps) {
  if (variant === "ornate") {
    return (
      <div className="flex items-center justify-center gap-4 py-8">
        <div className="h-px w-16 gold-line md:w-24" />
        <motion.span
          className="font-[family-name:var(--font-playfair)] text-gold text-lg"
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
