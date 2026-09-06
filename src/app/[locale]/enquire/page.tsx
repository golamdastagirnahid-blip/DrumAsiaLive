import type { Metadata } from "next";
import { business } from "@/config/business";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { PageHero, OutroBand } from "@/components/page/primitives";
import { SmartEnquiry } from "@/components/smart-enquiry";

export const metadata: Metadata = {
  title: "Enquire — Start a Booking",
  description:
    "Start a booking enquiry at DrumAsia — jam, record, stream, hire the venue or rent gear. Sent on WhatsApp.",
};

export default async function EnquirePage() {
  const book = buildWhatsAppLink({ intent: "general", source: "Enquire" });

  return (
    <>
      <PageHero
        eyebrow="Enquire · Session sheet"
        title={
          <>
            Let&apos;s set it <span className="text-accent">up.</span>
          </>
        }
        lede="Pick what you need and we'll build a WhatsApp message that lands with the right person. The full step-by-step session sheet (purpose → room → date → add-ons) is the next milestone — this router gets you there now."
      />

      <section className="mx-auto max-w-[860px] px-4 py-16 sm:px-6">
        <SmartEnquiry />
      </section>

      <OutroBand
        number={business.whatsappDisplay}
        callHref={`tel:${business.whatsappNumber}`}
        bookHref={book}
      />
    </>
  );
}
