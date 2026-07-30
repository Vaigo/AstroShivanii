import type { Metadata } from "next";
import { FAQS } from "@/lib/faq";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqList from "./FaqList";

export const metadata: Metadata = {
  title: "FAQ — Bookings, Accuracy, Pricing & Privacy",
  description:
    "Answers to common questions about Astrologer Shivanii's readings: how bookings work, what happens without a birth time, refund policy, privacy, and why there's no fear-selling.",
  alternates: { canonical: "/faq/" },
};

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q.en,
      acceptedAnswer: { "@type": "Answer", text: f.a.en },
    })),
  };

  return (
    <section className="section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="container" style={{ maxWidth: "760px", paddingBottom: 0 }}>
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "FAQ" }]} />
      </div>
      <FaqList />
    </section>
  );
}
