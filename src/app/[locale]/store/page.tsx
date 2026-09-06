import type { Metadata } from "next";
import { business } from "@/config/business";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { PageHero, SectionHeading, Panel, OutroBand } from "@/components/page/primitives";

export const metadata: Metadata = {
  title: "Store — Retail, Prestige Guitars, Buy/Sell/Rent",
  description:
    "Strings, sticks, heads, picks, cables, amps, accessories and Prestige Guitars at both DrumAsia branches. Buy, sell and rent instruments.",
};

const retail = [
  "Strings",
  "Sticks & heads",
  "Picks",
  "Cables",
  "Guitar cases",
  "Amps",
  "Accessories",
  "In-ears",
];

export default async function StorePage() {
  const ask = (subject: string) =>
    buildWhatsAppLink({ intent: "general", source: "Store", subject });

  return (
    <>
      <PageHero
        eyebrow="Store · Both branches"
        title={
          <>
            Gear to <span className="text-accent">own.</span>
          </>
        }
        lede="Retail at both branches — strings to amps, plus the Prestige Guitars collection. We also buy, sell and rent instruments."
        actions={
          <a href={ask("Store enquiry")} target="_blank" rel="noopener noreferrer" className="btn btn--accent px-5">
            Ask about an item
          </a>
        }
      />

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading index="01" title="Retail" seed={81} />
            <Panel className="p-6">
              <div className="flex flex-wrap gap-2">
                {retail.map((r) => (
                  <span key={r} className="tech rounded-[4px] border border-hairline-strong px-2.5 py-1.5 text-[12px] text-ink">
                    {r}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-[14px] text-ink-mid">
                Ask about availability and price on WhatsApp — nothing is presented as payable on this site.
              </p>
            </Panel>
          </div>

          <div>
            <SectionHeading index="02" title="Prestige Guitars" seed={82} />
            <Panel className="p-6">
              <p className="text-[15px] leading-relaxed text-ink-mid">
                The Prestige Guitars collection is carried at Kota Damansara. For the
                current line-up and pricing, ask on WhatsApp.
              </p>
              <a href={ask("Prestige Guitars")} target="_blank" rel="noopener noreferrer" className="btn btn--ghost mt-4 px-5">
                Ask about Prestige Guitars
              </a>
            </Panel>
          </div>
        </div>

        {/* Buy / sell / rent */}
        <div className="mt-10">
          <SectionHeading
            index="03"
            title="Buy · Sell · Rent"
            seed={83}
            lede="Sell us your gear — send brand, model, condition and your asking price, and attach photos in the chat."
          />
          <Panel className="p-6">
            <a
              href={buildWhatsAppLink({
                intent: "sell_gear",
                source: "Store / Sell your gear",
                brand: "Brand?",
                model: "Model?",
                condition: "Condition?",
                asking: "Asking price?",
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--accent px-5"
            >
              Sell us your gear
            </a>
            <p className="tech mt-4 text-[12px] text-ink-dim">
              Opens WhatsApp with a pre-filled message — just add the details and photos.
            </p>
          </Panel>
        </div>
      </section>

      <OutroBand
        number={business.whatsappDisplay}
        callHref={`tel:${business.whatsappNumber}`}
        bookHref={ask("Store outro")}
      />
    </>
  );
}
