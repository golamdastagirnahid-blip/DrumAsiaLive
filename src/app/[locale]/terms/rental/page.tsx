import type { Metadata } from "next";
import { standardClauses, categorySpecific } from "@/config/terms";
import { LegalShell, LegalSection } from "@/components/legal";

export const metadata: Metadata = {
  title: "Rental Terms & Conditions",
  description:
    "Rental terms and conditions for DrumAsia equipment, rooms and production — eligibility, deposits, damage, insurance and more.",
};

export default function RentalTermsPage() {
  return (
    <LegalShell title="Rental Terms & Conditions" updated="To be reviewed">
      <p className="text-[15px] leading-relaxed text-ink-mid">
        Every category uses the same fourteen headings; only the values change. All
        figures are placeholders until the client supplies them — none of this is
        binding, and it must be reviewed by a Malaysian lawyer before launch.
      </p>

      {standardClauses.map((c, i) => (
        <LegalSection key={c.heading} heading={`${i + 1} · ${c.heading}`}>
          {c.body.map((b, j) => (
            <p key={j}>{b}</p>
          ))}
        </LegalSection>
      ))}

      <section>
        <h2 className="text-[1.3rem] text-ink">Category-specific clauses</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {categorySpecific.map((c) => (
            <div key={c.category} className="panel p-5">
              <h3 className="text-[1.05rem] text-accent">{c.category}</h3>
              <ul className="mt-2 space-y-1.5">
                {c.items.map((it) => (
                  <li key={it} className="text-[14px] leading-relaxed text-ink-mid">
                    · {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </LegalShell>
  );
}
