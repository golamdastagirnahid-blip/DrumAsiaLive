/**
 * /config/gels.ts — Studio Instrument Themes & Lighting Gels.
 *
 * Provides dedicated music equipment themes:
 *  - DRUM STUDIO (drum-stage): Stage black, cymbal brass/gold, drum shell geometry
 *  - GUITAR LOUNGE (guitar-lounge): Vintage amp tweed, tube amber glow, guitar strings
 *  - SYNTH & KEYS (synth-keys): Cyber electric cyan, piano keys, synthesizer matrix
 *  - CONSOLE MASTER (console): Classic analog SSL console, warm VU meter amber
 *  - HOUSE LIGHTS (house-lights): Crisp studio daylight mode
 */

export type GelId =
  | "drum-stage"
  | "guitar-lounge"
  | "synth-keys"
  | "console"
  | "sky-session"
  | "pure-dark"
  | "stage-lights"
  | "amber-wash"
  | "cool-wash"
  | "house-lights";

export interface Gel {
  id: GelId;
  label: string;
  instrument: string;
  icon: "drum" | "guitar" | "keyboard" | "console" | "sky" | "dark" | "lights" | "sun";
  swatch: string; // accent swatch colour for the selector
  scheme: "dark" | "light";
  tokens: Record<string, string>;
}

const TOKEN_ORDER = ["base", "panel", "accent", "secondary", "textHi", "textMid", "textDim"];

export const GELS: Gel[] = [
  {
    id: "drum-stage",
    label: "Drum Studio",
    instrument: "Drums & Cymbals",
    icon: "drum",
    swatch: "#E5A93C",
    scheme: "dark",
    tokens: {
      base: "#08090C",
      panel: "#121418",
      accent: "#E5A93C",
      secondary: "#A3782C",
      textHi: "#F5F3EC",
      textMid: "#A3A199",
      textDim: "#7A7870",
    },
  },
  {
    id: "guitar-lounge",
    label: "Guitar Lounge",
    instrument: "Guitars & Amps",
    icon: "guitar",
    swatch: "#FF5E1A",
    scheme: "dark",
    tokens: {
      base: "#0F0B08",
      panel: "#1A130D",
      accent: "#FF5E1A",
      secondary: "#D45D28",
      textHi: "#FBF3E8",
      textMid: "#B29F8B",
      textDim: "#857361",
    },
  },
  {
    id: "synth-keys",
    label: "Synth & Keys",
    instrument: "Synthesizer & Piano",
    icon: "keyboard",
    swatch: "#00E5FF",
    scheme: "dark",
    tokens: {
      base: "#05080E",
      panel: "#0C121D",
      accent: "#00E5FF",
      secondary: "#BD00FF",
      textHi: "#EAF6FF",
      textMid: "#8BA4B8",
      textDim: "#657E94",
    },
  },
  {
    id: "console",
    label: "Console Master",
    instrument: "Mixing Desk & VU",
    icon: "console",
    swatch: "#FFB800",
    scheme: "dark",
    tokens: {
      base: "#0B0C0E",
      panel: "#15171B",
      accent: "#FFB800",
      secondary: "#22C55E",
      textHi: "#F2F1EC",
      textMid: "#9C9C98",
      textDim: "#83827B",
    },
  },
  {
    id: "sky-session",
    label: "Midnight Sky",
    instrument: "Sky & Starlight",
    icon: "sky",
    swatch: "#38BDF8",
    scheme: "dark",
    tokens: {
      base: "#030814",
      panel: "#091224",
      accent: "#38BDF8",
      secondary: "#818CF8",
      textHi: "#F0F8FF",
      textMid: "#93B4D7",
      textDim: "#627D9A",
    },
  },
  {
    id: "pure-dark",
    label: "Obsidian Dark",
    instrument: "Stealth Black & Ember",
    icon: "dark",
    swatch: "#EF4444",
    scheme: "dark",
    tokens: {
      base: "#030304",
      panel: "#0B0C0E",
      accent: "#EF4444",
      secondary: "#71717A",
      textHi: "#F4F4F5",
      textMid: "#A1A1AA",
      textDim: "#71717A",
    },
  },
  {
    id: "stage-lights",
    label: "Stage Lights",
    instrument: "Concert Spotlight Beams",
    icon: "lights",
    swatch: "#FACC15",
    scheme: "dark",
    tokens: {
      base: "#090412",
      panel: "#150A26",
      accent: "#FACC15",
      secondary: "#EC4899",
      textHi: "#FFFBEB",
      textMid: "#D8B4E2",
      textDim: "#926B9C",
    },
  },
];

export const SEMANTIC_LAMPS = [
  { id: "lamp-live", value: "#E1332B", label: "Live / REC", purpose: "An event is live in the building" },
  { id: "lamp-open", value: "#37D18A", label: "Open", purpose: "We're open right now" },
  { id: "lamp-warn", value: "#E8B62C", label: "Warn", purpose: "Caution / armed" },
] as const;

export const MOTION = {
  reveal: "opacity 0→1 + 20px rise · 480ms · cubic-bezier(.16,1,.3,1)",
  siblingStagger: "60ms",
  hover: "≤180ms",
  pageTransition: "240ms fade + 4px lift",
  lampBreathe: "2s sine",
  recPulse: "1s",
  transportEase: "120ms ease (scroll hide/show)",
  gelCrossfade: "400ms (lighting-board cue)",
} as const;

export { TOKEN_ORDER };
