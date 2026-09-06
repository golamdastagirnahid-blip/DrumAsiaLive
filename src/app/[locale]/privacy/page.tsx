import type { Metadata } from "next";
import { LegalShell, LegalSection } from "@/components/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How DrumAsia handles your data under Malaysia's PDPA 2010 — geolocation, analytics and enquiries.",
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="To be reviewed">
      <LegalSection heading="1 · What we collect">
        <p>
          This site is designed to minimise data collection. We collect only what you
          choose to send us — the contents of WhatsApp messages and enquiry forms — plus
          anonymous, cookieless analytics.
        </p>
      </LegalSection>
      <LegalSection heading="2 · Geolocation">
        <p>
          We never request your location automatically. The Load-In page offers an
          optional "use my location" control; if you grant permission, your location is
          used only to estimate travel time to the studio. It is not stored, and it is
          not shared.
        </p>
      </LegalSection>
      <LegalSection heading="3 · Analytics">
        <p>
          Analytics are cookieless and aggregated. We track interactions (for example,
          a WhatsApp click) to understand what's useful — not to identify you.
        </p>
      </LegalSection>
      <LegalSection heading="4 · Your data and PDPA 2010">
        <p>
          Under Malaysia&apos;s Personal Data Protection Act 2010, you may request access to
          or correction of personal data we hold. Contact us on WhatsApp or by email.
          This policy is scaffolding pending legal review.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
