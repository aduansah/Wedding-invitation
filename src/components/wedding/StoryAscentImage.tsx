"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { RefObject } from "react";
import { WEDDING_IMAGES } from "@/lib/constants";

type StoryAscentImageProps = {
  containerRef: RefObject<HTMLElement | null>;
};

export function StoryAscentImage({ containerRef }: StoryAscentImageProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 0.45], [340, 64]);
  const opacity = useTransform(scrollYProgress, [0.08, 0.38], [0, 1]);

  if (reducedMotion) {
    return (
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 z-[8] w-[min(78vw,340px)] -translate-x-1/2 translate-y-[18%] md:w-[380px]"
        aria-hidden="true"
      >
        <div className="relative aspect-[4/5] w-full">
          <Image
            src={WEDDING_IMAGES.story}
            alt="Michael and Precious"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 78vw, 380px"
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="pointer-events-none absolute bottom-0 left-1/2 z-[8] w-[min(78vw,340px)] -translate-x-1/2 md:w-[380px]"
      style={{ y, opacity }}
      aria-hidden="true"
    >
      <div className="relative aspect-[4/5] w-full">
        <Image
          src={WEDDING_IMAGES.story}
          alt="Michael and Precious"
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 78vw, 380px"
        />
      </div>
    </motion.div>
  );
}
