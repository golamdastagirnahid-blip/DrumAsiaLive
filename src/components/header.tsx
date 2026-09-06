"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { GelSelector } from "@/components/gel-selector";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { NavDesktop } from "@/components/nav/nav-desktop";
import { NavMobile } from "@/components/nav/nav-mobile";
import { getNavItems } from "@/components/nav/nav-data";
import { BookButton } from "@/components/book-button";
import { LocalizedLink } from "@/components/nav/nav-bits";
import { JammingSoundController } from "@/components/jamming-sound-controller";

/**
 * Header — 68px. Transparent over the hero, then on 90px of scroll becomes
 * `backdrop-filter: blur(18px)` with a brass hairline underline (MILESTONE 1).
 */
export function Header() {
  const t = useTranslations("common");
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 90);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const bookPayload = {
    intent: "general" as const,
    source: "Header",
    subject: "Booking enquiry",
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[80] transition-[background-color,border-color,backdrop-filter,box-shadow] duration-500",
        scrolled
          ? "border-b border-secondary/60 bg-base/85 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] backdrop-blur-[18px]"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
        {/* Left: logo (client-side Link to prevent page reloads) */}
        <LocalizedLink href="/" aria-label="DrumAsia — home" className="shrink-0 text-ink">
          <Logo />
        </LocalizedLink>

        {/* Centre: recursive nav (desktop) */}
        <div className="flex flex-1 items-center justify-center">
          <NavDesktop items={getNavItems()} />
        </div>

        {/* Right: jamming sound, gel selector, language, book */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <JammingSoundController compact />
          <GelSelector />
          <LocaleSwitcher />
          <BookButton
            payload={bookPayload}
            label={t("book")}
            className="hidden xl:inline-flex"
          />
          <NavMobile items={getNavItems()} />
        </div>
      </div>
    </header>
  );
}
