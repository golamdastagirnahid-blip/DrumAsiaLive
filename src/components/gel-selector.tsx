"use client";

import { useEffect, useRef, useState } from "react";
import {
  Drum,
  Guitar,
  Music,
  SlidersHorizontal,
  CloudMoon,
  Eye,
  Sparkles,
  ChevronDown,
  Check,
} from "lucide-react";
import { GELS, useTheme, type GelId } from "@/components/providers/theme-provider";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, any> = {
  drum: Drum,
  guitar: Guitar,
  keyboard: Music,
  console: SlidersHorizontal,
  sky: CloudMoon,
  dark: Eye,
  lights: Sparkles,
};

/**
 * <GelSelector> — Studio Equipment & Instrument Theme Selector.
 * 
 * Auto-fits any screen size in the world:
 *  - Sleek, compact studio capsule trigger in the header (~140px)
 *  - Floating viewport-clamped studio console with all 7 premier presets:
 *      1. 🥁 Drum Studio
 *      2. 🎸 Guitar Lounge
 *      3. 🎹 Synth & Keys
 *      4. 🎛️ Console Master
 *      5. 🌌 Midnight Sky
 *      6. 🖤 Obsidian Dark
 *      7. ✨ Stage Lights
 *  - Never crops or overflows, fully responsive, keyboard accessible (Esc/Enter)
 */
export function GelSelector({ compact = false }: { compact?: boolean }) {
  const { gel, setGel } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeGel = GELS.find((g) => g.id === gel) ?? GELS[0]!;
  const ActiveIcon = ICON_MAP[activeGel.icon] ?? SlidersHorizontal;

  // Click outside and Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative inline-block select-none">
      {/* ── Sleek Compact Header Capsule Trigger ── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Active theme: ${activeGel.label}. Click to select from 7 studio themes`}
        title={`Theme: ${activeGel.label} (${activeGel.instrument}) — Click to change`}
        className={cn(
          "group relative flex h-9 items-center gap-2 rounded-[6px] border px-2.5 sm:px-3 text-ink backdrop-blur-md transition-all duration-200",
          isOpen
            ? "border-accent bg-panel text-accent shadow-[0_0_12px_var(--gel-glow)]"
            : "border-hairline bg-panel-2/80 hover:border-hairline-strong hover:bg-panel text-ink-mid hover:text-ink",
          compact && "px-2",
        )}
      >
        {/* Glowing Active LED Swatch Lamp */}
        <span
          className="h-2.5 w-2.5 rounded-full shrink-0 transition-transform duration-300"
          style={{
            background: activeGel.swatch,
            boxShadow: `0 0 8px ${activeGel.swatch}`,
          }}
          aria-hidden
        />

        {/* Active Instrument Icon */}
        <ActiveIcon className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />

        {/* Label (auto-adapts: short on mobile/laptop, full on wider screens) */}
        {!compact && (
          <span className="tech text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-ink hidden sm:inline truncate max-w-[110px]">
            {activeGel.label}
          </span>
        )}

        {/* Dropdown Chevron */}
        <ChevronDown
          aria-hidden
          className={cn(
            "h-3 w-3 text-ink-dim transition-transform duration-200",
            isOpen && "rotate-180 text-accent",
          )}
        />
      </button>

      {/* ── Auto-Fitting Floating Studio Theme Console ── */}
      {isOpen && (
        <div
          role="menu"
          aria-label="Studio Themes and Lighting Gels"
          className="absolute right-0 top-full mt-2 w-[310px] sm:w-[350px] max-w-[calc(100vw-24px)] rounded-[12px] border border-hairline-strong bg-panel-2/95 p-3 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_24px_var(--gel-glow)] z-[100] animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header Bar */}
          <div className="mb-2.5 flex items-center justify-between border-b border-hairline pb-2 px-1">
            <div className="flex items-center gap-2">
              <span className="lamp lamp--open h-2 w-2" aria-hidden />
              <span className="tech text-[9px] uppercase tracking-[0.24em] font-semibold text-accent">
                STUDIO THEMES · 7 PRESETS
              </span>
            </div>
            <span className="tech text-[9px] uppercase tracking-wider text-ink-dim font-mono">
              AUTO-FIT
            </span>
          </div>

          {/* All 7 Themes List */}
          <div className="flex flex-col gap-1.5 max-h-[65vh] overflow-y-auto pr-0.5">
            {GELS.map((g) => {
              const isCurrent = gel === g.id;
              const IconComp = ICON_MAP[g.icon] ?? SlidersHorizontal;

              return (
                <button
                  key={g.id}
                  type="button"
                  role="menuitem"
                  aria-pressed={isCurrent}
                  onClick={() => {
                    setGel(g.id);
                    track("gel_change", { gel: g.id });
                    setIsOpen(false);
                  }}
                  className={cn(
                    "group flex items-center justify-between gap-3 rounded-[8px] p-2.5 text-left transition-all duration-200",
                    isCurrent
                      ? "bg-panel text-ink border border-accent/80 shadow-[0_0_12px_var(--gel-glow)]"
                      : "border border-transparent hover:bg-panel/60 hover:border-hairline text-ink-mid hover:text-ink",
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Glowing LED Swatch */}
                    <span
                      className="h-3 w-3 rounded-full shrink-0 transition-transform group-hover:scale-110"
                      style={{
                        background: g.swatch,
                        boxShadow: isCurrent ? `0 0 10px ${g.swatch}` : `0 0 4px ${g.swatch}80`,
                      }}
                      aria-hidden
                    />

                    {/* Instrument Icon */}
                    <IconComp
                      aria-hidden
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isCurrent ? "text-accent" : "text-ink-dim group-hover:text-ink",
                      )}
                    />

                    {/* Theme Name & Instrument Tag */}
                    <div className="flex flex-col min-w-0">
                      <span
                        className={cn(
                          "text-[13px] font-semibold tracking-wide truncate",
                          isCurrent ? "text-ink font-bold" : "text-ink/90",
                        )}
                      >
                        {g.label}
                      </span>
                      <span className="tech text-[10px] uppercase tracking-wider text-ink-dim truncate">
                        {g.instrument}
                      </span>
                    </div>
                  </div>

                  {/* Active Radio / Check Indicator */}
                  {isCurrent ? (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-black shrink-0 shadow-[0_0_8px_var(--gel-glow)]">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-hairline-strong opacity-40 group-hover:opacity-80 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
