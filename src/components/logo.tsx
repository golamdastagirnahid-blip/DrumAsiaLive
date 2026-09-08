import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Official DrumAsia Studio Brand Logo
 * Displays the authentic circular emblem uploaded by the client.
 */
export function Logo({
  className,
  withWordmark = true,
  size = 40,
}: {
  className?: string;
  withWordmark?: boolean;
  size?: number;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 sm:gap-3 group select-none shrink-0", className)}>
      <span
        className="relative block rounded-full overflow-hidden shrink-0 border border-hairline transition-all duration-300 group-hover:border-accent group-hover:shadow-[0_0_12px_var(--gel-glow)] w-8 h-8 sm:w-10 sm:h-10"
      >
        <img
          src="/logo.jpg"
          alt="DrumAsia Live Logo"
          width={size}
          height={size}
          className="object-cover w-full h-full scale-[1.04]"
          loading="eager"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src.indexOf('/brand/logo.jpg') === -1) {
              target.src = '/brand/logo.jpg';
            }
          }}
        />
      </span>
      {withWordmark && (
        <span className="flex flex-col text-left">
          <span className="font-display text-[17px] sm:text-[21px] leading-none tracking-[0.02em] sm:tracking-[0.03em] uppercase text-ink group-hover:text-accent transition-colors">
            DRUM<span className="text-accent">ASIA</span>
          </span>
          <span className="tech text-[7.5px] sm:text-[9px] uppercase tracking-[0.18em] sm:tracking-[0.26em] text-secondary font-semibold mt-0.5 whitespace-nowrap">
            LIVE · EST. 2014
          </span>
        </span>
      )}
    </span>
  );
}
