"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useMotionValueEvent } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setVisible(value > 0.02);
  });

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed top-0 right-0 left-0 z-50 h-[2px] origin-left bg-gradient-to-r from-champagne/80 via-gold to-champagne-light/80"
      style={{ scaleX }}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    />
  );
}
