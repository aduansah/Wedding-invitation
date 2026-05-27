"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { RSVP_CONTACTS } from "@/lib/constants";
import { AnimatedHeading } from "./AnimatedHeading";

export function RSVP() {
  return (
    <section id="rsvp" className="section-padding relative overflow-hidden bg-warm-white">
      <div className="absolute inset-0 bg-gradient-to-br from-champagne/5 via-transparent to-gold/5" />

      <div className="relative mx-auto max-w-5xl">
        <AnimatedHeading
          title="RSVP"
          subtitle="We Would Love to Hear From You"
        />

        <motion.p
          className="mx-auto -mt-6 mb-12 max-w-2xl text-center text-base leading-relaxed text-charcoal-soft md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Kindly confirm your attendance by reaching out to any of our wedding
          coordinators. Your presence would mean the world to us.
        </motion.p>

        <div className="grid gap-5 sm:grid-cols-2">
          {RSVP_CONTACTS.map((contact, index) => (
            <motion.div
              key={contact.tel}
              className="glass-card group rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl md:p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-champagne/10 text-champagne transition-colors group-hover:bg-champagne group-hover:text-white">
                <Phone className="h-5 w-5" />
              </div>

              <p className="text-xs tracking-[0.25em] text-charcoal-soft uppercase">
                Wedding Coordinator
              </p>

              <p className="mt-2 font-[family-name:var(--font-playfair)] text-2xl text-charcoal">
                {contact.phone}
              </p>

              <a
                href={`tel:${contact.tel}`}
                className="glow-button mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-champagne/30 bg-transparent px-6 py-3 text-sm font-medium tracking-wide text-champagne uppercase transition-all hover:border-champagne hover:bg-champagne hover:text-white sm:hidden"
              >
                <Phone className="h-4 w-4" />
                Call Now
              </a>

              <p className="mt-4 hidden text-sm text-charcoal-soft/70 sm:block">
                Available for RSVP confirmations and event inquiries.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
