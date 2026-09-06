# DrumAsia — CMS Guide (for non-technical editors)

> Written for a non-technical person. Milestone 1 uses a static seed; this guide
> will be screenshot-led and fully illustrated once the Sanity Studio (`/studio`)
> is wired in (Milestone 2+). The operations below are the ones you will need.

## What you will be able to do (no developer)

1. **Change a rate** — open the gear item / room / service, edit the rate field,
   save, publish. The site updates automatically (prices always say
   "Confirm final pricing on WhatsApp").
2. **Add a gear item** — create a `gearItem`, fill name/brand/model/category/images/
   rates/condition, set `isVisible`, publish. It appears in the Backline catalogue,
   filters, search, sitemap and JSON-LD.
3. **Add a new dropdown category** — create a `gearCategory`, set its `parent`
   (e.g. "PA & Live Sound"), save. The dropdown, filter rail, breadcrumbs and
   section anchors update automatically.
4. **Add an event** — create an `event`, set poster/dates/series/price/tickets URL
   (ticket2u or CloudJoi), publish. It appears on `/on-stage` and the homepage rail.
5. **Edit a T&C clause** — open the `termsGroup`, edit the value for one of the
   fourteen standard headings, set "last reviewed", publish.
6. **Swap the founder photo** — open the founder document, replace the image and
   adjust the focal point (so an off-centre crop is correct without re-exporting).

## The "always" rules

- Set `isVisible` and `order` on everything.
- A missing price renders as `RM— · confirm on WhatsApp` — never type a guess.
- Use the `SOON` badge to tease gear that's on order.
- Nothing here takes payment. Every enquiry ends on WhatsApp (012 516 1620).

---

## (Screenshots to be added when Studio is live)

- [ ] Rate edit — before/after
- [ ] New gear item — form walkthrough
- [ ] New dropdown category — parent field
- [ ] New event — series + tickets link
- [ ] T&C clause edit
- [ ] Founder photo swap + focal point
