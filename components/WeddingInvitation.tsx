"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  CalendarDays,
  Church,
  Clock3,
  Flower2,
  Gem,
  Heart,
  MapPin,
  Music2,
  Navigation,
  PauseCircle,
  Phone,
  Sparkles,
  Users,
} from "lucide-react";

const weddingStart = new Date("2026-07-17T17:00:00-04:00").getTime();
const mapsLink =
  "https://www.google.com/maps/search/?api=1&query=69%20Milvan%20Dr%2C%20North%20York%2C%20ON%20M9L%201Y8";

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type EventItem = {
  title: string;
  date?: string;
  time: string;
  venue: string;
  dress?: string;
  address?: string;
  icon: LucideIcon;
  label: string;
};

const events: EventItem[] = [
  {
    title: "Traditional Marriage",
    date: "Friday July 17, 2026",
    time: "5:00 PM EST",
    dress: "All White",
    venue: "Wesley Banquet Hall",
    address: "69 Milvan Dr, North York",
    icon: Flower2,
    label: "Day One",
  },
  {
    title: "Wedding Ceremony",
    date: "Saturday July 18, 2026",
    time: "2:00 PM",
    venue: "Ghana Methodist Church of Toronto",
    address: "69 Milvan Dr, North York",
    icon: Church,
    label: "The Vows",
  },
  {
    title: "Reception",
    time: "6:00 PM",
    dress: "Come Elegantly Dressed",
    venue: "Wesley Banquet Hall",
    icon: Sparkles,
    label: "The Celebration",
  },
];

const gallery = [
  {
    title: "Champagne Arrival",
    span: "md:row-span-2",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Golden Tablescape",
    span: "",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Soft Florals",
    span: "",
    image:
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Candlelit Romance",
    span: "md:row-span-2",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Forever Details",
    span: "",
    image:
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Evening Glow",
    span: "",
    image:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85",
  },
];

const rsvpNumbers = ["(647) 702-6077", "(647) 801-7809", "(647) 772-8587", "(647) 785-7395"];

function getCountdown(): Countdown {
  const distance = Math.max(weddingStart - Date.now(), 0);

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 44, filter: "blur(14px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.85, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

function SectionIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <Reveal className="mx-auto max-w-3xl text-center">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.48em] text-[#a77b32]">
        {eyebrow}
      </p>
      <h2 className="font-heading text-5xl leading-tight text-[#2a1d16] sm:text-6xl lg:text-7xl">
        {title}
      </h2>
      <div className="mx-auto my-7 luxury-divider" />
      {children ? (
        <div className="font-romantic text-2xl leading-relaxed text-[#6c5545] sm:text-3xl">
          {children}
        </div>
      ) : null}
    </Reveal>
  );
}

