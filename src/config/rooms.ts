/**
 * /config/rooms.ts — room seed (CMS `room` collection in production).
 * Every rate/capacity/dimension is [CONFIRM] → `null` renders as "RM— / hr".
 */
import type { Branch } from "@/config/business";

export interface Room {
  slug: string;
  name: string;
  branch: Branch["id"];
  tagline: string;
  blurb: string;
  /** Selling line for the LIVE STAGE differentiator (SECTION 1). */
  sellLine?: string;
  capacity: string | null; // [CONFIRM]
  dimensions: string | null; // [CONFIRM]
  rateHour: number | null; // [CONFIRM]
  /** Typical house gear — confirm exact items on WhatsApp. */
  gear: string[];
  features: string[];
  order: number;
}

export const rooms: Room[] = [
  {
    slug: "studio-ori",
    name: "Studio Ori",
    branch: "hartamas",
    tagline: "The workhorse rehearsal room.",
    blurb:
      "A tight, dry jamming room built for bands who want to hear exactly what they're playing. Book by the hour or the session — confirm rates on WhatsApp.",
    capacity: null,
    dimensions: null,
    rateHour: null,
    gear: ["House drum kit", "Guitar & bass amps", "Vocal mics", "PA"],
    features: ["Hourly sessions", "House backline included"],
    order: 1,
  },
  {
    slug: "live-stage",
    name: "Live Stage",
    branch: "hartamas",
    tagline: "Rehearse on a real stage.",
    blurb:
      "The performance hall itself. When no show is booked, the stage — with its full PA and lighting rig — is yours to rehearse on at an affordable rate.",
    sellLine: "It's the performance hall. When there's no show, the stage is yours to rehearse on.",
    capacity: null,
    dimensions: null,
    rateHour: null,
    gear: ["Full PA", "Stage lighting", "House drum kit", "Backline"],
    features: ["Real stage + PA", "Lighting rig", "Doubles as the live venue"],
    order: 2,
  },
  {
    slug: "lagenda",
    name: "Lagenda",
    branch: "hartamas",
    tagline: "Room three — the legend.",
    blurb:
      "The third jamming space at Hartamas. Same house backline, same honest sound. Details and rates — confirm on WhatsApp.",
    capacity: null,
    dimensions: null,
    rateHour: null,
    gear: ["House drum kit", "Amps", "Mics"],
    features: ["Hourly sessions"],
    order: 3,
  },
  {
    slug: "kota-damansara",
    name: "Kota Damansara",
    branch: "kota-damansara",
    tagline: "The big room, plus DARS recording studio.",
    blurb:
      "One large jamming studio plus DARS — DrumAsia Recording Studio, set up to record full bands, solo musicians, vocals and corporate work. Opened 17 June 2019.",
    capacity: null,
    dimensions: null,
    rateHour: null,
    gear: ["Large room", "DARS recording studio", "Prestige Guitars store on site"],
    features: ["Recording studio on site", "Retail store", "Opened 17 June 2019"],
    order: 4,
  },
];

export function getRoom(slug: string): Room | undefined {
  return rooms.find((r) => r.slug === slug);
}
