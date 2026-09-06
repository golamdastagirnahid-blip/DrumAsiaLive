# DrumAsia — Architecture

## The extensibility promise (R4)

The client will keep buying equipment and adding services. Everything that appears
on the site — navigation, categories, subcategories, gear items, rooms, services,
T&C groups, FAQ sections — is **CMS-driven and infinitely nestable**. Adding
"Digital Consoles" under "PA & Live Sound" is a CMS action, never a code change.

In Milestone 1 the CMS (Sanity) is not yet wired; every collection is represented by
a **static seed** that shares the exact shape the CMS will serialise to. When Sanity
lands, the loaders swap from seed to query and **no component changes**.

## Recursive navigation (`navNode`)

```
Depth 1 → top-level header item
Depth 2 → drop-panel column
Depth 3 → nested flyout column (opens right, 150ms open delay,
          300ms close grace, invisible "safe bridge" across the gap)
Depth 4+ → inline accordion inside the panel (the menu can never run off screen)
Mobile   → same tree as a full-screen stacked accordion with breadcrumb back-nav
```

- Data: `src/config/nav.ts` (`NavNodeItem`), loader: `src/components/nav/nav-data.ts`.
- One recursive renderer drives both desktop (`nav-desktop.tsx`) and mobile
  (`nav-mobile.tsx`); shared atoms in `nav-bits.tsx`.
- Keyboard: Tab, Arrow keys, Home/End, Escape closes and returns focus,
  `aria-expanded`, `aria-haspopup`, `role="menu"/"menuitem"`.
- Badges: `NEW` / `PROMO` / `SOON` (tease gear on order).

## Recursive category taxonomy (`gearCategory`)

```
01 Drums & Percussion → acoustic kits · electronic kits · snares · cymbals · hardware · hand percussion · cajons · thrones · practice pads
02 Guitars & Bass → electric · acoustic · bass · Prestige Guitars collection
03 Amplifiers → guitar amps · bass amps · keyboard amps · cabinets · DI boxes
04 Keys & Synths → stage pianos · synths · MIDI controllers · stands
05 PA & Live Sound → tops · subs · monitors · analogue consoles · digital consoles · power amps · processing
06 Microphones & Wireless → vocal · instrument · drum mic kits · condensers · wireless · stands · cables
07 Lighting & Stage FX → par cans · moving heads · hazers · controllers · truss
08 Backline & Staging → risers · stage decking · backdrops · barricades
09 Streaming & Video → cameras · capture cards · switchers · streaming packages
10 Accessories & Consumables (retail) → strings · sticks · heads · picks · straps · cables · cases · in-ears
11 Production Packages → bundled sound + light + crew
```

The Backline filter tree, breadcrumbs, section anchors and JSON-LD are all generated
from this tree (Milestone 3).

## The transaction layer (R1 + R2)

- **No payment integration of any kind.** No checkout, cart, card fields, or flags.
- Every commercial conversation ends in **WhatsApp**: `lib/whatsapp.ts` exports
  `buildWhatsAppLink(payload)` with a typed payload union for every intent.
- Prices are information-only and always say "Confirm final pricing on WhatsApp."

## Time & hours correctness

- `lib/time.ts` builds a KL wall-clock `Date` via `Intl` pinned to
  `Asia/Kuala_Lumpur` — correct on any visitor device.
- `lib/hours.ts` is pure and handles the Kota Damansara **overnight window**
  (Mon–Fri 18:00 → 05:00 next day), per-weekday variation and public-holiday
  overrides. Fully unit-tested (28 tests).

## Design system

Documented live at **`/console`** — tokens, components, states, lamps, gels and
motion curves. Four gels (`console` · `amber-wash` · `cool-wash` · `house-lights`)
set via `data-gel` on `<html>`; semantic lamps (`--lamp-live/--open/--warn`) are
constant across all four. All text/background pairs verified ≥ 4.5:1 (WCAG AA).
