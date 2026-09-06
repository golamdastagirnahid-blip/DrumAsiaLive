"use client";

import type { ReactNode } from "react";
import { buildWhatsAppLink, openWhatsApp, type WhatsAppPayload } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * <BookButton> — the site's primary WhatsApp CTA (R2).
 *
 * Renders a deterministic href (correct even with JavaScript disabled), and on
 * click stamps a fresh reference code + fires `wa_click`, then opens WhatsApp
 * via the single lib/whatsapp.ts utility. No duplicated message-building logic.
 */
export function BookButton({
  payload,
  className,
  children,
  label,
}: {
  payload: WhatsAppPayload;
  className?: string;
  children?: ReactNode;
  label?: string;
}) {
  const href = buildWhatsAppLink(payload); // deterministic — safe for SSR

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn("btn btn--accent", className)}
      onClick={(e) => {
        e.preventDefault();
        openWhatsApp(payload); // fresh reference code at click time
        track("wa_click", { source: payload.source, intent: payload.intent });
      }}
    >
      {children ?? label}
    </a>
  );
}
