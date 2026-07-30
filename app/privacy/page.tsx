import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Astrologer Shivanii handles your data: birth details used only for your reading, never sold or shared. Payments secured by Razorpay.",
};

export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "760px" }}>
        <h1 style={{ marginBottom: "2rem" }}>Privacy Policy</h1>
        <div style={{ color: "var(--ink-light)", lineHeight: 1.8, fontSize: "0.95rem" }}>
          <p style={{ marginBottom: "1rem" }}>
            <strong>Last updated:</strong> June 2025
          </p>
          <h2 style={{ marginBottom: "0.75rem", fontSize: "1.2rem" }}>Data we collect</h2>
          <p style={{ marginBottom: "1rem" }}>
            When you book a reading, we collect your name, email address, WhatsApp number, and birth details
            (date, time, and place of birth). We use this information solely to provide the astrology reading
            you requested.
          </p>
          <h2 style={{ marginBottom: "0.75rem", fontSize: "1.2rem" }}>How we use your data</h2>
          <p style={{ marginBottom: "1rem" }}>
            Your birth data is used only to calculate and prepare your personal reading. We do not sell,
            share, or use your data for advertising or any other purpose.
          </p>
          <h2 style={{ marginBottom: "0.75rem", fontSize: "1.2rem" }}>Payments</h2>
          <p style={{ marginBottom: "1rem" }}>
            Payments are processed securely by Razorpay. We do not store any card or payment information.
          </p>
          <h2 style={{ marginBottom: "0.75rem", fontSize: "1.2rem" }}>Contact</h2>
          <p>
            For privacy-related questions, email us or reach us on WhatsApp (see the Contact page).
          </p>
        </div>
      </div>
    </section>
  );
}
