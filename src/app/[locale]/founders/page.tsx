import type { Metadata } from "next";
import { business } from "@/config/business";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { getFounderPortrait } from "@/lib/founder";
import { SectionHeading, Panel, OutroBand, LocalLink } from "@/components/page/primitives";
import { FounderPortrait } from "@/components/founder-portrait";
import { Reveal } from "@/components/reveal";
import { Waveform } from "@/components/waveform";

export const metadata: Metadata = {
  title: "The Founder",
  description:
    "Michael Thomas Philip founded DrumAsia in 2014 — from a home studio his parents built to a live venue in Desa Sri Hartamas.",
};

const founder = business.founder;

const timeline = [
  { year: "2014", text: "The doors open to the public when the home studio is outgrown." },
  { year: "—", text: "The performance hall is added — the venue that becomes DrumAsia Live." },
  { year: "2020–21", text: "Lockdowns. Free live streams and virtual open mics for artists with no stages, plus donation-based artist streams." },
  { year: "Today", text: "Flagship Desa Sri Hartamas studio, three rooms, live stage, and backline for the Malaysian music scene." },
];

const threePs = [
  { p: "Play", b: "Walk in, plug in, make a noise. The rooms are for playing first — not for waiting your turn." },
  { p: "Practice", b: "Affordable hours and real gear, because practice shouldn't cost a fortune to get right." },
  { p: "Perform", b: "A real stage, a real PA, and a crew who want your show to land — from open mic to album launch." },
];

