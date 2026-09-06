import type { ReactNode } from "react";

/** A simple legal-page shell with a hero, body sections and a review note. */
export function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-[820px] px-4 pb-28 pt-32 sm:px-6">
      <p className="tech text-[11px] uppercase tracking-[0.3em] text-ink-dim">Legal</p>
      <h1 className="mt-3 text-[clamp(2.2rem,6vw,4rem)] leading-[0.95] text-ink">{title}</h1>
      <p className="tech mt-4 text-[12px] text-ink-dim">Last reviewed: {updated}</p>
      <div className="mt-10 space-y-10">{children}</div>
      <ReviewNote />
    </section>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-[1.3rem] text-ink">{heading}</h2>
      <div className="mt-3 space-y-4 text-[15px] leading-relaxed text-ink-mid">{children}</div>
    </section>
  );
}

export function ReviewNote() {
  return (
    <div className="mt-16 rounded-[6px] border border-warn/50 bg-panel p-5">
      <p className="tech text-[12px] leading-relaxed text-warn">
        [CLIENT TO CONFIRM] — These documents are structural scaffolding, not legal
        advice. A Malaysian lawyer must review the final rental terms and the PDPA
        notice before launch.
      </p>
    </div>
  );
}
