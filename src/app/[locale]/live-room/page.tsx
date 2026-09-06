import type { Metadata } from "next";
import { business } from "@/config/business";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { PageHero, Panel, OutroBand } from "@/components/page/primitives";

export const metadata: Metadata = {
  title: "The Live Room — Playable Instruments",
  description:
    "Play a browser drum kit that sounds like DrumAsia's rooms. The full interactive kit lands soon.",
};

export default async function LiveRoomPage() {
  const book = buildWhatsAppLink({
    intent: "room_booking",
    source: "Live Room",
    room: "Live Stage",
  });

  return (
    <>
      <PageHero
        eyebrow="The Live Room · Interactive"
        title={
          <>
            Can&apos;t get here tonight? <span className="text-accent">Hit something.</span>
          </>
        }
        lede="The playable instrument room is the next milestone. Coming: a full browser drum kit with the room reverbs, a 16-step pattern grid and shareable beats."
      />

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <Panel className="flex min-h-[320px] flex-col items-center justify-center p-10 text-center">
          <span className="lamp lamp--warn" aria-hidden />
          <h2 className="mt-4 text-[1.5rem] text-ink">The kit is being wired up.</h2>
          <p className="mx-auto mt-3 max-w-[52ch] text-[15px] leading-relaxed text-ink-mid">
            Three sample sets — ORI (tight maple), LIVE STAGE (big room) and LAGENDA (dry) —
            each carrying the real room reverb. That&apos;s roughly how the room sounds.
            Come hear the real thing.
          </p>
          <a href={book} target="_blank" rel="noopener noreferrer" className="btn btn--accent mt-6 px-5">
            Book the real room on WhatsApp
          </a>
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
