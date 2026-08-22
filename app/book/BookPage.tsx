"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import PatrikaFrame from "@/components/PatrikaFrame";
import Divider from "@/components/Divider";
import Link from "next/link";
import Icon from "@/components/Icon";
import { READINGS, readingName, getReading } from "@/lib/readings";
import { createPaymentOrder, verifyPayment, SiteApiError } from "@/lib/api/site";
import BirthForm from "@/components/BirthForm";
import type { BirthRequest } from "@/lib/api/types";

const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";

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
  const [birthPlace, setBirthPlace] = useState<BirthRequest | null>(null);
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [notes, setNotes] = useState("");
  const [callSlot, setCallSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // A refresh right after paying must show the confirmation again, not the
  // pre-filled payment form (which invites a double payment). The receipt is
  // kept for 12 hours in this tab's session.
  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem("book-success");
      if (saved) {
        const s = JSON.parse(saved);
        if (s.slug && Date.now() - (s.at ?? 0) < 12 * 3600 * 1000) {
          setSlug(s.slug);
          setSuccess(true);
        } else {
          window.sessionStorage.removeItem("book-success");
        }
      }
    } catch { /* corrupted state — start fresh */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reading = getReading(slug);
  const isLive = slug === "live-consultation";
  // The deluxe kundli PDF report generates automatically from an exact
  // chart — it needs real lat/lon/timezone, not just a date, plus gender
  // for correct Hindi grammar and spouse-karaka selection in the report.
  const isKundliReport = slug === "birth-chart";
  // Ask-Shivanii-directly: the question IS the product — an order without
  // one is unfulfillable, so the notes field becomes a required question box.
  const isAskQuestion = slug === "ask-one-question";

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
      /* 1. Server creates the Razorpay order — price comes from the server's
         own price list AND the booking is recorded for history/admin. */
      let order;
      try {
        order = await createPaymentOrder({
          kind: "booking", slug, name, email, whatsapp,
          dob: isKundliReport ? (birthPlace?.dob ?? "") : dob,
          tob: isKundliReport ? (birthPlace?.tob ?? "") : tob,
          notes: callSlot ? `${notes}\n[Call slot: ${callSlot}]` : notes,
          ...(isKundliReport && birthPlace
            ? { lat: birthPlace.lat, lon: birthPlace.lon, tz: birthPlace.tz, gender: gender || undefined }
            : {}),
        });
      } catch (err) {
        // Never surface raw API error codes at the payment moment.
        void err;
        throw new Error(
          isHi
            ? "ऑनलाइन भुगतान अभी उपलब्ध नहीं है। कृपया थोड़ी देर बाद पुनः प्रयास करें।"
            : "Online payment isn't available right now. Please try again in a moment."
        );
      }

      /* 2. Open Razorpay Checkout (only the public key reaches the browser) */
      const rzp = new window.Razorpay({
        key: order.key_id || RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: "Astrologer Shivanii",
        description: readingName(slug, "en"),
        prefill: { name, email, contact: whatsapp },
        theme: { color: "#6E1E2A" },
        handler: async (response: unknown) => {
          const r = response as { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };
          /* 3. Verify the signature server-side — marks the booking 'paid' */
          try {
            await verifyPayment(r);
            setSuccess(true);
            try { window.sessionStorage.setItem("book-success", JSON.stringify({ slug, at: Date.now() })); } catch { /* non-fatal */ }
          } catch (err) {
            setError(err instanceof SiteApiError ? err.message
              : (isHi ? "भुगतान सत्यापन में समस्या — WhatsApp पर संपर्क करें" : "Verification issue — please contact us on WhatsApp"));
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError(isHi
              ? "Checkout बंद हो गया। यदि आपने भुगतान पूरा किया है और वह यहां नहीं दिख रहा, तो कृपया WhatsApp पर संदेश करें, हम इसे सुलझा देंगे।"
              : "Checkout closed. If you completed a payment and it isn't reflected here, message us on WhatsApp and we'll sort it out.");
          },
        },
      });

      rzp.on("payment.failed", () => {
        setError(
          isHi
            ? "भुगतान विफल रहा। कृपया पुनः प्रयास करें।"
            : "Payment failed. Please try again."
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
          {isKundliReport
            ? (isHi ? "भुगतान सफल — आपकी रिपोर्ट तैयार हो रही है" : "Payment successful — your report is being prepared")
            : (isHi ? "बुकिंग की पुष्टि हो गई!" : "Booking Confirmed!")}
        </h2>
        {!isKundliReport && (
          <p style={{ color: "var(--ink-light)", marginBottom: "1.25rem" }}>
            {t("book.success")}
          </p>
        )}
        {/* What happens next — kills the "did it actually work?" anxiety */}
        <ol
          className={isHi ? "devanagari" : undefined}
          style={{
            textAlign: "left", maxWidth: "420px", margin: "0 auto 1.5rem",
            paddingLeft: "1.4rem", color: "var(--ink-light)", fontSize: "0.9rem",
            lineHeight: 1.7, display: "grid", gap: "0.4rem",
          }}
        >
          {isKundliReport ? (
            <>
              <li>{isHi ? "आपकी कुंडली के सभी 27 खंड अभी तैयार किए जा रहे हैं — इसमें कुछ मिनट लगेंगे।" : "All 27 sections of your kundli are being prepared now — this takes a few minutes."}</li>
              <li>{isHi ? "तैयार होते ही शिवानी जी इसे अंतिम स्वीकृति देंगी।" : "Once ready, Shivanii gives it her final sign-off."}</li>
              <li>{isHi ? "स्वीकृति मिलते ही आपके \"मेरा खाता\" पेज पर डाउनलोड बटन दिखेगा — हम आपको WhatsApp पर सूचित करेंगे।" : "As soon as it's approved, a download button appears on your Account page — we'll notify you on WhatsApp."}</li>
            </>
          ) : (
            <>
              <li>{isHi ? "आपकी बुकिंग शिवानी जी तक पहुंच गई है।" : "Your booking has reached Shivanii."}</li>
              <li>{isHi ? "वे 24 घंटे के भीतर आपके WhatsApp नंबर पर संदेश करेंगी।" : "She will message you on WhatsApp within 24 hours."}</li>
              <li>{isHi ? "पाठन 24–48 घंटे में मिलेगा (लाइव कॉल का समय आपसी सहमति से तय होगा)।" : "Your reading arrives in 24–48 hours (live calls are scheduled together)."}</li>
            </>
          )}
        </ol>
        {isKundliReport && (
          <Link href="/account" className="btn btn-primary" style={{ marginBottom: "0.75rem" }}>
            {isHi ? "मेरा खाता देखें" : "Go to My Account"}
          </Link>
        )}
        <Link href="/" className={isKundliReport ? "btn btn-ghost" : "btn btn-primary"}>{isHi ? "होम पर वापस जाएं" : "Back to Home"}</Link>
        <p style={{ marginTop: "1rem" }}>
          <button
            type="button"
            onClick={() => {
              try { window.sessionStorage.removeItem("book-success"); } catch { /* non-fatal */ }
              setSuccess(false);
            }}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", color: "var(--maroon)", fontWeight: 600, textDecoration: "underline" }}
          >
            {isHi ? "एक और बुकिंग करें" : "Book another reading"}
          </button>
        </p>
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
        <div className="form-2col">
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
        {isKundliReport ? (
          <>
            <BirthForm embedded onChange={setBirthPlace} />
            <div className="form-group">
              <label className="form-label" htmlFor="gender">{isHi ? "लिंग (सही व्याकरण एवं विश्लेषण हेतु)" : "Gender (for correct grammar & analysis in the report)"}</label>
              <select id="gender" className="form-select" value={gender} onChange={(e) => setGender(e.target.value as "male" | "female" | "")}>
                <option value="">{isHi ? "चुनें" : "Select"}</option>
                <option value="male">{isHi ? "पुरुष" : "Male"}</option>
                <option value="female">{isHi ? "महिला" : "Female"}</option>
              </select>
            </div>
          </>
        ) : (
          <div className="form-2col">
            <div className="form-group">
              <label className="form-label" htmlFor="dob">{t("form.dob")}</label>
              <input id="dob" type="date" className="form-input" required value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="tob">{t("form.tobOptional")}</label>
              <input id="tob" type="time" className="form-input" value={tob} onChange={(e) => setTob(e.target.value)} />
            </div>
          </div>
        )}

        {isLive && (
          <div className="form-group">
            <label className="form-label" htmlFor="callSlot">{t("book.callSlot")}</label>
            <input id="callSlot" type="text" className="form-input" placeholder="e.g. Weekday evenings 7-9 PM IST" value={callSlot} onChange={(e) => setCallSlot(e.target.value)} />
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="notes">
            {isAskQuestion
              ? (isHi ? "शिवानी जी से आपका सवाल *" : "Your question for Shivanii *")
              : t("book.notes")}
          </label>
          <textarea
            id="notes"
            className="form-input"
            rows={isAskQuestion ? 4 : 3}
            placeholder={isAskQuestion
              ? (isHi
                  ? "जैसे: क्या मुझे यह नौकरी का ऑफर लेना चाहिए? / क्या यह रिश्ता आगे बढ़ाना ठीक रहेगा? — जितना खुलकर लिखेंगे, जवाब उतना सटीक मिलेगा"
                  : "e.g. Should I take this job offer? / Is this relationship right to move forward with? — the more openly you write, the more precise her answer")
              : (isHi ? "कोई खास विषय जिस पर शिवानी जी ध्यान दें?" : "Any specific area you want Shivanii to focus on?")}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required={isAskQuestion}
            style={{ resize: "vertical" }}
          />
          {isAskQuestion && (
            <span className={`form-hint${isHi ? " devanagari" : ""}`}>
              {isHi
                ? "यह सवाल सीधे शिवानी जी के पास जाता है — वे स्वयं आपकी कुंडली देखकर 24–48 घंटे में WhatsApp पर जवाब देती हैं।"
                : "This goes straight to Shivanii — she studies your chart herself and replies on your WhatsApp within 24–48 hours."}
            </span>
          )}
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
                  : isKundliReport
                  ? (isHi ? "भुगतान के कुछ ही मिनटों में तैयार, शिवानी जी की अंतिम स्वीकृति के साथ आपके अकाउंट में" : "Ready within minutes of payment, in your account after Shivanii's final sign-off")
                  : (isHi ? "24–48 घंटे में WhatsApp/ईमेल पर" : "Delivered on WhatsApp/email in 24–48 hrs")}
              </span>
            </span>
            <strong style={{ color: "var(--maroon-deep)", fontSize: "1.15rem", whiteSpace: "nowrap" }}>
              ₹{reading.priceINR.toLocaleString("en-IN")}
            </strong>
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading || (isKundliReport && !birthPlace) || (isAskQuestion && !notes.trim())} style={{ width: "100%", fontSize: "1.05rem" }}>
          {loading ? t("book.paying") : `${t("book.pay")} — ₹${reading?.priceINR.toLocaleString("en-IN") ?? ""}`}
        </button>

        <p style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.75rem" }}>
          {t("book.secureNote")}
        </p>
      </form>
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
