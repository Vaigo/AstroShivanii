"use client";

/**
 * One phone field shown in every paid tool's paywall, so Razorpay Checkout
 * can be opened with prefill.contact and skip its own "enter phone number"
 * screen — a new user types their number ONCE, on our page, in our language,
 * with the reason stated (support/delivery on WhatsApp) instead of being
 * asked cold by a payment popup. The number also lands in the Razorpay
 * order notes (backend CreateOrderBody.whatsapp), so support can find an
 * order from a customer's number.
 */

/** "+91 98765-43210" → "9876543210"; returns "" when not a valid Indian mobile. */
export function normalizePhone(v: string): string {
  let d = v.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : "";
}

export default function PayPhoneField({
  isHi, value, onChange, idPrefix = "pay",
}: {
  isHi: boolean;
  value: string;
  onChange: (v: string) => void;
  idPrefix?: string;
}) {
  const valid = normalizePhone(value) !== "";
  return (
    <div style={{ margin: "0 0 0.75rem", textAlign: "left" }}>
      <label
        htmlFor={`${idPrefix}-phone`}
        className={isHi ? "devanagari" : undefined}
        style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--gold-pale)", marginBottom: "0.35rem" }}
      >
        {isHi ? "WhatsApp / मोबाइल नंबर *" : "WhatsApp / mobile number *"}
      </label>
      <input
        id={`${idPrefix}-phone`}
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        className="form-input"
        placeholder="9XXXXXXXXX"
        maxLength={15}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%" }}
      />
      <span className={`form-hint${isHi ? " devanagari" : ""}`} style={{ display: "block", marginTop: "0.3rem", color: "var(--gold-pale)", opacity: 0.85 }}>
        {isHi
          ? "किसी भी समस्या में इसी नंबर पर सहायता मिलेगी — भुगतान के समय दोबारा नंबर नहीं मांगा जाएगा।"
          : "Support reaches you on this number if anything goes wrong — the payment popup won't ask for it again."}
      </span>
      {value.trim() !== "" && !valid && (
        <span className={isHi ? "devanagari" : undefined} style={{ display: "block", marginTop: "0.3rem", fontSize: "0.75rem", color: "#ffd7c9" }}>
          {isHi ? "10 अंकों का सही मोबाइल नंबर डालें" : "Enter a valid 10-digit mobile number"}
        </span>
      )}
    </div>
  );
}
