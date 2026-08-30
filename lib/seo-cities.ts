/**
 * City dataset for the per-city SEO pages (/rahu-kaal/[city] …).
 * All Indian cities, all IST (tz 5.5). Separate from lib/cities.ts, which is
 * the tiny worldwide "popular picks" list inside PlaceSearch — this one is
 * about crawlable per-city pages, so it carries Hindi names + slugs.
 */
export interface SeoCity {
  slug: string;
  en: string;
  hi: string;
  lat: number;
  lon: number;
  tz: number;
}

export const SEO_CITIES: SeoCity[] = [
  { slug: "delhi",        en: "Delhi",        hi: "दिल्ली",      lat: 28.6139, lon: 77.209,  tz: 5.5 },
  { slug: "mumbai",       en: "Mumbai",       hi: "मुंबई",       lat: 19.076,  lon: 72.8777, tz: 5.5 },
  { slug: "kolkata",      en: "Kolkata",      hi: "कोलकाता",     lat: 22.5726, lon: 88.3639, tz: 5.5 },
  { slug: "chennai",      en: "Chennai",      hi: "चेन्नई",      lat: 13.0827, lon: 80.2707, tz: 5.5 },
  { slug: "bengaluru",    en: "Bengaluru",    hi: "बेंगलुरु",     lat: 12.9716, lon: 77.5946, tz: 5.5 },
  { slug: "hyderabad",    en: "Hyderabad",    hi: "हैदराबाद",    lat: 17.385,  lon: 78.4867, tz: 5.5 },
  { slug: "ahmedabad",    en: "Ahmedabad",    hi: "अहमदाबाद",    lat: 23.0225, lon: 72.5714, tz: 5.5 },
  { slug: "pune",         en: "Pune",         hi: "पुणे",        lat: 18.5204, lon: 73.8567, tz: 5.5 },
  { slug: "jaipur",       en: "Jaipur",       hi: "जयपुर",       lat: 26.9124, lon: 75.7873, tz: 5.5 },
  { slug: "lucknow",      en: "Lucknow",      hi: "लखनऊ",       lat: 26.8467, lon: 80.9462, tz: 5.5 },
  { slug: "kanpur",       en: "Kanpur",       hi: "कानपुर",      lat: 26.4499, lon: 80.3319, tz: 5.5 },
  { slug: "nagpur",       en: "Nagpur",       hi: "नागपुर",      lat: 21.1458, lon: 79.0882, tz: 5.5 },
  { slug: "indore",       en: "Indore",       hi: "इंदौर",       lat: 22.7196, lon: 75.8577, tz: 5.5 },
  { slug: "bhopal",       en: "Bhopal",       hi: "भोपाल",       lat: 23.2599, lon: 77.4126, tz: 5.5 },
  { slug: "patna",        en: "Patna",        hi: "पटना",        lat: 25.5941, lon: 85.1376, tz: 5.5 },
  { slug: "surat",        en: "Surat",        hi: "सूरत",        lat: 21.1702, lon: 72.8311, tz: 5.5 },
  { slug: "varanasi",     en: "Varanasi",     hi: "वाराणसी",     lat: 25.3176, lon: 82.9739, tz: 5.5 },
  { slug: "prayagraj",    en: "Prayagraj",    hi: "प्रयागराज",    lat: 25.4358, lon: 81.8463, tz: 5.5 },
  { slug: "agra",         en: "Agra",         hi: "आगरा",       lat: 27.1767, lon: 78.0081, tz: 5.5 },
  { slug: "chandigarh",   en: "Chandigarh",   hi: "चंडीगढ़",     lat: 30.7333, lon: 76.7794, tz: 5.5 },
  { slug: "dehradun",     en: "Dehradun",     hi: "देहरादून",    lat: 30.3165, lon: 78.0322, tz: 5.5 },
  { slug: "ranchi",       en: "Ranchi",       hi: "रांची",       lat: 23.3441, lon: 85.3096, tz: 5.5 },
  { slug: "raipur",       en: "Raipur",       hi: "रायपुर",      lat: 21.2514, lon: 81.6296, tz: 5.5 },
  { slug: "bhubaneswar",  en: "Bhubaneswar",  hi: "भुवनेश्वर",    lat: 20.2961, lon: 85.8245, tz: 5.5 },
  { slug: "guwahati",     en: "Guwahati",     hi: "गुवाहाटी",    lat: 26.1445, lon: 91.7362, tz: 5.5 },
  { slug: "amritsar",     en: "Amritsar",     hi: "अमृतसर",      lat: 31.634,  lon: 74.8723, tz: 5.5 },
  { slug: "jodhpur",      en: "Jodhpur",      hi: "जोधपुर",      lat: 26.2389, lon: 73.0243, tz: 5.5 },
  { slug: "udaipur",      en: "Udaipur",      hi: "उदयपुर",      lat: 24.5854, lon: 73.7125, tz: 5.5 },
  { slug: "haridwar",     en: "Haridwar",     hi: "हरिद्वार",     lat: 29.9457, lon: 78.1642, tz: 5.5 },
  { slug: "mathura",      en: "Mathura",      hi: "मथुरा",       lat: 27.4924, lon: 77.6737, tz: 5.5 },
  { slug: "ujjain",       en: "Ujjain",       hi: "उज्जैन",      lat: 23.1765, lon: 75.7885, tz: 5.5 },
  { slug: "nashik",       en: "Nashik",       hi: "नासिक",       lat: 19.9975, lon: 73.7898, tz: 5.5 },
  { slug: "gorakhpur",    en: "Gorakhpur",    hi: "गोरखपुर",     lat: 26.7606, lon: 83.3732, tz: 5.5 },
  { slug: "meerut",       en: "Meerut",       hi: "मेरठ",        lat: 28.9845, lon: 77.7064, tz: 5.5 },
];

export function cityBySlug(slug: string): SeoCity | undefined {
  return SEO_CITIES.find((c) => c.slug === slug);
}
