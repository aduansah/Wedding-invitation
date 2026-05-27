"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { seededRandom } from "@/lib/seededRandom";

export type FaunaPhase = "intro" | "opening" | "hero";

type ParticleKind = "butterfly" | "feather";

type Particle = {
  id: number;
  kind: ParticleKind;
  anchorX: number;
  anchorY: number;
  orbit: number;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
  tone: "gold" | "ivory" | "cream";
};

export type FaunaImpulse = {
  id: number;
  type: "tap" | "scroll";
  x: number;
  y: number;
  forceX: number;
  forceY: number;
};

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    kind: id % 3 === 0 ? "feather" : "butterfly",
    anchorX: 38 + seededRandom(id * 7 + 1) * 24,
    anchorY: 32 + seededRandom(id * 7 + 2) * 22,
    orbit: 6 + seededRandom(id * 7 + 3) * 14,
    size: 0.75 + seededRandom(id * 7 + 4) * 0.55,
    delay: seededRandom(id * 7 + 5) * 2,
    duration: 4 + seededRandom(id * 7 + 6) * 3,
    rotation: seededRandom(id * 7 + 7) * 360,
    tone: (["gold", "ivory", "cream"] as const)[id % 3],
  }));
}

function getBasePosition(particle: Particle, phase: FaunaPhase) {
  if (phase === "opening") {
    return {
      x: particle.anchorX + (particle.id % 2 === 0 ? -1 : 1) * (18 + particle.orbit),
      y: particle.anchorY - 22 - particle.orbit * 0.8,
      scale: particle.size * 1.15,
      opacity: 0.95,
      rotate: particle.rotation + (particle.id % 2 === 0 ? -35 : 35),
    };
  }

  if (phase === "hero") {
    return {
      x: ((particle.anchorX + particle.id * 7) % 92) + 4,
      y: ((particle.anchorY + particle.id * 5) % 75) + 8,
      scale: particle.size * 0.85,
      opacity: particle.kind === "butterfly" ? 0.38 : 0.28,
      rotate: particle.rotation + 15,
    };
  }

  return {
    x: particle.anchorX + Math.sin(particle.id) * particle.orbit * 0.3,
    y: particle.anchorY + Math.cos(particle.id * 1.3) * particle.orbit * 0.25,
    scale: particle.size,
    opacity: particle.kind === "butterfly" ? 0.82 : 0.65,
    rotate: particle.rotation,
  };
}

function computeImpulseOffset(
  particle: Particle,
  phase: FaunaPhase,
  impulse: FaunaImpulse,
): { x: number; y: number; rotate: number; wingFlap: number } {
  const base = getBasePosition(particle, phase);

  if (impulse.type === "tap") {
    const dx = base.x - impulse.x;
    const dy = base.y - impulse.y;
    const dist = Math.max(Math.hypot(dx, dy), 6);
    const proximity = Math.max(0, 1 - dist / 45);
    const push = 14 + particle.orbit * (0.6 + proximity);

    return {
      x: (dx / dist) * push,
      y: (dy / dist) * push,
      rotate: (particle.id % 2 === 0 ? -1 : 1) * (8 + proximity * 14),
      wingFlap: 0.45,
    };
  }

  const scrollStrength = 0.35 + particle.orbit * 0.02;
  return {
    x: impulse.forceX * scrollStrength * (particle.id % 3 === 0 ? 1.4 : 1),
    y: impulse.forceY * scrollStrength,
    rotate: impulse.forceX * 0.4 * (particle.id % 2 === 0 ? 1 : -1),
    wingFlap: 0.58,
  };
}

const toneColors = {
  gold: { fill: "#d4af37", stroke: "#b8942e", wing: "rgba(212,175,55,0.45)" },
  ivory: { fill: "#fffff8", stroke: "#e8e0d0", wing: "rgba(255,255,248,0.5)" },
  cream: { fill: "#f5efe6", stroke: "#d4c4a8", wing: "rgba(245,239,230,0.55)" },
};

