"use client";

import { motion } from "framer-motion";

type AnimatedHeadingProps = {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  script?: boolean;
};

export function AnimatedHeading({
  title,
  subtitle,
  align = "center",
  script = false,
}: AnimatedHeadingProps) {
  const alignment = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`mb-8 md:mb-16 ${alignment}`}>
      <motion.p
        className="mb-3 font-[family-name:var(--font-sans)] text-sm tracking-[0.25em] text-purple uppercase md:text-base"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {subtitle ?? "Celebrating Love ✨"}
      </motion.p>

      <motion.h2
        className={
          script
            ? "wedding-script text-4xl leading-none text-charcoal md:text-5xl lg:text-6xl"
            : "wedding-display-title text-4xl text-charcoal md:text-5xl lg:text-6xl"
        }
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
      >
        {title}
      </motion.h2>

      <motion.div
        className={`mt-6 h-px w-20 gold-line ${align === "center" ? "mx-auto" : ""}`}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
    </div>
  );
}
