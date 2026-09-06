import type { Metadata } from "next";
import { business } from "@/config/business";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { PageHero, OutroBand } from "@/components/page/primitives";
import { LoadIn } from "@/components/load-in";

export const metadata: Metadata = {
  title: "Load-In — Getting Here",
  description:
    "How to get to DrumAsia in Desa Sri Hartamas — Grab, driving, motorbike, public transport or walking. Buses 190, T818, T852.",
};

export default async function LoadInPage() {
  const book = buildWhatsAppLink({ intent: "general", source: "Load-In", subject: "Getting here" });

  return (
    <>
      <PageHero
        eyebrow="Load-In · Getting here"
        title={
          <>
            Find the <span className="text-accent">door.</span>
          </>
        }
        lede="Wisma CKL, Desa Sri Hartamas — the Live venue is in the basement. Pick how you're arriving and we'll point you in."
      />

      <section className="mx-auto max-w-[860px] px-4 py-16 sm:px-6">
        <LoadIn />
      </section>

      <OutroBand
        number={business.whatsappDisplay}
        callHref={`tel:${business.whatsappNumber}`}
        bookHref={book}
      />
    </>
  );
}
