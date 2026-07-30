import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of service for Astrologer Shivanii's readings: what you're purchasing, delivery times, refund policy, and the guidance-not-guarantee disclaimer.",
};

export default function TermsPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "760px" }}>
        <h1 style={{ marginBottom: "2rem" }}>Terms of Service</h1>
        <div style={{ color: "var(--ink-light)", lineHeight: 1.8, fontSize: "0.95rem" }}>
          <p style={{ marginBottom: "1rem" }}><strong>Last updated:</strong> June 2025</p>
          <h2 style={{ marginBottom: "0.75rem", fontSize: "1.2rem" }}>Nature of service</h2>
          <p style={{ marginBottom: "1rem" }}>
            Astrology readings provided by Astrologer Shivanii are for informational and guidance purposes only.
            They do not constitute medical, legal, financial, or psychological advice. Consult qualified
            professionals for decisions in these areas.
          </p>
          <h2 style={{ marginBottom: "0.75rem", fontSize: "1.2rem" }}>Disclaimer</h2>
          <p style={{ marginBottom: "1rem" }}>
            Astrology is a form of guidance, not a guarantee. Predictions and interpretations reflect
            astrological principles and Shivanii's personal experience and should not be treated as fact.
          </p>
          <h2 style={{ marginBottom: "0.75rem", fontSize: "1.2rem" }}>Refund policy</h2>
          <p style={{ marginBottom: "1rem" }}>
            Once a reading has been delivered, refunds are not available. If your reading has not been
            delivered within the stated timeframe, please contact us on WhatsApp.
          </p>
          <h2 style={{ marginBottom: "0.75rem", fontSize: "1.2rem" }}>Contact</h2>
          <p>For any questions, reach us via the Contact page.</p>
        </div>
      </div>
    </section>
  );
}
