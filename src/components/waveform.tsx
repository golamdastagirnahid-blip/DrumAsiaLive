import { cn } from "@/lib/utils";

/**
 * <Waveform> — every section divider is a REAL waveform, drawn from a small
 * amplitude array, generated deterministically at build/render time
 * (SECTION 2.4 signature detail). A different seed per section.
 */
export function Waveform({
  seed = 1,
  bars = 96,
  className,
  height = 26,
}: {
  seed?: number;
  bars?: number;
  className?: string;
  height?: number;
}) {
  const amps = Array.from({ length: bars }, (_, i) => {
    // deterministic pseudo-random in [0,1)
    const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
    const f = x - Math.floor(x);
    // gentle envelope: louder in the middle, quieter at the edges
    const env = Math.sin((Math.PI * i) / (bars - 1));
    return 0.15 + (f * 0.7 + 0.15) * (0.4 + 0.6 * env);
  });

  return (
    <svg
      viewBox={`0 0 ${bars} ${height}`}
      preserveAspectRatio="none"
      width="100%"
      height={height}
      aria-hidden
      className={cn("block", className)}
    >
      {amps.map((a, i) => {
        const h = Math.max(1, a * (height - 2));
        const y = (height - h) / 2;
        return (
          <rect key={i} x={i} y={y} width={1} height={h} fill="currentColor" rx={0.5} />
        );
      })}
    </svg>
  );
}
