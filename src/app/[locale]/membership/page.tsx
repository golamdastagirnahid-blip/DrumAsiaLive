import type { Metadata } from "next";
import { business } from "@/config/business";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { PageHero, SectionHeading, Panel, OutroBand } from "@/components/page/primitives";
import { Confirm } from "@/components/confirm";

export const metadata: Metadata = {
  title: "Lifetime Membership",
  description:
    "DrumAsia Lifetime Membership — no registration fees. Price and benefits confirmed on WhatsApp.",
};

export default async function MembershipPage() {
  const signup = buildWhatsAppLink({
    intent: "membership",
    source: "Membership",
  });

  return (
    <>
      <PageHero
        eyebrow="Membership · Lifetime"
        title={
          <>
            For life. <span className="text-accent">No registration fees.</span>
          </>
        }
        lede="The DrumAsia Lifetime Membership — advertised with no registration fees. Price and the full benefit list are confirmed on WhatsApp."
        actions={
          <a href={signup} target="_blank" rel="noopener noreferrer" className="btn btn--accent px-5">
            Sign up on WhatsApp
          </a>
        }
      />

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <SectionHeading
          index="01"
          title="Member vs non-member"
          seed={71}
          lede="The comparison below is being finalised with the client. Every figure is illustrative until confirmed."
        />
        <Panel className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-hairline">
                <th className="tech px-5 py-4 text-[11px] uppercase tracking-[0.16em] text-ink-dim">
                  Benefit
                </th>
                <th className="tech px-5 py-4 text-[11px] uppercase tracking-[0.16em] text-accent">
                  Member
                </th>
                <th className="tech px-5 py-4 text-[11px] uppercase tracking-[0.16em] text-ink-dim">
                  Non-member
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {[
                ["Registration fee", "None", "—"],
                ["Room rates", <Confirm key="r">To confirm</Confirm>, "Standard"],
                ["Priority booking", <Confirm key="p">To confirm</Confirm>, "—"],
                ["Other benefits", <Confirm key="o">To confirm</Confirm>, "—"],
              ].map(([label, m, nm]) => (
                <tr key={label as string}>
                  <td className="px-5 py-3.5 text-[15px] text-ink">{label as string}</td>
                  <td className="px-5 py-3.5 text-[15px] text-accent">{m}</td>
                  <td className="px-5 py-3.5 text-[15px] text-ink-mid">{nm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
        <p className="tech mt-4 text-[12px] text-ink-dim">
          No payment on this site. Membership is arranged on WhatsApp — {business.whatsappDisplay}.
        </p>
      </section>

      <OutroBand
        number={business.whatsappDisplay}
        callHref={`tel:${business.whatsappNumber}`}
        bookHref={signup}
      />
    </>
  );
}
