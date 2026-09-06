import type { Metadata } from "next";
import { business } from "@/config/business";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { PageHero, OutroBand } from "@/components/page/primitives";
import { FaqAccordion } from "@/components/faq-accordion";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Booking, gear, house rules, events, recording, rental and getting-here questions for DrumAsia.",
};

export default async function FaqPage() {
  const book = buildWhatsAppLink({ intent: "general", source: "FAQ", subject: "Question" });

  return (
    <>
      <PageHero
        eyebrow="FAQ · Straight answers"
        title={
          <>
            Ask <span className="text-accent">away.</span>
          </>
        }
        lede="Booking, gear, house rules, events, recording, rental, getting here. If it's not answered below, WhatsApp us."
      />

      <section className="mx-auto max-w-[860px] px-4 py-16 sm:px-6">
        <FaqAccordion />
      </section>

      <OutroBand
        number={business.whatsappDisplay}
        callHref={`tel:${business.whatsappNumber}`}
        bookHref={book}
      />
    </>
  );
}
