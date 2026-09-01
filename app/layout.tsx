import type { Metadata } from "next";
import { Fraunces, Tiro_Devanagari_Hindi, Mukta } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CosmicBackground from "@/components/CosmicBackground";
import StructuredData from "@/components/StructuredData";
import BackToTop from "@/components/BackToTop";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const tiroDevanagari = Tiro_Devanagari_Hindi({
  variable: "--font-tiro-devanagari",
  subsets: ["devanagari"],
  weight: "400",
  display: "swap",
});

const mukta = Mukta({
  variable: "--font-mukta",
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Astrologer Shivanii — Personal Vedic Astrology Readings",
    // Was " | Astrologer Shivanii" (22 chars) — ate nearly half of Google's
    // ~60-char SERP title budget before a page's own title even started,
    // confirmed via built output that most page titles were being
    // truncated in search results as a result. Shortened site-wide in one
    // place rather than re-padding every individual page title.
    template: "%s | Shivanii",
  },
  description:
    "AstroShivanii — personal Vedic astrology readings by Astrologer Shivanii. Birth chart, marriage matching, Prashna, annual forecast and more. Hindi & English. Flat pricing, no per-minute meters.",
  keywords: [
    "AstroShivanii",
    "Astro Shivanii",
    "vedic astrology",
    "kundli",
    "birth chart reading",
    "marriage matching",
    "guna milan",
    "astrologer",
    "jyotish",
    "Hindi astrology",
    "online astrologer India",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    alternateLocale: "hi_IN",
    siteName: "AstroShivanii",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Astrologer Shivanii — Personal Vedic Astrology Readings" }],
  },
  twitter: { card: "summary_large_image", images: ["/og-image.png"] },
  robots: { index: true, follow: true },
  alternates: { canonical: "./" },
  category: "Astrology",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="hi"
      className={`${fraunces.variable} ${tiroDevanagari.variable} ${mukta.variable}`}
      style={
        {
          "--font-display": "var(--font-fraunces), Georgia, serif",
          "--font-devanagari":
            "var(--font-tiro-devanagari), 'Noto Sans Devanagari', serif",
          "--font-body": "var(--font-mukta), 'Noto Sans', system-ui, sans-serif",
        } as React.CSSProperties
      }
    >
      <body>
        <StructuredData />
        <I18nProvider>
          <CosmicBackground />
          <div className="content-layer">
            <Navbar />
            <main>{children}</main>
            <Footer />
          </div>
          <FloatingWhatsApp />
          <BackToTop />
        </I18nProvider>
      </body>
    </html>
  );
}
