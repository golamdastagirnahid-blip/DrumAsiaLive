import type { Metadata } from "next";
import { MapPin, Phone, MessageCircle, Mail } from "lucide-react";
import { branches, business } from "@/config/business";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { PageHero, SectionHeading, Panel, OutroBand } from "@/components/page/primitives";
import { SmartEnquiry } from "@/components/smart-enquiry";
import { Confirm } from "@/components/confirm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact DrumAsia — bookings, both branches, store, and WhatsApp. Fastest on WhatsApp.",
};

export default async function ContactPage() {
  const general = buildWhatsAppLink({ intent: "general", source: "Contact" });

  return (
    <>
      <PageHero
        eyebrow="Contact · Desa Sri Hartamas"
        title={
          <>
            Talk to <span className="text-accent">us.</span>
          </>
        }
        lede="Bookings are fastest on WhatsApp. Pick a topic and we'll route you to the right person — or just call."
      />

      {/* Branch cards */}
      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <SectionHeading index="01" title="Both branches" seed={101} />
        <div className="grid gap-4 md:grid-cols-2">
          {branches.map((b) => (
            <Panel key={b.id} className="p-6">
              <h3 className="text-[1.35rem] text-ink">{b.name}</h3>
              <p className="tech mt-2 flex items-start gap-2 text-[13px] leading-relaxed text-ink-mid">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                {b.address ?? (
                  <Confirm note="Full street address pending">Full address — confirm on WhatsApp</Confirm>
                )}
              </p>
              {b.venueNote && <p className="mt-1 text-[12px] italic text-ink-dim">{b.venueNote}</p>}
              <div className="mt-5 flex flex-wrap gap-2">
                {b.phones.bookings && (
                  <a
                    href={`tel:${b.phones.bookings.value}`}
                    className="btn btn--ghost h-10 px-3 text-[11px]"
                  >
                    <Phone className="h-3.5 w-3.5" aria-hidden />
                    {b.phones.bookings.value.replace("+60", "0")}
                    {b.phones.bookings.confidence === "confirm" && " · confirm"}
                  </a>
                )}
                {b.phones.store && (
                  <a
                    href={`tel:${b.phones.store.value}`}
                    className="btn btn--ghost h-10 px-3 text-[11px]"
                  >
                    Store {b.phones.store.value.replace("+60", "0")}
                  </a>
                )}
                <a
                  href={buildWhatsAppLink({ intent: "general", source: `Contact — ${b.shortName}` })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--accent h-10 px-3 text-[11px]"
                >
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                  WhatsApp
                </a>
              </div>
            </Panel>
          ))}
        </div>

        {/* Emails + hours */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Panel className="p-6">
            <h3 className="tech text-[11px] uppercase tracking-[0.2em] text-ink-dim">Email</h3>
            <div className="mt-3 space-y-2">
              {[business.email.primary, business.email.hello].map((e) => (
                <a key={e} href={`mailto:${e}`} className="flex items-center gap-2 text-[15px] text-ink transition-colors hover:text-accent">
                  <Mail className="h-4 w-4 text-accent" aria-hidden />
                  {e}
                </a>
              ))}
            </div>
          </Panel>
          <Panel className="p-6">
            <h3 className="tech text-[11px] uppercase tracking-[0.2em] text-ink-dim">Opening hours</h3>
            <div className="mt-3 space-y-2 text-[15px] text-ink-mid">
              <p>
                Desa Sri Hartamas — 10AM–10PM daily
              </p>
              <p className="tech text-[12px] text-ink-dim">
                Confirm current hours on WhatsApp.
              </p>
            </div>
          </Panel>
        </div>
      </section>

      {/* Smart enquiry router */}
      <section className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
        <SectionHeading
          index="02"
          title="Tell us what you need"
          seed={102}
          lede="Each option builds a differently structured WhatsApp message, so it lands with the right person."
        />
        <SmartEnquiry />
      </section>

      <OutroBand
        number={business.whatsappDisplay}
        callHref={`tel:${business.whatsappNumber}`}
        bookHref={general}
      />
    </>
  );
}
