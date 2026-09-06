# DrumAsia — Assets the Client Must Supply

> From SECTION 13. Tick items as they arrive. Formats/sizes below are minimums
> unless stated. Everything lands in the CMS (Sanity) once wired; for now, files
> can be dropped in `public/assets/` (git-ignored for large media — keep the repo
> lean and use an external store/CDN for photos and video).

## Brand
- [ ] **Logo in SVG** — `Logo` component currently uses a placeholder mark
      (`src/components/logo.tsx`); swap when the real one arrives.
- [ ] Brand fonts, if any (otherwise the self-hosted Anton / Inter / JetBrains Mono
      set stays).

## People
- [x] **Founder/owner portrait** — single founder, **Michael Thomas Philip**.
      Drop the photo at `public/founder/portrait.jpg` (or `.png` / `.webp`) — the
      founders page + homepage upgrade from the silhouette fallback automatically.
      (Note: the attachment in the brief did not land in the repo — re-send or drop
      the file at the path above.)
- [ ] A second candid / at-work shot of the founder.
- [ ] Founder **signature scan** (for the founder's-letter block).
- [ ] Team photos (name, role, one-line bio each).

## Rooms
- [ ] At least **six photos per room** at 2400px+.
- [ ] A **lights-off + lights-on pair per room** (the room-fader crossfade effect).
- [ ] Optional 360° panorama per room.

## Audio & video
- [ ] A 20–30s **horizontal hero video** of a real jam session (plus poster frame).
- [ ] Per room: one **6s stick-click** and one **8s ambience loop**.
      (Shipping royalty-free placeholders until then.)
- [ ] **Three full drum sample sets** for the Live Room kits
      (ORI · LIVE STAGE · LAGENDA) — 48kHz mono, trimmed + normalised.
- [ ] Tracks/videos recorded at DrumAsia for "Cut at DrumAsia".

## Gear
- [ ] Clean-background photos of **every gear item** (min 3 angles each).

## Documents
- [ ] Verified **rate cards** — jamming, recording, streaming, mixing/mastering,
      rental, venue hire.
- [ ] Verified **opening hours** per branch (weekends + public holidays).
- [ ] **Kota Damansara street address** + geo coordinates.
- [ ] The **venue technical rider** (PA, console, lighting, stage dims, power).
- [ ] **Rental terms** with deposit + damage schedule (for the lawyer review).
- [ ] **Membership** price + benefits.
- [ ] Parking / bike-parking / load-in details for both branches.
- [ ] Written permission for any **client logos** (currently text wordmarks only).
- [ ] Real **testimonials** with names + consent.

## Media-handling note
Large binaries are kept out of Git. Use the CMS asset pipeline or a CDN; reference
by URL. The repository stays code + small placeholders only.
