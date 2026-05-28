"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { RSVP_CONTACTS } from "@/lib/constants";
import { AnimatedHeading } from "./AnimatedHeading";
import { CelebrationBurst } from "./CelebrationBurst";

function InviteAcceptedButton({
  accepted,
  onAccept,
}: {
  accepted: boolean;
  onAccept: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onAccept}
      disabled={accepted}
      aria-label={accepted ? "Invite accepted" : "Accept wedding invite"}
      className={`relative mx-auto mb-6 flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-[family-name:var(--font-poppins)] text-xs font-medium tracking-[0.2em] uppercase transition-colors md:px-10 md:py-4 md:text-sm md:tracking-[0.24em] ${
        accepted
          ? "cursor-default border border-gold/40 bg-white/80 text-purple"
          : "cursor-pointer border border-purple/20 bg-white/90 text-purple shadow-[0_8px_30px_rgba(123,75,168,0.12)] backdrop-blur-sm hover:border-gold/50 hover:bg-white"
      }`}
      whileHover={accepted ? undefined : { scale: 1.02, y: -1 }}
      whileTap={accepted ? undefined : { scale: 0.98 }}
    >
      {!accepted && (
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(212, 175, 55, 0)",
              "0 0 0 6px rgba(212, 175, 55, 0.12)",
              "0 0 0 0 rgba(212, 175, 55, 0)",
            ],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
      )}

      <span className="relative z-[1]">
        {accepted ? "Thank You — Call Below ❤️" : "Invite Accepted ❤️"}
      </span>
    </motion.button>
  );
}

export function RSVP() {
  const [inviteAccepted, setInviteAccepted] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  const handleAccept = useCallback(() => {
    if (inviteAccepted) return;
    setInviteAccepted(true);
    setCelebrating(true);
  }, [inviteAccepted]);

  const handleCelebrationComplete = useCallback(() => {
    setCelebrating(false);
  }, []);

  return (
    <section id="rsvp" className="sea-section section-padding relative overflow-hidden">
      <CelebrationBurst active={celebrating} onComplete={handleCelebrationComplete} />

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-8 md:mb-16">
          <InviteAcceptedButton accepted={inviteAccepted} onAccept={handleAccept} />
          <AnimatedHeading title="RSVPs" subtitle="We Can't Wait to Celebrate With You" script />
        </div>

        {inviteAccepted && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-6 max-w-xl text-center font-[family-name:var(--font-poppins)] text-sm font-medium text-purple md:text-base"
          >
            We&apos;re so excited! Please call one of the numbers below to confirm your RSVP.
          </motion.p>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          {RSVP_CONTACTS.map((contact, index) => (
            <motion.div
              key={contact.tel}
              className={`glass-card group rounded-2xl border bg-white/80 p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl md:p-8 ${
                inviteAccepted
                  ? "animate-pulse border-purple/50 ring-2 ring-gold/70 ring-offset-2 ring-offset-[#fffcf9]"
                  : "border-gold/20"
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f8dde4] text-[#c87d95] transition-colors group-hover:bg-[#e8a0b4] group-hover:text-white">
                <Phone className="h-5 w-5" />
              </div>

              <p className="text-xs tracking-[0.25em] text-charcoal-soft uppercase">RSVP</p>

              <a
                href={`tel:${contact.tel}`}
                className={`mt-2 block font-[family-name:var(--font-playfair)] text-2xl transition-colors md:text-3xl ${
                  inviteAccepted
                    ? "text-purple underline decoration-gold decoration-2 underline-offset-4"
                    : "text-charcoal"
                }`}
              >
                {contact.phone}
              </a>

              <a
                href={`tel:${contact.tel}`}
                className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide uppercase transition-all ${
                  inviteAccepted
                    ? "animate-pulse border-2 border-purple bg-purple text-white shadow-[0_0_24px_rgba(123,75,168,0.45)]"
                    : "border border-gold/30 bg-transparent text-purple hover:border-purple hover:bg-purple hover:text-white"
                }`}
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
