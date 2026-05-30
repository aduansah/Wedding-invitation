"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { RefObject } from "react";
import { WEDDING_IMAGES } from "@/lib/constants";

type StoryAscentImageProps = {
  containerRef: RefObject<HTMLElement | null>;
  src?: string;
  alt?: string;
  variant?: "hero" | "compact" | "storyCard";
  active?: boolean;
};

const variantConfig = {
  hero: {
    shell: "w-[min(78vw,340px)] md:w-[380px]",
    yRange: [340, 64] as [number, number],
    yClamp: [340, 64, 64, 64] as [number, number, number, number],
    scrollClamp: [0, 0.45, 0.7, 1] as [number, number, number, number],
    reducedTranslate: "translate-y-[18%]",
    zClass: "z-[8]",
    scrollInput: [0, 0.45] as [number, number],
    opacityInput: [0.08, 0.38] as [number, number],
  },
  compact: {
    shell: "w-[min(52vw,200px)] md:w-[240px]",
    yRange: [150, 28] as [number, number],
    reducedTranslate: "translate-y-[12%]",
    zClass: "z-[8]",
    scrollInput: [0, 0.45] as [number, number],
    opacityInput: [0.08, 0.38] as [number, number],
  },
  storyCard: {
    shell: "w-[min(54vw,210px)] overflow-hidden rounded-2xl sm:w-[min(48vw,230px)] md:w-[260px] lg:w-[280px]",
    yRange: [240, 0] as [number, number],
    yClamp: [240, 0, 0, 0],
    scrollClamp: [0, 0.48, 0.66, 1],
    scaleClamp: [0.96, 1, 1.08, 1, 1],
    scaleScroll: [0, 0.48, 0.54, 0.66, 1],
    reducedTranslate: "translate-y-0",
    zClass: "z-30",
    scrollInput: [0, 0.66] as [number, number],
    opacityInput: [0, 0.22, 0.48, 0.66, 1],
    opacityOutput: [0.12, 0.42, 1, 1, 1],
    imageSizes: "(max-width: 640px) 54vw, (max-width: 768px) 48vw, 280px",
    imageClass:
      "object-cover object-[center_14%] shadow-[0_20px_44px_-14px_rgba(90,53,128,0.38)] ring-1 ring-white/60",
    lockZone: true,
  },
} as const;

export function StoryAscentImage({
  containerRef,
  src = WEDDING_IMAGES.story,
  alt = "Michael and Precious",
  variant = "hero",
  active = false,
}: StoryAscentImageProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const config = variantConfig[variant];
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yInput = "scrollClamp" in config ? config.scrollClamp : config.scrollInput;
  const yOutput = "yClamp" in config ? config.yClamp : config.yRange;
  const y = useTransform(scrollYProgress, [...yInput], [...yOutput]);
  const scaleScroll = "scaleScroll" in config ? config.scaleScroll : ([0, 1] as [number, number]);
  const scaleClamp = "scaleClamp" in config ? config.scaleClamp : ([1, 1] as [number, number]);
  const scale = useTransform(scrollYProgress, [...scaleScroll], [...scaleClamp]);
  const opacity = useTransform(
    scrollYProgress,
    [...config.opacityInput],
    [...("opacityOutput" in config ? config.opacityOutput : [0, 1])],
  );

  const imageClass =
    "imageClass" in config
      ? config.imageClass
      : "object-cover object-center";

  const imageSizes =
    "imageSizes" in config
      ? config.imageSizes
      : variant === "compact"
        ? "(max-width: 768px) 52vw, 240px"
        : "(max-width: 768px) 78vw, 380px";

  const image =
    variant === "compact" ? (
      <Image
        src={src}
        alt={alt}
        width={1536}
        height={802}
        className="h-auto w-full"
        sizes={imageSizes}
      />
    ) : (
      <div className="relative aspect-[4/5] w-full">
        <Image
          src={src}
          alt={alt}
          fill
          className={imageClass}
          sizes={imageSizes}
        />
      </div>
    );

  if (!active) {
    return null;
  }

  if (reducedMotion) {
    const lockClass =
      "lockZone" in config && config.lockZone
        ? "absolute bottom-0 left-1/2 -translate-x-1/2 origin-bottom"
        : "absolute bottom-0 left-1/2 -translate-x-1/2";

    return (
      <div
        className={`pointer-events-none ${lockClass} ${config.shell} ${config.zClass} ${config.reducedTranslate}`}
        aria-hidden="true"
      >
        {image}
      </div>
    );
  }

  const lockClass =
    "lockZone" in config && config.lockZone
      ? "absolute bottom-0 left-1/2 -translate-x-1/2 origin-bottom"
      : "absolute bottom-0 left-1/2 -translate-x-1/2";

  return (
    <motion.div
      className={`pointer-events-none ${lockClass} will-change-transform ${config.shell} ${config.zClass}`}
      style={{
        y,
        scale: "scaleClamp" in config ? scale : 1,
        opacity,
        transformOrigin: "bottom center",
      }}
      aria-hidden="true"
    >
      {image}
    </motion.div>
  );
}
