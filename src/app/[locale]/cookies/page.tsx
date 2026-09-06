import type { Metadata } from "next";
import { LegalShell, LegalSection } from "@/components/legal";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How DrumAsia uses cookies (as few as possible).",
};

export default function CookiesPage() {
  return (
    <LegalShell title="Cookie Policy" updated="To be reviewed">
      <LegalSection heading="1 · Cookies">
        <p>
          This site uses as few cookies as possible. We use a small amount of local
          storage to remember your preferences (theme, arrival mode, dismissed notices)
          and to keep a half-built enquiry in progress. No advertising or cross-site
          tracking cookies are used.
        </p>
      </LegalSection>
      <LegalSection heading="2 · Clearing them">
        <p>
          You can clear site data from your browser settings at any time. The site works
          fully without it — you&apos;ll simply be asked for your preferences again.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
