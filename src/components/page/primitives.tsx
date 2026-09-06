import type { ReactNode } from "react";
import Link from "next/link";
import { Waveform } from "@/components/waveform";
import { cn } from "@/lib/utils";

/**
 * Shared page primitives — keep every page on the same "machined" system.
 * All server-compatible (no hooks).
 */

export function PageHero({
  eyebrow,
  title,
  lede,
  actions,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: string;
  actions?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-hairline pb-14 pt-32 md:pt-40",
        align === "center" && "text-center",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 70% at 50% 0%, var(--gel-glow), transparent 60%)",
        }}
      />
      <div className={cn("relative mx-auto max-w-[1200px] px-4 sm:px-6", align === "center" && "flex flex-col items-center")}>
        <p className="tech mb-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-ink-mid">
          <span className="inline-block h-px w-8 bg-secondary" aria-hidden />
          {eyebrow}
        </p>
        <h1 className="font-display text-[clamp(2.6rem,8vw,6rem)] leading-[0.9] tracking-[-0.02em] text-ink">
          {title}
        </h1>
        {lede && (
          <p className="mt-6 max-w-[58ch] text-[17px] leading-relaxed text-ink-mid">
            {lede}
          </p>
        )}
        {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </section>
  );
}

export function SectionHeading({
  index,
  title,
  seed,
  lede,
}: {
  index?: string;
  title: string;
  seed: number;
  lede?: string;
}) {
  return (
    <div className="mb-8">
      {index && (
        <div className="tech text-[11px] uppercase tracking-[0.3em] text-ink-dim">
          {index}
        </div>
      )}
      <h2 className="mt-2 text-[clamp(1.7rem,4vw,2.6rem)] text-ink">{title}</h2>
      <Waveform seed={seed} className="mt-3 max-w-[420px] text-accent" />
      {lede && (
        <p className="mt-4 max-w-[62ch] text-[16px] leading-relaxed text-ink-mid">
          {lede}
        </p>
      )}
    </div>
  );
}

export function Panel({
  children,
  className,
  perforated = false,
}: {
  children: ReactNode;
  className?: string;
  perforated?: boolean;
}) {
  return (
    <div className={cn("panel relative overflow-hidden", perforated && "perforated", className)}>
      {children}
    </div>
  );
}

/** Reusable outro band — "YOUR BAND IS WAITING." */
export function OutroBand({
  number,
  callHref,
  bookHref,
}: {
  number: string;
  callHref: string;
  bookHref: string;
}) {
  return (
    <section className="mx-auto max-w-[1200px] px-4 pb-28 pt-16 sm:px-6">
      <Panel className="panel--hero perforated p-8 md:p-14">
        <h2 className="font-display text-[clamp(2.2rem,7vw,5rem)] leading-[0.9] text-ink">
          Your band is waiting.
        </h2>
        <p className="tech mt-4 text-[clamp(1.3rem,4vw,2.4rem)] text-ink-mid">
          <a href={callHref} className="text-accent transition-colors hover:text-ink">
            {number}
          </a>
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href={bookHref} target="_blank" rel="noopener noreferrer" className="btn btn--accent px-5">
            Book on WhatsApp
          </a>
          <a href={callHref} className="btn btn--ghost px-5">
            Call the studio
          </a>
        </div>
      </Panel>
    </section>
  );
}

export function LocalHref({ locale, path }: { locale: string; path: string }) {
  return `/${locale}${path}`;
}

export function LocalLink({
  locale,
  path,
  children,
  className,
}: {
  locale: string;
  path: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={`/${locale}${path}`} className={className}>
      {children}
    </Link>
  );
}
