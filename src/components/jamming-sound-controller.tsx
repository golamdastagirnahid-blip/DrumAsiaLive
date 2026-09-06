"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX, Play, Pause, Disc } from "lucide-react";
import { jammingAudio, type JammingAudioState } from "@/lib/jamming-audio";
import { cn } from "@/lib/utils";

/**
 * <JammingSoundController>
 * Live Jamming Room Sound Console:
 *  - On/Off button with active glowing ON AIR indicator
 *  - Rotary/slider volume controller (0% - 100%)
 *  - Real-time animated audio equalizer bars
 */
export function JammingSoundController({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const [audioState, setAudioState] = useState<JammingAudioState>({
    isPlaying: false,
    volume: 0.65,
    tempo: 96,
  });

  useEffect(() => {
    return jammingAudio.subscribe(setAudioState);
  }, []);

  const togglePlay = () => {
    jammingAudio.togglePlay();
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    jammingAudio.setVolume(val);
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2 rounded-[6px] border border-hairline bg-panel-2/90 px-3 py-1.5 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.5)]", className)}>
        {/* Play/Stop Button */}
        <button
          type="button"
          onClick={togglePlay}
          aria-label={audioState.isPlaying ? "Stop Jamming Room Audio" : "Play Jamming Room Audio"}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300",
            audioState.isPlaying
              ? "bg-accent text-black shadow-[0_0_12px_var(--gel-glow)] scale-105"
              : "border border-hairline text-ink-mid hover:text-accent hover:border-accent",
          )}
        >
          {audioState.isPlaying ? (
            <Pause className="h-3.5 w-3.5 fill-current" />
          ) : (
            <Play className="h-3.5 w-3.5 fill-current translate-x-0.5" />
          )}
        </button>

        {/* Status text & equalizer */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                audioState.isPlaying ? "bg-open animate-pulse shadow-[0_0_8px_#37d18a]" : "bg-ink-dim/40",
              )}
            />
            <span className="tech text-[9px] uppercase tracking-wider font-semibold text-ink">
              {audioState.isPlaying ? "JAM LIVE" : "JAM AUDIO"}
            </span>
          </div>
          {audioState.isPlaying && (
            <div className="flex items-end gap-0.5 h-2 mt-0.5">
              {[60, 100, 40, 80, 50].map((h, i) => (
                <span
                  key={i}
                  className="w-1 rounded-full bg-accent animate-pulse"
                  style={{ height: `${h}%`, animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Compact Volume Slider */}
        <div className="flex items-center gap-1 pl-1">
          <button
            type="button"
            onClick={() => jammingAudio.setVolume(audioState.volume > 0 ? 0 : 0.65)}
            className="text-ink-mid hover:text-accent transition-colors"
          >
            {audioState.volume === 0 ? (
              <VolumeX className="h-3.5 w-3.5" />
            ) : (
              <Volume2 className="h-3.5 w-3.5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={audioState.volume}
            onChange={handleVolume}
            className="h-1.5 w-14 accent-accent cursor-pointer rounded-full bg-panel"
            aria-label="Volume slider"
          />
        </div>
      </div>
    );
  }

  // Full Rich Studio Console Unit
  return (
    <div
      className={cn(
        "relative rounded-[12px] border border-hairline-strong bg-panel-2/95 p-4 sm:p-5 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_24px_var(--gel-glow)] select-none",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Master Play/Pause with ON AIR Lamp */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={audioState.isPlaying ? "Stop Jamming Session" : "Start Jamming Session"}
            className={cn(
              "relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border transition-all duration-300",
              audioState.isPlaying
                ? "border-accent bg-accent text-black shadow-[0_0_24px_var(--gel-glow)] scale-105"
                : "border-hairline-strong bg-panel text-ink hover:border-accent hover:text-accent",
            )}
          >
            {audioState.isPlaying ? (
              <Pause className="h-5 w-5 sm:h-6 sm:w-6 fill-current" />
            ) : (
              <Play className="h-5 w-5 sm:h-6 sm:w-6 fill-current translate-x-0.5" />
            )}
            <Disc
              className={cn(
                "absolute inset-0 m-auto h-full w-full opacity-20 pointer-events-none",
                audioState.isPlaying && "animate-spin text-black",
              )}
              style={{ animationDuration: "3s" }}
            />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-block h-2 w-2 rounded-full",
                  audioState.isPlaying
                    ? "bg-open animate-ping shadow-[0_0_10px_#37d18a]"
                    : "bg-warn shadow-[0_0_8px_#e8b62c]",
                )}
              />
              <span className="tech text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
                {audioState.isPlaying ? "LIVE JAMMING ROOM SESSION" : "STUDIO REHEARSAL AMBIENCE"}
              </span>
            </div>
            <h3 className="font-display text-[17px] sm:text-[20px] text-ink mt-0.5">
              {audioState.isPlaying ? "Hear the Room Reverb & Groove" : "Step Inside the Jamming Room"}
            </h3>
            <p className="tech text-[10px] sm:text-[11px] uppercase tracking-wider text-ink-dim">
              REAL-TIME WEB AUDIO SYNTHESIZER · 96 BPM · NO STREAMING DELAY
            </p>
          </div>
        </div>

        {/* Right: Master Volume & Animated EQ Bars */}
        <div className="flex items-center gap-5 sm:gap-6 bg-panel/80 px-4 py-2.5 rounded-[8px] border border-hairline">
          {/* Animated Equalizer Visualizer */}
          <div className="flex items-end gap-1 h-8 w-20 sm:w-24">
            {[40, 75, 95, 60, 30, 85, 100, 70, 45, 90, 65, 35].map((h, i) => (
              <span
                key={i}
                className={cn(
                  "w-1 sm:w-1.5 rounded-full transition-all duration-150",
                  audioState.isPlaying ? "bg-accent shadow-[0_0_8px_var(--gel-glow)]" : "bg-ink-dim/20",
                )}
                style={{
                  height: audioState.isPlaying ? `${Math.max(12, (h * (i % 3 + 1)) % 100)}%` : "15%",
                }}
              />
            ))}
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => jammingAudio.setVolume(audioState.volume > 0 ? 0 : 0.65)}
              className="text-ink hover:text-accent transition-colors"
              title="Mute / Unmute"
            >
              {audioState.volume === 0 ? (
                <VolumeX className="h-5 w-5 text-warn" />
              ) : (
                <Volume2 className="h-5 w-5 text-accent" />
              )}
            </button>
            <div className="flex flex-col gap-1">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={audioState.volume}
                onChange={handleVolume}
                aria-label="Master Jamming Room Volume"
                className="h-2 w-24 sm:w-32 accent-accent cursor-pointer rounded-full bg-base"
              />
              <div className="flex justify-between tech text-[9px] uppercase tracking-wider text-ink-dim">
                <span>VOL</span>
                <span className="text-accent font-semibold">{Math.round(audioState.volume * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
