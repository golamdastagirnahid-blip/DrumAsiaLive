"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";

/**
 * EN / BM language switch — locale-prefixed routes via next-intl.
 * Malay copy is machine-drafted and flagged for human review before launch
 * (see /docs/OPEN-QUESTIONS.md).
 */
export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  const other = locale === "en" ? "ms" : "en";

  return (
    <button
      type="button"
      onClick={() => {
        // @ts-expect-error — next-intl router.push accepts a locale override
        router.replace({ pathname, params }, { locale: other });
      }}
      aria-label={`Switch language to ${other === "ms" ? "Bahasa Malaysia" : "English"}`}
      className="tech text-[11px] font-medium tracking-[0.18em] uppercase text-ink-mid transition-colors hover:text-accent"
    >
      {other === "ms" ? "BM" : "EN"}
    </button>
  );
}
