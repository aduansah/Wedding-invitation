"use client";

import { FormEvent, useCallback, useState } from "react";
import { motion } from "framer-motion";
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
        className="mx-auto max-w-xl rounded-2xl border border-gold/30 bg-white/85 p-8 text-center shadow-sm backdrop-blur-sm"
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
      className="mx-auto max-w-xl rounded-2xl border border-gold/30 bg-white/85 p-6 shadow-sm backdrop-blur-sm md:p-8"
    >
      <p className="mb-6 text-center font-[family-name:var(--font-sans)] text-sm font-medium text-purple md:text-base">
        We&apos;re so excited! Please share your name to confirm your RSVP.
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
      </div>
    </section>
  );
}
