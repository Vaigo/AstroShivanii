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

// Fonts. Every weight/style declared here is used somewhere (audited across
// pages, both languages, phone + desktop, tool results included); Fraunces 500
// and the italic weights other than 700 were not, so they are gone.
//
// Preloads (next/font preloads a call's `subsets` unless `preload: false`)
// compete with the homepage hero image, the LCP element on phones. So exactly
// the files the homepage's first render on a phone requests are preloaded
// (Hindi, the static default; that render includes the footer):
// - not preloaded: Fraunces italic (reading cards' corner label) and Mukta 500
//   (desktop nav, phone menu) — that render never asks for them;
// - preloaded: the first screen's fonts (incl. Tiro Latin, for the spaces in
//   its Devanagari lines) plus Mukta 600/700 and Mukta 400 Latin Extended (₹ in
//   the footer). That render asks for all of them; left to be found after the
//   first layout, they made Lighthouse's FCP worse.
// A family split over several calls is still one family (the generated
// @font-face uses the plain family name). Only the first call's CSS variable
// is used; the others sit on <html> so their @font-face rules always ship.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"], // one variable file serves them all
  style: "normal",
  display: "swap",
});
// Italic is only used at 700, so only 700 is asked for; Google then serves a
// static 700 instance (23 KB instead of the 46 KB variable file).
const frauncesItalic = Fraunces({
  variable: "--font-fraunces-italic",
  subsets: ["latin"],
  weight: "700",
  style: "italic",
  display: "swap",
  preload: false,
});

const tiroDevanagari = Tiro_Devanagari_Hindi({
  variable: "--font-tiro-devanagari",
  subsets: ["devanagari", "latin"],
  weight: "400",
  display: "swap",
});

const mukta = Mukta({
  variable: "--font-mukta",
  subsets: ["devanagari", "latin", "latin-ext"],
  weight: "400",
  display: "swap",
});
const muktaBold = Mukta({
  variable: "--font-mukta-bold",
  subsets: ["devanagari", "latin"],
  weight: ["600", "700"],
  display: "swap",
});
const mukta500 = Mukta({
  variable: "--font-mukta-500",
  subsets: ["devanagari", "latin"],
  weight: "500",
  display: "swap",
  preload: false,
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
    "astrologer shivani",
    "shivani astrologer",
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
      className={[fraunces, frauncesItalic, tiroDevanagari, mukta, muktaBold, mukta500].map((f) => f.variable).join(" ")}
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
