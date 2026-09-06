import type { Metadata } from "next";
import { LegalShell, LegalSection } from "@/components/legal";

export const metadata: Metadata = {
  title: "Cancellation Policy",
  description: "Cancellation and rescheduling for DrumAsia bookings.",
};

export default function CancellationPage() {
  return (
    <LegalShell title="Cancellation Policy" updated="To be reviewed">
      <LegalSection heading="1 · Nothing is booked until confirmed">
        <p>
          A booking exists only once our team confirms it on WhatsApp. Until then there
          is nothing to cancel.
        </p>
      </LegalSection>
      <LegalSection heading="2 · Cancelling or rescheduling">
        <p>
          To cancel or reschedule, message us on WhatsApp. Cancellation terms and any
          fees are [CLIENT TO CONFIRM] and will be shared at booking time.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
