import type { Metadata } from "next";
import { Great_Vibes, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { COUPLE, HASHTAG, OPENER_VIDEO, WEDDING_DATES } from "@/lib/constants";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `💍 ${COUPLE.full} | Wedding Celebration ${HASHTAG}`,
  description: `You're invited! ${COUPLE.full} — ${WEDDING_DATES.display} in North York, Ontario. ${HASHTAG} ✨`,
  openGraph: {
    title: `${COUPLE.full} | Wedding Invitation ${HASHTAG}`,
    description: `Join us as we celebrate forever. ${WEDDING_DATES.display} 💒✨`,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-intro-pending=""
      suppressHydrationWarning
      className={`${playfair.variable} ${greatVibes.variable} ${bodyFont.variable}`}
    >
      <head>
        <link
          rel="preload"
          href={OPENER_VIDEO.src}
          as="video"
          type="video/mp4"
          fetchPriority="high"
        />
      </head>
      <body className="m-0 min-h-screen p-0 font-[family-name:var(--font-sans)] antialiased">
        {children}
      </body>
    </html>
  );
}
