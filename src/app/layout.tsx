import type { Metadata } from "next";
import Script from "next/script";
import { Great_Vibes, Playfair_Display, Poppins } from "next/font/google";
import { COUPLE, HASHTAG, WEDDING_DATES } from "@/lib/constants";
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

const poppins = Poppins({
  variable: "--font-poppins",
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
    <html lang="en" className={`${playfair.variable} ${greatVibes.variable} ${poppins.variable}`}>
      <body className="m-0 min-h-screen p-0 font-[family-name:var(--font-poppins)] antialiased">
        <Script id="intro-pending" strategy="beforeInteractive">
          {`document.documentElement.dataset.introPending="1"`}
        </Script>
        {children}
      </body>
    </html>
  );
}
