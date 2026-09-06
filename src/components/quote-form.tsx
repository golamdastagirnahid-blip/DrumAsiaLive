"use client";

import { useState } from "react";
import { openWhatsApp } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";

const EVENT_TYPES = ["Wedding", "Prom", "Annual dinner", "School event", "Mall event", "Corporate launch", "Other"];

/**
 * Off-site production quote form → WhatsApp (no payment, no backend).
 */
export function QuoteForm() {
  const [eventType, setEventType] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [headcount, setHeadcount] = useState("");
  const [budget, setBudget] = useState("");
  const [name, setName] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    openWhatsApp({
      intent: "production_quote",
      source: "Live / Production quote form",
      eventType: eventType || "Not specified",
      date: date || "TBC",
      venue: venue || "TBC",
      headcount: headcount || "TBC",
      budget: budget || "TBC",
      name: name || undefined,
    });
    track("enquiry_submit", { source: "production_quote", intent: "production_quote" });
  };

  const field =
    "tech h-11 w-full rounded-[2px] border border-hairline bg-panel px-3 text-[13px] text-ink placeholder:text-ink-dim focus:border-accent focus:outline-none";

  return (
    <form onSubmit={submit} className="panel p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="tech mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-ink-dim">
            Event type
          </span>
          <select value={eventType} onChange={(e) => setEventType(e.target.value)} className={field}>
            <option value="">Select…</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="tech mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-ink-dim">
            Date
          </span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={field} />
        </label>
        <label className="block">
          <span className="tech mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-ink-dim">
            Venue
          </span>
          <input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Where's the event?" className={field} />
        </label>
        <label className="block">
          <span className="tech mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-ink-dim">
            Headcount
          </span>
          <input value={headcount} onChange={(e) => setHeadcount(e.target.value)} placeholder="Roughly how many?" className={field} />
        </label>
        <label className="block sm:col-span-2">
          <span className="tech mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-ink-dim">
            Budget band
          </span>
          <input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Optional — a rough band helps us spec it" className={field} />
        </label>
        <label className="block sm:col-span-2">
          <span className="tech mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-ink-dim">
            Your name
          </span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Optional" className={field} />
        </label>
      </div>
      <button type="submit" className="btn btn--accent mt-6 w-full">
        Send quote request on WhatsApp
      </button>
      <p className="tech mt-3 text-center text-[11px] text-ink-dim">
        No payment here — a quote only. Final pricing on WhatsApp.
      </p>
    </form>
  );
}
