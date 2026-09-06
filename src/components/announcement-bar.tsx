"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getAnnouncements } from "@/lib/announcements";
import { LocalizedLink } from "@/components/nav/nav-bits";

/**
 * <AnnouncementBar> — CMS-driven, dismissible, remembered (MILESTONE 1).
 * Renders nothing when there is no announcement.
 */
export function AnnouncementBar() {
  const [announcement] = useState(() => getAnnouncements()[0]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!announcement) return;
    const key = `da-announce-${announcement.id}`;
    if (window.localStorage.getItem(key) === "1") setDismissed(true);
  }, [announcement]);

  if (!announcement || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(`da-announce-${announcement.id}`, "1");
    } catch {
      /* noop */
    }
  };

  return (
    <div className="relative z-[85] bg-accent text-black">
      <div className="mx-auto flex max-w-[1440px] items-center justify-center gap-4 px-10 py-2 text-center">
        <p className="tech text-[12px] font-medium tracking-wide">
          {announcement.text}
          {announcement.ctaHref && announcement.ctaLabel && (
            <LocalizedLink
              href={announcement.ctaHref}
              className="ml-2 underline underline-offset-2"
            >
              {announcement.ctaLabel}
            </LocalizedLink>
          )}
        </p>
      </div>
      {announcement.dismissible !== false && (
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
