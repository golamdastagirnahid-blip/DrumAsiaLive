"use client";

import { useTranslations } from "next-intl";
import { MapPin, Phone, MessageCircle, Instagram, Facebook } from "lucide-react";
import { branches, business } from "@/config/business";
import { getNavItems } from "@/components/nav/nav-data";
import { LocalizedLink } from "@/components/nav/nav-bits";
import { Logo } from "@/components/logo";
import { Confirm } from "@/components/confirm";
import { buildWhatsAppLink, openWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/**
 * Footer — a patchbay: columns of links drawn as jack sockets that illuminate
 * on hover (MILESTONE 1). Branch cards, socials, newsletter, the 3Ps in brass,
 * EST. 2014, legal links, auto-updating copyright.
 */
export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();
  const columns = getNavItems().filter((n) => n.showInFooter !== false);

  return (
    <footer className="panel--hero relative mt-24 overflow-hidden border-t border-hairline">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6">
        {/* Top: patchbay columns */}
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo className="text-ink" />
            <p className="mt-4 max-w-[38ch] text-[15px] leading-relaxed text-ink-mid">
              {t("tagline")}
            </p>
            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-[14px] font-medium text-ink">{t("newsletterTitle")}</p>
              <NewsletterForm />
            </div>
            {/* Socials */}
            <div className="mt-6 flex items-center gap-2">
              {[
                { href: business.social.instagramLive.url, label: business.social.instagramLive.handle, Icon: Instagram },
                { href: business.social.instagramStudio.url, label: business.social.instagramStudio.handle, Icon: Instagram },
                { href: business.social.facebook.url, label: business.social.facebook.handle, Icon: Facebook },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-hairline text-ink-mid transition-colors hover:border-accent hover:text-accent"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {/* Patchbay link columns */}
          <div className="md:col-span-8">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
              {columns.slice(0, 6).map((col) => (
                <PatchbayColumn key={col.id} title={col.label} href={col.href} items={col.children} />
              ))}
            </div>
          </div>
        </div>

        {/* Branch cards */}
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {branches.map((b) => (
            <div key={b.id} className="panel relative overflow-hidden p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[16px] tracking-wide text-ink">{b.name}</h3>
                  <p className="tech mt-2 text-[12px] leading-relaxed text-ink-mid">
                    {b.address ?? (
                      <Confirm note="Full street address pending">Full address — confirm on WhatsApp</Confirm>
                    )}
                  </p>
                  {b.venueNote && (
                    <p className="mt-2 text-[12px] italic text-ink-dim">{b.venueNote}</p>
                  )}
                  {b.hoursNote && (
                    <p className="tech mt-2 text-[10px] text-ink-dim">{b.hoursNote}</p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {b.phones.bookings && (
                  <a
                    href={`tel:${b.phones.bookings.value}`}
                    className="tech flex items-center gap-1.5 rounded-[2px] border border-hairline px-2.5 py-1.5 text-[11px] text-ink transition-colors hover:border-accent hover:text-accent"
                  >
                    <Phone className="h-3.5 w-3.5" aria-hidden />
                    {b.phones.bookings.value.replace("+60", "0")}
                  </a>
                )}
                <a
                  href={buildWhatsAppLink({ intent: "general", source: `Footer — ${b.shortName}` })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tech flex items-center gap-1.5 rounded-[2px] border border-hairline px-2.5 py-1.5 text-[11px] text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                  WhatsApp
                </a>
                {b.geo && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.address ?? b.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tech flex items-center gap-1.5 rounded-[2px] border border-hairline px-2.5 py-1.5 text-[11px] text-ink transition-colors hover:border-accent hover:text-accent"
                  >
                    <MapPin className="h-3.5 w-3.5" aria-hidden />
                    {t("getDirections")}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 3Ps + legal */}
        <div className="mt-16 flex flex-col gap-8 border-t border-hairline pt-10 md:flex-row md:items-end md:justify-between">
          <div aria-hidden className="font-display text-[clamp(2rem,6vw,4.5rem)] leading-[0.9] tracking-tight text-secondary">
            {business.threePs.play}. <span className="text-ink">{business.threePs.practice}.</span>{" "}
            {business.threePs.perform}.
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <div className="tech text-[11px] uppercase tracking-[0.2em] text-ink-dim">
              {t("established")}
            </div>
            <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end">
              {["/terms", "/privacy", "/cancellation", "/cookies"].map((href) => (
                <LocalizedLink
                  key={href}
                  href={href}
                  className="tech text-[11px] uppercase tracking-[0.12em] text-ink-mid transition-colors hover:text-accent"
                >
                  {href.slice(1)}
                </LocalizedLink>
              ))}
            </nav>
            <p className="tech text-[11px] text-ink-dim">
              © {year} {business.brand}. {t("rights")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function PatchbayColumn({
  title,
  href,
  items,
}: {
  title: string;
  href?: string | null;
  items?: import("@/config/nav").NavNodeItem[];
}) {
  return (
    <div>
      <h4 className="tech text-[11px] uppercase tracking-[0.2em] text-ink-dim">{title}</h4>
      <ul className="mt-4 space-y-1">
        {(items ?? []).map((item) => (
          <li key={item.id}>
            <LocalizedLink
              href={item.href ?? href ?? "/"}
              className="group flex items-center gap-2 py-1 text-[14px] text-ink-mid transition-colors hover:text-ink"
            >
              {/* jack socket that illuminates on hover */}
              <span
                aria-hidden
                className={cn(
                  "block h-[7px] w-[7px] rounded-full border border-hairline-strong transition-all",
                  "group-hover:border-accent group-hover:bg-accent group-hover:shadow-[0_0_6px_var(--gel-glow)]",
                )}
              />
              {item.label}
            </LocalizedLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NewsletterForm() {
  const t = useTranslations("footer");
  return (
    <form
      className="mt-2 flex max-w-sm gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem("email") as HTMLInputElement | null;
        openWhatsApp({
          intent: "general",
          source: "Footer newsletter",
          subject: "Newsletter sign-up",
          message: input?.value ? `Please add me to the list: ${input.value}` : "Please add me to the list",
        });
      }}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        placeholder="you@band.com"
        className="tech h-11 w-full rounded-[2px] border border-hairline bg-panel px-3 text-[13px] text-ink placeholder:text-ink-dim focus:border-accent focus:outline-none"
      />
      <button type="submit" className="btn btn--ghost h-11 whitespace-nowrap">
        {t("newsletterCta")}
      </button>
    </form>
  );
}
