import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { business } from "@/config/business";
import { rooms } from "@/config/rooms";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { getFounderPortrait } from "@/lib/founder";
import { Reveal } from "@/components/reveal";
import { FounderPortrait } from "@/components/founder-portrait";
import { Waveform } from "@/components/waveform";
import { Confirm } from "@/components/confirm";
import { EquipmentBrandTitle } from "@/components/equipment-brand-title";
import { AnimatedSlogan } from "@/components/animated-slogan";
import { JammingSoundController } from "@/components/jamming-sound-controller";

/**
 * Homepage — the session. Each region maps to a numbered marker on the playhead.
 * M2 brings the cold open and gutter playhead; the regions are already here.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  const book = buildWhatsAppLink({ intent: "general", source: "Home hero" });
  const call = `tel:${business.whatsappNumber}`;
  const local = (path: string) => `/${locale}${path}`;
  const founder = business.founder;
  const { src, hasImage } = getFounderPortrait();

  return (
    <>
      {/* ═══ 01 INTRO / HERO ═══════════════════════════════════════════════ */}
      <section className="relative flex min-h-[90vh] flex-col justify-center overflow-hidden py-16 sm:py-24">
        {/* Soft Vignette Behind Hero Content for Reading Comfort */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 transition-colors duration-700"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 30%, transparent 35%, var(--gel-base) 90%)",
          }}
        />
        <div
          aria-hidden
          className="perforated absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--gel-hairline-strong) 1px, transparent 1.6px)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(120% 90% at 50% 20%, black 30%, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(120% 90% at 50% 20%, black 30%, transparent 78%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 60% at 50% 0%, var(--gel-glow), transparent 60%)",
            opacity: 0.55,
          }}
        />

        <div className="relative mx-auto w-full max-w-[1440px] px-4 pt-12 pb-8 sm:px-6">
          <Reveal>
            <p className="tech mb-7 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-ink-mid">
              <span className="inline-block h-px w-10 bg-secondary" aria-hidden />
              Session One — Desa Sri Hartamas · EST. {business.foundedYear}
            </p>
          </Reveal>

          {/* ═══ WORLD-CLASS EQUIPMENT TYPOGRAPHY: DRUM ASIA LIVE ═══ */}
          <Reveal delay={60} className="mb-10">
            <EquipmentBrandTitle />
          </Reveal>

          {/* ═══ ANIMATED SLOGAN (ZERO OVERLAP + KINETIC MOTION) ═══ */}
          <Reveal delay={120}>
            <AnimatedSlogan
              play={business.threePs.play}
              practice={business.threePs.practice}
              perform={business.threePs.perform}
            />
          </Reveal>

          <Reveal delay={180}>
            <p className="mt-6 max-w-[56ch] text-[17px] leading-relaxed text-ink-mid md:text-[19px]">
              Three rooms, one stage, and all the gear. Desa Sri Hartamas since 2014.
            </p>
          </Reveal>

          {/* ═══ AUTHENTIC JAMMING ROOM SOUND ENGINE CONTROLLER ═══ */}
          <Reveal delay={240} className="mt-8 max-w-2xl">
            <JammingSoundController />
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={book}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--accent px-6"
              >
                {t("bookOnWhatsApp")}
              </a>
              <Link href={local("/live-room")} className="btn btn--ghost px-6">
                Play the Live Room
              </Link>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3">
              <span className="tech text-[11px] uppercase tracking-[0.24em] text-ink-dim">
                Jamming
              </span>
              <span className="tech text-[11px] uppercase tracking-[0.24em] text-ink-dim">
                Recording
              </span>
              <span className="tech text-[11px] uppercase tracking-[0.24em] text-ink-dim">
                Live
              </span>
              <span className="tech text-[11px] uppercase tracking-[0.24em] text-ink-dim">
                Backline rental
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ PROOF STRIP + CLIENT WORDMARKS ════════════════════════════════ */}
      <section className="border-y border-hairline bg-panel/40">
        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6">
          <Reveal>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { v: "92%", l: "recommend · 36 reviews", confirm: true },
                { v: "17K", l: "community", confirm: true },
                { v: "2014", l: "EST.", confirm: false },
                { v: "2", l: "branches", confirm: false },
              ].map((s) => (
                <div
                  key={s.l}
                  className="panel flex flex-col items-center gap-1 px-4 py-5 text-center"
                >
                  <span className="tech text-[1.7rem] leading-none text-ink">
                    {s.confirm ? <Confirm>{s.v}</Confirm> : s.v}
                  </span>
                  <span className="tech text-[10px] uppercase tracking-[0.2em] text-ink-dim">
                    {s.l}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* client wordmarks — text only (no logo files), pause on hover, aria-hidden */}
        <div
          aria-hidden
          className="relative overflow-hidden border-t border-hairline py-5"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-base to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-base to-transparent" />
          <div className="marquee gap-14 px-7">
            {[...business.clients, ...business.clients].map((c, i) => (
              <span
                key={`${c}-${i}`}
                className="tech whitespace-nowrap text-[15px] tracking-[0.3em] text-ink-mid"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 02 THE ROOMS ══════════════════════════════════════════════════ */}
      <section id="rooms" className="mx-auto max-w-[1440px] px-4 py-14 sm:py-18 sm:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <div>
              <div className="tech text-[11px] uppercase tracking-[0.3em] text-ink-dim">
                02 — The rooms
              </div>
              <h2 className="mt-3 text-[clamp(2rem,6vw,4rem)] text-ink">
                Pick your <span className="text-accent">room.</span>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <Link href={local("/rooms")} className="btn btn--ghost px-5">
              All rooms →
            </Link>
          </Reveal>
        </div>
        <Waveform seed={2} className="mb-10 max-w-[420px] text-accent" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rooms.map((room, i) => (
            <Reveal key={room.slug} delay={i * 60}>
              <Link
                href={local(`/rooms/${room.slug}`)}
                className="panel perforated group relative flex h-full flex-col overflow-hidden p-5 transition-colors hover:border-accent"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="tech text-[10px] uppercase tracking-[0.2em] text-ink-dim">
                    {room.slug === "live-stage" ? "Hartamas · Performance hall" : room.slug === "kota-damansara" ? "Kota Damansara" : "Hartamas"}
                  </span>
                  {room.slug === "live-stage" && (
                    <span className="tech rounded-[2px] bg-accent px-1.5 py-0.5 text-[8px] font-semibold tracking-[0.14em] text-black">
                      STAGE
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-[1.5rem] leading-tight text-ink transition-colors group-hover:text-accent">
                  {room.name}
                </h3>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-mid">
                  {room.tagline}
                </p>
                {room.sellLine && (
                  <p className="mt-3 border-t border-hairline pt-3 text-[12px] leading-snug text-secondary">
                    {room.sellLine}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <span className="tech text-[12px] text-ink-mid">from RM—/hr</span>
                  <span className="tech text-[10px] uppercase tracking-[0.16em] text-accent">
                    Book →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ 06 THE FOUNDER ════════════════════════════════════════════════ */}
      <section id="founder" className="mx-auto max-w-[1440px] px-4 py-14 sm:py-18 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <FounderPortrait
              hasImage={hasImage}
              src={src}
              name={founder.name}
              role="Founder"
              aspect="aspect-[4/5]"
            />
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <div className="tech text-[11px] uppercase tracking-[0.3em] text-ink-dim">
                06 — The founder
              </div>
              <blockquote className="mt-5 font-display text-[clamp(1.7rem,4.5vw,3.2rem)] leading-[1.02] text-ink">
                &ldquo;When we started, we just wanted a room we could afford to play in.&rdquo;
              </blockquote>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 max-w-[58ch] text-[16px] leading-relaxed text-ink-mid">
                {founder.name} built DrumAsia out of a studio his parents built on the top
                floor of the family house. In 2014 the house ran out of room — and the
                doors opened to the public. One founder, one idea: make the best gear and
                the best support affordable for the Malaysian independent scene.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <div className="mt-8">
                <Link href={local("/founders")} className="btn btn--ghost px-6">
                  Read the full story →
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ THE 3Ps ═══════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[1440px] px-4 pb-14 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              p: "Play",
              body: "A room, a kit, and a stage that's yours when no show is booked.",
            },
            {
              p: "Practice",
              body: "Affordable hours and real gear — no rehearsal-room compromises.",
            },
            {
              p: "Perform",
              body: "The basement venue, sound and lights, and a crew that knows the room.",
            },
          ].map((x, i) => (
            <Reveal key={x.p} delay={i * 80}>
              <div className="panel perforated relative overflow-hidden p-6">
                <h2 className="text-[2.2rem] text-secondary">{x.p}.</h2>
                <p className="mt-2.5 max-w-[34ch] text-[14px] leading-relaxed text-ink-mid">
                  {x.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ 08 OUTRO ══════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-6">
        <Reveal>
          <div className="panel panel--hero perforated relative overflow-hidden p-9 md:p-16">
            <h2 className="font-display text-[clamp(2.4rem,8vw,6rem)] leading-[0.9] text-ink">
              Your band is waiting.
            </h2>
            <p className="tech mt-5 text-[clamp(1.4rem,4vw,2.6rem)] text-ink-mid">
              <a href={call} className="text-accent transition-colors hover:text-ink">
                {business.whatsappDisplay}
              </a>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={book}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--accent px-6"
              >
                {t("bookOnWhatsApp")}
              </a>
              <a href={call} className="btn btn--ghost px-6">
                {t("callTheStudio")}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
