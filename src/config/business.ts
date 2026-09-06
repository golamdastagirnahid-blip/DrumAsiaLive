/**
 * /config/business.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * THE SINGLE SOURCE OF TRUTH for every factual business value.
 *
 * RULES (from the build specification, SECTION 1 / R3):
 *  - Nothing is invented. Every value carries a `confidence` field:
 *      "verified"  → sourced from the client's public materials.
 *      "confirm"   → tagged [CONFIRM] in the spec — render via <Confirm>.
 *  - A missing value is `null` and is rendered as `RM— / hr · confirm on WhatsApp`
 *    — NEVER `RM0`, never a guess.
 *  - Every component imports from here. A hardcoded phone number or address in a
 *    component is a build failure.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** A weekday, 0 = Sunday … 6 = Saturday (matches JS Date.getDay()). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Wall-clock time, 24h, zero-padded. */
export type Clock = `${number}:${number}`;

/** An open window. `closeOnNextDay` = the window crosses midnight. */
export interface OpenInterval {
  opens: Clock;
  closes: Clock;
  /** true when `closes` falls on the following calendar day (e.g. 18:00 → 05:00). */
  closeOnNextDay?: boolean;
}

/** Per-weekday opening hours. `null` = closed all day. */
export type DayHours = OpenInterval[] | null;

/** A branch's weekly schedule, indexed by weekday (0=Sun … 6=Sat). */
export type WeeklyHours = Record<Weekday, DayHours>;

/** A public-holiday override. When set, it wins over the weekly schedule. */
export interface HolidayOverride {
  name: string;
  date: string; // ISO date, e.g. "2026-08-31"
  /** `null` = closed; `"default"` = use the weekly schedule; else explicit hours. */
  hours: DayHours | "default";
}

export interface Branch {
  id: "hartamas" | "kota-damansara";
  /** Sub-brand slug — hartamas is the flagship / "Studio" house. */
  name: string;
  shortName: string;
  subBrand: "studio" | "live" | "studio";
  address: string | null;
  /** Waze "search term" the client publishes. */
  wazeTerm: string | null;
  /** Geo point — Hartamas sourced from Waze structured data; Kota Damansara [CONFIRM]. */
  geo: { lat: number; lng: number } | null;
  /** Main booking phone (display + dial). `+`-prefixed E.164 for wa.me. */
  phones: {
    bookings: { label: string; value: string; confidence: "verified" | "confirm" } | null;
    store: { label: string; value: string; confidence: "verified" | "confirm" } | null;
  };
  /** Structured opening hours. `null` values inside are [CONFIRM] placeholders. */
  hours: WeeklyHours | null;
  holidays: HolidayOverride[];
  /** Human note rendered next to the clock. */
  hoursNote: string | null;
  venueNote?: string | null;
}

export type Confidence = "verified" | "confirm";

/* ────────────────────────────────────────────────────────────────────────────
 * HOURS
 * Kota Damansara's cited window is Mon–Fri 6pm–5am — an OVERNIGHT window. The
 * weekly schedule below encodes it with `closeOnNextDay: true`. Weekend hours were
 * not captured → `null` for Sat/Sun (closed/unknown is surfaced as [CONFIRM]).
 * Hartamas: 10AM–10PM cited in a past announcement → `[CONFIRM]`, no weekly split.
 * ──────────────────────────────────────────────────────────────────────────── */

const KOTA_DAMANSARA_WEEKDAYS: WeeklyHours = {
  0: null, // Sun — not captured [CONFIRM]
  1: [{ opens: "18:00", closes: "05:00", closeOnNextDay: true }],
  2: [{ opens: "18:00", closes: "05:00", closeOnNextDay: true }],
  3: [{ opens: "18:00", closes: "05:00", closeOnNextDay: true }],
  4: [{ opens: "18:00", closes: "05:00", closeOnNextDay: true }],
  5: [{ opens: "18:00", closes: "05:00", closeOnNextDay: true }],
  6: null, // Sat — not captured [CONFIRM]
};

