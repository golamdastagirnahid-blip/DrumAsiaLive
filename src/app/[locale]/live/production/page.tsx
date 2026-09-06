import type { Metadata } from "next";
import { business } from "@/config/business";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { PageHero, SectionHeading, OutroBand } from "@/components/page/primitives";
import { QuoteForm } from "@/components/quote-form";

export const metadata: Metadata = {
  title: "Off-site Sound & Light Production",
  description:
    "Sound and lighting with crew for weddings, proms, annual dinners, school events and mall events — anywhere in Malaysia. Get a quote on WhatsApp.",
};

const eventTypes = [
  { name: "Weddings", blurb: "Full-band and dinner sound, lighting and crew." },
  { name: "Proms", blurb: "Stage, PA, lights and an engineer who's done it before." },
  { name: "Annual dinners", blurb: "Speeches, awards, bands — clean and on time." },
  { name: "School events", blurb: "Affordable, reliable, student-friendly." },
  { name: "Mall events & launches", blurb: "Rigged, run and struck professionally." },
];

export default async function ProductionPage() {
  const quote = buildWhatsAppLink({
    intent: "production_quote",
    source: "Live / Production",
  });

  return (
    <>
      <PageHero
        eyebrow="DrumAsia Live · Off-site"
        title={
          <>
            We bring the <span className="text-accent">sound.</span>
          </>
        }
        lede="Off-site sound and light production with crew — weddings, proms, annual dinners, school events and mall events. The same engineers who run the basement venue."
        actions={
          <a href={quote} target="_blank" rel="noopener noreferrer" className="btn btn--accent px-5">
            Get a quote on WhatsApp
          </a>
        }
      />

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <SectionHeading index="01" title="What we run" seed={51} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {eventTypes.map((e) => (
            <div key={e.name} className="panel p-5">
              <h3 className="text-[1.2rem] text-ink">{e.name}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-mid">{e.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading index="02" title="Crew & support" seed={52} />
            <ul className="space-y-3 text-[15px] text-ink-mid">
              <li className="flex gap-3">
                <span className="lamp lamp--open mt-2" aria-hidden />
                Head sound engineer plus a technician team.
              </li>
              <li className="flex gap-3">
                <span className="lamp lamp--open mt-2" aria-hidden />
                PA, stage monitors, mics and consoles to spec.
              </li>
              <li className="flex gap-3">
                <span className="lamp lamp--open mt-2" aria-hidden />
                Lighting, rigging and effects as needed.
              </li>
              <li className="flex gap-3">
                <span className="lamp lamp--open mt-2" aria-hidden />
                Load-in, soundcheck, show and load-out — handled.
              </li>
            </ul>
          </div>
          <div>
            <SectionHeading index="03" title="Get a quote" seed={53} />
            <QuoteForm />
          </div>
        </div>
      </section>

      <OutroBand
        number={business.whatsappDisplay}
        callHref={`tel:${business.whatsappNumber}`}
        bookHref={quote}
      />
    </>
  );
}
