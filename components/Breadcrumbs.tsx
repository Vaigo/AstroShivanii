import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export interface Crumb {
  name: string;
  /** Path starting with "/" — omit for the current page */
  href?: string;
}

/** Visible breadcrumb trail + BreadcrumbList JSON-LD for rich results. */
export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        {crumbs.map((c, i) => (
          <span key={i}>
            {i > 0 && <span className="breadcrumb-sep" aria-hidden="true">›</span>}
            {c.href ? (
              <Link href={c.href}>{c.name}</Link>
            ) : (
              <span className="breadcrumb-current" aria-current="page">{c.name}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
