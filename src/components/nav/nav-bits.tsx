"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import type { ComponentType, ReactNode } from "react";
import {
  Cable,
  DoorOpen,
  Drum,
  Mic,
  Radio,
  School,
  SlidersHorizontal,
  Tag,
  type LucideProps,
} from "lucide-react";
import type { NavNodeItem } from "@/config/nav";
import { cn } from "@/lib/utils";

const ICONS: Record<string, ComponentType<LucideProps>> = {
  door: DoorOpen,
  cable: Cable,
  mic: Mic,
  radio: Radio,
  drumstick: Drum,
  school: School,
  tag: Tag,
  sliders: SlidersHorizontal,
};

export function NavIcon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null;
  const Icon = ICONS[name] ?? Cable;
  return <Icon className={cn("h-4 w-4", className)} aria-hidden />;
}

/** Locale-prefixed internal link (href may include a query string / anchor). */
export function LocalizedLink({
  href,
  className,
  children,
  ...rest
}: {
  href: string;
  className?: string;
  children: ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">) {
  const locale = useLocale();
  if (href.startsWith("http")) {
    return (
      <a href={href} className={className} {...rest}>
        {children}
      </a>
    );
  }
  const [path, query] = href.split("?");
  const localized = `/${locale}${path === "/" ? "" : path}${query ? `?${query}` : ""}`;
  return (
    <Link href={localized} className={className} {...(rest as object)}>
      {children}
    </Link>
  );
}

export function NavBadge({ badge }: { badge?: NavNodeItem["badge"] }) {
  if (!badge) return null;
  const styles: Record<string, string> = {
    NEW: "bg-accent text-black",
    PROMO: "bg-secondary text-black",
    SOON: "border border-hairline-strong text-ink-mid",
  };
  return (
    <span
      className={cn(
        "tech rounded-[2px] px-1 py-px text-[8px] font-semibold tracking-[0.14em]",
        styles[badge],
      )}
    >
      {badge}
    </span>
  );
}

export function PriceHint({ hint }: { hint?: string | null }) {
  if (!hint) return null;
  return (
    <span className="tech rounded-[2px] border border-hairline px-1.5 py-px text-[10px] text-ink-mid">
      {hint}
    </span>
  );
}
