/**
 * /config/nav.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * CMS-driven navigation seed.
 *
 * R4: navigation is infinitely nestable. In production this tree is loaded from
 * the Sanity `navNode` collection; this file is the STATIC SEED + the TypeScript
 * type it serialises to. When Sanity is wired in (M1 remains functional without
 * it), the loader reads `navNode` documents and maps them onto this same shape —
 * the recursive <NavNode> component does not change.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type NavBadge = "NEW" | "PROMO" | "SOON" | null;

export interface NavNodeItem {
  id: string;
  label: string;
  slug?: string;
  icon?: string;
  thumbnail?: string | null;
  blurb?: string;
  /** A mono "from RM—/hr" style hint chip shown inside panels. */
  priceHint?: string | null;
  badge?: NavBadge;
  /** Where the node links to (or null if it's a pure folder). */
  href?: string | null;
  /** Recursive children — unlimited depth. */
  children?: NavNodeItem[];
  order?: number;
  isVisible?: boolean;
  showInHeader?: boolean;
  showInFooter?: boolean;
  showInMobile?: boolean;
}

/**
 * Depth 1 → top-level header item.
 * Depth 2 → drop-panel column.
 * Depth 3 → nested flyout column.
 * Depth 4+ → inline accordion inside the panel.
 */
export const navTree: NavNodeItem[] = [
  {
    id: "rooms",
    label: "Rooms",
    slug: "rooms",
    icon: "door",
    href: "/rooms",
    order: 10,
    showInHeader: true,
    showInFooter: true,
    showInMobile: true,
    children: [
      {
        id: "room-ori",
        label: "Studio Ori",
        slug: "studio-ori",
        href: "/rooms/studio-ori",
        priceHint: "from RM—/hr",
        blurb: "Tight, dry rehearsal room. The workhorse.",
      },
      {
        id: "room-live-stage",
        label: "Live Stage",
        slug: "live-stage",
        href: "/rooms/live-stage",
        badge: "NEW",
        priceHint: "from RM—/hr",
        blurb: "The performance hall. When there's no show, the stage is yours.",
      },
      {
        id: "room-lagenda",
        label: "Lagenda",
        slug: "lagenda",
        href: "/rooms/lagenda",
        priceHint: "from RM—/hr",
        blurb: "Room three — the legend.",
      },
      {
        id: "room-kota-damansara",
        label: "Kota Damansara",
        slug: "kota-damansara",
        href: "/rooms/kota-damansara",
        priceHint: "from RM—/hr",
        blurb: "The big room, plus DARS — DrumAsia Recording Studio.",
        children: [
          {
            id: "dars",
            label: "DARS Recording Studio",
            slug: "dars",
            href: "/rooms/kota-damansara#dars",
            blurb: "Record full bands, soloists, vocals and corporate work.",
          },
        ],
      },
    ],
  },
  {
    id: "backline",
    label: "Backline",
    slug: "backline",
    icon: "cable",
    href: "/backline",
    order: 20,
    showInHeader: true,
    showInFooter: true,
    showInMobile: true,
    children: [
      {
        id: "cat-drums",
        label: "Drums & Percussion",
        href: "/backline?category=drums-percussion",
        priceHint: "from RM—/day",
      },
      {
        id: "cat-guitars",
        label: "Guitars & Bass",
        href: "/backline?category=guitars-bass",
        priceHint: "from RM—/day",
        children: [
          {
            id: "cat-prestige",
            label: "Prestige Guitars",
            href: "/backline?category=prestige-guitars",
            badge: "NEW",
          },
        ],
      },
      {
        id: "cat-amps",
        label: "Amplifiers",
        href: "/backline?category=amplifiers",
        priceHint: "from RM—/day",
      },
      {
        id: "cat-keys",
        label: "Keys & Synths",
        href: "/backline?category=keys-synths",
        priceHint: "from RM—/day",
      },
      {
        id: "cat-pa",
        label: "PA & Live Sound",
        href: "/backline?category=pa-live-sound",
        priceHint: "from RM—/day",
        children: [
          {
            id: "cat-digital-consoles",
            label: "Digital Consoles",
            href: "/backline?category=digital-consoles",
            badge: "SOON",
          },
        ],
      },
      {
        id: "cat-mics",
        label: "Microphones & Wireless",
        href: "/backline?category=microphones-wireless",
      },
      {
        id: "cat-lighting",
        label: "Lighting & Stage FX",
        href: "/backline?category=lighting-stage-fx",
      },
      {
        id: "cat-staging",
        label: "Backline & Staging",
        href: "/backline?category=backline-staging",
      },
      {
        id: "cat-streaming",
        label: "Streaming & Video",
        href: "/backline?category=streaming-video",
        badge: "SOON",
      },
      {
        id: "cat-accessories",
        label: "Accessories & Consumables",
        href: "/backline?category=accessories-consumables",
      },
      {
        id: "cat-production",
        label: "Production Packages",
        href: "/backline?category=production-packages",
      },
    ],
  },
  {
    id: "record",
    label: "Record",
    slug: "record",
    icon: "mic",
    href: "/record",
    order: 30,
    showInHeader: true,
    showInFooter: true,
    showInMobile: true,
    children: [
      {
        id: "record-studio",
        label: "Studio Recording",
        href: "/record#studio",
      },
      {
        id: "record-live",
        label: "Live Recording",
        href: "/record#live",
      },
      {
        id: "record-streaming",
        label: "Live Streaming",
        href: "/record#streaming",
        blurb: "Available at both branches.",
      },
      {
        id: "record-mix",
        label: "Mixing & Mastering",
        href: "/record#mixing",
      },
      {
        id: "record-dars",
        label: "DARS — Kota Damansara",
        href: "/record#dars",
        badge: "NEW",
      },
    ],
  },
  {
    id: "live",
    label: "Live",
    slug: "live",
    icon: "radio",
    href: "/live",
    order: 40,
    showInHeader: true,
    showInFooter: true,
    showInMobile: true,
    children: [
      {
        id: "live-venue",
        label: "The Venue",
        href: "/live",
        blurb: "The basement venue. Gigs, launches, comedy, private events.",
      },
      {
        id: "live-production",
        label: "Off-site Production",
        href: "/live/production",
        blurb: "Sound & light with crew — weddings to mall events.",
      },
      {
        id: "live-on-stage",
        label: "On Stage — Events",
        href: "/on-stage",
        blurb: "What's coming up at the venue.",
      },
    ],
  },
  {
    id: "live-room",
    label: "Live Room",
    slug: "live-room",
    icon: "drumstick",
    href: "/live-room",
    order: 45,
    badge: "NEW",
    showInHeader: true,
    showInFooter: true,
    showInMobile: true,
    blurb: "Play the kit in your browser.",
  },
  {
    id: "learn",
    label: "Learn",
    slug: "learn",
    icon: "school",
    href: "/learn",
    order: 50,
    showInHeader: true,
    showInFooter: true,
    showInMobile: true,
    children: [
      {
        id: "learn-mep",
        label: "Music Experience Program",
        href: "/learn",
        badge: "PROMO",
      },
      {
        id: "learn-membership",
        label: "Lifetime Membership",
        href: "/membership",
        blurb: "No registration fees.",
      },
    ],
  },
  {
    id: "store",
    label: "Store",
    slug: "store",
    icon: "tag",
    href: "/store",
    order: 60,
    showInHeader: true,
    showInFooter: true,
    showInMobile: true,
    children: [
      {
        id: "store-retail",
        label: "Retail",
        href: "/store",
        blurb: "Strings, sticks, heads, picks, cables, cases, amps.",
      },
      {
        id: "store-prestige",
        label: "Prestige Guitars",
        href: "/store#prestige",
      },
      {
        id: "store-buy-sell",
        label: "Buy / Sell / Rent",
        href: "/store#sell",
        blurb: "Sell us your gear.",
      },
    ],
  },
  {
    id: "more",
    label: "More",
    slug: "more",
    icon: "sliders",
    href: null,
    order: 70,
    showInHeader: true,
    showInFooter: true,
    showInMobile: true,
    children: [
      {
        id: "more-gallery",
        label: "Gallery",
        href: "/gallery",
      },
      {
        id: "more-founders",
        label: "The Founder",
        href: "/founders",
      },
      {
        id: "more-faq",
        label: "FAQ",
        href: "/faq",
      },
      {
        id: "more-contact",
        label: "Contact",
        href: "/contact",
      },
      {
        id: "more-loadin",
        label: "Load-In — Getting Here",
        href: "/load-in",
      },
    ],
  },
];
