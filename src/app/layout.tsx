import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Michael & Precious | Wedding Celebration",
  description:
    "Join Michael and Precious as they celebrate their union in love. July 17–18, 2026 in North York, Ontario.",
  openGraph: {
    title: "Michael & Precious | Wedding Celebration",
    description:
      "Two hearts, one beautiful journey. Our forever begins here.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <body className="m-0 min-h-screen p-0 font-[family-name:var(--font-poppins)] antialiased">
        {children}
      </body>
    </html>
  );
}
