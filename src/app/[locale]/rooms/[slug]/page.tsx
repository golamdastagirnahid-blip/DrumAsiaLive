import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoom, rooms } from "@/config/rooms";
import { business, getBranch } from "@/config/business";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { PageHero, SectionHeading, Panel, OutroBand, LocalLink } from "@/components/page/primitives";
import { Rate } from "@/components/rate";
import { RoomCard } from "@/components/rooms/room-card";

export function generateStaticParams() {
  return rooms.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const room = getRoom(slug);
  if (!room) return { title: "Room not found" };
  return {
    title: `${room.name} — Jamming & Rehearsal Room`,
    description: room.blurb,
  };
}

export default async function RoomPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const room = getRoom(slug);
  if (!room) notFound();

  const branch = getBranch(room.branch);
  const book = buildWhatsAppLink({
    intent: "room_booking",
    source: `Rooms — ${room.name}`,
    room: room.name,
    branch: branch.shortName,
  });

  return (
    <>
      <PageHero
        eyebrow={`Rooms · ${branch.shortName}`}
        title={room.name}
        lede={room.blurb}
        actions={
          <a href={book} target="_blank" rel="noopener noreferrer" className="btn btn--accent px-5">
            Book this room on WhatsApp
          </a>
        }
      />

      {room.sellLine && (
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Panel className="glow-accent border-secondary/50 p-6">
            <p className="font-display text-[clamp(1.3rem,3vw,2rem)] leading-tight text-secondary">
              {room.sellLine}
            </p>
          </Panel>
        </div>
      )}

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Spec sheet */}
          <div className="lg:col-span-2">
            <SectionHeading index="01" title="Spec sheet" seed={11} />
            <Panel className="overflow-hidden">
              <dl className="divide-y divide-hairline">
                {[
                  ["Rate", <Rate key="r" amount={room.rateHour} unit="hr" className="text-ink" />],
                  ["Capacity", room.capacity ?? "— · confirm on WhatsApp"],
                  ["Dimensions", room.dimensions ?? "— · confirm on WhatsApp"],
                  ["Branch", branch.shortName],
                  ["Address", branch.address ?? "Full address — confirm on WhatsApp"],
                ].map(([label, value]) => (
                  <div key={label as string} className="flex items-start justify-between gap-4 px-5 py-3">
                    <dt className="tech text-[11px] uppercase tracking-[0.16em] text-ink-dim">
                      {label as string}
                    </dt>
                    <dd className="tech text-right text-[13px] text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </Panel>

            <div className="mt-6">
              <SectionHeading index="02" title="Features" seed={12} />
              <ul className="space-y-2">
                {room.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[15px] text-ink-mid">
                    <span className="lamp lamp--open" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Gear + rules */}
          <div className="lg:col-span-3">
            <SectionHeading index="03" title="House gear" seed={13} />
            <Panel className="p-6">
              <div className="flex flex-wrap gap-2">
                {room.gear.map((g) => (
                  <span
                    key={g}
                    className="tech rounded-[4px] border border-hairline-strong px-2.5 py-1.5 text-[12px] text-ink"
                  >
                    {g}
                  </span>
                ))}
              </div>
              <p className="tech mt-5 text-[12px] text-ink-dim">
                Typical house backline — confirm exact items on WhatsApp before you come.
              </p>
            </Panel>

            <div className="mt-6">
              <SectionHeading index="04" title="House rules" seed={14} />
              <ul className="space-y-2 text-[15px] text-ink-mid">
                <li>· Leave the room as you found it.</li>
                <li>· No food or drinks on the gear.</li>
                <li>· Respect the neighbours after hours.</li>
                <li>
                  · Full terms per room are confirmed on WhatsApp —{" "}
                  <Link href={`/${locale}/terms/rental`} className="text-accent underline underline-offset-2">
                    see rental terms
                  </Link>
                  .
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <LocalLink locale={locale} path="/load-in" className="btn btn--ghost px-5">
                Plan my arrival →
              </LocalLink>
            </div>
          </div>
        </div>
      </section>

      {/* Other rooms */}
      <section className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
        <SectionHeading index="05" title="The other rooms" seed={15} />
        <div className="grid gap-4 sm:grid-cols-3">
          {rooms
            .filter((r) => r.slug !== room.slug)
            .map((r) => (
              <RoomCard key={r.slug} room={r} locale={locale} />
            ))}
        </div>
      </section>

      <OutroBand
        number={business.whatsappDisplay}
        callHref={`tel:${business.whatsappNumber}`}
        bookHref={book}
      />
    </>
  );
}
