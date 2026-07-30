declare module "tz-lookup" {
  /** Returns the IANA timezone name (e.g. "Asia/Kolkata") for coordinates. */
  export default function tzlookup(lat: number, lon: number): string;
}
