"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Phone, MessageCircle, CalendarDays } from "lucide-react";
import { business, getBranch } from "@/config/business";
import { isOpenNow, nextTransition, formatCountdown } from "@/lib/hours";
import { subscribeLoop } from "@/lib/time-loop";
import { slateStamp, plainKLTime } from "@/lib/time";
import { useTime } from "@/components/providers/time-provider";
import { useSound } from "@/components/providers/sound-provider";
import { getAnnouncements } from "@/lib/announcements";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { BookButton } from "@/components/book-button";
import { JammingSoundController } from "@/components/jamming-sound-controller";
import { LocalizedLink } from "@/components/nav/nav-bits";
import { cn } from "@/lib/utils";

/**
 * <TransportBar> — the persistent transport section of a mixing console
 * (SECTION 2.1). Fixed to the bottom of every page; hides on scroll-down,
 * returns on scroll-up (120ms ease); respects env(safe-area-inset-bottom).
 */
export function TransportBar() {
  const t = useTranslations("transport");
  const locale = useLocale();
  const { now } = useTime();
  const { muted, toggleMuted } = useSound();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  const branch = getBranch("hartamas");
  const open = now ? isOpenNow(branch, now) : false;
  const next = now ? nextTransition(branch, now) : null;

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (Math.abs(delta) < 4) return;
      if (delta > 0) {
        // Scrolling down -> bottom bar appears / shows
        setHidden(false);
      } else if (delta < 0 && y > 80) {
        // Scrolling up -> bottom bar hides
        setHidden(true);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bookPayload = { intent: "general" as const, source: "TransportBar" };
  const callUrl = `tel:${business.whatsappNumber}`;

  return (
    <div
      className={cn(
        "transport fixed inset-x-0 bottom-0 z-[70] transition-transform duration-[120ms] ease-out",
        hidden && "translate-y-full",
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-4 px-4 sm:px-6 md:gap-6">
        {/* ── Desktop transport cluster ─────────────────────────────────── */}
        <div className="hidden flex-1 items-center gap-5 md:flex">
          <RecLamp />
          <SegDivider />
          <Timecode />
          <SegDivider />
          <SlateDate />
          <SegDivider />
          <StatusLamp open={open} next={next} />
        </div>

        {/* ── Mobile cluster: timecode · status · four icon keys ────────── */}
        <div className="flex flex-1 items-center gap-3 md:hidden">
          <Timecode compact />
          <StatusLamp open={open} next={next} compact />
        </div>

        {/* ── Shared right side ──────────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 md:gap-3">
          {/* Live Jamming Room Sound Console */}
          <div className="hidden sm:block">
            <JammingSoundController compact />
          </div>

          {/* Master mute */}
          <button
            type="button"
            onClick={toggleMuted}
            aria-label={muted ? t("unmute") : t("masterMute")}
            aria-pressed={!muted}
            title={muted ? t("unmute") : t("masterMute")}
            className={cn(
              "flex h-11 flex-col items-center justify-center rounded-[4px] px-2 md:h-10 md:flex-row md:gap-2 md:border md:border-hairline md:px-3",
              !muted && "text-accent",
            )}
          >
            <span className="tech text-[9px] tracking-[0.2em] text-ink-dim">MUTE</span>
            <span
              className={cn("lamp", muted ? "lamp--off" : "lamp--warn")}
              aria-hidden
            />
          </button>

          {/* Mobile icon keys */}
          <a
            href={callUrl}
            aria-label="Call the studio"
            className="grid h-11 w-11 place-items-center rounded-[4px] text-ink transition-colors hover:text-accent md:hidden"
          >
            <Phone className="h-5 w-5" aria-hidden />
          </a>
          <a
            href={buildWhatsAppLink({ intent: "general", source: "TransportBar mobile" })}
            aria-label="WhatsApp"
            className="grid h-11 w-11 place-items-center rounded-[4px] text-ink transition-colors hover:text-accent md:hidden"
          >
            <MessageCircle className="h-5 w-5" aria-hidden />
          </a>
          <LocalizedLink
            href="/load-in"
            aria-label="Load-In — getting here"
            className="grid h-11 w-11 place-items-center rounded-[4px] text-ink transition-colors hover:text-accent md:hidden"
          >
            <CalendarDays className="h-5 w-5" aria-hidden />
          </LocalizedLink>

          {/* Book on WhatsApp — the single amber action */}
          <BookButton
            payload={bookPayload}
            label={t("bookAria")}
            className="h-10 px-3 md:px-4"
          >
            <span className="hidden sm:inline">{t("bookAria")}</span>
            <span className="sm:hidden">Book</span>
          </BookButton>
        </div>
      </div>
      <div className="pb-safe" />
    </div>
  );
}

/* Engraved segment divider between transport modules. */
function SegDivider() {
  return (
    <span
      aria-hidden
      className="h-6 w-px self-center"
      style={{
        background: "linear-gradient(180deg, transparent, var(--gel-hairline-strong), transparent)",
        boxShadow: "1px 0 0 rgba(0,0,0,0.4)",
      }}
    />
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * REC lamp — deep red, pulses ONLY when an event is live in the building.
 * ──────────────────────────────────────────────────────────────────────────── */
function RecLamp() {
  const t = useTranslations("transport");
  const [live] = useState(() => getAnnouncements().some((a) => a.live));
  return (
    <div className="flex items-center gap-2" aria-label="Recording status">
      <span
        aria-hidden
        className={cn("lamp", live ? "lamp--live pulse" : "lamp--off")}
      />
      <span className="transport__label">{t("recLabel")}</span>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * TIMECODE — KL time in broadcast timecode HH:MM:SS:FF, frames at 25fps.
 * Visual readout is aria-hidden; plain-language time is exposed to AT.
 * ──────────────────────────────────────────────────────────────────────────── */
function Timecode({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("transport");
  const { now } = useTime();
  const frameRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    return subscribeLoop(() => {
      const ff = Math.floor((Date.now() % 1000) / 40) % 25;
      if (frameRef.current) {
        frameRef.current.textContent = String(ff).padStart(2, "0");
      }
    });
  }, []);

  const hh = now ? String(now.getHours()).padStart(2, "0") : "--";
  const mm = now ? String(now.getMinutes()).padStart(2, "0") : "--";
  const ss = now ? String(now.getSeconds()).padStart(2, "0") : "--";

  return (
    <div className="flex items-center gap-2">
      <span className="transport__label hidden lg:inline">Timecode</span>
      {/* plain-language time for assistive tech */}
      <span className="sr-only">
        {t("timeAria")}: {now ? plainKLTime(now) : ""}
      </span>
      <span
        aria-hidden
        className={cn("tech tabular-nums text-ink", compact ? "text-[13px]" : "text-[15px]")}
      >
        {hh}:{mm}:{ss}
        <span className="text-accent">:</span>
        <span ref={frameRef} className="text-ink-mid">
          --
        </span>
      </span>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * SLATE DATE — "SAT 06 SEP 26" in engraved mono.
 * ──────────────────────────────────────────────────────────────────────────── */
function SlateDate() {
  const { now } = useTime();
  return (
    <div className="hidden items-center gap-2 xl:flex">
      <span className="transport__label">Slate</span>
      <span aria-hidden className="tech engraved text-[13px] tracking-[0.1em] text-ink">
        {now ? slateStamp(now) : "-- --- --"}
      </span>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * STATUS LAMP — OPEN (breathing green) or CLOSED (dim), plus mono countdown.
 * ──────────────────────────────────────────────────────────────────────────── */
function StatusLamp({
  open,
  next,
  compact = false,
}: {
  open: boolean;
  next: ReturnType<typeof nextTransition>;
  compact?: boolean;
}) {
  const t = useTranslations("transport");
  const countdown = (() => {
    if (!next) return "--:--";
    const delta = next.at.getTime() - Date.now();
    if (open) return formatCountdown(delta);
    const sameDay = next.at.toDateString() === new Date().toDateString();
    if (!sameDay) return "--:--";
    const hh = String(next.at.getHours()).padStart(2, "0");
    const mm = String(next.at.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  })();

  return (
    <div className="flex items-center gap-2">
      <span aria-hidden className={cn("lamp", open ? "lamp--open breathe" : "lamp--off")} />
      <span
        className={cn(
          "tech text-[11px] font-semibold tracking-[0.14em]",
          open ? "text-open" : "text-ink-dim",
        )}
      >
        {open ? t("statusOpen") : t("statusClosed")}
      </span>
      <span className="sr-only">
        {open
          ? `${t("closesIn")} ${countdown}`
          : `${t("opensAt")} ${countdown}`}
      </span>
      {!compact && (
        <span aria-hidden className="tech text-[11px] text-ink-mid">
          {open ? `${t("closesIn")} ${countdown}` : `${t("opensAt")} ${countdown}`}
        </span>
      )}
    </div>
  );
}
