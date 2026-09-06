"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * <FounderPortrait> — the founder's portrait in a machined bezel frame with an
 * engraved nameplate, a hairline inner border, and a slow warm-light sweep that
 * runs once when scrolled into view (disabled under reduced-motion).
 *
 * `hasImage` is decided by the server (whether the client's photo file exists),
 * so the layout is correct for landscape / portrait / square, and never breaks:
 * without a photo it renders a tasteful engraved silhouette.
 */
export function FounderPortrait({
  hasImage,
  src,
  name,
  role,
  aspect = "aspect-[4/5]",
  className,
  priority = false,
}: {
  hasImage: boolean;
  src: string;
  name: string;
  role: string;
  aspect?: string;
  className?: string;
  priority?: boolean;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [swept, setSwept] = useState(false);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSwept(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure className={cn("founder-frame relative", className)}>
      {/* corner screws — machined, bolted-down */}
      <span className="screw screw--tl" aria-hidden />
      <span className="screw screw--tr" aria-hidden />
      <span className="screw screw--bl" aria-hidden />
      <span className="screw screw--br" aria-hidden />

      <div ref={frameRef} className={cn("founder-frame__inner", aspect, swept && "light-sweep sweep-in")}>
        {hasImage ? (
          <Image
            src={src}
            alt={`Portrait of ${name}, ${role}`}
            fill
            sizes="(max-width: 768px) 92vw, 44vw"
            className="object-cover"
            priority={priority}
          />
        ) : (
          <Monogram name={name} />
        )}
      </div>
      <figcaption className="flex items-end justify-between gap-3 px-2 pb-1 pt-3">
        <span className="nameplate">{name}</span>
        <span className="tech text-[9px] uppercase tracking-[0.16em] text-ink-dim">{role}</span>
      </figcaption>
    </figure>
  );
}

/**
 * Tasteful fallback — a machined founder monogram plate, so the page never
 * breaks and never looks unfinished while the photo is on its way.
 */
function Monogram({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter((p) => p.length > 1) // drop single-letter tokens
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-panel-2">
      {/* subtle perforation behind the mark */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--gel-hairline-strong) 1px, transparent 1.4px)",
          backgroundSize: "16px 16px",
          maskImage: "radial-gradient(70% 70% at 50% 50%, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(70% 70% at 50% 50%, black, transparent 75%)",
        }}
      />
      {/* monogram */}
      <span
        aria-hidden
        className="font-display relative text-[clamp(4rem,9vw,7rem)] leading-none text-ink"
        style={{ textShadow: "0 1px 0 var(--gel-inner-highlight), 0 -1px 0 rgba(0,0,0,0.5)" }}
      >
        {initials || "DA"}
        <span className="text-accent">.</span>
      </span>
      <span className="nameplate relative">{name}</span>
      <span className="tech relative text-[9px] uppercase tracking-[0.3em] text-ink-dim">
        EST. 2014
      </span>
    </div>
  );
}
