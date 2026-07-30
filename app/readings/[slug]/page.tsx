import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { READINGS, readingName, readingDesc } from "@/lib/readings";
import ReadingDetail from "./ReadingDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return READINGS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const reading = READINGS.find((r) => r.slug === slug);
  if (!reading) return {};
  const name = readingName(slug, "en");
  const desc = readingDesc(slug, "en");
  return {
    title: `${name} — ₹${reading.priceINR.toLocaleString("en-IN")}, Personal & Flat-Priced`,
    description: desc.slice(0, 160),
    alternates: { canonical: `/readings/${slug}/` },
    openGraph: { title: name, description: desc.slice(0, 160) },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const reading = READINGS.find((r) => r.slug === slug);
  if (!reading) notFound();
  return <ReadingDetail reading={reading} />;
}
