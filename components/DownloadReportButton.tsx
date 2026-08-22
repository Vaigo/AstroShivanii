"use client";

import { useI18n } from "@/lib/i18n";

interface DownloadReportButtonProps {
  /** Becomes the suggested PDF filename (browsers use document.title). */
  filename: string;
}

/** "Download PDF" for free-tool results on a static host: opens the
 *  browser's print dialog (Save as PDF) with the print stylesheet in
 *  globals.css isolating the nearest `.print-area` ancestor — site chrome,
 *  forms and CTAs stripped, a letterhead added. Print-to-PDF keeps text as
 *  real vectors (crisp Devanagari) with zero JS dependencies, unlike
 *  canvas-rasterizing PDF libraries.
 *
 *  Usage: put this at the top of a result container that has the
 *  `print-area` class. The letterhead below prints in this component's DOM
 *  position, so placing it first puts the branding at the top of the PDF. */
export default function DownloadReportButton({ filename }: DownloadReportButtonProps) {
  const { lang } = useI18n();
  const isHi = lang === "hi";

  function handleDownload() {
    const prevTitle = document.title;
    document.title = filename; // default PDF filename in the save dialog
    document.body.classList.add("print-report");
    const cleanup = () => {
      document.title = prevTitle;
      document.body.classList.remove("print-report");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
    // afterprint is unreliable in some browsers (older Safari) — belt & braces
    setTimeout(cleanup, 3000);
  }

  return (
    <>
      {/* print-only letterhead — top of the saved PDF */}
      <div className="print-brand" aria-hidden="true">
        <div className="print-brand-name">Astrologer Shivanii</div>
        <div className="print-brand-sub">
          astroshivanii.com · {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </div>
      </div>
      <div className="no-print" style={{ textAlign: "right", marginBottom: "0.4rem" }}>
        <button type="button" className="btn btn-ghost btn-sm" onClick={handleDownload}>
          ⤓ {isHi ? "PDF डाउनलोड करें" : "Download PDF"}
        </button>
      </div>
    </>
  );
}
