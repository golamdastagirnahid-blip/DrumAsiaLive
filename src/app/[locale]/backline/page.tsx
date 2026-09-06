import type { Metadata } from "next";
import { gearCategories } from "@/config/gear";
import { business } from "@/config/business";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { PageHero, SectionHeading, OutroBand } from "@/components/page/primitives";
import { Rate } from "@/components/rate";

export const metadata: Metadata = {
  title: "The Backline — Equipment & Rental",
  description:
    "Rent and buy gear in Kuala Lumpur: drums, guitars, amps, keys, PA, lighting, staging and production packages. Rates confirmed on WhatsApp.",
};

export default async function BacklinePage() {
  const ask = (slug: string, name: string) =>
    buildWhatsAppLink({
      intent: "general",
      source: "Backline",
      subject: `${name} enquiry`,
      message: `Hi, I'd like to ask about ${name} (category).`,
    });

  return (
    <>
      <PageHero
        eyebrow="The Backline · Rent or buy"
        title={
          <>
            Gear you can <span className="text-accent">trust.</span>
          </>
        }
        lede="Rental and showroom, at both branches. Drums to digital consoles, lights to full production packages. We also buy, sell and rent instruments."
        actions={
          <a
            href={buildWhatsAppLink({ intent: "general", source: "Backline hero", subject: "Backline enquiry" })}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--accent px-5"
          >
            Ask on WhatsApp
          </a>
        }
      />

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <SectionHeading
          index="01"
          title="Browse by category"
          seed={21}
          lede="Pick a category and we'll send you the current list and rates on WhatsApp. The full filterable catalogue with search is rolling out next."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gearCategories.map((cat) => (
            <a
              key={cat.slug}
              href={ask(cat.slug, cat.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="panel perforated group relative flex flex-col overflow-hidden p-6 transition-colors hover:border-accent"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[1.25rem] leading-tight text-ink transition-colors group-hover:text-accent">
                  {cat.name}
                </h3>
              </div>
              <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-mid">
                {cat.description}
              </p>
              {cat.note && (
                <span className="tech mt-2 inline-block w-max rounded-[2px] bg-accent px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.14em] text-black">
                  {cat.note}
                </span>
              )}
              <div className="mt-5 flex items-center justify-between border-t border-hairline pt-4">
                <Rate amount={null} unit={cat.priceHint?.includes("/day") ? "day" : "session"} className="text-[12px] text-ink-mid" />
                <span className="tech text-[10px] uppercase tracking-[0.16em] text-accent">Ask →</span>
              </div>
            </a>
          ))}
        </div>

        <p className="tech mt-8 text-[12px] text-ink-dim">
          Prices are information only. Confirm final pricing on WhatsApp — {business.whatsappDisplay}.
        </p>
      </section>

      <OutroBand
        number={business.whatsappDisplay}
        callHref={`tel:${business.whatsappNumber}`}
        bookHref={buildWhatsAppLink({ intent: "general", source: "Backline outro", subject: "Backline enquiry" })}
      />
    </>
  );
}
