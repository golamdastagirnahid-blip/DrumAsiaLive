/**
 * /config/events.ts — event series + events seed (CMS `event`/`eventSeries`).
 * No live events are seeded; /on-stage renders the graceful state and the
 * series explainers. Tickets always link OUT to ticket2u / cloudjoi (R1).
 */
import { business } from "@/config/business";

export interface EventSeries {
  id: string;
  name: string;
  blurb: string;
}

export const eventSeries: EventSeries[] = [
  {
    id: "playlist",
    name: "PLAYLIST",
    blurb: "A recurring showcase night at the venue.",
  },
  {
    id: "unchartered",
    name: "UNCHARTERED",
    blurb: "New and unsigned acts, given a stage.",
  },
  {
    id: "soundcheck",
    name: "SOUNDCHECK",
    blurb: "Monthly open mic.",
  },
  {
    id: "comedy-mixtape",
    name: "COMEDY MIXTAPE",
    blurb: "Stand-up open mic — reached Vol. 42.",
  },
  {
    id: "open-jam",
    name: "OPEN JAM — FREE",
    blurb: "Free open jam / open mic days (one advertised 12PM–8PM, admission FREE).",
  },
  {
    id: "battle-of-the-dragons",
    name: "BATTLE OF THE DRAGONS",
    blurb: "With Black Anchor.",
  },
];

export interface EventItem {
  slug: string;
  title: string;
  seriesId: string;
  date: string | null; // [CONFIRM]
  doors: string | null; // [CONFIRM]
  priceFrom: number | null; // [CONFIRM]
  ticketsUrl: string | null;
}

/** No confirmed shows yet — kept empty so the UI renders the graceful state. */
export const events: EventItem[] = [];

export const freeStream = {
  label: "Weekly free stream",
  detail: "Mon–Wed 8–9pm from the Hartamas studio",
  confirmed: false, // [CONFIRM still running]
};

export const ticketing = business.ticketing;
