import type { MetadataRoute } from "next";
import { GUIDES } from "@/lib/guides";
import { READINGS } from "@/lib/readings";
import { NAKSHATRAS } from "@/lib/nakshatras";
import { RASHIS } from "@/lib/rashis";
import { SEO_CITIES } from "@/lib/seo-cities";
import { MUHURTA_PAGES } from "@/lib/muhurta-pages";
import { FESTIVAL_PAGES } from "@/lib/festival-pages";

/**
 * Programmatic sitemap — replaces the old hand-edited public/sitemap.xml,
 * which had already drifted (shubh-muhurta and palmistry were missing).
 * Every route list is imported from the same data the pages themselves are
 * generated from, so new slugs can never be forgotten again.
 *
 * Excluded on purpose: /account, /admin (private), /tools/time-rectification
 * (unpublished, noindex — see the note in its page.tsx).
 */

const BASE = "https://astroshivanii.com";

const STATIC_ROUTES = [
  "", // home
  "/tools",
  "/faq",
  "/guides",
  "/readings",
  "/about",
  "/contact",
  "/book",
  "/privacy",
  "/terms",
  "/nakshatra",
  "/rashi",
  "/festivals-2026",
  "/rahu-kaal",
  "/muhurta",
  "/choghadiya",
  "/rashifal",
];

const TOOLS = [
  "panchang",
  "kundli",
  "matching",
  "rashifal",
  "tarot",
  "sade-sati",
  "numerology",
  "baal-kundli",
  "turant-uttar",
  "lal-kitab",
  "lucky-colors",
  "kaal-sarp-dosha",
  "favorable-alphabet",
  "personal-year",
  "karmic-debt",
  "name-correction",
  "numerology-suite",
  "varshphal-yearly",
  "shubh-muhurta",
  "palmistry",
];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]) => ({
    url: `${BASE}${path}/`.replace(/\/\/$/, "/"),
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    url("", 1.0, "daily"),
    ...STATIC_ROUTES.slice(1).map((r) => url(r, 0.7, "weekly")),
    ...TOOLS.map((t) => url(`/tools/${t}`, 0.9, "weekly")),
    ...GUIDES.map((g) => url(`/guides/${g.slug}`, 0.7, "monthly")),
    ...READINGS.map((r) => url(`/readings/${r.slug}`, 0.8, "monthly")),
    ...NAKSHATRAS.map((n) => url(`/nakshatra/${n.slug}`, 0.6, "monthly")),
    ...RASHIS.map((r) => url(`/rashi/${r.slug}`, 0.6, "monthly")),
    ...SEO_CITIES.map((c) => url(`/rahu-kaal/${c.slug}`, 0.8, "daily")),
    ...SEO_CITIES.map((c) => url(`/choghadiya/${c.slug}`, 0.8, "daily")),
    ...RASHIS.map((r) => url(`/rashifal/${r.slug}`, 0.8, "daily")),
    ...MUHURTA_PAGES.map((p) => url(`/muhurta/${p.slug}`, 0.9, "weekly")),
    ...FESTIVAL_PAGES.map((f) => url(`/festivals/${f.slug}`, 0.9, "weekly")),
  ];
}
