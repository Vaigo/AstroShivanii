"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import type { Crumb } from "./Breadcrumbs";

/** The visible breadcrumb trail. A crumb with `nameHi` shows it in Hindi mode;
 *  crumbs without one show `name` in both languages. */
export default function BreadcrumbTrail({ crumbs }: { crumbs: Crumb[] }) {
  const { lang } = useI18n();
  const label = (c: Crumb) => (lang === "hi" && c.nameHi ? c.nameHi : c.name);

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {crumbs.map((c, i) => (
        <span key={i}>
          {i > 0 && <span className="breadcrumb-sep" aria-hidden="true">›</span>}
          {c.href ? (
            <Link href={c.href}>{label(c)}</Link>
          ) : (
            <span className="breadcrumb-current" aria-current="page">{label(c)}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
