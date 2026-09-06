/**
 * /config/faq.ts — FAQ seed (CMS `faqSection`/`faqItem` collections in production).
 * Answers are drawn from verified facts; anything uncertain points to WhatsApp.
 */

export interface FaqSection {
  id: string;
  title: string;
  items: { q: string; a: string }[];
}

export const faqSections: FaqSection[] = [
  {
    id: "booking",
    title: "Booking",
    items: [
      {
        q: "How do I book a room?",
        a: "Everything is booked on WhatsApp at 012 516 1620. Tell us which room, the date and time, and we'll confirm availability and pricing. Nothing is booked until we confirm.",
      },
      {
        q: "How much is jamming?",
        a: "A past promo offered RM30 per hour on weekdays and weekends, and studio-hall rental was referenced at RM100/hour. Rates change — confirm final pricing on WhatsApp.",
      },
      {
        q: "Can I rehearse on the Live Stage?",
        a: "Yes. When no show is booked, the performance hall doubles as a jamming room — you rehearse on a real stage at an affordable rate.",
      },
      {
        q: "What are your opening hours?",
        a: "Hartamas was last cited at 10AM–10PM; Kota Damansara at Mon–Fri 6pm–5am (overnight), weekend hours unlisted. Confirm current hours on WhatsApp.",
      },
    ],
  },
  {
    id: "gear",
    title: "Gear & Rental",
    items: [
      {
        q: "What gear is in the rooms?",
        a: "Rooms come with house backline — drum kit, amps and mics. For exact items and anything extra, ask on WhatsApp.",
      },
      {
        q: "Do you rent equipment?",
        a: "Yes — PA, lighting, instruments and full production packages. Browse The Backline and send your rider on WhatsApp for a quote.",
      },
      {
        q: "Can I buy gear from you?",
        a: "Yes. We sell at both branches — amps, accessories, cases and a Prestige Guitars collection — and we also buy, sell and rent instruments.",
      },
    ],
  },
  {
    id: "recording",
    title: "Recording",
    items: [
      {
        q: "Do you record bands?",
        a: "Yes. DARS — DrumAsia Recording Studio at Kota Damansara records full bands, solo musicians, vocals and corporate work. Live recording and live streaming are also available at both branches.",
      },
      {
        q: "What is BYOSE?",
        a: "A live-audio recording offer that was promoted as exclusive to Kota Damansara. Confirm what it currently includes on WhatsApp.",
      },
    ],
  },
  {
    id: "events",
    title: "Events",
    items: [
      {
        q: "Where do I buy gig tickets?",
        a: "Tickets are sold on Ticket2u and CloudJoi — we link out to them. We never handle payment on this site.",
      },
      {
        q: "Can I hire the venue for a private event?",
        a: "Yes — band gigs, album launches, stand-up comedy, birthdays, engagements, showers and parties. Ask about venue hire on WhatsApp.",
      },
      {
        q: "Is there an open mic?",
        a: "Yes — SOUNDCHECK is a monthly open mic, COMEDY MIXTAPE is a stand-up open mic, and there are free OPEN JAM days. Follow us for dates.",
      },
    ],
  },
  {
    id: "getting-here",
    title: "Getting Here",
    items: [
      {
        q: "Where are you?",
        a: "Hartamas: Wisma CKL, 7-2, Jalan 22A/70A, Desa Sri Hartamas, 50480 Kuala Lumpur — the Live venue is in the basement. There's also a second branch in Kota Damansara.",
      },
      {
        q: "How do I get there by public transport?",
        a: "Buses 190, T818 and T852. Nearest stops: Plaza Crystelville (KL2338, 87 m / 2-min walk) and 1 Mont Kiara (397 m / 6-min walk). Nearest KTM is Segambut (~1.77 km).",
      },
      {
        q: "Where do I park?",
        a: "Parking availability and cost at Wisma CKL are being confirmed — check the Load-In page or ask on WhatsApp before you come.",
      },
    ],
  },
  {
    id: "membership",
    title: "Membership & Learning",
    items: [
      {
        q: "What is the Lifetime Membership?",
        a: "A membership advertised with no registration fees. Price and the full benefit list are being confirmed — ask on WhatsApp.",
      },
      {
        q: "What is the Music Experience Program (MEP)?",
        a: "A programme promoted via 012-516-1620. Ask about MEP on WhatsApp for format and pricing.",
      },
    ],
  },
];
