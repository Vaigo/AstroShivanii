/** Google reviews shown on the site.
 *
 *  ⚠ PLACEHOLDERS — replace every entry below with the REAL Google reviews
 *  (copy them verbatim, names as shown on Google) before launch. Never invent
 *  or edit review text: these are presented as genuine Google reviews.
 *  Also set GOOGLE_PROFILE.url to the real Google Business profile link.
 */

export interface GoogleReview {
  name: string;
  rating: number;      // 1–5
  text: string;
  date?: string;       // e.g. "2 months ago" as Google shows it
}

export const GOOGLE_PROFILE = {
  /** TODO(launch): real Google Business review link */
  url: "https://g.page/REPLACE_WITH_REAL_PROFILE/review",
  average: 5.0,        // TODO: real average
  count: 0,            // TODO: real review count — strip hides itself while 0
};

export const GOOGLE_REVIEWS: GoogleReview[] = [
  // TODO(launch): paste real reviews here, e.g.:
  // { name: "Priya Sharma", rating: 5, text: "…verbatim review text…", date: "3 months ago" },
];
