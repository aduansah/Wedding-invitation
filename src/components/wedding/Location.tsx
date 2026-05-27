"use client";

import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";
import { LOCATION } from "@/lib/constants";
import { AnimatedHeading } from "./AnimatedHeading";

export function Location() {
  return (
    <section id="location" className="section-padding bg-warm-white">
      <div className="mx-auto max-w-6xl">
        <AnimatedHeading title="Find Us" subtitle="Venue Location" />

        <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
          <motion.div
            className="flex flex-col justify-center lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="glass-card rounded-2xl p-8 md:p-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-champagne/10 text-champagne">
                <MapPin className="h-6 w-6" />
              </div>

              <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-charcoal md:text-3xl">
                Wesley Banquet Hall &amp; Ghana Methodist Church
              </h3>

              <p className="mt-4 text-lg leading-relaxed text-charcoal-soft">
                {LOCATION.address}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-charcoal-soft/80">
                All celebration events take place at 69 Milvan Drive in North York.
                Ample parking is available on site.
              </p>

              <motion.a
                href={LOCATION.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glow-button mt-8 inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-champagne px-8 py-3.5 text-sm font-medium tracking-wide text-white uppercase transition-all hover:bg-gold hover:shadow-lg"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Open in Google Maps
                <ExternalLink className="h-4 w-4" />
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            className="overflow-hidden rounded-2xl border border-champagne/20 shadow-xl lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <div className="relative aspect-[4/3] w-full md:aspect-[16/10]">
              <iframe
                title="Wedding venue location map"
                src={LOCATION.embedUrl}
                className="absolute inset-0 h-full w-full grayscale-[20%] contrast-[1.05] transition-all duration-500 hover:grayscale-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-champagne/10 ring-inset" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
