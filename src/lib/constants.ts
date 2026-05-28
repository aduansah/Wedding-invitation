export const COUPLE = {
  groom: "Michael",
  bride: "Precious",
  full: "Michael & Precious",
  initials: "M&P",
} as const;

export const HASHTAG = "#Mprez26";

/** Drop your opener animation at public/videos/opener.mp4 (optional poster: opener-poster.jpg) */
export const OPENER_VIDEO = {
  src: "/videos/opener.mp4",
  poster: undefined as string | undefined,
  muted: true,
} as const;

export const WEDDING_DATES = {
  display: "July 17–18, 2026",
  countdown: new Date("2026-07-18T14:00:00-04:00"),
} as const;

export const EVENTS = [
  {
    id: "traditional",
    title: "Traditional Marriage",
    emoji: "🤍",
    date: "Friday, July 17, 2026",
    time: "5:00 PM EST",
    dressCode: "All White",
    venue: "Wesley Banquet Hall",
    address: "69 Milvan Dr, North York",
    icon: "rings" as const,
  },
  {
    id: "ceremony",
    title: "Wedding Ceremony",
    emoji: "💒",
    date: "Saturday, July 18, 2026",
    time: "2:00 PM EST",
    dressCode: "Come Elegantly Dressed",
    venue: "Ghana Methodist Church of Toronto",
    address: "69 Milvan Dr, North York",
    icon: "church" as const,
  },
  {
    id: "reception",
    title: "Reception",
    emoji: "✨",
    date: "Saturday, July 18, 2026",
    time: "6:00 PM EST",
    dressCode: "Come Elegantly Dressed",
    venue: "Wesley Banquet Hall",
    address: "69 Milvan Dr, North York",
    icon: "sparkles" as const,
  },
] as const;

export const LOCATION = {
  address: "69 Milvan Dr, North York, ON M9L 1Y8",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=69+Milvan+Dr,+North+York,+ON+M9L+1Y8",
  embedUrl:
    "https://maps.google.com/maps?q=69+Milvan+Dr,+North+York,+ON+M9L+1Y8&output=embed",
} as const;

export const RSVP_CONTACTS = [
  { name: "Contact 1", phone: "(647) 702-6077", tel: "+16477026077" },
  { name: "Contact 2", phone: "(647) 801-7809", tel: "+16478017809" },
  { name: "Contact 3", phone: "(647) 772-8587", tel: "+16477728587" },
  { name: "Contact 4", phone: "(647) 785-7395", tel: "+16477857395" },
] as const;

/** Hero background + story photos + section divider */
export const WEDDING_IMAGES = {
  heroBackground: "/images/hero-background.png",
  story: "/images/story.png",
  story2: "/images/story2.png",
  sectionBorder: "/images/boarder.png",
} as const;

export const GALLERY_IMAGES = [
  {
    src: "/images/gallery/01.jpeg",
    alt: "Michael and Precious — moment 1",
    span: "tall" as const,
  },
  {
    src: "/images/gallery/02.jpeg",
    alt: "Michael and Precious — moment 2",
    span: "wide" as const,
  },
  {
    src: "/images/gallery/03.jpeg",
    alt: "Michael and Precious — moment 3",
    span: "normal" as const,
  },
  {
    src: "/images/gallery/04.jpg",
    alt: "Michael and Precious — moment 4",
    span: "normal" as const,
  },
  {
    src: "/images/gallery/05.jpg",
    alt: "Michael and Precious — moment 5",
    span: "wide" as const,
  },
  {
    src: "/images/gallery/06.jpeg",
    alt: "Michael and Precious — moment 6",
    span: "tall" as const,
  },
] as const;

export const CLOSING_MESSAGE = "Your presence will mean the world to us.";

export const WEDDING_AUDIO = {
  src: "/audio/wedding-music.mp3",
} as const;
