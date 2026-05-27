"use client";

import { motion } from "framer-motion";
import { Church, Sparkles, Heart } from "lucide-react";
import { EVENTS } from "@/lib/constants";
import { AnimatedHeading } from "./AnimatedHeading";

const iconMap = {
  rings: Heart,
  church: Church,
  sparkles: Sparkles,
} as const;

export function EventTimeline() {
  return (
    <section id="events" className="sea-section section-padding relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #C9A962 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <AnimatedHeading title="Celebration Timeline 🥂" subtitle="You're Invited ✨" script />

        <div className="relative">
          <div className="absolute top-0 left-1/2 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-champagne/40 to-transparent md:block" />

          <div className="space-y-12 md:space-y-16">
            {EVENTS.map((event, index) => {
              const Icon = iconMap[event.icon];
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={event.id}
                  className={`relative flex flex-col md:flex-row ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                >
                  <div className="hidden w-1/2 md:block" />

                  <div
                    className={`w-full md:w-1/2 ${
                      isEven ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"
                    }`}
                  >
                    <motion.div
                      className="glass-card group rounded-2xl border border-champagne/20 bg-white/75 p-8 transition-all duration-500 hover:-translate-y-1 hover:border-purple/25 hover:shadow-xl"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div
                        className={`mb-4 flex items-center gap-3 ${
                          isEven ? "md:justify-end" : "md:justify-start"
                        }`}
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-champagne/30 bg-champagne/10 text-champagne transition-colors group-hover:bg-champagne group-hover:text-white">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-xs tracking-[0.25em] text-champagne uppercase">
                          Event {index + 1}
                        </span>
                      </div>

                      <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-charcoal md:text-3xl">
                        {event.emoji} {event.title}
                      </h3>

                      <div
                        className={`my-4 h-px w-16 gold-line ${isEven ? "md:ml-auto" : ""}`}
                      />

                      <p className="font-medium text-charcoal">{event.date}</p>
                      <p className="mt-1 text-champagne">{event.time}</p>

                      {"dressCode" in event && event.dressCode && (
                        <p className="mt-3 inline-block rounded-full border border-champagne/30 bg-champagne/5 px-4 py-1 text-sm text-charcoal-soft">
                          Dress Code: {event.dressCode}
                        </p>
                      )}

                      <div className="mt-6 border-t border-champagne/15 pt-6">
                        <p className="text-xs tracking-widest text-charcoal-soft uppercase">
                          Venue
                        </p>
                        <p className="mt-1 font-[family-name:var(--font-playfair)] text-lg text-charcoal">
                          {event.venue}
                        </p>
                        <p className="mt-1 text-sm text-charcoal-soft">{event.address}</p>
                      </div>
                    </motion.div>
                  </div>

                  <div className="absolute left-1/2 hidden h-4 w-4 -translate-x-1/2 rounded-full border-2 border-champagne bg-cream md:block">
                    <div className="absolute inset-1 animate-pulse-glow rounded-full bg-gold/60" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
