"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Phone, X } from "lucide-react";
import { RSVP_CONTACTS } from "@/lib/constants";
import { AnimatedHeading } from "./AnimatedHeading";
import { CelebrationBurst } from "./CelebrationBurst";

function ThankYouModal({
  firstName,
  onClose,
}: {
  firstName: string;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-[400] flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rsvp-thank-you-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-sm rounded-2xl border border-gold/35 bg-white p-6 text-center shadow-[0_20px_50px_rgba(74,45,110,0.18)] sm:p-7"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close thank you message"
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-charcoal-soft/70 transition hover:bg-[#fff5f8] hover:text-purple"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f3e8ff] text-purple">
            <Check className="h-6 w-6" strokeWidth={2.5} />
          </div>

          <p
            id="rsvp-thank-you-title"
            className="font-[family-name:var(--font-playfair)] text-2xl text-purple-deep"
          >
            You&apos;re on the list!
          </p>
          <p className="mt-2 font-[family-name:var(--font-sans)] text-sm leading-relaxed text-charcoal-soft">
            Thank you, {firstName}. We can&apos;t wait to celebrate with you.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-5 w-full rounded-full border border-purple/20 bg-purple px-5 py-2.5 font-[family-name:var(--font-sans)] text-xs font-semibold tracking-[0.16em] text-white uppercase transition hover:bg-purple-deep"
          >
            Continue
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}

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
      animate={accepted ? undefined : { y: [0, -5, 0] }}
      transition={
        accepted
          ? undefined
          : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
      }
      className={`relative mx-auto mb-6 flex items-center justify-center gap-2 overflow-hidden rounded-full px-9 py-4 font-[family-name:var(--font-sans)] text-xs font-semibold tracking-[0.22em] uppercase transition-[filter,transform] md:px-11 md:py-4.5 md:text-sm md:tracking-[0.26em] ${
        accepted ? "invite-accept-btn--done cursor-default" : "invite-accept-btn cursor-pointer"
      }`}
      whileHover={accepted ? undefined : { scale: 1.05 }}
      whileTap={accepted ? undefined : { scale: 0.96, y: 2 }}
    >
      {!accepted ? (
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-full border border-white/20"
          animate={{ opacity: [0.35, 0.75, 0.35] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
      ) : null}

      <span className="relative z-[1] flex items-center gap-2">
        {accepted ? "Thank You ❤️" : "Invite Accepted ❤️"}
      </span>
    </motion.button>
  );
}

function RsvpForm({
  highlighted,
  onSuccess,
}: {
  highlighted: boolean;
  onSuccess: (firstName: string) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [confirmedName, setConfirmedName] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (!trimmedFirstName || !trimmedLastName) {
      setError("First name and last name are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: trimmedFirstName,
          lastName: trimmedLastName,
        }),
      });

      let data: { error?: string } = {};
      try {
        data = (await response.json()) as { error?: string };
      } catch {
        data = {};
      }

      if (!response.ok) {
        setError(data.error || "Unable to save RSVP right now. Please try again.");
        return;
      }

      setConfirmedName(trimmedFirstName);
      setSubmitted(true);
      onSuccess(trimmedFirstName);
    } catch {
      setError("Unable to save RSVP right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mx-auto mb-8 max-w-xl rounded-xl border border-gold/25 bg-white/80 px-4 py-3 text-center shadow-sm backdrop-blur-sm"
      >
        <p className="font-[family-name:var(--font-sans)] text-sm font-medium text-purple">
          RSVP confirmed for {confirmedName}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className={`mx-auto mb-10 max-w-xl rounded-2xl border bg-white/85 p-6 shadow-sm backdrop-blur-sm transition-shadow duration-500 md:p-8 ${
        highlighted
          ? "border-purple/45 ring-4 ring-gold/45 ring-offset-2 ring-offset-[#fffcf9] shadow-[0_0_32px_rgba(123,75,168,0.18)]"
          : "border-gold/30"
      }`}
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
    <div className="mx-auto grid max-w-3xl grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
      {RSVP_CONTACTS.map((contact, index) => (
        <motion.a
          key={contact.tel}
          href={`tel:${contact.tel}`}
          className={`group flex min-h-[72px] flex-col justify-between rounded-xl border bg-white/85 p-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:min-h-[84px] sm:p-3.5 md:p-4 ${
            highlight
              ? "animate-pulse border-purple/45 ring-2 ring-gold/60 ring-offset-1 ring-offset-[#fffcf9]"
              : "border-gold/25 hover:border-gold/40"
          }`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: index * 0.06 }}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f8dde4] text-[#c87d95] transition-colors group-hover:bg-[#e8a0b4] group-hover:text-white sm:h-8 sm:w-8">
              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </span>
            <span
              className={`font-[family-name:var(--font-sans)] text-[13px] leading-tight font-bold tracking-tight tabular-nums sm:text-[15px] md:text-base ${
                highlight ? "text-purple" : "text-charcoal"
              }`}
            >
              {contact.phone}
            </span>
          </div>

          <span
            className={`mt-2 inline-flex w-full items-center justify-center rounded-full px-2 py-1.5 text-[9px] font-semibold tracking-[0.12em] uppercase transition sm:text-[10px] ${
              highlight
                ? "border border-purple/30 bg-purple/10 text-purple"
                : "border border-gold/25 bg-[#fffaf5] text-purple/80 group-hover:border-purple/25 group-hover:bg-purple group-hover:text-white"
            }`}
          >
            Call Now
          </span>
        </motion.a>
      ))}
    </div>
  );
}

