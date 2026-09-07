/**
 * /config/site.ts — site-wide non-business configuration.
 * (Business facts live in business.ts; this is canonical URL / SEO / nav metadata.)
 */
import { business } from "./business";

export const site = {
  name: business.brand,
  titleTemplate: `%s — ${business.brand}`,
  description:
    "DrumAsia is a jamming studio, recording studio, live venue and backline rental in Desa Sri Hartamas, Kuala Lumpur. Play, Practice and Perform since 2014.",
  // Canonical domain
  url: "https://drumasialive.com",
  ogImage: "/logo.jpg",
  locale: "en-MY",
  defaultLocale: "en",
  locales: ["en", "ms"] as const,
  themeColor: "#0B0C0E",
};

export type Locale = (typeof site.locales)[number];
