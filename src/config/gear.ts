/**
 * /config/gear.ts — recursive gear taxonomy seed (SECTION 4.3).
 * CMS `gearCategory` in production; the Backline filter tree, breadcrumbs and
 * anchors all derive from this shape. The client can extend freely.
 */
export interface GearCategory {
  slug: string;
  name: string;
  description: string;
  icon: string;
  priceHint: string | null;
  parent?: string; // slug of parent category (self-reference)
  children?: string[]; // convenience list of child descriptions
  note?: string;
}

export const gearCategories: GearCategory[] = [
  { slug: "drums-percussion", name: "Drums & Percussion", icon: "drum", priceHint: "from RM—/day", description: "Acoustic kits, electronic kits, snares, cymbals, hardware & stands, hand percussion, cajons, thrones, practice pads." },
  { slug: "guitars-bass", name: "Guitars & Bass", icon: "guitar", priceHint: "from RM—/day", description: "Electric, acoustic, bass — and the Prestige Guitars collection.", note: "Includes Prestige Guitars" },
  { slug: "amplifiers", name: "Amplifiers", icon: "amp", priceHint: "from RM—/day", description: "Guitar amps, bass amps, keyboard amps, cabinets, DI boxes." },
  { slug: "keys-synths", name: "Keys & Synths", icon: "keys", priceHint: "from RM—/day", description: "Stage pianos, synths, MIDI controllers, stands." },
  { slug: "pa-live-sound", name: "PA & Live Sound", icon: "speaker", priceHint: "from RM—/day", description: "Tops, subs, stage monitors, analogue consoles, digital consoles, power amps, processing." },
  { slug: "microphones-wireless", name: "Microphones & Wireless", icon: "mic", priceHint: "from RM—/day", description: "Vocal, instrument, drum mic kits, condensers, wireless systems, stands, cables." },
  { slug: "lighting-stage-fx", name: "Lighting & Stage FX", icon: "light", priceHint: "from RM—/day", description: "Par cans, moving heads, hazers, controllers, truss." },
  { slug: "backline-staging", name: "Backline & Staging", icon: "stage", priceHint: "from RM—/day", description: "Risers, stage decking, backdrops, barricades." },
  { slug: "streaming-video", name: "Streaming & Video", icon: "video", priceHint: "from RM—/day", description: "Cameras, capture cards, switchers, streaming packages. Live streaming is available at both branches." },
  { slug: "accessories-consumables", name: "Accessories & Consumables", icon: "tag", priceHint: "from RM—", description: "Strings, sticks, heads, picks, straps, cables, guitar cases, in-ears. Retail — sold, not rented." },
  { slug: "production-packages", name: "Production Packages", icon: "package", priceHint: "from RM—", description: "Bundled sound + light + crew for weddings, proms, annual dinners, school events, mall events and launches." },
];
