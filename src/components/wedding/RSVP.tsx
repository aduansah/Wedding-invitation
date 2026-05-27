"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { RSVP_CONTACTS } from "@/lib/constants";
import { AnimatedHeading } from "./AnimatedHeading";

function WatercolorRibbon() {
  return (
    <svg
      viewBox="0 0 240 48"
      className="mx-auto mb-3 h-10 w-40 md:h-11 md:w-44"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ribbonWash" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f9a8d4" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#fb7185" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#fda4af" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <path
        d="M8 28 C40 8, 80 6, 120 14 C160 6, 200 8, 232 28 C200 36, 160 40, 120 34 C80 40, 40 36, 8 28 Z"
        fill="url(#ribbonWash)"
        opacity="0.9"
      />
      <path
        d="M20 26 C55 18, 95 16, 120 22 C145 16, 185 18, 220 26"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.45"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function RSVP() {
  return (
    <section id="rsvp" className="sea-section section-padding relative overflow-hidden">
      <div className="relative mx-auto max-w-5xl">
        <div className="mb-8 md:mb-16">
          <WatercolorRibbon />
          <AnimatedHeading title="RSVPs" subtitle="We Can't Wait to Celebrate With You" script />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {RSVP_CONTACTS.map((contact, index) => (
            <motion.div
              key={contact.tel}
              className="glass-card group rounded-2xl border border-gold/20 bg-white/80 p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl md:p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f8dde4] text-[#c87d95] transition-colors group-hover:bg-[#e8a0b4] group-hover:text-white">
                <Phone className="h-5 w-5" />
              </div>

              <p className="text-xs tracking-[0.25em] text-charcoal-soft uppercase">RSVP</p>

              <p className="mt-2 font-[family-name:var(--font-playfair)] text-2xl text-charcoal md:text-3xl">
                {contact.phone}
              </p>

              <a
                href={`tel:${contact.tel}`}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-gold/30 bg-transparent px-6 py-3 text-sm font-medium tracking-wide text-purple uppercase transition-all hover:border-purple hover:bg-purple hover:text-white sm:hidden"
              >
                <Phone className="h-4 w-4" />
                Call Now
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
