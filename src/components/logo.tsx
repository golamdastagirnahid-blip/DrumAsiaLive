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
    <span className={cn("inline-flex items-center gap-3 group", className)}>
      <span
        className="relative block rounded-full overflow-hidden shrink-0 border border-hairline transition-all duration-300 group-hover:border-accent group-hover:shadow-[0_0_12px_var(--gel-glow)]"
        style={{ width: size, height: size }}
      >
        <Image
          src="/brand/logo.jpg"
          alt="DrumAsia Live Logo"
          width={size}
          height={size}
          className="object-cover w-full h-full scale-[1.04]"
          priority
        />
      </span>
      {withWordmark && (
        <span className="flex flex-col text-left">
          <span className="font-display text-[21px] leading-none tracking-[0.03em] uppercase text-ink group-hover:text-accent transition-colors">
            DRUM<span className="text-accent">ASIA</span>
          </span>
          <span className="tech text-[9px] uppercase tracking-[0.26em] text-secondary font-semibold mt-0.5">
            LIVE · EST. 2014
          </span>
        </span>
      )}
    </span>
  );
}
