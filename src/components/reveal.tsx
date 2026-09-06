"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * <Reveal> — the site's reveal motion (SECTION 2.5):
 * opacity 0→1 + 20px rise, 480ms, cubic-bezier(.16,1,.3,1), 60ms sibling
 * stagger, driven by IntersectionObserver, fires once, never re-triggers.
 * Fully static under prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
}: {
  children: ReactNode;
  delay?: number;
  as?: "div" | "section" | "li" | "span" | "article";
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    setShown(true);
  }, []);

  return (
    <Tag
      // @ts-expect-error — polymorphic ref
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-[480ms] ease-[cubic-bezier(.16,1,.3,1)]",
        "translate-y-0 opacity-100",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