export function RSVP() {
  const [inviteAccepted, setInviteAccepted] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [highlightForm, setHighlightForm] = useState(false);
  const [highlightContacts, setHighlightContacts] = useState(false);
  const [thankYouName, setThankYouName] = useState<string | null>(null);
  const formAnchorRef = useRef<HTMLDivElement>(null);
  const highlightTimerRef = useRef<number | null>(null);

  const clearHighlightTimer = useCallback(() => {
    if (highlightTimerRef.current !== null) {
      window.clearTimeout(highlightTimerRef.current);
      highlightTimerRef.current = null;
    }
  }, []);

  const stopHighlights = useCallback(() => {
    clearHighlightTimer();
    setHighlightForm(false);
    setHighlightContacts(false);
  }, [clearHighlightTimer]);

  const handleAccept = useCallback(() => {
    if (inviteAccepted) return;
    setInviteAccepted(true);
    setCelebrating(true);
    setFormVisible(true);
    setHighlightForm(true);
    setHighlightContacts(true);

    window.setTimeout(() => {
      formAnchorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 450);

    clearHighlightTimer();
    highlightTimerRef.current = window.setTimeout(() => {
      setHighlightForm(false);
      setHighlightContacts(false);
    }, 4200);
  }, [clearHighlightTimer, inviteAccepted]);

  const handleFormSuccess = useCallback((firstName: string) => {
    stopHighlights();
    setThankYouName(firstName);
  }, [stopHighlights]);

  const handleCelebrationComplete = useCallback(() => {
    setCelebrating(false);
  }, []);

  useEffect(() => {
    return () => clearHighlightTimer();
  }, [clearHighlightTimer]);

  return (
    <section id="rsvp" className="sea-section section-padding relative overflow-hidden">
      <CelebrationBurst active={celebrating} onComplete={handleCelebrationComplete} />

      {thankYouName ? (
        <ThankYouModal firstName={thankYouName} onClose={() => setThankYouName(null)} />
      ) : null}

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-8 md:mb-16">
          <InviteAcceptedButton accepted={inviteAccepted} onAccept={handleAccept} />
          <AnimatedHeading title="RSVPs" subtitle="We Can't Wait to Celebrate With You" script />
        </div>

        {formVisible ? (
          <div ref={formAnchorRef} className="scroll-mt-24">
            <RsvpForm highlighted={highlightForm} onSuccess={handleFormSuccess} />
          </div>
        ) : null}

        {inviteAccepted ? (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-4 max-w-xl text-center font-[family-name:var(--font-sans)] text-sm font-medium text-purple md:mb-6 md:text-base"
          >
            Prefer to call? Reach us on any of the numbers below.
          </motion.p>
        ) : (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-4 max-w-xl text-center font-[family-name:var(--font-sans)] text-sm text-charcoal-soft md:mb-6 md:text-base"
          >
            Contact any of the RSVP numbers for further details, Thank You!
          </motion.p>
        )}

        <RsvpContactCards highlight={highlightContacts} />
      </div>
    </section>
  );
}
