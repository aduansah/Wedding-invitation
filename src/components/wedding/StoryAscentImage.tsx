"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { RefObject } from "react";
import { WEDDING_IMAGES } from "@/lib/constants";

type StoryAscentImageProps = {
  containerRef: RefObject<HTMLElement | null>;
  src?: string;
  alt?: string;
  variant?: "hero" | "compact";
};

const variantConfig = {
  hero: {
    shell: "w-[min(78vw,340px)] md:w-[380px]",
    yRange: [340, 64] as [number, number],
    reducedTranslate: "translate-y-[18%]",
  },
  compact: {
    shell: "w-[min(52vw,200px)] md:w-[240px]",
    yRange: [150, 28] as [number, number],
    reducedTranslate: "translate-y-[12%]",
  },
} as const;

export function StoryAscentImage({
  containerRef,
  src = WEDDING_IMAGES.story,
  alt = "Michael and Precious",
  variant = "hero",
}: StoryAscentImageProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const config = variantConfig[variant];
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 0.45], config.yRange);
  const opacity = useTransform(scrollYProgress, [0.08, 0.38], [0, 1]);

  const image =
    variant === "compact" ? (
      <Image
        src={src}
        alt={alt}
        width={1536}
        height={802}
        className="h-auto w-full"
        sizes="(max-width: 768px) 52vw, 240px"
      />
    ) : (
      <div className="relative aspect-[4/5] w-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 78vw, 380px"
        />
      </div>
    );

  if (reducedMotion) {
    return (
      <div
        className={`pointer-events-none absolute bottom-0 left-1/2 z-[8] -translate-x-1/2 ${config.shell} ${config.reducedTranslate}`}
        aria-hidden="true"
      >
        {image}
      </div>
    );
  }

  return (
    <motion.div
      className={`pointer-events-none absolute bottom-0 left-1/2 z-[8] -translate-x-1/2 will-change-transform ${config.shell}`}
      style={{ y, opacity }}
      aria-hidden="true"
    >
      {image}
    </motion.div>
  );
}
