"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import Link from "next/link";
import Icon from "@/components/Icon";
import { READINGS, readingName, getReading } from "@/lib/readings";
import { WHATSAPP_NUMBER } from "@/lib/config";

const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open(): void;
      on(event: string, handler: (response: unknown) => void): void;
    };
  }
}

function BookForm() {
  const { t, lang } = useI18n();
  const isHi = lang === "hi";
  const params = useSearchParams();
  const initialSlug = params.get("reading") ?? "birth-chart";

  const [slug, setSlug] = useState(initialSlug);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [notes, setNotes] = useState("");
  const [callSlot, setCallSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const reading = getReading(slug);
  const isLive = slug === "live-consultation";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reading) return;
    setLoading(true);
    setError("");

    try {
      /* 1. Ask backend to create a Razorpay order (secret stays on server) */
      const orderRes = await fetch(`${API_BASE}/v1/account/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: reading.amountPaise,
          currency: "INR",
          receipt: `${slug}-${Date.now()}`,
          notes: { name, email, whatsapp, dob, reading: slug },
        }),
      });

      if (!orderRes.ok) {
        // Never surface raw API error codes ("Not Found") at the payment
        // moment — always steer to the WhatsApp fallback that's on this page.
        throw new Error(
          isHi
            ? "ऑनलाइन भुगतान अभी उपलब्ध नहीं है। कृपया नीचे दिए गए WhatsApp बटन से बुक करें — वही विवरण वहां भेज दें।"
            : "Online payment isn't available right now. Please book via the WhatsApp button below — just send the same details there."
        );
      }

      const { order_id, amount, currency } = await orderRes.json();

      /* 2. Open Razorpay Checkout (only public key on frontend) */
      const rzp = new window.Razorpay({
        key: RAZORPAY_KEY,
        amount,
        currency,
        order_id,
        name: "Astrologer Shivanii",
        description: readingName(slug, "en"),
        prefill: { name, email, contact: whatsapp },
        theme: { color: "#6E1E2A" },
        handler: async (response: unknown) => {
          const r = response as { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };
          /* 3. Verify on backend */
          await fetch(`${API_BASE}/v1/account/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...r, booking: { name, email, whatsapp, dob, tob, notes, callSlot, reading: slug } }),
          });
          setSuccess(true);
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.on("payment.failed", () => {
        setError(
          isHi
            ? "भुगतान विफल रहा। कृपया पुनः प्रयास करें या WhatsApp पर संपर्क करें।"
            : "Payment failed. Please try again or contact us on WhatsApp."
        );
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("form.error"));
      setLoading(false);
    }
  }

  if (success) {
    return (
      <PatrikaFrame style={{ textAlign: "center", padding: "3rem" }}>
        <div className="contact-icon" style={{ marginBottom: "1rem" }}>
          <Icon name="check" size={28} />
        </div>
        <h2 style={{ marginBottom: "0.75rem" }} className={isHi ? "devanagari" : undefined}>
          {isHi ? "बुकिंग की पुष्टि हो गई!" : "Booking Confirmed!"}
        </h2>
        <p style={{ color: "var(--ink-light)", marginBottom: "1.25rem" }}>
          {t("book.success")}
        </p>
        {/* What happens next — kills the "did it actually work?" anxiety */}
        <ol
          className={isHi ? "devanagari" : undefined}
          style={{
            textAlign: "left", maxWidth: "420px", margin: "0 auto 1.5rem",
            paddingLeft: "1.4rem", color: "var(--ink-light)", fontSize: "0.9rem",
            lineHeight: 1.7, display: "grid", gap: "0.4rem",
          }}
        >
          <li>{isHi ? "आपकी बुकिंग शिवानी जी तक पहुंच गई है।" : "Your booking has reached Shivanii."}</li>
          <li>{isHi ? "वे 24 घंटे के भीतर आपके WhatsApp नंबर पर संदेश करेंगी।" : "She will message you on WhatsApp within 24 hours."}</li>
          <li>{isHi ? "पाठन 24–48 घंटे में मिलेगा (लाइव कॉल का समय आपसी सहमति से तय होगा)।" : "Your reading arrives in 24–48 hours (live calls are scheduled together)."}</li>
        </ol>
        <Link href="/" className="btn btn-primary">{isHi ? "होम पर वापस जाएं" : "Back to Home"}</Link>
      </PatrikaFrame>
    );
  }

  return (
    <PatrikaFrame>
      <form onSubmit={handleSubmit}>
        {/* Reading selector */}
        <div className="form-group">
          <label className="form-label" htmlFor="reading">{t("book.selectReading")}</label>
          <select
            id="reading"
            className="form-select"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          >
            {READINGS.map((r) => (
              <option key={r.slug} value={r.slug}>
                {readingName(r.slug, lang)} — ₹{r.priceINR.toLocaleString("en-IN")}
              </option>
            ))}
          </select>
        </div>

        <Divider />

        {/* Contact details */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">{t("book.name")}</label>
            <input id="name" type="text" className="form-input" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">{t("book.email")}</label>
            <input id="email" type="email" className="form-input" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="whatsapp">{t("book.whatsapp")}</label>
          <input id="whatsapp" type="tel" className="form-input" required placeholder="+91 9XXXXXXXXX" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
        </div>

        {/* Birth details */}
        <Divider />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <div className="form-group">
            <label className="form-label" htmlFor="dob">{t("form.dob")}</label>
            <input id="dob" type="date" className="form-input" required value={dob} onChange={(e) => setDob(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="tob">{t("form.tobOptional")}</label>
            <input id="tob" type="time" className="form-input" value={tob} onChange={(e) => setTob(e.target.value)} />
          </div>
        </div>

        {isLive && (
          <div className="form-group">
            <label className="form-label" htmlFor="callSlot">{t("book.callSlot")}</label>
            <input id="callSlot" type="text" className="form-input" placeholder="e.g. Weekday evenings 7-9 PM IST" value={callSlot} onChange={(e) => setCallSlot(e.target.value)} />
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="notes">{t("book.notes")}</label>
          <textarea
            id="notes"
            className="form-input"
            rows={3}
            placeholder={isHi ? "कोई खास विषय जिस पर शिवानी जी ध्यान दें?" : "Any specific area you want Shivanii to focus on?"}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ resize: "vertical" }}
          />
        </div>

        {error && <p className="form-error" style={{ marginBottom: "1rem" }}>{error}</p>}

        {/* Order summary — the user should see exactly what they're paying for
            BEFORE the pay button, not only inside its label. */}
        {reading && (
          <div
            className={isHi ? "devanagari" : undefined}
            style={{
              background: "rgba(201,154,58,0.08)",
              border: "1px solid rgba(201,154,58,0.35)",
              borderRadius: "2px",
              padding: "0.8rem 1rem",
              marginBottom: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: "0.75rem",
              flexWrap: "wrap",
              fontSize: "0.9rem",
            }}
          >
            <span>
              <strong style={{ color: "var(--maroon-deep)" }}>{readingName(slug, lang)}</strong>
              <span style={{ color: "var(--muted)", display: "block", fontSize: "0.78rem" }}>
                {isLive
                  ? (isHi ? "30 मिनट लाइव — बुकिंग के बाद समय तय होगा" : "30 min live — slot scheduled after booking")
                  : (isHi ? "24–48 घंटे में WhatsApp/ईमेल पर" : "Delivered on WhatsApp/email in 24–48 hrs")}
              </span>
            </span>
            <strong style={{ color: "var(--maroon-deep)", fontSize: "1.15rem", whiteSpace: "nowrap" }}>
              ₹{reading.priceINR.toLocaleString("en-IN")}
            </strong>
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", fontSize: "1.05rem" }}>
          {loading ? t("book.paying") : `${t("book.pay")} — ₹${reading?.priceINR.toLocaleString("en-IN") ?? ""}`}
        </button>

        <p style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.75rem" }}>
          {t("book.secureNote")}
        </p>
      </form>

      <Divider />

      <div style={{ textAlign: "center" }}>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "0.75rem" }} className={isHi ? "devanagari" : undefined}>
          {isHi ? "WhatsApp से बुक करना चाहते हैं?" : "Prefer to book via WhatsApp?"}
        </p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Namaste! I'd like to book: ${readingName(slug, "en")}`)}`}
          className="btn btn-ghost"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("book.orWhatsapp")}
        </a>
      </div>
    </PatrikaFrame>
  );
}

export default function BookPage() {
  const { t } = useI18n();

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "700px" }}>
        <h1 className="section-heading">{t("book.heading")}</h1>
        <p className="section-heading-hi devanagari">{t("book.headingHi")}</p>

        <Suspense fallback={<div className="spinner" />}>
          <BookForm />
        </Suspense>
      </div>
    </section>
  );
}
