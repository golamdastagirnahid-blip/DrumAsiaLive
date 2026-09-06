"use client";

import type { ReactNode } from "react";
import { buildWhatsAppLink, type WhatsAppPayload } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * WaLink — a WhatsApp CTA anchor. Builds the URL via the single lib/whatsapp.ts
 * utility (R2) and fires the `wa_click` analytics event.
 */
export function WaLink({
  payload,
  className,
  children,
  onBeforeOpen,
}: {
  payload: WhatsAppPayload;
  className?: string;
  children: ReactNode;
  onBeforeOpen?: () => void;
}) {
  const href = buildWhatsAppLink(payload);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        onBeforeOpen?.();
        track("wa_click", { source: payload.source, intent: payload.intent });
      }}
    >
      {children}
    </a>
  );
}

/** A muted mono "confirm on WhatsApp" line that accompanies every price. */
export function ConfirmLine({ className }: { className?: string }) {
  return (
    <span className={cn("tech text-[11px] text-ink-dim", className)}>
      Confirm final pricing on WhatsApp.
    </span>
  );
}