const HARTAMAS_DAILY: WeeklyHours = {
  0: [{ opens: "10:00", closes: "22:00" }],
  1: [{ opens: "10:00", closes: "22:00" }],
  2: [{ opens: "10:00", closes: "22:00" }],
  3: [{ opens: "10:00", closes: "22:00" }],
  4: [{ opens: "10:00", closes: "22:00" }],
  5: [{ opens: "10:00", closes: "22:00" }],
  6: [{ opens: "10:00", closes: "22:00" }],
};

/* ────────────────────────────────────────────────────────────────────────────
 * BRANCHES
 * ──────────────────────────────────────────────────────────────────────────── */

export const branches: Branch[] = [
  {
    id: "hartamas",
    name: "DrumAsia Studio — Hartamas",
    shortName: "Hartamas",
    subBrand: "studio",
    address: "Wisma CKL, 7-2, Jalan 22A/70A, Desa Sri Hartamas, 50480 Kuala Lumpur",
    wazeTerm: "Drum Asia Hartamas",
    geo: { lat: 3.16319, lng: 101.65226 },
    phones: {
      bookings: { label: "Bookings", value: "+60125161620", confidence: "verified" },
      store: { label: "Store", value: "+60199098511", confidence: "confirm" },
    },
    hours: HARTAMAS_DAILY,
    holidays: [],
    hoursNote: "Past announcements cited 10AM–10PM — confirm current hours on WhatsApp.",
    venueNote: "The DrumAsia Live venue is in the basement.",
  },
  {
    id: "kota-damansara",
    name: "DrumAsia Studio — Kota Damansara",
    shortName: "Kota Damansara",
    subBrand: "studio",
    address: null, // Full street address [CONFIRM]
    wazeTerm: null,
    geo: null, // [CONFIRM]
    phones: {
      bookings: { label: "Branch", value: "+60179191619", confidence: "confirm" },
      store: { label: "Store", value: "+60199098511", confidence: "confirm" },
    },
    hours: KOTA_DAMANSARA_WEEKDAYS,
    holidays: [],
    hoursNote:
      "Cited Mon–Fri 6pm–5am; weekend hours not captured — confirm on WhatsApp.",
    venueNote:
      "Home of DARS — DrumAsia Recording Studio — and the Prestige Guitars collection.",
  },
];

export const getBranch = (id: Branch["id"]): Branch =>
  branches.find((b) => b.id === id) ?? branches[0]!;

/* ────────────────────────────────────────────────────────────────────────────
 * IDENTITY
 * ──────────────────────────────────────────────────────────────────────────── */

export const business = {
  brand: "DrumAsia",
  legalName: "DrumAsia",
  foundedYear: 2014,
  motto: "Play, Practice and Perform",
  threePs: { play: "Play", practice: "Practice", perform: "Perform" },

  /** The single WhatsApp number the whole site hands off to (R2). */
  whatsappNumber: "+60125161620",
  whatsappDisplay: "012 516 1620",

  email: {
    primary: "info@drum-asia.com",
    hello: "hello@drum-asia.com",
  },

  social: {
    instagramLive: { handle: "@drumasialive", url: "https://www.instagram.com/drumasialive" },
    instagramStudio: { handle: "@drumasiastudio_", url: "https://www.instagram.com/drumasiastudio_" },
    facebook: { handle: "/DrumAsiaStudio", url: "https://www.facebook.com/DrumAsiaStudio" },
  },

  ticketing: {
    // Tickets are sold on these platforms — we link OUT, never replicate (R1).
    ticket2u: "https://www.ticket2u.com.my",
    cloudjoi: "https://www.cloudjoi.com",
  },

  /** Social proof — [CONFIRM] figures, CMS-editable. */
  proof: {
    recommend: { value: "92%", source: "36 reviews", confidence: "confirm" as Confidence },
    community: { value: "17K", label: "community", confidence: "confirm" as Confidence },
    branches: { value: "2", label: "branches", confidence: "verified" as Confidence },
    est: { value: "2014", label: "EST.", confidence: "verified" as Confidence },
  },

  /** Past clients as text wordmarks (no logo files — spec forbids unless supplied). */
  clients: ["TV3", "Shopee", "Alif Satar", "Estranged", "Midnight Fusic", "Insomniacks"],

  /** Artists associated with the venue. */
  artists: ["Nadir", "Fazz", "The Nabil Nazmi Trio", "Djezna's Stalker", "Tabako Neko"],

  /** Founding date of the Kota Damansara branch. */
  kotaDamansaraOpened: "2019-06-17",

  /**
   * The founder — a single person. [CONFIRM exact legal spelling of the name.]
   * The earlier brief listed two brothers; the client has corrected this to one
   * founder, Michael Thomas Philip (drummer, head sound engineer).
   */
  founder: {
    name: "Michael Thomas Philip",
    shortName: "Michael",
    role: "Founder · Head Sound Engineer",
    /** Portrait slot — drop the client photo at public/founder/portrait.jpg. */
    portraitPath: "/founder/portrait.jpg",
    /** Short facts, drawn from the verified origin story. */
    facts: [
      "Behind a kit since age six",
      "Supplying sound and lighting to his school by twelve",
      "Leads the technician team as head sound engineer",
      "Built a home studio with his parents on the top floor of the family house",
    ],
  },
} as const;

