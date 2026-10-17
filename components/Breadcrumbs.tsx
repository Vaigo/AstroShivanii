import BreadcrumbTrail from "./BreadcrumbTrail";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroshivanii.com";

export interface Crumb {
  name: string;
  /** Shown instead of `name` in Hindi mode (the JSON-LD keeps `name`) */
  nameHi?: string;
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
      <BreadcrumbTrail crumbs={crumbs} />
    </>
  );
}
