"use client";

import { FormEvent, useCallback, useState } from "react";
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
      className={`relative mx-auto mb-6 flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-[family-name:var(--font-sans)] text-xs font-medium tracking-[0.2em] uppercase transition-colors md:px-10 md:py-4 md:text-sm md:tracking-[0.24em] ${
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
        {accepted ? "Thank You ❤️" : "Invite Accepted ❤️"}
      </span>
    </motion.button>
  );
}

function RsvpForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error || "Unable to submit RSVP.");
        return;
      }

      setDone(true);
    } catch {
      setError("Unable to submit RSVP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mb-10 max-w-xl rounded-2xl border border-gold/30 bg-white/85 p-8 text-center shadow-sm backdrop-blur-sm"
      >
        <p className="font-[family-name:var(--font-playfair)] text-2xl text-purple-deep md:text-3xl">
          You&apos;re on the list!
        </p>
        <p className="mt-3 font-[family-name:var(--font-sans)] text-sm text-charcoal-soft md:text-base">
          Thank you, {firstName}. We can&apos;t wait to celebrate with you.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="mx-auto mb-10 max-w-xl rounded-2xl border border-gold/30 bg-white/85 p-6 shadow-sm backdrop-blur-sm md:p-8"
    >
      <p className="mb-6 text-center font-[family-name:var(--font-sans)] text-sm font-medium text-purple md:text-base">
        Share your name to confirm online, or call one of the numbers below.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block font-[family-name:var(--font-sans)] text-sm font-medium text-charcoal">
          First name
          <input
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-gold/30 bg-white px-4 py-3 font-[family-name:var(--font-sans)] text-sm text-charcoal outline-none focus:border-purple/40 focus:ring-2 focus:ring-purple/15"
            autoComplete="given-name"
            required
            maxLength={80}
          />
        </label>

        <label className="block font-[family-name:var(--font-sans)] text-sm font-medium text-charcoal">
          Last name
          <input
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-gold/30 bg-white px-4 py-3 font-[family-name:var(--font-sans)] text-sm text-charcoal outline-none focus:border-purple/40 focus:ring-2 focus:ring-purple/15"
            autoComplete="family-name"
            required
            maxLength={80}
          />
        </label>
      </div>

      {error ? (
        <p className="mt-4 text-center font-[family-name:var(--font-sans)] text-sm text-red-600">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-full border border-purple/20 bg-purple px-6 py-3.5 font-[family-name:var(--font-sans)] text-sm font-semibold tracking-[0.18em] text-white uppercase transition hover:bg-purple-deep disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Confirm RSVP"}
      </button>
    </motion.form>
  );
}

function RsvpContactCards({ highlight }: { highlight: boolean }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {RSVP_CONTACTS.map((contact, index) => (
        <motion.div
          key={contact.tel}
          className={`glass-card group rounded-2xl border bg-white/80 p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl md:p-8 ${
            highlight
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
              highlight
                ? "text-purple underline decoration-gold decoration-2 underline-offset-4"
                : "text-charcoal"
            }`}
          >
            {contact.phone}
          </a>

          <a
            href={`tel:${contact.tel}`}
            className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide uppercase transition-all ${
              highlight
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
  );
}

export function RSVP() {
  const [inviteAccepted, setInviteAccepted] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const handleAccept = useCallback(() => {
    if (inviteAccepted) return;
    setInviteAccepted(true);
    setCelebrating(true);
    setFormVisible(true);
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

        {formVisible ? <RsvpForm /> : null}

        {inviteAccepted ? (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-6 max-w-xl text-center font-[family-name:var(--font-sans)] text-sm font-medium text-purple md:text-base"
          >
            Prefer to call? Reach us on any of the numbers below.
          </motion.p>
        ) : (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-6 max-w-xl text-center font-[family-name:var(--font-sans)] text-sm text-charcoal-soft md:text-base"
          >
            Tap invite accepted above, then confirm online or by phone.
          </motion.p>
        )}

        <RsvpContactCards highlight={inviteAccepted} />
      </div>
    </section>
  );
}
