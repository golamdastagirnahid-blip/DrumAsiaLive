"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { faqSections } from "@/config/faq";

/**
 * FAQ — searchable accordion (MILESTONE 8), grouped by section.
 */
export function FaqAccordion() {
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const q = query.trim().toLowerCase();
  const sections = faqSections
    .map((s) => ({
      ...s,
      items: s.items.filter(
        (i) => !q || i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q),
      ),
    }))
    .filter((s) => s.items.length > 0);

  const toggle = (key: string) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div>
      <label className="mb-6 block">
        <span className="tech mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-ink-dim">
          Search the FAQ
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. how do I book a room?"
          className="tech h-12 w-full rounded-[2px] border border-hairline bg-panel px-3 text-[14px] text-ink placeholder:text-ink-dim focus:border-accent focus:outline-none"
        />
      </label>

      {sections.length === 0 && (
        <p className="text-[15px] text-ink-mid">
          Nothing matches “{query}”.{" "}
          <a
            href={`/${locale}/contact`}
            className="text-accent underline underline-offset-2"
          >
            Ask us on WhatsApp instead →
          </a>
        </p>
      )}

      {sections.map((section) => (
        <div key={section.id} className="mb-10">
          <h3 className="tech mb-3 text-[12px] uppercase tracking-[0.24em] text-accent">
            {section.title}
          </h3>
          <div className="divide-y divide-hairline border-y border-hairline">
            {section.items.map((item) => {
              const key = `${section.id}:${item.q}`;
              const isOpen = open[key];
              return (
                <div key={key}>
                  <button
                    type="button"
                    onClick={() => toggle(key)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left"
                  >
                    <span className="text-[15px] font-medium text-ink">{item.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-ink-dim transition-transform ${isOpen ? "rotate-180 text-accent" : ""}`}
                      aria-hidden
                    />
                  </button>
                  {isOpen && (
                    <p className="max-w-[62ch] pb-4 text-[15px] leading-relaxed text-ink-mid">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
