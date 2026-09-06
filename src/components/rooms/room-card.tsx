import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Room } from "@/config/rooms";
import { getBranch } from "@/config/business";
import { Rate } from "@/components/rate";

export function RoomCard({ room, locale }: { room: Room; locale: string }) {
  const branch = getBranch(room.branch);
  return (
    <Link
      href={`/${locale}/rooms/${room.slug}`}
      className="panel perforated group relative flex flex-col overflow-hidden p-6 transition-colors hover:border-accent"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="tech text-[10px] uppercase tracking-[0.24em] text-ink-dim">
            {branch.shortName}
          </div>
          <h3 className="mt-2 text-[1.6rem] text-ink transition-colors group-hover:text-accent">
            {room.name}
          </h3>
        </div>
        <ArrowRight
          className="h-4 w-4 text-ink-dim transition-all group-hover:translate-x-1 group-hover:text-accent"
          aria-hidden
        />
      </div>

      <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-mid">{room.tagline}</p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {room.gear.slice(0, 4).map((g) => (
          <span
            key={g}
            className="tech rounded-[2px] border border-hairline px-1.5 py-0.5 text-[10px] text-ink-mid"
          >
            {g}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-hairline pt-4">
        <Rate amount={room.rateHour} unit="hr" className="text-[13px] text-ink" />
        <span className="tech text-[10px] uppercase tracking-[0.16em] text-ink-dim">
          Book →
        </span>
      </div>
    </Link>
  );
}
