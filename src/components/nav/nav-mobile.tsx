"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import type { NavNodeItem } from "@/config/nav";
import { cn } from "@/lib/utils";
import { LocalizedLink, NavBadge, NavIcon, PriceHint } from "./nav-bits";

/**
 * Mobile navigation — the same tree as a full-screen stacked accordion with
 * breadcrumb-style back navigation (SECTION 4.1).
 */
export function NavMobile({ items }: { items: NavNodeItem[] }) {
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState<string[]>([]); // node ids from root

  // Lock body scroll while open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) setPath([]);
  }, [open]);

  const current = resolve(items, path);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-haspopup="dialog"
        className="grid h-11 w-11 place-items-center rounded-[6px] text-ink transition-colors hover:text-accent lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[90] flex flex-col bg-base lg:hidden"
        >
          <header className="flex h-16 items-center justify-between border-b border-hairline px-4">
            {path.length > 0 ? (
              <button
                type="button"
                onClick={() => setPath((p) => p.slice(0, -1))}
                className="flex items-center gap-1 text-ink-mid"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                <span className="tech text-[12px] uppercase tracking-[0.14em]">Back</span>
              </button>
            ) : (
              <span className="tech text-[12px] uppercase tracking-[0.2em] text-ink-dim">
                Menu
              </span>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid h-11 w-11 place-items-center text-ink"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </header>

          {/* breadcrumb trail */}
          {path.length > 0 && (
            <nav aria-label="Breadcrumb" className="border-b border-hairline px-4 py-2">
              <ol className="tech flex flex-wrap items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-ink-dim">
                {path.map((id, i) => {
                  const label = items.find((n) => n.id === id)?.label ?? id;
                  return (
                    <li key={id} className="flex items-center gap-1">
                      {i > 0 && <span aria-hidden>·</span>}
                      <span className={cn(i === path.length - 1 && "text-accent")}>{label}</span>
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}

          <ul className="flex-1 overflow-y-auto px-2 py-3">
            {current.map((node) => {
              const hasChildren = (node.children?.length ?? 0) > 0;
              return (
                <li key={node.id}>
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={() => setPath((p) => [...p, node.id])}
                      aria-expanded="false"
                      className="flex w-full items-center gap-3 rounded-[8px] px-3 py-3.5 text-left transition-colors hover:bg-panel-2"
                    >
                      <span className="text-accent">
                        <NavIcon name={node.icon} className="h-5 w-5" />
                      </span>
                      <span className="flex-1 text-[16px] font-semibold text-ink">
                        {node.label}
                      </span>
                      <NavBadge badge={node.badge} />
                      <ChevronRight className="h-4 w-4 text-ink-dim" aria-hidden />
                    </button>
                  ) : (
                    <LocalizedLink
                      href={node.href ?? "/"}
                      onClick={() => setOpen(false)}
                      className="flex w-full items-center gap-3 rounded-[8px] px-3 py-3.5 transition-colors hover:bg-panel-2"
                    >
                      <span className="text-accent">
                        <NavIcon name={node.icon} className="h-5 w-5" />
                      </span>
                      <span className="flex-1 text-[16px] font-semibold text-ink">
                        {node.label}
                      </span>
                      <NavBadge badge={node.badge} />
                      <PriceHint hint={node.priceHint} />
                    </LocalizedLink>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}

function resolve(items: NavNodeItem[], path: string[]): NavNodeItem[] {
  let level = items;
  for (const id of path) {
    const node = level.find((n) => n.id === id);
    level = node?.children ?? [];
  }
  return level;
}
