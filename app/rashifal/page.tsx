import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import RashifalAllLive from "@/components/RashifalAllLive";
import { bakedRashifalAll } from "@/lib/baked";
import { fmtHi } from "@/lib/hi-date";

export async function generateMetadata(): Promise<Metadata> {
  // the build day's date (a rashifal exists for it, shared with the page body) goes into the snippet
  const baked = await bakedRashifalAll();
  return {
    title: "आज का राशिफल — Aaj Ka Rashifal, सभी 12 राशियां",
    description: baked
      ? `${fmtHi(baked.date)} का राशिफल: सभी 12 राशियों के सितारे, सबसे मज़बूत क्षेत्र और शुभ अंक — आज के असली गोचर से। Aaj ka rashifal in Hindi.`
      : "Aaj ka rashifal in Hindi: daily horoscope for all 12 rashis computed from today's real planetary transits — career, money, love, health stars, lucky numbers and auspicious hours. Updated every day.",
    alternates: { canonical: "/rashifal/" },
  };
}

export default async function Page() {
  const baked = await bakedRashifalAll();
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "860px" }}>
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Rashifal" }]} />
        <h1 className="section-heading">आज का राशिफल — Aaj Ka Rashifal</h1>
        <p className="section-heading-hi devanagari">
          अपनी राशि चुनें — आज के वास्तविक गोचर से बना राशिफल, रोज़ स्वतः अपडेट
        </p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p className="devanagari" style={{ fontWeight: 600, color: "var(--maroon)" }}>
            हर राशि के सितारे आज की असली ग्रह-स्थितियों से गणना होते हैं — किसी छपे राशिफल की नक़ल नहीं।
          </p>
          <p>
            The stars for each rashi are computed from today&apos;s actual transits over your Moon sign (Lahiri
            ayanamsa) — that&apos;s why they change daily and differ for every rashi.
          </p>
        </div>

        <RashifalAllLive initial={baked} />

        <p className="guide-p devanagari" style={{ textAlign: "center", marginTop: "2rem" }}>
          अपनी सही चंद्र-राशि नहीं पता? <Link href="/tools/kundli/">निःशुल्क कुंडली</Link> से जानें · साप्ताहिक
          राशिफल: <Link href="/tools/rashifal/">राशिफल टूल</Link>
        </p>
      </div>
    </section>
  );
}
