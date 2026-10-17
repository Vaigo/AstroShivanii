"use client";

import Link from "next/link";
import { Fragment } from "react";
import { useI18n } from "@/lib/i18n";

export interface RelatedLink {
  href: string;
  en: string;
  hi: string;
}

/** The "यह भी देखें / Related:" line of links under a tool, in the visitor's
 *  language. Renders inline content only; the page keeps its own wrapper. */
export default function RelatedLinks({ links, label }: { links: RelatedLink[]; label?: { en: string; hi: string } }) {
  const { lang } = useI18n();
  const isHi = lang === "hi";

  return (
    <>
      {isHi ? (label?.hi ?? "यह भी देखें:") : (label?.en ?? "Related:")}{" "}
      {links.map((l, i) => (
        <Fragment key={l.href}>
          {i > 0 && " · "}
          <Link href={l.href}>{isHi ? l.hi : l.en}</Link>
        </Fragment>
      ))}
    </>
  );
}