export default async function FoundersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const visit = buildWhatsAppLink({ intent: "general", source: "Founders", subject: "Visit enquiry" });
  const { src, hasImage } = getFounderPortrait();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: founder.name,
    jobTitle: founder.role,
    worksFor: { "@type": "Organization", name: business.brand, foundingDate: String(business.foundedYear) },
    url: `https://drumasia.example/${locale}/founders`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HERO: portrait + name ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-hairline">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(70% 60% at 50% 0%, var(--gel-glow), transparent 62%)",
          }}
        />
        <div className="relative mx-auto grid max-w-[1200px] items-center gap-10 px-4 pb-16 pt-28 sm:px-6 md:pt-36 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="tech mb-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-ink-mid">
                <span className="inline-block h-px w-10 bg-secondary" aria-hidden />
                The founder · EST. 2014
              </p>
              <h1 className="font-display text-[clamp(3rem,9vw,7rem)] leading-[0.9] tracking-[-0.02em] text-ink">
                {founder.name.split(" ")[0]}
                <br />
                <span className="text-accent">{founder.name.split(" ").slice(1).join(" ")}</span>
              </h1>
              <p className="tech mt-5 text-[13px] uppercase tracking-[0.2em] text-secondary">
                {founder.role}
              </p>
              <p className="mt-7 max-w-[54ch] text-[17px] leading-relaxed text-ink-mid md:text-[18px]">
                One person, one room, one idea — that the best equipment and the best
                technical support shouldn&apos;t cost what they usually do. DrumAsia grew out
                of a studio {founder.name.split(" ")[0]}&apos;s parents built on the top floor of the
                family house. In 2014 the house ran out of room, and the doors opened to the public.
              </p>
            </Reveal>
          </div>

          <Reveal className="lg:col-span-5" delay={120}>
            <FounderPortrait
              hasImage={hasImage}
              src={src}
              name={founder.name}
              role="Founder"
              aspect="aspect-[4/5]"
              priority={hasImage}
            />
          </Reveal>
        </div>
      </section>

      {/* ── FACTS STRIP ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {founder.facts.map((fact, i) => (
            <Reveal key={fact} delay={i * 60}>
              <div className="panel flex h-full items-start gap-3 p-5">
                <span className="tech text-[11px] text-accent">0{i + 1}</span>
                <span className="text-[14px] leading-snug text-ink-mid">{fact}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── ORIGIN STORY + 3Ps ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading index="01" title="The origin story" seed={91} />
            <Reveal>
              <div className="space-y-4 text-[16px] leading-relaxed text-ink-mid">
                <p>
                  {founder.name} has been behind a kit since age six — he was already
                  supplying sound and lighting to his school by twelve. Music was never
                  a side project; it was the whole house.
                </p>
                <p>
                  His parents built a studio on the top floor of the family home so he
                  could practise properly. That room — modest, honest, well-built — is
                  the DNA of everything DrumAsia is today.
                </p>
                <p>
                  By 2014 the house was no longer big enough, and the studio opened its
                  doors to the public in Desa Sri Hartamas. Today {founder.name.split(" ")[0]} leads the
                  technician team as head sound engineer, and DrumAsia supports the
                  Malaysian independent scene the way that first room did: properly.
                </p>
              </div>
            </Reveal>
          </div>

          <div>
            <SectionHeading index="02" title="The 3Ps" seed={92} />
            <div className="space-y-4">
              {threePs.map((x, i) => (
                <Reveal key={x.p} delay={i * 80}>
                  <Panel className="p-5">
                    <h3 className="text-[1.5rem] text-secondary">{x.p}.</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-ink-mid">{x.b}</p>
                  </Panel>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE AS WAVEFORM ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
        <SectionHeading index="03" title="The timeline" seed={93} />
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <ol className="relative space-y-0 border-l border-hairline-strong pl-6">
              {timeline.map((t, i) => (
                <li key={i} className="relative pb-8 last:pb-0">
                  <span
                    aria-hidden
                    className="absolute -left-[27px] top-1 block h-2.5 w-2.5 rounded-full border border-accent bg-base"
                    style={{ boxShadow: "0 0 8px var(--gel-glow)" }}
                  />
                  <div className="tech text-[12px] tracking-[0.14em] text-accent">{t.year}</div>
                  <p className="mt-1 max-w-[48ch] text-[15px] leading-relaxed text-ink-mid">{t.text}</p>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={100}>
            <div className="panel perforated flex h-full flex-col justify-center p-6">
              <p className="tech text-[10px] uppercase tracking-[0.24em] text-ink-dim">
                The whole story, one waveform
              </p>
              <Waveform seed={93} className="mt-4 text-accent" height={90} />
              <p className="mt-4 text-[14px] leading-relaxed text-ink-mid">
                Every section of this site is divided by a waveform — because the story
                isn&apos;t a list. It&apos;s a recording.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── COMMUNITY ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
        <SectionHeading index="04" title="For the scene" seed={94} />
        <Reveal>
          <Panel className="p-7">
            <p className="max-w-[70ch] text-[16px] leading-relaxed text-ink-mid">
              During the pandemic lockdowns, DrumAsia ran free live streams and virtual
              open mics for artists who had no stages, plus donation-based artist streams.
              The venue has long been home to Malaysian independent musicians —{" "}
              {business.artists.join(", ")} — and that&apos;s the point of the place: give the
              scene a room that sounds right.
            </p>
          </Panel>
        </Reveal>
      </section>

      {/* ── FOUNDER'S LETTER ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
        <SectionHeading index="05" title="A note from the founder" seed={95} />
        <Reveal>
          <Panel className="panel--hero relative overflow-hidden p-8 md:p-12">
            <p className="tech absolute right-6 top-6 text-[10px] uppercase tracking-[0.24em] text-ink-dim">
              Letter — CMS slot
            </p>
            <div className="max-w-[64ch] space-y-5 text-[17px] leading-relaxed text-ink-mid">
              <p>
                &ldquo;When we started, we just wanted a room we could afford to play in.
                Everything else — the stage, the studio, the backline — came from the same
                question: what would make it easier for a band in KL to actually play?
              </p>
              <p>
                Come in. Bring your band. If you&apos;re stuck on gear or sound, ask — that&apos;s
                what we&apos;re here for.&rdquo;
              </p>
            </div>
            <div className="mt-8 flex items-end justify-between gap-4">
              <span className="font-display text-[2rem] text-accent">{founder.name}</span>
              <span className="nameplate">{founder.name}</span>
            </div>
          </Panel>
        </Reveal>
      </section>

      {/* ── CLOSING ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
        <Reveal>
          <Panel className="panel--hero perforated flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-12">
            <div>
              <h2 className="font-display text-[clamp(1.8rem,5vw,3.4rem)] leading-[0.95] text-ink">
                Come and see the place.
              </h2>
              <p className="mt-2 text-[15px] text-ink-mid">
                The rooms sound better in person than in any photo.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={visit} target="_blank" rel="noopener noreferrer" className="btn btn--accent px-5">
                Say hi on WhatsApp
              </a>
              <LocalLink locale={locale} path="/load-in" className="btn btn--ghost px-5">
                How to get here →
              </LocalLink>
            </div>
          </Panel>
        </Reveal>
      </section>

      <OutroBand
        number={business.whatsappDisplay}
        callHref={`tel:${business.whatsappNumber}`}
        bookHref={visit}
      />
    </>
  );
}
