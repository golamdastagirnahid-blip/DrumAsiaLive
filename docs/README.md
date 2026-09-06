# DrumAsia — "Session One" · Developer README

A jamming studio, recording studio, live venue and backline-rental website for
DrumAsia (Desa Sri Hartamas, Kuala Lumpur). Concept: **the website is a piece of
precision studio equipment** — a mixing-console transport bar fixed to the bottom,
a scroll-as-session-timeline playhead, and a lighting-gel theme system.

> **Status: Milestone 1 — shell, transport bar, recursive navigation, design system.**

---

## Stack

| Layer       | Choice                                                            |
| ----------- | ----------------------------------------------------------------- |
| Framework   | Next.js 15 (App Router, TypeScript strict)                        |
| Styling     | Tailwind CSS v4 + CSS custom-property token system (4 "gels")     |
| Motion      | Framer Motion (reveals/transitions; nav uses CSS transitions)     |
| Icons       | Lucide                                                            |
| i18n        | next-intl — English (default) + Bahasa Malaysia, locale-prefixed  |
| Validation  | Zod (forms land in M7)                                            |
| CMS         | Sanity (embedded `/studio`) — **not yet wired; static seed in use** |
| Audio       | Tone.js (M5, dynamically imported, never in first-load bundle)    |
| Tests       | Vitest (`lib/hours`, `lib/whatsapp`)                              |
| Analytics   | Cookieless, PDPA-friendly (`src/lib/analytics.ts` — pluggable)    |

## Requirements

- Node ≥ 20

## Setup

```bash
npm install
cp .env.example .env.local   # fill what you have; most keys are [CONFIRM]
npm run dev                  # http://localhost:3000 → redirects to /en
```

Locale-prefixed routes: `/en` (default), `/ms`. Internal docs route: `/en/console`.

## Scripts

| Command              | What it does                        |
| -------------------- | ----------------------------------- |
| `npm run dev`        | dev server                          |
| `npm run build`      | production build                    |
| `npm run start`      | serve the production build          |
| `npm run typecheck`  | `tsc --noEmit`                      |
| `npm test`           | Vitest unit tests                   |
| `npm run lint`       | ESLint                              |

## Environment variables

See `.env.example` — every key is commented. In summary:

- **Sanity** — `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`,
  `SANITY_API_READ_TOKEN` (pending project creation).
- **Analytics** — `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (Plausible) or Umami equivalents.
- **Email** — `RESEND_API_KEY`, `ENQUIRY_NOTIFY_EMAIL` (secondary channel).
- **Staff alerts** — optional `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID`.
- **Routing (Live ETA)** — `ROUTING_PROVIDER`, `ROUTING_API_KEY` `[CONFIRM]`.
- **Weather** — `WEATHER_PROVIDER`, `WEATHER_API_KEY` `[CONFIRM]`.

## Deploy

- **Vercel** — framework preset auto-detected. Set env vars in the project.
- **Branches** — `main` (production) + `staging` (preview deploys).
- **HTTPS/HSTS** — enforced at the edge; `next.config.ts` sets security headers.
- **Canonical domain** — TBD per the domain advisory in `OPEN-QUESTIONS.md`.

## Key files

| Path                       | Purpose                                              |
| -------------------------- | ---------------------------------------------------- |
| `src/config/business.ts`   | **Single source of truth** — brand, branches, phones, emails, hours, transit, pricing signals |
| `src/config/site.ts`       | canonical URL / SEO                                  |
| `src/config/gels.ts`       | the four gel tokens (docs + selector)                |
| `src/config/nav.ts`        | recursive nav seed (CMS replaces in production)      |
| `src/lib/hours.ts`         | pure opening-hours logic (overnight windows, holidays) |
| `src/lib/whatsapp.ts`      | `buildWhatsAppLink(payload)` — the one transaction layer (R2) |
| `src/lib/time.ts`          | KL wall-clock helpers                                 |
| `src/lib/time-loop.ts`     | single shared rAF loop                                |
| `src/app/globals.css`      | token system + material classes + motion law          |
| `src/components/transport-bar.tsx` | the persistent transport bar                 |

## Hard gates (SECTION 12)

- Lighthouse mobile: ≥95 Perf, 100 A11y, 100 BP, 100 SEO (final milestone).
- LCP < 2.0s · CLS < 0.05 · INP < 200ms · TBT < 200ms · first-load JS < 180KB gzip.
- WCAG 2.2 AA — axe-core in CI fails the build on violations.
