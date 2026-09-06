"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import type { NavNodeItem } from "@/config/nav";
import { cn } from "@/lib/utils";
import { LocalizedLink, NavBadge, NavIcon, PriceHint } from "./nav-bits";

/**
 * Desktop navigation — fully responsive, auto-fitting mega-menu:
 *   - Clamped to viewport boundaries (never overflows or crops on any screen)
 *   - Auto-responsive grid: fits laptops, tablets, desktops and ultrawides
 *   - Built-in max-height with smooth scrolling for shorter viewports
 *   - Clean inline submenus to prevent lateral screen clipping
 *   - Full keyboard navigation: Tab, Arrows, Home, End, Escape
 */

const OPEN_DELAY = 120;
const CLOSE_GRACE = 260;

interface Props {
  items: NavNodeItem[];
}

export function NavDesktop({ items }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const topRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const clearTimer = (key: string) => {
    const t = timers.current.get(key);
    if (t) clearTimeout(t);
    timers.current.delete(key);
  };

  const schedule = (key: string, fn: () => void, ms: number) => {
    clearTimer(key);
    timers.current.set(key, setTimeout(fn, ms));
  };

  const openPanel = useCallback((id: string) => {
    clearTimer(`close-${id}`);
    schedule(`open-${id}`, () => setOpenId(id), OPEN_DELAY);
  }, []);

  const closePanel = useCallback((id: string) => {
    clearTimer(`open-${id}`);
    schedule(
      `close-${id}`,
      () => {
        setOpenId((cur) => (cur === id ? null : cur));
      },
      CLOSE_GRACE,
    );
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const focusTop = (idx: number) => {
    const tops = items.filter((i) => i.showInHeader !== false);
    const item = tops[idx];
    if (item) topRefs.current.get(item.id)?.focus();
  };

  const onTopKeyDown = (e: React.KeyboardEvent, id: string, idx: number) => {
    const tops = items.filter((i) => i.showInHeader !== false);
    switch (e.key) {
      case "Enter":
      case " ":
      case "ArrowDown":
        e.preventDefault();
        setOpenId(id);
        break;
      case "ArrowRight":
        e.preventDefault();
        focusTop((idx + 1) % tops.length);
        break;
      case "ArrowLeft":
        e.preventDefault();
        focusTop((idx - 1 + tops.length) % tops.length);
        break;
      case "Home":
        e.preventDefault();
        focusTop(0);
        break;
      case "End":
        e.preventDefault();
        focusTop(tops.length - 1);
        break;
    }
  };

  const moveFocus = (scope: HTMLElement, dir: 1 | -1) => {
    const els = Array.from(
      scope.querySelectorAll<HTMLElement>("[data-nav-focusable]"),
    );
    if (!els.length) return;
    const idx = els.indexOf(document.activeElement as HTMLElement);
    const next = els[(idx + dir + els.length) % els.length];
    next?.focus();
  };

  return (
    <nav aria-label="Main navigation" className="relative hidden lg:block">
      <ul role="menubar" className="flex items-center gap-0.5">
        {items.map((item, idx) => {
          const hasChildren = (item.children?.length ?? 0) > 0;
          const open = openId === item.id;
          const triggerEl = topRefs.current.get(item.id);

          return (
            <li key={item.id} role="none" className="relative">
              {hasChildren ? (
                <button
                  ref={(el) => {
                    if (el) topRefs.current.set(item.id, el);
                  }}
                  role="menuitem"
                  aria-haspopup="true"
                  aria-expanded={open}
                  type="button"
                  onMouseEnter={() => openPanel(item.id)}
                  onMouseLeave={() => closePanel(item.id)}
                  onFocus={() => openPanel(item.id)}
                  onKeyDown={(e) => onTopKeyDown(e, item.id, idx)}
                  className={cn(
                    "tech flex h-11 items-center gap-1.5 px-3.5 text-[12px] uppercase tracking-[0.14em] font-medium transition-all duration-200 rounded-[4px]",
                    open ? "text-accent bg-panel/70 shadow-[0_0_12px_var(--gel-glow)]" : "text-ink hover:text-accent hover:bg-panel/40",
                  )}
                >
                  {item.label}
                  <ChevronRight
                    aria-hidden
                    className={cn(
                      "h-3 w-3 rotate-90 text-ink-dim transition-transform duration-200",
                      open && "rotate-[270deg] text-accent",
                    )}
                  />
                </button>
              ) : (
                <LocalizedLink
                  href={item.href ?? "/"}
                  role="menuitem"
                  onFocus={() => setOpenId(null)}
                  className="tech flex h-11 items-center px-3.5 text-[12px] uppercase tracking-[0.14em] font-medium text-ink transition-colors hover:text-accent hover:bg-panel/40 rounded-[4px]"
                >
                  {item.label}
                </LocalizedLink>
              )}

              {hasChildren && open && triggerEl && (
                <SmartViewportPanel
                  item={item}
                  triggerEl={triggerEl}
                  onPanelEnter={() => clearTimer(`close-${item.id}`)}
                  onPanelLeave={() => closePanel(item.id)}
                  onPanelKeyDown={(e) => onPanelKeyDown(e, item)}
                  moveFocus={moveFocus}
                />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );

  function onPanelKeyDown(e: React.KeyboardEvent, item: NavNodeItem) {
    const scope = e.currentTarget.closest<HTMLElement>("[data-panel-scope]");
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setOpenId(null);
        topRefs.current.get(item.id)?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        if (scope) moveFocus(scope, 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (scope) moveFocus(scope, -1);
        break;
      case "Home":
      case "End": {
        e.preventDefault();
        if (!scope) break;
        const els = Array.from(
          scope.querySelectorAll<HTMLElement>("[data-nav-focusable]"),
        );
        const target = e.key === "Home" ? els[0] : els[els.length - 1];
        target?.focus();
        break;
      }
    }
  }
}

/**
 * SmartViewportPanel:
 * Dynamically computes its position relative to the viewport.
 * - Always clamped between 16px and (window.innerWidth - 16px).
 * - Never overflows horizontally or gets cropped on ANY display resolution.
 * - Caps vertical height with custom scrollbar so it never cuts off vertically.
 */
function SmartViewportPanel({
  item,
  triggerEl,
  onPanelEnter,
  onPanelLeave,
  onPanelKeyDown,
  moveFocus,
}: {
  item: NavNodeItem;
  triggerEl: HTMLElement;
  onPanelEnter: () => void;
  onPanelLeave: () => void;
  onPanelKeyDown: (e: React.KeyboardEvent) => void;
  moveFocus: (scope: HTMLElement, dir: 1 | -1) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ left: number; top: number; maxWidth: number; maxHeight: number }>({
    left: 16,
    top: 68,
    maxWidth: 960,
    maxHeight: 600,
  });

  const updatePosition = useCallback(() => {
    if (!triggerEl) return;
    const triggerRect = triggerEl.getBoundingClientRect();
    const panel = panelRef.current;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Determine target width
    const columnsCount = item.children?.length ?? 1;
    let idealWidth = 280;
    if (columnsCount === 2) idealWidth = 480;
    else if (columnsCount === 3) idealWidth = 680;
    else if (columnsCount === 4) idealWidth = 860;
    else if (columnsCount > 4) idealWidth = 980;

    const maxWidth = Math.min(idealWidth, viewportWidth - 32);
    const measuredWidth = panel ? Math.min(panel.offsetWidth || idealWidth, maxWidth) : maxWidth;

    // Center under button, then clamp strictly within screen bounds
    const idealLeft = triggerRect.left + triggerRect.width / 2 - measuredWidth / 2;
    const clampedLeft = Math.max(16, Math.min(idealLeft, viewportWidth - measuredWidth - 16));

    const top = triggerRect.bottom + 8;
    const maxHeight = Math.max(260, viewportHeight - top - 24);

    setCoords({
      left: clampedLeft,
      top,
      maxWidth,
      maxHeight,
    });
  }, [triggerEl, item.children]);

  useLayoutEffect(() => {
    updatePosition();
  }, [updatePosition]);

  useEffect(() => {
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [updatePosition]);

  const columns = item.children ?? [];

  return (
    <div
      ref={panelRef}
      role="menu"
      aria-label={item.label}
      data-panel-scope
      onMouseEnter={onPanelEnter}
      onMouseLeave={onPanelLeave}
      onKeyDown={onPanelKeyDown}
      style={{
        position: "fixed",
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        maxWidth: `${coords.maxWidth}px`,
        maxHeight: `${coords.maxHeight}px`,
        zIndex: 100,
        boxShadow: "0 24px 60px -15px rgba(0,0,0,0.92), 0 0 0 1px var(--gel-hairline-strong)",
      }}
      className="panel perforated overflow-y-auto p-5 rounded-[12px] bg-panel-2/95 backdrop-blur-[24px] transition-all duration-150 animate-in fade-in zoom-in-95"
    >
      {/* Category header plate */}
      <div className="mb-4 flex items-center justify-between border-b border-hairline pb-2.5">
        <div className="flex items-center gap-2">
          <span className="lamp lamp--open h-2 w-2" aria-hidden />
          <span className="tech text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
            {item.label} · Navigation Matrix
          </span>
        </div>
        {item.href && (
          <LocalizedLink
            href={item.href}
            className="tech text-[10px] uppercase tracking-[0.16em] text-ink-mid hover:text-accent transition-colors flex items-center gap-1"
          >
            Browse All →
          </LocalizedLink>
        )}
      </div>

      {/* Responsive Columns Grid */}
      <div
        className={cn(
          "grid gap-3.5",
          columns.length <= 2 && "grid-cols-1 sm:grid-cols-2",
          columns.length === 3 && "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
          columns.length === 4 && "grid-cols-2 lg:grid-cols-4",
          columns.length > 4 && "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
        )}
      >
        {columns.map((col) => (
          <ColumnCard key={col.id} col={col} moveFocus={moveFocus} />
        ))}
      </div>
    </div>
  );
}

/**
 * Individual column card:
 * Displays parent node + neatly integrated sub-items so nothing clips horizontally.
 */
function ColumnCard({
  col,
  moveFocus,
}: {
  col: NavNodeItem;
  moveFocus: (scope: HTMLElement, dir: 1 | -1) => void;
}) {
  const hasKids = (col.children?.length ?? 0) > 0;

  return (
    <div className="group/card flex flex-col rounded-[8px] border border-hairline bg-panel/60 p-3 transition-all duration-200 hover:border-accent hover:bg-panel hover:shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
      {col.href ? (
        <LocalizedLink
          href={col.href}
          role="menuitem"
          data-nav-focusable
          className="flex flex-col gap-1 text-left"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 font-display text-[15px] tracking-wide text-ink group-hover/card:text-accent transition-colors">
              <NavIcon name={col.icon} className="h-4 w-4 text-accent shrink-0" />
              {col.label}
            </span>
            <NavBadge badge={col.badge} />
          </div>
          {col.blurb && (
            <p className="mt-1 text-[12px] leading-snug text-ink-mid line-clamp-2">
              {col.blurb}
            </p>
          )}
          {col.priceHint && (
            <div className="mt-2 flex items-center justify-between">
              <PriceHint hint={col.priceHint} />
              <span className="tech text-[9px] uppercase tracking-[0.16em] text-accent">View →</span>
            </div>
          )}
        </LocalizedLink>
      ) : (
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 font-display text-[15px] tracking-wide text-ink">
              <NavIcon name={col.icon} className="h-4 w-4 text-accent shrink-0" />
              {col.label}
            </span>
            <NavBadge badge={col.badge} />
          </div>
          {col.blurb && (
            <p className="mt-1 text-[12px] leading-snug text-ink-mid">{col.blurb}</p>
          )}
        </div>
      )}

      {/* Integrated sub-items (depth 3) cleanly nested inside the card */}
      {hasKids && (
        <div className="mt-3 space-y-1.5 border-t border-hairline/60 pt-2.5">
          {col.children?.map((kid) => (
            <LocalizedLink
              key={kid.id}
              href={kid.href ?? "/"}
              role="menuitem"
              data-nav-focusable
              className="flex items-center justify-between gap-2 rounded-[4px] px-2 py-1 text-[11px] text-ink-mid transition-colors hover:bg-panel-2 hover:text-ink"
            >
              <span className="flex items-center gap-1.5 truncate">
                <span className="h-1 w-1 rounded-full bg-secondary shrink-0" />
                <span className="truncate">{kid.label}</span>
              </span>
              <NavBadge badge={kid.badge} />
            </LocalizedLink>
          ))}
        </div>
      )}
    </div>
  );
}
