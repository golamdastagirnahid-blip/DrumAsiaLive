import type { Metadata } from "next";
import { business } from "@/config/business";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { PageHero, SectionHeading, Panel, OutroBand } from "@/components/page/primitives";
import { Rate } from "@/components/rate";
import { Confirm } from "@/components/confirm";

export const metadata: Metadata = {
  title: "Record — Studio, Live, Streaming & Mixing",
  description:
    "Studio recording, live recording, live streaming at both branches, and mixing & mastering. DARS — DrumAsia Recording Studio, Kota Damansara.",
};

const services = [
  {
    id: "studio",
    name: "Studio Recording",
    blurb:
      "DARS — DrumAsia Recording Studio at Kota Damansara is set up to record full bands, solo musicians, vocals and corporate work.",
    tag: "Kota Damansara",
  },
  {
    id: "live",
    name: "Live Recording",
    blurb: "Capture a show or a rehearsal straight off the desk — multi-track, mixed after.",
    tag: "Both branches",
  },
  {
    id: "streaming",
    name: "Live Streaming",
    blurb: "Multi-camera live streaming, available at both branches.",
    tag: "Both branches",
  },
  {
    id: "mixing",
    name: "Mixing & Mastering",
    blurb: "From a raw multi-track to a finished master.",
    tag: "On request",
  },
];

export default async function RecordPage() {
  const ask = (name: string) =>
    buildWhatsAppLink({
      intent: "recording",
      source: "Record",
      service: name,
    });

  return (
    <>
      <PageHero
        eyebrow="Record · DARS & more"
        title={
          <>
            Get it <span className="text-accent">down.</span>
          </>
        }
        lede="Studio recording, live recording, live streaming at both branches, and mixing & mastering. Tell us what you're making and we'll set it up."
        actions={
          <a
            href={ask("Recording enquiry")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--accent px-5"
          >
            Ask about recording
          </a>
        }
      />

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <SectionHeading index="01" title="Services" seed={31} />
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((s) => (
            <Panel key={s.id} className="flex flex-col p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-[1.4rem] text-ink">{s.name}</h3>
                <span className="tech rounded-[2px] border border-hairline px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] text-ink-mid">
                  {s.tag}
                </span>
              </div>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-mid">{s.blurb}</p>
              <div className="mt-5 flex items-center justify-between border-t border-hairline pt-4">
                <Rate amount={null} unit="session" className="text-[13px] text-ink-mid" />
                <a
                  href={ask(s.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tech text-[11px] uppercase tracking-[0.16em] text-accent transition-colors hover:text-ink"
                >
                  Ask →
                </a>
              </div>
            </Panel>
          ))}
        </div>

        {/* BYOSE */}
        <div className="mt-6">
          <Panel className="border-secondary/50 p-6">
            <h3 className="text-[1.3rem] text-ink">
              BYOSE{" "}
              <span className="tech text-[11px] uppercase tracking-[0.2em] text-ink-dim">
                · live audio recording offer
              </span>
            </h3>
            <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-ink-mid">
              A live-audio recording offer promoted as exclusive to Kota Damansara.{" "}
              <Confirm note="What BYOSE currently includes is unconfirmed">
                What it currently includes is being confirmed
              </Confirm>{" "}
              — ask on WhatsApp.
            </p>
            <a href={ask("BYOSE")} target="_blank" rel="noopener noreferrer" className="btn btn--ghost mt-4 px-5">
              Ask about BYOSE
            </a>
          </Panel>
        </div>
      </section>

      <OutroBand
        number={business.whatsappDisplay}
        callHref={`tel:${business.whatsappNumber}`}
        bookHref={ask("Recording outro")}
      />
    </>
  );
}
