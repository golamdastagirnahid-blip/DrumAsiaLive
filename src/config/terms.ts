/**
 * /config/terms.ts — rental terms scaffold (SECTION 3.4).
 * Every figure is [CLIENT TO CONFIRM] — no invented deposits, percentages,
 * penalties or timeframes. A Malaysian lawyer must review before launch.
 */

export interface TermsClause {
  heading: string;
  body: string[];
  /** True when the clause differs per category — the client fills the value. */
  perCategory?: boolean;
}

export const STANDARD_HEADINGS = [
  "Eligibility & ID",
  "Booking, deposit & payment arrangements",
  "Minimum duration & late return",
  "Security deposit & refund timeline",
  "Collection, delivery & return",
  "Condition inspection at handover and return",
  "Damage, loss & repair liability",
  "Insurance",
  "Cancellation & rescheduling",
  "Operator/technician requirement",
  "Power, safety & venue requirements",
  "Force majeure",
  "Governing law (Malaysia) and dispute resolution",
];

export const standardClauses: TermsClause[] = STANDARD_HEADINGS.map((heading) => ({
  heading,
  body: ["[CLIENT TO CONFIRM] — value to be supplied by the client and reviewed by a Malaysian lawyer."],
}));

export const categorySpecific = [
  {
    category: "Acoustic drums",
    items: [
      "Heads and sticks are consumables, billed separately.",
      "No alteration of tuning hardware.",
      "Cymbals are inspected for cracks on return.",
    ],
  },
  {
    category: "Electronic kits",
    items: [
      "No third-party firmware.",
      "Pads and mesh heads charged if torn.",
    ],
  },
  {
    category: "Guitars & bass",
    items: [
      "No re-fretting or nut alteration.",
      "Strings are consumables.",
      "Returned in the supplied case.",
    ],
  },
  {
    category: "Amplifiers",
    items: [
      "Never run a speaker cable into a line input.",
      "Valve amps must not be moved while hot; standby procedure required.",
      "No bypassing earth pins.",
    ],
  },
  {
    category: "PA & consoles",
    items: [
      "Operated by DrumAsia crew unless the renter passes a competency check.",
      "Stable, correctly earthed power is the renter's responsibility.",
      "No unauthorised firmware or scene wipes.",
    ],
  },
  {
    category: "Microphones & wireless",
    items: [
      "Frequency coordination is the renter's responsibility where multiple systems are in use.",
      "Capsules charged in full if damaged.",
    ],
  },
  {
    category: "Lighting & FX",
    items: [
      "Hazers can trigger fire alarms — venue clearance is the renter's responsibility.",
      "All rigging by qualified crew with rated safety bonds.",
    ],
  },
  {
    category: "Staging",
    items: [
      "Load ratings must not be exceeded.",
      "Assembly by DrumAsia crew only.",
    ],
  },
  {
    category: "Retail consumables",
    items: ["Sold, not rented; no returns once opened."],
  },
  {
    category: "Production packages",
    items: [
      "Load-in/load-out windows, crew overtime rate, minimum spend, outstation travel and accommodation — [CLIENT TO CONFIRM].",
    ],
  },
];
