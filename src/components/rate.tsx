import { Confirm } from "@/components/confirm";

/**
 * Rate — renders a [CONFIRM] rate. Missing value renders the literal
 * "RM— / hr · confirm on WhatsApp" (R3) — never RM0, never a guess.
 */
export function Rate({
  amount,
  unit = "hr",
  label,
  className,
}: {
  amount: number | null;
  unit?: string;
  label?: string;
  className?: string;
}) {
  if (amount == null) {
    return (
      <span className={`tech ${className ?? ""}`}>
        RM— / {unit} · confirm on WhatsApp
      </span>
    );
  }
  return (
    <span className={`tech ${className ?? ""}`}>
      <Confirm note="Illustrative rate — confirm on WhatsApp">
        {label ? `${label} ` : ""}RM{amount}/{unit}
      </Confirm>
    </span>
  );
}
