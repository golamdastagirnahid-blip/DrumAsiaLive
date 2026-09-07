"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * <AnimatedSlogan>
 * "Play. Practice. Perform."
 * - Completely solves text overlap issues with dedicated responsive line clearance
 * - Smooth kinetic typography with staggered wave animation & warm light sweeps
 * - Live animated studio indicator bars
 */
export function AnimatedSlogan({
  play = "Play",
  practice = "Practice",
  perform = "Perform",
  className,
}: {
  play?: string;
  practice?: string;
  perform?: string;
  className?: string;
}) {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((s) => (s + 1) % 3);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const items = [
    { text: `${play}.`, highlight: false, subtitle: "Walk in, plug in, make your noise" },
    { text: `${practice}.`, highlight: false, subtitle: "Real gear, soundproofed rooms, affordable hours" },
    { text: `${perform}.`, highlight: true, subtitle: "The live venue stage with full lighting & PA" },
  ];

  return (
    <div className={cn("relative flex flex-col gap-2 sm:gap-3 py-1 select-none", className)}>
      {items.map((item, idx) => {
        const isActive = activeStage === idx;

        return (
          <div
            key={item.text}
            className={cn(
              "group relative flex flex-col md:flex-row md:items-baseline gap-1.5 md:gap-4 transition-all duration-700",
              isActive ? "translate-x-1 sm:translate-x-2" : "opacity-85 hover:opacity-100",
            )}
          >
            {/* The Main Headline Word with comfortable, balanced typography */}
            <div className="flex items-center gap-2.5 sm:gap-4">
              {/* Active Stage Indicator Lamp */}
              <span
                className={cn(
                  "block h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full transition-all duration-500",
                  isActive
                    ? "bg-accent shadow-[0_0_12px_var(--gel-glow)] scale-110"
                    : "bg-hairline-strong opacity-40 group-hover:opacity-75",
                )}
                aria-hidden
              />

              <h2
                className={cn(
                  "font-display text-[clamp(1.8rem,4.6vw,3.4rem)] leading-[1.06] tracking-[-0.01em] transition-all duration-500",
                  item.highlight
                    ? "text-accent drop-shadow-[0_0_20px_var(--gel-glow)]"
                    : isActive
                      ? "text-ink drop-shadow-[0_2px_10px_rgba(255,255,255,0.12)]"
                      : "text-ink/90 group-hover:text-ink",
                )}
                style={{
                  textShadow: isActive
                    ? "0 0 35px var(--gel-glow)"
                    : "0 2px 4px rgba(0,0,0,0.6)",
                }}
              >
                {item.text}
              </h2>
            </div>

            {/* Accompanying Studio Subtitle Note */}
            <div className="flex items-center gap-2 pl-6 md:pl-0">
              <span className="h-px w-6 bg-secondary/50 hidden md:inline-block" aria-hidden />
              <p
                className={cn(
                  "tech text-[11px] sm:text-[12px] uppercase tracking-[0.16em] transition-colors duration-500",
                  isActive ? "text-secondary font-medium" : "text-ink-dim",
                )}
              >
                {item.subtitle}
              </p>
            </div>
          </div>
        );
      })}

      {/* Rhythmic Animated Equalizer Bar across the bottom of the slogan */}
      <div className="mt-2 flex items-center gap-1.5 h-3 opacity-70">
        {[40, 70, 95, 60, 30, 85, 100, 75, 45, 90, 65, 35, 80, 100, 50, 70, 90, 40].map((h, i) => (
          <span
            key={i}
            className="w-1.5 rounded-full bg-accent transition-all duration-300"
            style={{
              height: `${Math.max(4, (h * (activeStage + 1)) % 100)}%`,
              opacity: 0.3 + ((i % 4) * 0.2),
            }}
          />
        ))}
      </div>
    </div>
  );
}
