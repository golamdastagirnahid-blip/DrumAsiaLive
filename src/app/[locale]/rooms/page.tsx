import type { Metadata } from "next";
import { rooms } from "@/config/rooms";
import { business } from "@/config/business";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { PageHero, OutroBand } from "@/components/page/primitives";
import { RoomCard } from "@/components/rooms/room-card";

export const metadata: Metadata = {
  title: "Rooms — Jamming & Rehearsal Studios",
  description:
    "Studio Ori, Live Stage and Lagenda at Desa Sri Hartamas — signature jamming and rehearsal studios.",
};

export default async function RoomsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const book = buildWhatsAppLink({ intent: "room_booking", source: "Rooms index" });

  return (
    <>
      <PageHero
        eyebrow="The rooms · Desa Sri Hartamas"
        title={
          <>
            Pick your <span className="text-accent">room.</span>
          </>
        }
        lede="Three signature jamming and rehearsal spaces at Desa Sri Hartamas — including the Live Stage, a full performance hall you can rehearse on when no show is booked, alongside Studio Ori and Lagenda."
        actions={
          <a href={book} target="_blank" rel="noopener noreferrer" className="btn btn--accent px-5">
            Book on WhatsApp
          </a>
        }
      />

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {rooms.map((room) => (
            <RoomCard key={room.slug} room={room} locale={locale} />
          ))}
        </div>
        <p className="tech mt-8 text-[12px] text-ink-dim">
          All rates are illustrative — confirm final pricing on WhatsApp.{" "}
          {business.whatsappDisplay}
        </p>
      </section>

      <OutroBand
        number={business.whatsappDisplay}
        callHref={`tel:${business.whatsappNumber}`}
        bookHref={book}
      />
    </>
  );
}