function FloralCorner({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute h-52 w-52 text-[#d7b56f]/45 ${className}`}
      viewBox="0 0 220 220"
      fill="none"
    >
      <path
        className="floral-line"
        d="M26 188C62 170 76 138 76 99C76 70 91 45 121 31C113 58 123 80 148 93C118 99 98 119 92 151C119 126 148 120 184 132C153 146 135 169 127 202"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M50 151C34 139 33 120 49 107C64 119 65 139 50 151Z"
        fill="currentColor"
      />
      <path
        d="M119 61C100 51 96 30 110 15C129 25 132 46 119 61Z"
        fill="currentColor"
      />
      <path
        d="M154 113C146 94 156 76 176 73C184 92 174 110 154 113Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SectionDivider() {
  return (
    <div className="relative flex items-center justify-center py-3">
      <div className="luxury-divider" />
      <Heart className="absolute h-5 w-5 fill-[#d9b978] text-[#d9b978]" />
    </div>
  );
}

export default function WeddingInvitation() {
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<{
    context: AudioContext;
    gain: GainNode;
    oscillators: OscillatorNode[];
  } | null>(null);

  const { scrollY, scrollYProgress } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, 150]);
  const heroScale = useTransform(scrollY, [0, 700], [1.05, 1.18]);

  const particles = useMemo(
    () =>
      Array.from({ length: 34 }, (_, index) => ({
        id: index,
        left: (index * 29 + 7) % 100,
        delay: (index % 12) * 0.46,
        duration: 10 + (index % 8) * 1.18,
        size: 5 + (index % 5) * 2,
      })),
    [],
  );

  useEffect(() => {
    const loadingTimer = window.setTimeout(() => setLoading(false), 1650);
    const updateCountdown = () => setCountdown(getCountdown());

    updateCountdown();
    const countdownTimer = window.setInterval(updateCountdown, 1000);

    return () => {
      window.clearTimeout(loadingTimer);
      window.clearInterval(countdownTimer);
      audioRef.current?.context.close();
    };
  }, []);

  const stopMusic = () => {
    const currentAudio = audioRef.current;
    if (!currentAudio) {
      return;
    }

    currentAudio.gain.gain.setTargetAtTime(0.0001, currentAudio.context.currentTime, 0.08);
    window.setTimeout(() => {
      currentAudio.oscillators.forEach((oscillator) => {
        try {
          oscillator.stop();
        } catch {
          // The browser may have already stopped this oscillator during cleanup.
        }
      });
      currentAudio.context.close();
    }, 260);

    audioRef.current = null;
    setMusicPlaying(false);
  };

  const toggleMusic = async () => {
    if (musicPlaying) {
      stopMusic();
      return;
    }

    const AudioConstructor =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioConstructor) {
      return;
    }

    const context = new AudioConstructor();
    const gain = context.createGain();
    gain.gain.value = 0.0001;
    gain.connect(context.destination);

    const oscillators = [261.63, 329.63, 392].map((frequency, index) => {
      const oscillator = context.createOscillator();
      oscillator.type = index === 0 ? "sine" : "triangle";
      oscillator.frequency.value = frequency;

      const voiceGain = context.createGain();
      voiceGain.gain.value = index === 0 ? 0.05 : 0.027;
      oscillator.connect(voiceGain);
      voiceGain.connect(gain);
      oscillator.start();

      return oscillator;
    });

    gain.gain.exponentialRampToValueAtTime(0.055, context.currentTime + 0.8);
    audioRef.current = { context, gain, oscillators };
    setMusicPlaying(true);
    await context.resume();
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fbf5ea] text-[#2a1d16]">
      <motion.div
        className="fixed left-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-[#fff4c7] via-[#d6ad61] to-[#8f6426]"
        style={{ scaleX: scrollYProgress }}
      />

      <motion.div
        aria-hidden={!loading}
        className="fixed inset-0 z-[80] grid place-items-center bg-[#1f1510]"
        animate={{ opacity: loading ? 1 : 0, pointerEvents: loading ? "auto" : "none" }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      >
        <div className="text-center">
          <div className="loader-ring mx-auto mb-8 h-24 w-24 rounded-full border border-[#d9b978]/20 border-t-[#e9d49b]" />
          <p className="font-heading text-4xl text-[#fff6df]">Michael &amp; Precious</p>
          <p className="mt-3 text-xs uppercase tracking-[0.5em] text-[#d9b978]">
            A love story awaits
          </p>
        </div>
      </motion.div>

      <header className="fixed left-0 right-0 top-5 z-50 mx-auto flex w-[min(1120px,calc(100%-2rem))] items-center justify-between rounded-full border border-white/25 bg-[#1f1510]/18 px-5 py-3 text-white shadow-2xl backdrop-blur-xl">
        <a href="#top" className="font-heading text-2xl tracking-wide">
          M<span className="text-[#e1c27c]">&amp;</span>P
        </a>
        <nav className="hidden items-center gap-8 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/78 md:flex">
          <a className="transition hover:text-[#f5dd9c]" href="#story">
            Story
          </a>
          <a className="transition hover:text-[#f5dd9c]" href="#events">
            Events
          </a>
          <a className="transition hover:text-[#f5dd9c]" href="#rsvp">
            RSVP
          </a>
        </nav>
        <a
          href="#rsvp"
          className="rounded-full border border-[#e4c983]/55 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#fff1bd] transition hover:bg-[#e4c983] hover:text-[#2a1d16]"
        >
          Attend
        </a>
      </header>

      <button
        type="button"
        onClick={toggleMusic}
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full border border-white/45 bg-[#2a1d16]/70 text-[#fff1c2] shadow-[0_18px_45px_rgba(42,29,22,0.28)] backdrop-blur-xl transition hover:scale-105 hover:bg-[#2a1d16]"
        aria-label={musicPlaying ? "Pause ambient music" : "Play ambient music"}
      >
        {musicPlaying ? <PauseCircle className="h-6 w-6" /> : <Music2 className="h-6 w-6" />}
      </button>

      <section id="top" className="relative min-h-screen overflow-hidden bg-[#1f1510] text-white">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            y: heroY,
            scale: heroScale,
            backgroundImage:
              "linear-gradient(120deg, rgba(31,21,16,0.84), rgba(31,21,16,0.4) 45%, rgba(31,21,16,0.82)), url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=2200&q=85')",
          }}
        />
        <div className="hero-glow absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-[#fbf5ea]" />

        {particles.map((particle) => (
          <span
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.left}%`,
              height: particle.size,
              width: particle.size,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}

        <FloralCorner className="-left-10 top-24 rotate-[-16deg]" />
        <FloralCorner className="-right-12 bottom-24 rotate-180" />

        <div className="relative z-10 mx-auto flex min-h-screen w-[min(1120px,calc(100%-2rem))] items-center justify-center py-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 1.1, ease: "easeOut" }}
            className="mx-auto max-w-5xl"
          >
            <div className="mx-auto mb-8 flex w-fit items-center gap-4 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.38em] text-[#f6e6b7] backdrop-blur-xl">
              <Sparkles className="h-4 w-4" />
              July 17&ndash;18, 2026
            </div>

            <h1 className="font-heading gold-gradient-text text-6xl leading-[0.9] sm:text-8xl lg:text-[9.8rem]">
              Michael
              <span className="block text-[0.62em] italic leading-[0.9]">&amp;</span>
              Precious
            </h1>
            <p className="font-romantic mx-auto mt-8 max-w-3xl text-3xl leading-snug text-[#fff7df] sm:text-4xl lg:text-5xl">
              Two hearts, one beautiful journey.
              <span className="block">Our forever begins here.</span>
            </p>
            <p className="mx-auto mt-7 max-w-2xl text-sm uppercase leading-8 tracking-[0.26em] text-white/76 sm:text-base">
              Together with our Families, we invite you to celebrate our union in love.
            </p>

            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Days", countdown.days],
                ["Hours", countdown.hours],
                ["Minutes", countdown.minutes],
                ["Seconds", countdown.seconds],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="glass-card rounded-[1.5rem] px-4 py-5 text-center text-white"
                >
                  <p className="font-heading text-4xl sm:text-5xl">
                    {String(value).padStart(2, "0")}
                  </p>
                  <p className="mt-2 text-[0.63rem] font-semibold uppercase tracking-[0.32em] text-[#f0d897]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <a
          href="#story"
          className="scroll-indicator absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-white/70"
        >
          Scroll
          <span className="h-12 w-px bg-gradient-to-b from-[#e7c980] to-transparent" />
        </a>
      </section>

      <section id="story" className="section-shell overflow-hidden">
        <FloralCorner className="-left-20 top-10 opacity-60" />
        <FloralCorner className="-right-24 bottom-6 rotate-180 opacity-50" />
        <SectionIntro eyebrow="Our Story" title="A beautiful journey">
          Two hearts, one beautiful journey. Our forever begins here. Together with our Families,
          we invite you to join us celebrate our union in love.
        </SectionIntro>

        <div className="mx-auto mt-16 grid w-[min(1120px,calc(100%-1rem))] gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="glass-card relative overflow-hidden rounded-[2rem] p-8 sm:p-10">
            <div className="absolute right-8 top-8 text-[#d9b978]/30">
              <Heart className="h-24 w-24 fill-current" />
            </div>
            <p className="mb-8 w-fit rounded-full border border-[#d9b978]/40 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#a77b32]">
              Michael &amp; Precious
            </p>
            <h3 className="font-heading max-w-xl text-4xl leading-tight text-[#2a1d16] sm:text-5xl">
              An invitation wrapped in warmth, family, and forever.
            </h3>
            <p className="mt-7 text-base leading-8 text-[#6c5545]">
              We imagined this celebration as a cinematic gathering of love: ivory light,
              champagne details, soft florals, graceful music, and the people who shaped our
              story. Every moment is created to feel intimate, elegant, and unforgettable.
            </p>
          </Reveal>

          <Reveal delay={0.12} className="relative min-h-[440px] overflow-hidden rounded-[2rem]">
            <div
              className="absolute inset-0 scale-105 bg-cover bg-center transition duration-700 hover:scale-110"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(42,29,22,0.02), rgba(42,29,22,0.58)), url('https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1400&q=85')",
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f3dda1]">
                Our forever begins here
              </p>
              <p className="font-romantic mt-3 max-w-lg text-3xl leading-tight">
                A premium celebration designed for memories that glow long after the evening ends.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionDivider />

      <section id="events" className="section-shell bg-[#fffaf2]">
        <SectionIntro eyebrow="Wedding Weekend" title="Event Timeline">
          A graceful two-day celebration honoring tradition, vows, and an elegant evening reception.
        </SectionIntro>

        <div className="relative mx-auto mt-16 w-[min(980px,calc(100%-1rem))]">
          <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#d9b978]/70 to-transparent md:left-1/2" />

          {events.map((event, index) => {
            const Icon = event.icon;
            const alignment =
              index % 2 === 0 ? "md:mr-[calc(50%+2rem)]" : "md:ml-[calc(50%+2rem)]";

            const markerPosition =
              index % 2 === 0
                ? "md:left-auto md:right-[-4.5rem]"
                : "md:left-[-4.5rem] md:right-auto";
            return (
              <Reveal key={event.title} delay={index * 0.08} className="relative mb-10 last:mb-0">
                <div className={`group relative ml-16 md:ml-0 ${alignment}`}>
                  <div
                    className={`absolute -left-[3.25rem] top-7 grid h-12 w-12 place-items-center rounded-full border border-[#d9b978]/50 bg-[#fffaf2] text-[#a77b32] shadow-[0_12px_35px_rgba(167,123,50,0.18)] ${markerPosition}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <article className="glass-card overflow-hidden rounded-[2rem] p-7 transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(73,47,22,0.18)] sm:p-9">
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <span className="rounded-full border border-[#d9b978]/40 px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-[#a77b32]">
                        {event.label}
                      </span>
                      <Gem className="h-5 w-5 text-[#d9b978]" />
                    </div>
                    <h3 className="font-heading text-4xl leading-tight text-[#2a1d16]">
                      {event.title}
                    </h3>
                    {event.date ? (
                      <p className="mt-4 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#8c6c43]">
                        <CalendarDays className="h-4 w-4" />
                        {event.date}
                      </p>
                    ) : null}
                    <div className="mt-6 grid gap-4 text-[#5d4738]">
                      <p className="flex items-center gap-3">
                        <Clock3 className="h-5 w-5 text-[#a77b32]" />
                        <span>{event.time}</span>
                      </p>
                      <p className="flex items-start gap-3">
                        <MapPin className="mt-1 h-5 w-5 text-[#a77b32]" />
                        <span>
                          <strong className="font-semibold text-[#2a1d16]">{event.venue}</strong>
                          {event.address ? <span className="block">{event.address}</span> : null}
                        </span>
                      </p>
                      {event.dress ? (
                        <p className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-[#a77b32]" />
                          <span>
                            Dress Code:{" "}
                            <strong className="font-semibold text-[#2a1d16]">{event.dress}</strong>
                          </span>
                        </p>
                      ) : null}
                    </div>
                  </article>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <SectionDivider />

      <section id="location" className="section-shell overflow-hidden">
        <SectionIntro eyebrow="Location" title="Celebrate with us">
          69 Milvan Dr,
          <br />
          North York, ON M9L 1Y8
        </SectionIntro>

        <Reveal className="glass-card map-frame mx-auto mt-14 grid w-[min(1120px,calc(100%-1rem))] overflow-hidden rounded-[2.25rem] lg:grid-cols-[1fr_0.55fr]">
          <iframe
            title="Map to 69 Milvan Dr, North York"
            src="https://www.google.com/maps?q=69%20Milvan%20Dr%2C%20North%20York%2C%20ON%20M9L%201Y8&output=embed"
            className="h-[420px] w-full border-0 lg:h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="relative overflow-hidden bg-[#2a1d16] p-8 text-white sm:p-10">
            <FloralCorner className="-right-24 -top-20 rotate-180 text-[#d9b978]/25" />
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#d9b978]">
              Wedding Destination
            </p>
            <h3 className="font-heading mt-6 text-4xl leading-tight sm:text-5xl">
              Arrive in love, leave with memories.
            </h3>
            <p className="mt-6 leading-8 text-white/70">
              The ceremony and reception are hosted at the Milvan Drive celebration destination in
              North York. Tap below for turn-by-turn directions.
            </p>
            <a
              href={mapsLink}
              target="_blank"
              rel="noreferrer"
              className="gold-button mt-8 inline-flex items-center gap-3 rounded-full bg-[#d9b978] px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#2a1d16] transition hover:-translate-y-1"
            >
              <Navigation className="h-4 w-4" />
              Open in Google Maps
            </a>
          </div>
        </Reveal>
      </section>

      <section id="gallery" className="section-shell bg-[#fffaf2]">
        <SectionIntro eyebrow="Gallery" title="Moments in gold">
          A cinematic moodboard of soft light, floral details, candlelit warmth, and modern wedding
          romance.
        </SectionIntro>

        <Reveal className="gallery-scrollbar mx-auto mt-14 flex w-[min(1180px,calc(100%-1rem))] snap-x gap-5 overflow-x-auto pb-4 md:grid md:auto-rows-[220px] md:grid-cols-4 md:overflow-visible md:pb-0">
          {gallery.map((item) => (
            <figure
              key={item.title}
              className={`group relative min-h-[360px] min-w-[78vw] snap-center overflow-hidden rounded-[2rem] bg-[#2a1d16] shadow-[0_20px_70px_rgba(73,47,22,0.15)] md:min-h-0 md:min-w-0 ${item.span}`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${item.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1f1510]/82 via-[#1f1510]/10 to-transparent" />
              <figcaption className="absolute bottom-0 left-0 right-0 p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#efd895]">
                  {item.title}
                </p>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </section>

      <SectionDivider />

      <section id="rsvp" className="section-shell overflow-hidden">
        <FloralCorner className="-left-24 top-24 rotate-12 opacity-60" />
        <SectionIntro eyebrow="RSVP" title="Kindly respond">
          Your presence is the gift we treasure most. Please confirm with any of our RSVP contacts.
        </SectionIntro>

        <div className="mx-auto mt-14 grid w-[min(1000px,calc(100%-1rem))] gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {rsvpNumbers.map((number, index) => {
            const tel = `+1${number.replace(/\D/g, "")}`;

            return (
              <Reveal key={number} delay={index * 0.06}>
                <a
                  href={`tel:${tel}`}
                  className="glass-card group block rounded-[1.75rem] p-7 text-center transition duration-500 hover:-translate-y-1 hover:border-[#d9b978]/65 hover:shadow-[0_25px_70px_rgba(167,123,50,0.18)]"
                >
                  <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-[#2a1d16] text-[#f4daa0] transition group-hover:scale-110">
                    <Phone className="h-5 w-5" />
                  </span>
                  <p className="text-[0.63rem] font-semibold uppercase tracking-[0.34em] text-[#a77b32]">
                    RSVP Contact
                  </p>
                  <p className="mt-3 text-lg font-semibold text-[#2a1d16]">{number}</p>
                  <p className="mt-4 text-sm text-[#6c5545] sm:hidden">Tap to call</p>
                </a>
              </Reveal>
            );
          })}
        </div>
      </section>

      <footer className="relative overflow-hidden bg-[#1f1510] px-5 py-16 text-center text-white">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d9b978] to-transparent" />
        <FloralCorner className="-bottom-28 left-1/2 -translate-x-1/2 rotate-45 text-[#d9b978]/20" />
        <p className="font-heading text-4xl text-[#fff4d0]">Michael &amp; Precious</p>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.38em] text-white/55">
          Made with Love for Michael &amp; Precious
        </p>
      </footer>
    </main>
  );
}