function ButterflyIcon({
  size,
  tone,
  wingFlap,
  flutter,
}: {
  size: number;
  tone: Particle["tone"];
  wingFlap: number;
  flutter: boolean;
}) {
  const c = toneColors[tone];
  const s = 28 * size;

  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <ellipse cx="24" cy="26" rx="2" ry="5" fill={c.stroke} opacity="0.7" />
      <motion.g
        style={{ transformOrigin: "24px 26px" }}
        animate={{ scaleX: wingFlap }}
        transition={{
          duration: flutter ? 0.18 : 0.35,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        <path
          d="M24 24 C14 14, 6 18, 8 28 C10 34, 18 32, 24 26 Z"
          fill={c.wing}
          stroke={c.stroke}
          strokeWidth="0.6"
        />
        <path
          d="M24 24 C34 14, 42 18, 40 28 C38 34, 30 32, 24 26 Z"
          fill={c.wing}
          stroke={c.stroke}
          strokeWidth="0.6"
        />
      </motion.g>
      <path
        d="M22 18 C21 14, 23 12, 24 10 C25 12, 27 14, 26 18"
        stroke={c.stroke}
        strokeWidth="0.8"
        fill="none"
      />
    </svg>
  );
}

function FeatherIcon({ size, tone }: { size: number; tone: Particle["tone"] }) {
  const c = toneColors[tone];
  const s = 22 * size;

  return (
    <svg width={s} height={s * 1.6} viewBox="0 0 24 40" fill="none" aria-hidden="true">
      <path
        d="M12 2 C12 2, 18 14, 16 28 C15 34, 12 38, 12 38 C12 38, 9 34, 8 28 C6 14, 12 2, 12 2 Z"
        fill={c.fill}
        fillOpacity="0.85"
        stroke={c.stroke}
        strokeWidth="0.5"
      />
      <path d="M12 6 L12 36" stroke={c.stroke} strokeWidth="0.6" opacity="0.5" />
      {[10, 14, 18, 22, 26, 30].map((y) => (
        <path
          key={y}
          d={`M12 ${y} L${y < 20 ? 7 : 8} ${y + 2}`}
          stroke={c.stroke}
          strokeWidth="0.4"
          opacity="0.35"
        />
      ))}
    </svg>
  );
}

function MagicalParticle({
  particle,
  phase,
  impulse,
  reducedMotion,
}: {
  particle: Particle;
  phase: FaunaPhase;
  impulse: FaunaImpulse | null;
  reducedMotion: boolean;
}) {
  const base = getBasePosition(particle, phase);
  const burst =
    impulse && !reducedMotion
      ? computeImpulseOffset(particle, phase, impulse)
      : { x: 0, y: 0, rotate: 0, wingFlap: phase === "opening" ? 0.55 : 0.72 };

  const isReacting = impulse !== null && !reducedMotion;

  return (
    <motion.div
      className="absolute will-change-transform"
      animate={{
        left: `${base.x}%`,
        top: `${base.y}%`,
        scale: base.scale,
        opacity: base.opacity,
        rotate: base.rotate,
      }}
      transition={{
        duration: phase === "opening" ? 1.6 : phase === "hero" ? 2.2 : particle.duration,
        ease: phase === "opening" ? [0.22, 1, 0.36, 1] : "easeInOut",
        delay: phase === "opening" ? particle.delay * 0.15 : 0,
      }}
    >
      <motion.div
        key={impulse?.id ?? "idle"}
        initial={{ x: burst.x, y: burst.y, rotate: burst.rotate }}
        animate={{ x: 0, y: 0, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: impulse?.type === "tap" ? 120 : 80,
          damping: impulse?.type === "tap" ? 14 : 18,
          mass: particle.kind === "feather" ? 0.8 : 0.55,
        }}
      >
        <motion.div
          animate={
            reducedMotion
              ? {}
              : phase === "hero"
                ? {
                    y: [0, -10, 0, 8, 0],
                    x: [0, 6, -4, 0],
                    rotate: [0, 3, -2, 0],
                  }
                : phase === "intro"
                  ? {
                      y: [0, -8, 0, 6, 0],
                      x: [0, 5, -5, 0],
                    }
                  : {
                      y: [0, -28, -12, -40],
                      x: [0, (particle.id % 2 === 0 ? -1 : 1) * 20, 0],
                    }
          }
          transition={{
            duration: phase === "opening" ? 1.8 : particle.duration,
            repeat: phase === "opening" || isReacting ? 0 : Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        >
          {particle.kind === "butterfly" ? (
            <ButterflyIcon
              size={particle.size}
              tone={particle.tone}
              wingFlap={burst.wingFlap}
              flutter={isReacting}
            />
          ) : (
            <FeatherIcon size={particle.size} tone={particle.tone} />
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function useFaunaInteraction(enabled: boolean) {
  const [impulse, setImpulse] = useState<FaunaImpulse | null>(null);
  const impulseId = useRef(0);
  const lastScrollY = useRef(0);
  const scrollRaf = useRef<number | null>(null);

  const emitImpulse = useCallback((next: Omit<FaunaImpulse, "id">) => {
    impulseId.current += 1;
    setImpulse({ ...next, id: impulseId.current });
    window.setTimeout(() => {
      setImpulse((current) =>
        current?.id === impulseId.current ? null : current,
      );
    }, 900);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handlePointer = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;

      emitImpulse({ type: "tap", x, y, forceX: 0, forceY: 0 });
    };

    const handleScroll = () => {
      if (scrollRaf.current !== null) return;

      scrollRaf.current = window.requestAnimationFrame(() => {
        scrollRaf.current = null;
        const delta = window.scrollY - lastScrollY.current;
        lastScrollY.current = window.scrollY;

        if (Math.abs(delta) < 2) return;

        emitImpulse({
          type: "scroll",
          x: 50,
          y: 40,
          forceX: delta * 0.06,
          forceY: -delta * 0.04,
        });
      });
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("pointerdown", handlePointer, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handlePointer);
      window.removeEventListener("scroll", handleScroll);
      if (scrollRaf.current !== null) {
        window.cancelAnimationFrame(scrollRaf.current);
      }
    };
  }, [enabled, emitImpulse]);

  return impulse;
}

type MagicalFaunaProps = {
  phase: FaunaPhase;
  prominent?: boolean;
};

export function MagicalFauna({ phase, prominent = false }: MagicalFaunaProps) {
  const particles = useMemo(() => generateParticles(14), []);
  const reducedMotion = useReducedMotion() ?? false;
  const impulse = useFaunaInteraction(true);

  return (
    <div
      className={`pointer-events-none fixed inset-0 overflow-hidden transition-opacity duration-1000 ${
        prominent ? "z-[120]" : "z-[8]"
      }`}
      aria-hidden="true"
    >
      {phase === "hero" && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/5" />
      )}

      {particles.map((particle) => (
        <MagicalParticle
          key={particle.id}
          particle={particle}
          phase={phase}
          impulse={impulse}
          reducedMotion={reducedMotion}
        />
      ))}

      {particles.slice(0, 6).map((p) => {
        const dustBurst =
          impulse && !reducedMotion
            ? impulse.type === "tap"
              ? {
                  x:
                    ((p.anchorX - impulse.x) /
                      Math.max(Math.hypot(p.anchorX - impulse.x, p.anchorY - impulse.y), 1)) *
                    20,
                  y:
                    ((p.anchorY - impulse.y) /
                      Math.max(Math.hypot(p.anchorX - impulse.x, p.anchorY - impulse.y), 1)) *
                    20,
                }
              : { x: impulse.forceX * 2, y: impulse.forceY * 2 }
            : { x: 0, y: 0 };

        return (
          <motion.div
            key={`dust-${p.id}-${impulse?.id ?? "idle"}`}
            className="absolute h-1 w-1 rounded-full bg-champagne/60 blur-[0.5px]"
            style={{ left: `${p.anchorX}%`, top: `${p.anchorY}%` }}
            initial={
              impulse
                ? { opacity: 0.7, scale: 1.6, x: dustBurst.x, y: dustBurst.y }
                : undefined
            }
            animate={
              impulse
                ? { opacity: 0, scale: 0.5, x: 0, y: 0 }
                : {
                    opacity: [0.2, 0.55, 0.2],
                    scale: [1, 1.4, 1],
                    y: [0, -12, 0],
                    x: 0,
                  }
            }
            transition={{
              duration: impulse ? 0.85 : 3 + p.delay,
              repeat: impulse ? 0 : Infinity,
              ease: "easeOut",
              delay: impulse ? p.delay * 0.05 : p.delay,
            }}
          />
        );
      })}
    </div>
  );
}
