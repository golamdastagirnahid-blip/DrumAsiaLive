import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * <Confirm> — renders an unverified [CONFIRM] value (R3).
 * Shows the value plus an invisible dev-only marker: a small amber `[CONFIRM]`
 * tag in development, and nothing visible in production. Either way the value is
 * flagged for the /docs/OPEN-QUESTIONS.md checklist.
 */
export function Confirm({
  value,
  children,
  note,
  className,
}: {
  value?: ReactNode;
  children?: ReactNode;
  note?: string;
  className?: string;
}) {
  const isDev = process.env.NODE_ENV === "development";
  const content = children ?? value;

  return (
    <span
      className={cn("relative inline", className)}
      data-confirm="true"
      title={isDev ? undefined : note ?? "Unverified — confirm with client"}
    >
      {content}
      {isDev && (
        <sup
          title={note ?? "Unverified — confirm with client"}
          className="text-accent ml-0.5 align-super text-[9px] font-semibold tracking-wide no-underline"
        >
          [CONFIRM]
        </sup>
      )}
    </span>
  );
}