/* ────────────────────────────────────────────────────────────────────────────
 * PRICING SIGNALS — every figure [CONFIRM], illustrative only (R3).
 * Rendered with `RM—` when no client value exists yet.
 * ──────────────────────────────────────────────────────────────────────────── */

export interface RateSignal {
  /** `null` = no value supplied → render "RM— / hr · confirm on WhatsApp". */
  amount: number | null;
  unit: "hr" | "day" | "weekend" | "week" | "session" | "ticket";
  label: string;
  note?: string;
}

export const pricing = {
  jamming: {
    amount: 30, // RM30/hr promo, weekdays & weekends [CONFIRM]
    unit: "hr" as const,
    label: "Jamming",
    note: "Promo rate seen in past posts — confirm on WhatsApp.",
  },
  studioHall: {
    amount: 100, // RM100/hour cited in one post [CONFIRM]
    unit: "hr" as const,
    label: "Studio hall",
    note: "Single-post figure — confirm on WhatsApp.",
  },
  eventTickets: {
    amount: null, // seen at RM30 / RM40 / RM55 [CONFIRM which tier maps where]
    unit: "ticket" as const,
    label: "Event tickets",
    note: "RM30 / RM40 / RM55 seen historically — confirm on WhatsApp.",
  },
  membership: {
    amount: null, // "no registration fees" advertised; price [CONFIRM]
    unit: "session" as const,
    label: "Lifetime Membership",
    note: "No registration fees. Price & benefits — confirm on WhatsApp.",
  },
  mep: {
    amount: null, // Music Experience Program [CONFIRM details]
    unit: "session" as const,
    label: "Music Experience Program",
    note: "Promoted via 012-516-1620 — confirm details on WhatsApp.",
  },
} as const;

/* ────────────────────────────────────────────────────────────────────────────
 * GETTING THERE — transit data (SECTION 1, verified unless marked).
 * ──────────────────────────────────────────────────────────────────────────── */

export const transit = {
  buses: ["190", "T818", "T852"],
  stops: [
    {
      name: "Plaza Crystelville",
      code: "KL2338",
      distance: "87 m",
      walk: "2-min walk",
      confidence: "verified" as Confidence,
    },
    {
      name: "1 Mont Kiara",
      code: null,
      distance: "397 m",
      walk: "6-min walk",
      confidence: "verified" as Confidence,
    },
    {
      // A second source cited this stop — [CONFIRM] before publishing both figures.
      name: "Hab Desa Sri Hartamas",
      code: null,
      distance: "551 m",
      walk: null,
      confidence: "confirm" as Confidence,
    },
  ],
  nearestKtm: {
    name: "Segambut",
    distance: "~1.77 km",
    walk: "23-min walk",
    confidence: "verified" as Confidence,
  },
  fromSemantanHint: "From MRT Semantan, take the T818 to Desa Sri Hartamas.",
  surrounding: ["Plaza Damas", "Mont Kiara", "Publika"],
} as const;

/** Destination card + navigation data consumed by Load-In. */
export const destination = {
  defaultBranch: "hartamas" as const,
  wazeSearchTerm: "Drum Asia Hartamas",
} as const;
