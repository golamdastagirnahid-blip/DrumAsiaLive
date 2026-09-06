import type { Metadata } from "next";
import { business } from "@/config/business";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { PageHero, SectionHeading, Panel, OutroBand } from "@/components/page/primitives";
import { Rate } from "@/components/rate";
import { Confirm } from "@/components/confirm";

export const metadata: Metadata = {
  title: "Learn — Music Experience Program (MEP)",
  description:
    "The Music Experience Program (MEP) at DrumAsia. Ask about format and pricing on WhatsApp.",
};

export default async function LearnPage() {
  const mep = buildWhatsAppLink({
    intent: "mep_enquiry",
    source: "Learn / MEP",
  });

  return (
    <>
      <PageHero
        eyebrow="Learn · Music Experience Program"
        title={
          <>
            Get <span className="text-accent">playing.</span>
          </>
        }
        lede={`The Music Experience Program (MEP) — promoted via ${business.whatsappDisplay}. Format, pricing and schedule are confirmed on WhatsApp.`}
        actions={
          <a href={mep} target="_blank" rel="noopener noreferrer" className="btn btn--accent px-5">
            Ask about MEP on WhatsApp
          </a>
        }
      />

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Panel className="p-6">
            <h3 className="text-[1.2rem] text-ink">Who it suits</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-mid">
              From first-timers to bands who want to tighten up.{" "}
              <Confirm note="MEP details unconfirmed">Details are being confirmed with the client.</Confirm>
            </p>
          </Panel>
          <Panel className="p-6">
            <h3 className="text-[1.2rem] text-ink">Format</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-mid">
              Hands-on, in the rooms, on real gear.{" "}
              <Confirm note="MEP structure unconfirmed">Exact structure to be confirmed.</Confirm>
            </p>
          </Panel>
          <Panel className="p-6">
            <h3 className="text-[1.2rem] text-ink">Pricing</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-mid">
              Rates are confirmed on WhatsApp — nothing is taken on this site.
            </p>
          </Panel>
        </div>

        <div className="mt-6">
          <Panel className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-[1.3rem] text-ink">Not sure if MEP is right for you?</h3>
                <p className="mt-1 text-[15px] text-ink-mid">
                  Message us and we&apos;ll point you the right way.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href={mep} target="_blank" rel="noopener noreferrer" className="btn btn--accent px-5">
                  Ask about MEP
                </a>
                <a href={`tel:${business.whatsappNumber}`} className="btn btn--ghost px-5">
                  Call {business.whatsappDisplay}
                </a>
              </div>
            </div>
          </Panel>
        </div>
      </section>

      <OutroBand
        number={business.whatsappDisplay}
        callHref={`tel:${business.whatsappNumber}`}
        bookHref={mep}
      />
    </>
  );
}
