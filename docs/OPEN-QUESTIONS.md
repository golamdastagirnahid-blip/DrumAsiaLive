# DrumAsia — Open Questions & Client Confirmations

> This file is the single checklist for everything tagged `[CONFIRM]` in the build.
> Nothing invented: every unverified value renders on-site as `RM— · confirm on
> WhatsApp` (or an explicit `[CLIENT TO CONFIRM]` token) until the client supplies it.
> Maintained by the engineering lead; tick a box when the client answers.

---

## ██ PRIORITY-ZERO CLIENT ADVISORY — DOMAIN HIJACK

The legacy domain **drum-asia.com** currently resolves to an unrelated Indonesian
online-gambling page ("Asialive88") with scraped shopping navigation, while the
client's Facebook page, Instagram bios and press coverage still cite it as the
official website. Anyone searching for them lands on a gambling site.

**Action list for the client:**

1. Check WHOIS and whether the domain lapsed and was re-registered.
2. Decide between attempting recovery or launching on a clean new domain.
3. Create Google Search Console for the new domain and submit the sitemap.
4. Request removal of the hijacked URLs from Google's index.
5. Update the website field on: Facebook, both Instagram accounts,
   Google Business Profile, Time Out, CloudJoi, Ticket2u, Wanderlog, Moovit and
   the Gig Life Pro feature.
6. Add 301 redirects from old paths **only if** the domain is recovered.

> The build therefore has **no hardcoded production domain**. `site.url` in
> `src/config/site.ts` is a placeholder (`https://drumasia.example`) to be swapped
> for whichever domain the client lands on. Do not ship until this is decided.

---

## ██ Open questions — business facts

### Identity & hours
- [ ] **Founder name spelling** — the client advises there is a **single founder**,
      **Michael Thomas Philip** (drummer, head sound engineer). Confirm the exact
      legal spelling of the name (typed "Michale" in the brief — assumed a typo).
- [ ] **Hartamas opening hours** — past announcement cited **10AM–10PM** (revised).
      Confirm current hours, including weekends and public holidays.
- [ ] **Kota Damansara opening hours** — cited **Mon–Fri 6pm–5am** (overnight) plus
      weekend hours that were not captured. Confirm weekends + public holidays.
- [ ] **Kota Damansara full street address** (currently rendered as `[CONFIRM]`).
- [ ] **Kota Damansara geo coordinates** (for maps / Load-In ETA).
- [ ] **Phones still active?** — branch **017-919 1619** · store **019-909 8511**.
- [ ] **Weekly free stream** (Mon–Wed 8–9pm from Hartamas) — still running?

### Services & programmes
- [ ] **BYOSE** (live-audio recording offer, Kota Damansara) — what it currently includes.
- [ ] **Music Experience Program (MEP)** — details, format, pricing
      (promoted via 012-516-1620).
- [ ] **Lifetime Membership** — price and full benefit list (advertised: no registration fees).
- [ ] **Regular lessons?** — confirm before adding a lessons page (vs MEP only).

### Pricing (all illustrative until confirmed)
- [ ] Jamming — RM30/hr promo seen for weekdays **and** weekends.
- [ ] Studio hall — RM100/hr cited in one post.
- [ ] Rates revised **10 April 2023** — what are the current rate cards for
      jamming, recording, streaming, mixing/mastering, rental and venue hire?
- [ ] Event tickets — RM30 / RM40 / RM55 seen; which tier maps where?
- [ ] Peak vs off-peak, member vs non-member pricing (Session Sheet estimate).

### Social proof
- [ ] Facebook **~17K followers** and **92% recommend / 36 reviews** (keep CMS-editable).

### Getting there
- [ ] **"Hab Desa Sri Hartamas" stop at 551 m** — a second source; confirm before
      publishing alongside Plaza Crystelville (87 m) and 1 Mont Kiara (397 m).
- [ ] Parking at Wisma CKL — availability, cost, after-hours access.
- [ ] Load-in note — nearest bay, lift vs stairs, how far gear is carried.
- [ ] Motorbike parking — location, sheltered?
- [ ] "Covered parking" claim for the rain warning (or an honest e-hailing
      suggestion if there is none).
- [ ] Nearby food & parking strip (Plaza Damas / Mont Kiara / Publika).

---

## ██ Open questions — integrations & infrastructure

- [ ] **Analytics** — Plausible vs Umami (cookieless, PDPA-friendly). Which account?
- [ ] **Email provider** — Resend (secondary channel + staff alerts) — API key holder?
- [ ] **Staff alerts** — Resend email, optional Telegram webhook — preference?
- [ ] **Routing provider for Live ETA** — Google Routes / Mapbox / TomTom — who holds the key?
- [ ] **Weather provider** for the motorcycle rain warning — provider + key?
- [ ] **Newsletter** — email provider for double opt-in?
- [ ] **Grab partner programme** — apply for attribution on ride intents?
- [ ] **THE BOARD** (community wall) — will the client moderate? If not, it ships disabled.

---

## ██ Open questions — legal & content (M3+)

- [ ] **Rental Terms & Conditions** — every deposit amount, percentage, penalty and
      timeframe is a `[CLIENT TO CONFIRM]` token. A Malaysian lawyer must review the
      final rental terms and the PDPA notice before launch. The drafts in this build
      are structural scaffolding, not legal advice.
- [ ] **Malay (Bahasa Malaysia) copy** is machine-drafted and requires human review
      before launch.
- [ ] **Testimonials** — real quotes with names and written consent.
- [ ] **Client logos** (TV3, Shopee, etc.) — written display permission if used as
      logos (currently rendered as text wordmarks only).

---

## How a value flows through the build

1. Client confirms a value → it lands in `src/config/business.ts` with
   `confidence: "verified"`.
2. Components render it directly (or via `<Confirm>` while still unconfirmed).
3. This checklist entry is ticked.
