import type { Metadata } from "next";
import { eventSeries, events, freeStream, ticketing } from "@/config/events";
import { business } from "@/config/business";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { PageHero, SectionHeading, Panel, OutroBand } from "@/components/page/primitives";
import { Confirm } from "@/components/confirm";

export const metadata: Metadata = {
  title: "On Stage — Events at DrumAsia Live",
  description:
    "Gigs and open mics at DrumAsia Live, Desa Sri Hartamas. Tickets via Ticket2u and CloudJoi.",
};

export default async function OnStagePage() {
  const enquire = buildWhatsAppLink({
    intent: "general",
    source: "On Stage",
    subject: "Event enquiry",
  });

  return (
    <>
      <PageHero
        eyebrow="On Stage · DrumAsia Live"
        title={
          <>
            What&apos;s <span className="text-accent">on.</span>
          </>
        }
        lede="Gigs, album launches and open mics at the basement venue. Tickets are always sold through Ticket2u and CloudJoi — we never take payment here."
      />

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        {/* Graceful state — no confirmed shows yet */}
        <Panel className="p-8 text-center">
          <span className="lamp lamp--warn mx-auto" aria-hidden />
          <h2 className="mt-4 text-[1.6rem] text-ink">No shows announced yet.</h2>
          <p className="mx-auto mt-2 max-w-[52ch] text-[15px] text-ink-mid">
            Here&apos;s what usually happens here — and how to hear about the next one first.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={enquire}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--accent px-5"
            >
              Ask about upcoming shows
            </a>
            <a
              href={ticketing.ticket2u}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--ghost px-5"
            >
              Browse Ticket2u
            </a>
            <a
              href={ticketing.cloudjoi}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--ghost px-5"
            >
              Browse CloudJoi
            </a>
          </div>
        </Panel>

        {/* Series */}
        <div className="mt-14">
          <SectionHeading index="01" title="The series" seed={61} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {eventSeries.map((s) => (
              <div key={s.id} className="panel p-5">
                <h3 className="text-[1.15rem] text-ink">{s.name}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-mid">{s.blurb}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Free stream */}
        <div className="mt-10">
          <Panel className="border-secondary/50 p-6">
            <h3 className="text-[1.3rem] text-ink">{freeStream.label}</h3>
            <p className="mt-1 text-[15px] text-ink-mid">
              {freeStream.detail}.{" "}
              <Confirm note="Whether the weekly free stream still runs is unconfirmed">
                Still running — to be confirmed
              </Confirm>
              .
            </p>
          </Panel>
        </div>
      </section>

      <OutroBand
        number={business.whatsappDisplay}
        callHref={`tel:${business.whatsappNumber}`}
        bookHref={enquire}
      />
    </>
  );
}
