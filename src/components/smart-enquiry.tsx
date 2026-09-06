"use client";

import { useState } from "react";
import { buildWhatsAppLink, openWhatsApp, type WhatsAppPayload } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { business } from "@/config/business";

/**
 * Smart enquiry router (MILESTONE 8 /contact) — each topic produces a
 * differently structured WhatsApp message via lib/whatsapp.ts.
 */
const TOPICS: { id: string; label: string; hint: string }[] = [
  { id: "jam", label: "Jam booking", hint: "Room + date + time" },
  { id: "rental", label: "Rental", hint: "Backline / PA / gear" },
  { id: "venue", label: "Venue hire", hint: "Gigs & private events" },
  { id: "production", label: "Production", hint: "Off-site sound & light" },
  { id: "recording", label: "Recording", hint: "Studio / live / streaming" },
  { id: "store", label: "Store", hint: "Buy an item" },
  { id: "sell", label: "Sell my gear", hint: "Buy / sell / rent" },
  { id: "mep", label: "MEP", hint: "Music Experience Program" },
  { id: "media", label: "Media", hint: "Press & partnerships" },
  { id: "other", label: "Other", hint: "Anything else" },
];

export function SmartEnquiry() {
  const [topic, setTopic] = useState<string>("jam");
  const [name, setName] = useState("");

  const payload: WhatsAppPayload = (() => {
    const base = { source: `Contact / ${topic}`, name: name || undefined };
    switch (topic) {
      case "jam":
        return { intent: "room_booking", ...base };
      case "rental":
        return { intent: "general", subject: "Rental enquiry", ...base };
      case "venue":
        return { intent: "venue_hire", ...base };
      case "production":
        return { intent: "production_quote", ...base };
      case "recording":
        return { intent: "recording", ...base };
      case "store":
        return { intent: "store_item", ...base };
      case "sell":
        return { intent: "sell_gear", ...base };
      case "mep":
        return { intent: "mep_enquiry", ...base };
      case "media":
        return { intent: "general", subject: "Media enquiry", ...base };
      default:
        return { intent: "general", ...base };
    }
  })();

  // Deterministic href (no random ref) so SSR and client render identically.
  const url = buildWhatsAppLink(payload);

  const open = () => {
    openWhatsApp(payload); // stamps a fresh reference code at click time
    track("wa_click", { source: "Contact router", intent: topic });
  };

  return (
    <div className="panel p-6">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {TOPICS.map((tp) => (
          <button
            key={tp.id}
            type="button"
            onClick={() => setTopic(tp.id)}
            aria-pressed={topic === tp.id}
            className={`flex flex-col items-start gap-0.5 rounded-[6px] border p-3 text-left transition-colors ${
              topic === tp.id
                ? "border-accent bg-panel-2"
                : "border-hairline hover:border-hairline-strong"
            }`}
          >
            <span className={`text-[14px] font-semibold ${topic === tp.id ? "text-accent" : "text-ink"}`}>
              {tp.label}
            </span>
            <span className="tech text-[10px] uppercase tracking-[0.12em] text-ink-dim">{tp.hint}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="tech mb-1 block text-[10px] uppercase tracking-[0.2em] text-ink-dim">
            Your name (optional)
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="So we know who's messaging"
            className="tech h-11 w-full rounded-[2px] border border-hairline bg-panel px-3 text-[13px] text-ink placeholder:text-ink-dim focus:border-accent focus:outline-none"
          />
        </label>
        <div className="flex items-end">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              open();
            }}
            className="btn btn--accent h-11 w-full whitespace-nowrap sm:w-auto"
          >
            Open WhatsApp →
          </a>
        </div>
      </div>
      <p className="tech mt-3 text-[11px] text-ink-dim">
        Or skip the form entirely — message{" "}
        <a
          href={buildWhatsAppLink({ intent: "general", source: "Contact escape hatch" })}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-2"
        >
          {business.whatsappDisplay}
        </a>{" "}
        directly.
      </p>
    </div>
  );
}
