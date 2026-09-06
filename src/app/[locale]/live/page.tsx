import type { Metadata } from "next";
import { business } from "@/config/business";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { PageHero, SectionHeading, Panel, OutroBand, LocalLink } from "@/components/page/primitives";
import { Confirm } from "@/components/confirm";

export const metadata: Metadata = {
  title: "DrumAsia Live — The Venue",
  description:
    "The basement venue in Desa Sri Hartamas — band gigs, album launches, stand-up comedy, and private events. Hire it on WhatsApp.",
};

const useCases = [
  "Band gigs & album launches",
  "Stand-up comedy",
  "Birthdays & engagements",
  "Baby & bridal showers",
  "Bachelor & bachelorette parties",
];

export default async function LivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const hire = buildWhatsAppLink({
    intent: "venue_hire",
    source: "DrumAsia Live",
    eventType: "Venue hire",
  });

  return (
    <>
      <PageHero
        eyebrow="DrumAsia Live · The basement venue"
        title={
          <>
            The <span className="text-accent">live room.</span>
          </>
        }
        lede="The performance hall in the basement at Wisma CKL, Desa Sri Hartamas. It's where the gigs happen — and when there's no show, it's a rehearsal stage."
        actions={
          <a href={hire} target="_blank" rel="noopener noreferrer" className="btn btn--accent px-5">
            Hire the venue
          </a>
        }
      />

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <SectionHeading index="01" title="What happens here" seed={41} />
            <ul className="grid gap-3 sm:grid-cols-2">
              {useCases.map((u) => (
                <li key={u} className="panel flex items-center gap-3 p-4">
                  <span className="lamp lamp--warn" aria-hidden />
                  <span className="text-[15px] text-ink">{u}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <SectionHeading index="02" title="Technical rider" seed={42} />
              <Panel className="p-6">
                <p className="max-w-[56ch] text-[15px] leading-relaxed text-ink-mid">
                  Full PA, console, lighting, stage dimensions and power spec. The
                  downloadable technical-rider PDF is being finalised —{" "}
                  <a href={hire} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2">
                    ask for the rider on WhatsApp
                  </a>{" "}
                  and we'll send it straight over.
                </p>
              </Panel>
            </div>
          </div>

          <div className="lg:col-span-2">
            <SectionHeading index="03" title="The numbers" seed={43} />
            <Panel className="overflow-hidden">
              <dl className="divide-y divide-hairline">
                {[
                  ["Capacity", <Confirm key="c">— · confirm on WhatsApp</Confirm>],
                  ["Stage", "Performance hall (doubles as a jam room)"],
                  ["Location", "Basement · Wisma CKL, Desa Sri Hartamas"],
                  ["Bookings", business.whatsappDisplay],
                ].map(([label, value]) => (
                  <div key={label as string} className="flex items-start justify-between gap-4 px-5 py-3">
                    <dt className="tech text-[11px] uppercase tracking-[0.16em] text-ink-dim">
                      {label as string}
                    </dt>
                    <dd className="tech text-right text-[13px] text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </Panel>

            <div className="mt-6">
              <LocalLink locale={locale} path="/live/production" className="btn btn--ghost w-full">
                Off-site sound & light production →
              </LocalLink>
            </div>
          </div>
        </div>
      </section>

      <OutroBand
        number={business.whatsappDisplay}
        callHref={`tel:${business.whatsappNumber}`}
        bookHref={hire}
      />
    </>
  );
}
