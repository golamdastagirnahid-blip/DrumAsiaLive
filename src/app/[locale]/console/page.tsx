import type { Metadata } from "next";
import { GELS, SEMANTIC_LAMPS, MOTION, TOKEN_ORDER } from "@/config/gels";
import { Waveform } from "@/components/waveform";

export const metadata: Metadata = {
  title: "Console — Design System",
  description:
    "DrumAsia internal design system: tokens, components, states, lamps, gels and motion curves.",
};

/**
 * /console — the internal route documenting every token, component, state,
 * lamp, gel and motion curve (SECTION 2.6), so future developers cannot drift
 * from the system.
 */
export default function ConsolePage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-28 pt-28 sm:px-6">
      <header className="border-b border-hairline pb-10">
        <p className="tech text-[11px] uppercase tracking-[0.3em] text-ink-dim">
          DrumAsia · Session One · Internal
        </p>
        <h1 className="mt-3 text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.9] text-ink">
          Design <span className="text-accent">System</span>
        </h1>
        <p className="mt-5 max-w-[60ch] text-[16px] leading-relaxed text-ink-mid">
          The console. Every token, component, state, lamp, gel and motion curve.
          If a future change isn&apos;t on this page, it&apos;s off-system.
        </p>
      </header>

      {/* ── GELS ─────────────────────────────────────────────────────────── */}
      <Section title="01 · Lighting Gels" seed={1}>
        <div className="grid gap-4 sm:grid-cols-2">
          {GELS.map((gel) => (
            <div key={gel.id} className="panel overflow-hidden">
              <div
                className="flex items-center justify-between border-b border-hairline px-5 py-4"
                style={{ background: gel.tokens.panel }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="block h-4 w-4 rounded-full"
                    style={{ background: gel.swatch, boxShadow: `0 0 12px ${gel.swatch}` }}
                  />
                  <span className="tech text-[12px] uppercase tracking-[0.2em] text-ink">
                    {gel.label}
                  </span>
                </div>
                <span className="tech text-[10px] uppercase tracking-[0.14em] text-ink-dim">
                  {gel.scheme} · {gel.id === "console" ? "default" : "optional"}
                </span>
              </div>
              <dl className="divide-y divide-hairline">
                {TOKEN_ORDER.map((key) => (
                  <div key={key} className="flex items-center justify-between px-5 py-2.5">
                    <dt className="tech text-[11px] uppercase tracking-[0.12em] text-ink-mid">
                      {key}
                    </dt>
                    <dd className="flex items-center gap-3">
                      <span className="tech text-[12px] text-ink">{gel.tokens[key]}</span>
                      <span
                        className="block h-4 w-4 rounded-[2px] border border-hairline"
                        style={{ background: gel.tokens[key] }}
                      />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </Section>

      {/* ── SEMANTIC LAMPS ───────────────────────────────────────────────── */}
      <Section title="02 · Semantic Lamps" seed={2}>
        <p className="mb-5 max-w-[60ch] text-[15px] text-ink-mid">
          Constant across all four gels. Every lamp has a text label — no
          colour-only meaning.
        </p>
        <div className="flex flex-wrap gap-4">
          {SEMANTIC_LAMPS.map((lamp) => (
            <div key={lamp.id} className="panel flex items-center gap-4 px-5 py-4">
              <span
                className="lamp lamp--open"
                style={{
                  background: lamp.value,
                  boxShadow: `0 0 8px ${lamp.value}`,
                }}
                aria-hidden
              />
              <div>
                <div className="tech text-[12px] text-ink">{lamp.id}</div>
                <div className="text-[12px] text-ink-dim">
                  {lamp.label} — {lamp.purpose}
                </div>
              </div>
              <span className="tech ml-2 text-[11px] text-ink-dim">{lamp.value}</span>
            </div>
          ))}
          {/* states */}
          <div className="panel flex items-center gap-4 px-5 py-4">
            <span className="lamp lamp--off" aria-hidden />
            <div>
              <div className="tech text-[12px] text-ink">unlit</div>
              <div className="text-[12px] text-ink-dim">idle / off</div>
            </div>
          </div>
          <div className="panel flex items-center gap-4 px-5 py-4">
            <span className="lamp lamp--live pulse" aria-hidden />
            <div className="text-[12px] text-ink-dim">live · pulse 1s</div>
          </div>
          <div className="panel flex items-center gap-4 px-5 py-4">
            <span className="lamp lamp--open breathe" aria-hidden />
            <div className="text-[12px] text-ink-dim">open · breathe 2s</div>
          </div>
        </div>
      </Section>

      {/* ── TYPE ─────────────────────────────────────────────────────────── */}
      <Section title="03 · Type System" seed={3}>
        <div className="grid gap-4 md:grid-cols-3">
          <TypeCard
            name="Display — Anton"
            usage="Headlines, huge & sparing"
            sample="PLAY."
            className="font-display text-[64px] leading-none"
          />
          <TypeCard
            name="Body — Inter"
            usage="17px / 1.65, measure ≤ 68ch"
            sample="Three rooms, one stage, all the gear."
            className="text-[17px] leading-[1.65]"
          />
          <TypeCard
            name="Technical — JetBrains Mono"
            usage="Numbers, prices, specs, rates, refs"
            sample="RM—/hr · 02:13 · DA-9F3K2"
            className="tech text-[17px]"
          />
        </div>
      </Section>

      {/* ── MATERIAL ─────────────────────────────────────────────────────── */}
      <Section title="04 · Material" seed={4}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="panel perforated relative h-40 p-5">
            <span className="tech text-[10px] uppercase tracking-[0.2em] text-ink-dim">
              panel · perforated
            </span>
          </div>
          <div className="panel h-40 p-5">
            <span className="tech engraved text-[10px] uppercase tracking-[0.2em] text-ink-mid">
              engraved label · 1px dark inset + 1px light outset
            </span>
          </div>
          <div className="glow-accent panel h-40 p-5">
            <span className="tech text-[10px] uppercase tracking-[0.2em] text-ink-dim">
              glow-accent · no grey shadows
            </span>
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <RadiusDemo label="input · 2px" radius={2} />
          <RadiusDemo label="card · 10px" radius={10} />
          <RadiusDemo label="hero panel · 20px" radius={20} />
        </div>
      </Section>

      {/* ── MOTION ───────────────────────────────────────────────────────── */}
      <Section title="05 · Motion Law" seed={5}>
        <dl className="divide-y divide-hairline border-y border-hairline">
          {Object.entries(MOTION).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-4 py-3">
              <dt className="tech text-[12px] uppercase tracking-[0.12em] text-ink-mid">{k}</dt>
              <dd className="tech text-right text-[13px] text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[13px] text-ink-dim">
          Under <code className="tech">prefers-reduced-motion: reduce</code>: no
          parallax, no marquees, no cold open, no playhead animation, no grain,
          no breathing lamps. Static, and still beautiful.
        </p>
      </Section>

      {/* ── WAVEFORM DIVIDERS ────────────────────────────────────────────── */}
      <Section title="06 · Waveform Dividers" seed={6}>
        <p className="mb-4 max-w-[60ch] text-[15px] text-ink-mid">
          One deterministic waveform per section, generated from a seeded
          amplitude array at render time.
        </p>
        <div className="space-y-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-4">
              <span className="tech w-20 shrink-0 text-[11px] uppercase tracking-[0.16em] text-ink-dim">
                seed {s}
              </span>
              <Waveform seed={s} className="text-accent" />
            </div>
          ))}
        </div>
      </Section>

      {/* ── COMPONENTS ───────────────────────────────────────────────────── */}
      <Section title="07 · Components" seed={7}>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="btn btn--accent">
            Book on WhatsApp
          </button>
          <button type="button" className="btn btn--ghost">
            Ghost action
          </button>
          <button type="button" className="btn">
            Neutral action
          </button>
          <span className="tech rounded-[2px] bg-accent px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.14em] text-black">
            NEW
          </span>
          <span className="tech rounded-[2px] bg-secondary px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.14em] text-black">
            PROMO
          </span>
          <span className="tech rounded-[2px] border border-hairline-strong px-1.5 py-0.5 text-[9px] tracking-[0.14em] text-ink-mid">
            SOON
          </span>
          <span className="tech rounded-[2px] border border-hairline px-1.5 py-0.5 text-[10px] text-ink-mid">
            from RM—/hr
          </span>
        </div>
      </Section>

      <footer className="mt-16 border-t border-hairline pt-8">
        <p className="tech text-[11px] uppercase tracking-[0.2em] text-ink-dim">
          DrumAsia Session One · single source of truth · /docs/ARCHITECTURE.md
        </p>
      </footer>
    </div>
  );
}

function Section({
  title,
  seed,
  children,
}: {
  title: string;
  seed: number;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16">
      <h2 className="text-[1.6rem] text-ink">{title}</h2>
      <Waveform seed={seed} className="mt-3 text-accent" />
      <div className="mt-6">{children}</div>
    </section>
  );
}

function TypeCard({
  name,
  usage,
  sample,
  className,
}: {
  name: string;
  usage: string;
  sample: string;
  className: string;
}) {
  return (
    <div className="panel flex h-48 flex-col justify-between p-5">
      <div>
        <div className="tech text-[11px] uppercase tracking-[0.2em] text-ink-dim">{name}</div>
        <div className="text-[12px] text-ink-mid">{usage}</div>
      </div>
      <div className={className}>{sample}</div>
    </div>
  );
}

function RadiusDemo({ label, radius }: { label: string; radius: number }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="block h-14 w-14 shrink-0 border border-hairline"
        style={{ borderRadius: radius, background: "var(--gel-panel)" }}
      />
      <span className="tech text-[12px] text-ink-mid">{label}</span>
    </div>
  );
}
