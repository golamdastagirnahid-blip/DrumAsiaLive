import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, LegalSection } from "@/components/legal";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for the DrumAsia website.",
};

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <LegalShell title="Terms of Use" updated="To be reviewed">
      <LegalSection heading="1 · The website">
        <p>
          This website is operated by DrumAsia. It provides information about our
          jamming studios, recording studio, live venue, backline rental and retail.
          It does not take payment of any kind — every commercial conversation is
          completed on WhatsApp.
        </p>
      </LegalSection>
      <LegalSection heading="2 · Prices">
        <p>
          All prices shown are for information only and are always accompanied by
          "Confirm final pricing on WhatsApp." No price on this site is a binding offer.
        </p>
      </LegalSection>
      <LegalSection heading="3 · Booking">
        <p>
          Nothing is booked until our team confirms it on WhatsApp. Enquiry forms on
          this site prepare a message — they do not create a reservation.
        </p>
      </LegalSection>
      <LegalSection heading="4 · Rental terms">
        <p>
          Equipment and room rental is governed by the{" "}
          <Link href={`/${locale}/terms/rental`} className="text-accent underline underline-offset-2">
            rental terms
          </Link>
          .
        </p>
      </LegalSection>
    </LegalShell>
  );
}
