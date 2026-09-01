import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import RashifalRashiLive from "@/components/RashifalRashiLive";
import { RASHIS, getRashi } from "@/lib/rashis";

export function generateStaticParams() {
  return RASHIS.map((r) => ({ rashi: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ rashi: string }> }): Promise<Metadata> {
  const { rashi } = await params;
  const r = getRashi(rashi);
  if (!r) return {};
  return {
    title: `आज का ${r.name_hi} राशिफल — ${r.name} Daily Horoscope`,
    description: `Aaj ka ${r.name_hi} rashifal (${r.name} daily horoscope in Hindi): career, money, love and health stars computed from today's real planetary transits over your Moon sign — plus this week's outlook. Updated live every day.`,
    alternates: { canonical: `/rashifal/${r.slug}/` },
  };
}

export default async function Page({ params }: { params: Promise<{ rashi: string }> }) {
  const { rashi } = await params;
  const r = getRashi(rashi);
  if (!r) notFound();

  const faqs = [
    {
      q: `${r.name_hi} राशिफल किस गणना से बनता है?`,
      a: `यह राशिफल किसी template से नहीं — आज की वास्तविक ग्रह-स्थितियों (गोचर) से बनता है: चंद्रमा ${r.name_hi} से किस भाव में है, ${r.lord_hi} (राशि-स्वामी) की स्थिति क्या है, और कौन-से ग्रह ${r.name_hi} पर दृष्टि डाल रहे हैं। इसीलिए यह रोज़ बदलता है और हर राशि के लिए अलग होता है।`,
    },
    {
      q: `मेरी राशि ${r.name_hi} है या नहीं, कैसे पता करूं?`,
      a: `वैदिक राशिफल चंद्र-राशि से देखा जाता है — यानी जन्म के समय चंद्रमा जिस राशि में था (जन्म-तारीख वाली 'sun sign' नहीं)। अगर आपको अपनी चंद्र-राशि पक्की नहीं पता, तो हमारे निःशुल्क कुंडली टूल में जन्म-विवरण डालें — वह आपकी सही चंद्र-राशि और नक्षत्र दोनों बता देगा।`,
    },
    {
      q: `${r.name_hi} राशि का स्वामी कौन है और शुभ दिन कौन-सा है?`,
      a: `${r.name_hi} के स्वामी ${r.lord_hi} (${r.lord}) हैं। परम्परा में इस राशि का शुभ दिन ${r.lucky_day} और शुभ रंग ${r.lucky_colors.join(", ")} माने जाते हैं। तत्व ${r.element_hi} है — स्वभाव की पूरी जानकारी नीचे राशि-प्रोफ़ाइल में है।`,
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="container" style={{ maxWidth: "860px" }}>
        <Breadcrumbs
          crumbs={[
            { name: "Home", href: "/" },
            { name: "Rashifal", href: "/rashifal" },
            { name: r.name_hi },
          ]}
        />
        <h1 className="section-heading">आज का {r.name_hi} राशिफल</h1>
        <p className="section-heading-hi devanagari">
          {r.name} Daily Horoscope · आज के वास्तविक गोचर से · रोज़ स्वतः अपडेट
        </p>

        <div className="tool-explainer" style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p className="devanagari" style={{ fontWeight: 600, color: "var(--maroon)" }}>
            Template नहीं — आज की असली ग्रह-स्थितियों से गणना: चंद्र-गोचर, {r.lord_hi} की स्थिति और दृष्टियां।
          </p>
        </div>

        <RashifalRashiLive rashiIndex={r.index} rashiEn={r.name} rashiHi={r.name_hi} />

        <article className="guide-article" style={{ marginTop: "2.5rem" }}>
          <h2 className="guide-h2 devanagari">{r.name_hi} राशि — स्वभाव और प्रोफ़ाइल</h2>
          <p className="guide-p devanagari">{r.traits_hi}</p>
          <p className="guide-p devanagari">
            स्वामी: <strong>{r.lord_hi}</strong> · तत्व: <strong>{r.element_hi}</strong> · स्वभाव:{" "}
            <strong>{r.quality_hi}</strong> · प्रतीक: <strong>{r.symbol_hi}</strong> · शुभ दिन:{" "}
            <strong>{r.lucky_day}</strong>
          </p>
          <p className="guide-p devanagari">
            पूरी राशि-प्रोफ़ाइल (करियर, प्रेम, स्वास्थ्य, नक्षत्र-चरण): <Link href={`/rashi/${r.slug}/`}>{r.name_hi} राशि गाइड →</Link>
          </p>

          <h2 className="guide-h2 devanagari">आम सवाल</h2>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <details key={i} className="faq-item">
                <summary className="faq-q devanagari">
                  <span>{f.q}</span>
                  <span className="faq-chevron" aria-hidden="true">›</span>
                </summary>
                <div className="faq-a devanagari">{f.a}</div>
              </details>
            ))}
          </div>

          <h2 className="guide-h2 devanagari">अन्य राशियों का आज का राशिफल</h2>
          <p className="guide-p devanagari" style={{ lineHeight: 2 }}>
            {RASHIS.filter((x) => x.slug !== r.slug).map((x, i) => (
              <span key={x.slug}>
                {i > 0 && " · "}
                <Link href={`/rashifal/${x.slug}/`}>{x.name_hi}</Link>
              </span>
            ))}
          </p>

          <p className="guide-p devanagari" style={{ textAlign: "center", marginTop: "1.5rem" }}>
            सभी 12 राशियां एक साथ + साप्ताहिक राशिफल: <Link href="/tools/rashifal/">राशिफल टूल</Link> · अपनी सही
            चंद्र-राशि जानें: <Link href="/tools/kundli/">निःशुल्क कुंडली</Link>
          </p>
        </article>
      </div>
    </section>
  );
}
