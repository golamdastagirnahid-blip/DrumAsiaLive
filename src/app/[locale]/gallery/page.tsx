import type { Metadata } from "next";
import { business } from "@/config/business";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { PageHero, Panel, OutroBand } from "@/components/page/primitives";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos and video from the rooms, live shows, backstage and production at DrumAsia.",
};

const filters = ["Rooms", "Live Shows", "Backstage", "Production"];

export default async function GalleryPage() {
  const book = buildWhatsAppLink({ intent: "general", source: "Gallery", subject: "Booking enquiry" });

  return (
    <>
      <PageHero
        eyebrow="Gallery · See the place"
        title={
          <>
            The <span className="text-accent">proof.</span>
          </>
        }
        lede="Photos and video from the rooms, live shows, backstage and production. The full gallery is being populated from client media — follow the socials for the daily view."
      />

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              className="tech rounded-[2px] border border-hairline px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-ink-mid"
            >
              {f}
            </button>
          ))}
        </div>

        <Panel className="flex min-h-[320px] flex-col items-center justify-center p-10 text-center">
          <p className="tech text-[11px] uppercase tracking-[0.3em] text-ink-dim">
            Media incoming
          </p>
          <p className="mx-auto mt-4 max-w-[46ch] text-[15px] text-ink-mid">
            Client photos and video land here (see docs/ASSETS-NEEDED.md). In the meantime,
            the fastest look inside is the socials.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={business.social.instagramLive.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--ghost px-5"
            >
              {business.social.instagramLive.handle}
            </a>
            <a
              href={business.social.facebook.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--ghost px-5"
            >
              {business.social.facebook.handle}
            </a>
          </div>
        </Panel>
      </section>

      <OutroBand
        number={business.whatsappDisplay}
        callHref={`tel:${business.whatsappNumber}`}
        bookHref={book}
      />
    </>
  );
}
