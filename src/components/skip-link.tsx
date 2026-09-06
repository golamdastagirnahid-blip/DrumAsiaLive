"use client";

import { useTranslations } from "next-intl";

export function SkipLink() {
  const t = useTranslations("common");
  return (
    <a
      href="#main"
      className="tech fixed left-4 top-4 z-[100] -translate-y-24 rounded-[2px] border border-accent bg-base px-4 py-2 text-xs uppercase tracking-wider text-ink transition-transform focus:translate-y-0"
    >
      {t("skipToContent")}
    </a>
  );
}
