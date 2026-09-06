"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

/**
 * <InstrumentThemeBackground>
 * Dynamic luxury background visualizer with 7 premier instrument & studio lighting themes:
 *  1. DRUM STUDIO (drum-stage): Bass drum shells, cymbal lathed grooves & acoustic baffles
 *  2. GUITAR LOUNGE (guitar-lounge): 6 resonant guitar strings with harmonic vibration & tube glow
 *  3. SYNTH & KEYS (synth-keys): Keyboard piano key rhythm, step sequencer matrix & neon synth waves
 *  4. CONSOLE MASTER (console): Multi-track mixing console fader rails, fader knobs & dual VU meter arcs
 *  5. MIDNIGHT SKY (sky-session): Celestial night sky constellations, starry acoustic dome & cosmic waves
 *  6. OBSIDIAN DARK (pure-dark): Stealth acoustic isolation wall geometry, minimal obsidian studio rings
 *  7. STAGE LIGHTS (stage-lights): Dramatic concert truss lighting beams, moving-head spotlights & stage wash
 *
 * Each theme is clearly visible, softly blurred (3.5px) for maximum visual comfort and readability.
 */
export function InstrumentThemeBackground({ className }: { className?: string }) {
  const { gel } = useTheme();

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 z-0 overflow-hidden transition-opacity duration-700 select-none",
        className,
      )}
    >
      {/* ══════════════ 1. DRUM STUDIO (Drums & Cymbals) ══════════════ */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          gel === "drum-stage" ? "opacity-100" : "opacity-0",
        )}
      >
        <svg
          viewBox="0 0 1440 900"
          className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-700"
          preserveAspectRatio="xMidYMid slice"
          style={{ filter: "blur(3.5px)" }}
        >
          {/* Top-Right Ride Cymbal Lathing & Bell */}
          <circle cx="85%" cy="15%" r="380" fill="none" stroke="var(--gel-accent)" strokeWidth="2.5" strokeDasharray="10 6" />
          <circle cx="85%" cy="15%" r="300" fill="none" stroke="var(--gel-accent)" strokeWidth="3" />
          <circle cx="85%" cy="15%" r="220" fill="none" stroke="var(--gel-secondary)" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="85%" cy="15%" r="140" fill="none" stroke="var(--gel-accent)" strokeWidth="4" />
          <circle cx="85%" cy="15%" r="60" fill="var(--gel-accent)" opacity="0.3" stroke="var(--gel-accent)" strokeWidth="3" />

          {/* Bottom-Left 22" Bass Drum Shell & Head */}
          <circle cx="15%" cy="85%" r="440" fill="none" stroke="var(--gel-secondary)" strokeWidth="3" strokeDasharray="12 8" />
          <circle cx="15%" cy="85%" r="340" fill="none" stroke="var(--gel-accent)" strokeWidth="4" />
          <circle cx="15%" cy="85%" r="240" fill="none" stroke="var(--gel-secondary)" strokeWidth="2.5" />
          <circle cx="15%" cy="85%" r="130" fill="none" stroke="var(--gel-accent)" strokeWidth="5" />
          {/* Kick Pedal Beater Impact Center */}
          <circle cx="15%" cy="85%" r="30" fill="var(--gel-accent)" opacity="0.4" />

          {/* Drum Tension Rod Lugs */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x = 0.15 * 1440 + 340 * Math.cos(rad);
            const y = 0.85 * 900 + 340 * Math.sin(rad);
            return <circle key={deg} cx={x} cy={y} r="6" fill="var(--gel-accent)" />;
          })}

          {/* Snare Drum Rim at Center-Right */}
          <ellipse cx="70%" cy="65%" rx="220" ry="90" fill="none" stroke="var(--gel-accent)" strokeWidth="3" strokeDasharray="6 4" />
          <ellipse cx="70%" cy="65%" rx="180" ry="70" fill="none" stroke="var(--gel-secondary)" strokeWidth="2" />
        </svg>

        {/* Studio Acoustic Diffuser Baffle Texture */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, var(--gel-accent) 0, var(--gel-accent) 3px, transparent 0, transparent 40px)",
          }}
        />
      </div>

      {/* ══════════════ 2. GUITAR LOUNGE (Guitars & Amps) ══════════════ */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          gel === "guitar-lounge" || gel === "amber-wash" ? "opacity-100" : "opacity-0",
        )}
      >
        <svg
          viewBox="0 0 1440 900"
          className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-700"
          preserveAspectRatio="none"
          style={{ filter: "blur(3.5px)" }}
        >
          {/* 6 Taut Resonant Guitar Strings */}
          {[120, 160, 200, 240, 280, 320].map((yOffset, i) => (
            <g key={i}>
              <line
                x1="-50"
                y1={yOffset + i * 45}
                x2="1500"
                y2={yOffset + 240 + i * 45}
                stroke="var(--gel-accent)"
                strokeWidth={5 - i * 0.5}
                opacity={0.7}
              />
              {/* String Harmonic Vibrations & Frets */}
              <circle cx={280 + i * 140} cy={yOffset + 70 + i * 45} r={8} fill="var(--gel-secondary)" />
              <circle cx={750 + i * 80} cy={yOffset + 140 + i * 45} r={6} fill="var(--gel-accent)" />
              <circle cx={1180 - i * 60} cy={yOffset + 200 + i * 45} r={7} fill="var(--gel-secondary)" />
            </g>
          ))}

          {/* Electric Guitar Dual Humbucker Pickup Poles */}
          {[180, 250, 320, 390, 460, 530].map((y, i) => (
            <g key={i}>
              <ellipse cx="82%" cy={y + 110} rx="20" ry="10" fill="none" stroke="var(--gel-accent)" strokeWidth="3" />
              <ellipse cx="87%" cy={y + 110} rx="20" ry="10" fill="none" stroke="var(--gel-secondary)" strokeWidth="3" />
            </g>
          ))}

          {/* Guitar Headstock Tuning Peg Silhouette at Top-Left */}
          <path
            d="M 50 40 L 220 180 L 160 260 L 20 120 Z"
            fill="none"
            stroke="var(--gel-accent)"
            strokeWidth="3.5"
            strokeDasharray="8 6"
          />
        </svg>

        {/* Vintage Amp Tweed Grille Texture */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(var(--gel-accent) 1.5px, transparent 1.5px), radial-gradient(var(--gel-secondary) 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
            backgroundPosition: "0 0, 12px 12px",
          }}
        />
      </div>

      {/* ══════════════ 3. SYNTH & KEYS (Synthesizers & Piano) ══════════════ */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          gel === "synth-keys" || gel === "cool-wash" ? "opacity-100" : "opacity-0",
        )}
      >
        <svg
          viewBox="0 0 1440 900"
          className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-700"
          preserveAspectRatio="xMidYMid slice"
          style={{ filter: "blur(3.5px)" }}
        >
          {/* Piano Keyboard Key Rhythm Blocks across bottom */}
          <g transform="translate(0, 680)" opacity="0.75">
            {Array.from({ length: 48 }).map((_, i) => (
              <rect
                key={i}
                x={i * 30}
                y="0"
                width="28"
                height={i % 3 === 0 ? "160" : "210"}
                fill={i % 7 === 1 || i % 7 === 4 ? "var(--gel-secondary)" : "none"}
                stroke="var(--gel-accent)"
                strokeWidth="2"
              />
            ))}
          </g>

          {/* Synthesizer Step-Sequencer LED Matrix at Top-Left */}
          <g transform="translate(80, 80)" opacity="0.7">
            {Array.from({ length: 16 }).map((_, col) =>
              Array.from({ length: 6 }).map((__, row) => (
                <circle
                  key={`${col}-${row}`}
                  cx={col * 50}
                  cy={row * 42}
                  r={col % 4 === 0 || row === 2 ? 6 : 4}
                  fill={col % 4 === 0 ? "var(--gel-accent)" : "var(--gel-secondary)"}
                />
              )),
            )}
          </g>

          {/* Dual Synth Waveforms (Analog Sine & Sawtooth) */}
          <path
            d="M 0 360 Q 180 180, 360 360 T 720 360 T 1080 360 T 1440 360"
            fill="none"
            stroke="var(--gel-accent)"
            strokeWidth="3.5"
          />
          <path
            d="M 0 460 L 120 400 L 240 520 L 360 400 L 480 520 L 600 400 L 720 520 L 840 400 L 960 520 L 1080 400 L 1200 520 L 1320 400 L 1440 520"
            fill="none"
            stroke="var(--gel-secondary)"
            strokeWidth="2.5"
          />
        </svg>

        {/* Digital Matrix Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--gel-accent) 1px, transparent 1px), linear-gradient(to bottom, var(--gel-accent) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* ══════════════ 4. CONSOLE MASTER (Mixing Desk & VU) ══════════════ */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          gel === "console" ? "opacity-100" : "opacity-0",
        )}
      >
        <svg
          viewBox="0 0 1440 900"
          className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-700"
          preserveAspectRatio="xMidYMid slice"
          style={{ filter: "blur(3.5px)" }}
        >
          {/* Multi-Channel Fader Rails running up from bottom */}
          {[160, 280, 400, 520, 640, 760, 880, 1000, 1120, 1240].map((x, i) => (
            <g key={x}>
              <line x1={x} y1="360" x2={x} y2="880" stroke="var(--gel-hairline-strong)" strokeWidth="3" />
              {/* Fader Notch Marks */}
              {[420, 480, 540, 600, 660, 720, 780, 840].map((y) => (
                <line key={y} x1={x - 10} y1={y} x2={x + 10} y2={y} stroke="var(--gel-secondary)" strokeWidth="1.5" />
              ))}
              {/* Fader Knob Block */}
              <rect
                x={x - 14}
                y={500 + (i % 4) * 55}
                width="28"
                height="42"
                rx="4"
                fill="var(--gel-panel-2)"
                stroke="var(--gel-accent)"
                strokeWidth="2.5"
              />
              <line
                x1={x - 10}
                y1={521 + (i % 4) * 55}
                x2={x + 10}
                y2={521 + (i % 4) * 55}
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />
            </g>
          ))}

          {/* Master VU Meter Dial Arcs at Top-Right */}
          <path
            d="M 1060 220 Q 1240 80 1420 220"
            fill="none"
            stroke="var(--gel-accent)"
            strokeWidth="4"
            strokeDasharray="8 6"
          />
          <path
            d="M 1100 220 Q 1240 110 1380 220"
            fill="none"
            stroke="var(--gel-secondary)"
            strokeWidth="2"
          />
          <line x1="1240" y1="230" x2="1330" y2="120" stroke="#FF4500" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="1240" cy="230" r="8" fill="var(--gel-accent)" />
        </svg>

        {/* Studio Metal Perforated Sheet */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--gel-accent) 1.2px, transparent 1.8px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* ══════════════ 5. MIDNIGHT SKY (Sky & Starlight) ══════════════ */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          gel === "sky-session" ? "opacity-100" : "opacity-0",
        )}
      >
        <svg
          viewBox="0 0 1440 900"
          className="absolute inset-0 w-full h-full object-cover opacity-65 transition-opacity duration-700"
          preserveAspectRatio="xMidYMid slice"
          style={{ filter: "blur(3.5px)" }}
        >
          {/* Celestial Moon Crescent at Top-Right */}
          <path
            d="M 1250 80 A 100 100 0 1 0 1350 240 A 130 130 0 0 1 1250 80 Z"
            fill="var(--gel-accent)"
            opacity="0.35"
            stroke="var(--gel-accent)"
            strokeWidth="2.5"
          />

          {/* Starlight Constellations & Acoustic Sound Dome Rings */}
          <circle cx="50%" cy="30%" r="500" fill="none" stroke="var(--gel-accent)" strokeWidth="1.5" strokeDasharray="12 12" />
          <circle cx="50%" cy="30%" r="380" fill="none" stroke="var(--gel-secondary)" strokeWidth="2" strokeDasharray="6 8" />
          <circle cx="50%" cy="30%" r="240" fill="none" stroke="var(--gel-accent)" strokeWidth="2.5" />
          <circle cx="50%" cy="30%" r="100" fill="none" stroke="var(--gel-secondary)" strokeWidth="1.5" />

          {/* Scattered Bright Star Nodes */}
          {([
            [180, 120], [320, 80], [450, 220], [240, 360], [680, 140],
            [850, 90], [980, 280], [1120, 180], [1340, 350], [160, 680],
            [380, 560], [540, 720], [720, 620], [920, 740], [1180, 660],
          ] as const).map(([x, y], idx) => (
            <g key={idx}>
              <circle cx={x} cy={y} r={idx % 3 === 0 ? 6 : 4} fill="var(--gel-accent)" />
              <line x1={x - 12} y1={y} x2={x + 12} y2={y} stroke="var(--gel-accent)" strokeWidth="1.5" />
              <line x1={x} y1={y - 12} x2={x} y2={y + 12} stroke="var(--gel-accent)" strokeWidth="1.5" />
            </g>
          ))}

          {/* Deep Ambient Cosmic Wave across horizon */}
          <path
            d="M 0 540 Q 360 440, 720 540 T 1440 540"
            fill="none"
            stroke="var(--gel-secondary)"
            strokeWidth="3"
            strokeDasharray="8 6"
          />
        </svg>

        {/* Ambient Cosmic Dust Texture */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--gel-accent) 1px, transparent 1.5px)",
            backgroundSize: "36px 36px",
          }}
        />
      </div>

      {/* ══════════════ 6. OBSIDIAN DARK (Stealth Black & Ember) ══════════════ */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          gel === "pure-dark" ? "opacity-100" : "opacity-0",
        )}
      >
        <svg
          viewBox="0 0 1440 900"
          className="absolute inset-0 w-full h-full object-cover opacity-50 transition-opacity duration-700"
          preserveAspectRatio="xMidYMid slice"
          style={{ filter: "blur(3.5px)" }}
        >
          {/* Minimal Geometric Studio Isolation Ring */}
          <circle cx="50%" cy="50%" r="480" fill="none" stroke="var(--gel-secondary)" strokeWidth="2" strokeDasharray="16 12" />
          <circle cx="50%" cy="50%" r="360" fill="none" stroke="var(--gel-accent)" strokeWidth="2.5" />
          <circle cx="50%" cy="50%" r="220" fill="none" stroke="var(--gel-secondary)" strokeWidth="1.5" strokeDasharray="8 8" />

          {/* Obsidian Angled Baffle Blades */}
          {[-400, -200, 0, 200, 400].map((offset, idx) => (
            <line
              key={idx}
              x1={720 + offset - 260}
              y1="0"
              x2={720 + offset + 260}
              y2="900"
              stroke="var(--gel-hairline-strong)"
              strokeWidth="2"
              opacity="0.6"
            />
          ))}

          {/* Warm Ember Corner Accents */}
          <circle cx="5%" cy="5%" r="180" fill="none" stroke="var(--gel-accent)" strokeWidth="2" />
          <circle cx="95%" cy="95%" r="220" fill="none" stroke="var(--gel-accent)" strokeWidth="2" />
        </svg>

        {/* Stealth Carbon Texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, var(--gel-accent) 0, var(--gel-accent) 1px, transparent 0, transparent 32px)",
          }}
        />
      </div>

      {/* ══════════════ 7. STAGE LIGHTS (Spotlight Beams & Truss) ══════════════ */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          gel === "stage-lights" ? "opacity-100" : "opacity-0",
        )}
      >
        <svg
          viewBox="0 0 1440 900"
          className="absolute inset-0 w-full h-full object-cover opacity-65 transition-opacity duration-700"
          preserveAspectRatio="none"
          style={{ filter: "blur(4px)" }}
        >
          {/* Overhead Concert Truss Grid across top */}
          <line x1="0" y1="50" x2="1440" y2="50" stroke="var(--gel-accent)" strokeWidth="4" />
          <line x1="0" y1="90" x2="1440" y2="90" stroke="var(--gel-secondary)" strokeWidth="3" />
          {Array.from({ length: 30 }).map((_, i) => (
            <line
              key={i}
              x1={i * 50}
              y1="50"
              x2={(i + 1) * 50}
              y2="90"
              stroke="var(--gel-accent)"
              strokeWidth="2"
              opacity="0.8"
            />
          ))}

          {/* Dynamic Moving-Head Stage Spotlight Beams (Criss-crossing) */}
          {/* Beam 1 from top-left to stage center-right */}
          <polygon
            points="180,90 880,900 680,900"
            fill="var(--gel-accent)"
            opacity="0.32"
          />
          {/* Beam 2 from top-right to stage center-left */}
          <polygon
            points="1260,90 560,900 760,900"
            fill="var(--gel-secondary)"
            opacity="0.32"
          />
          {/* Beam 3 center vertical spotlight cone */}
          <polygon
            points="720,90 380,900 1060,900"
            fill="var(--gel-accent)"
            opacity="0.22"
          />
          {/* Beam 4 wide left flank wash */}
          <polygon
            points="380,90 0,720 0,900 180,900"
            fill="var(--gel-secondary)"
            opacity="0.28"
          />
          {/* Beam 5 wide right flank wash */}
          <polygon
            points="1060,90 1440,720 1440,900 1260,900"
            fill="var(--gel-accent)"
            opacity="0.28"
          />

          {/* Lens Flare Glow Heads on the Truss */}
          {[180, 380, 720, 1060, 1260].map((x, i) => (
            <circle key={i} cx={x} cy="90" r="14" fill="#FFFFFF" opacity="0.9" />
          ))}
        </svg>

        {/* Stage Fog / Haze Ambient Dust */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 50% 15%, var(--gel-accent) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* ── Soft Ambient Vignette — Gives reading comfort without hiding the instruments ── */}
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-700"
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 35%, rgba(0,0,0,0.45) 0%, transparent 80%)",
        }}
      />
    </div>
  );
}
