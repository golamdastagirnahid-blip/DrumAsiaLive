"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * <EquipmentBrandTitle>
 * "DRUM ASIA LIVE" — Handcrafted Luxury Equipment Typography.
 * Every letter and element is built from iconic stage and studio instruments:
 *  - D: Bass drum shell, hoop, tension rods & kick pedal beater
 *  - R: Studio vocal condenser microphone & boom stand shock-mount
 *  - U: Curved studio monitor headphone band & gold-plated 1/4" audio cable
 *  - M: Twin dynamic stage microphones angled in stereo pair
 *  - ASIA: Equalizer fader console tracks, guitar strings, and crossed drumsticks
 *  - LIVE: Vacuum tube amplifier cage, amber neon glow & pulsating VU meter
 */
export function EquipmentBrandTitle({ className }: { className?: string }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => !p);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("relative w-full select-none", className)}>
      {/* Precision Machined Studio Equipment Badge */}
      <div className="relative overflow-hidden rounded-[14px] border border-hairline-strong bg-gradient-to-b from-panel/90 via-panel-2/95 to-base/95 p-4 sm:p-6 md:p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_var(--gel-glow)]">
        {/* Four Corner Machined Hex Screws */}
        <span className="screw screw--tl" aria-hidden />
        <span className="screw screw--tr" aria-hidden />
        <span className="screw screw--bl" aria-hidden />
        <span className="screw screw--br" aria-hidden />

        {/* Top Equipment Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline/80 pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
            </span>
            <span className="tech text-[10px] sm:text-[11px] font-semibold tracking-[0.28em] text-accent uppercase">
              STUDIO EQUIPMENT TYPOGRAPHY · MASTER SPEC
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="tech text-[9px] uppercase tracking-[0.2em] text-ink-dim hidden sm:inline">
              ANALOG CONSOLE · 24-BIT / 96KHZ
            </span>
            <span className="rounded-[3px] border border-accent/40 bg-accent/10 px-2 py-0.5 tech text-[9px] font-mono tracking-widest text-accent font-bold">
              EST. 2014
            </span>
          </div>
        </div>

        {/* The World-Class Equipment Typography Display */}
        <div className="relative my-4 sm:my-6 flex justify-center items-center py-2 sm:py-4">
          <svg
            viewBox="0 0 920 180"
            className="w-full h-auto max-w-[900px] overflow-visible drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
            aria-label="DRUM ASIA LIVE crafted with musical and studio equipment"
          >
            <defs>
              {/* Luxury Gold & Brushed Steel Gradients */}
              <linearGradient id="goldBrass" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF1B8" />
                <stop offset="35%" stopColor="#FFA31A" />
                <stop offset="70%" stopColor="#C97800" />
                <stop offset="100%" stopColor="#E29419" />
              </linearGradient>

              <linearGradient id="chromeSteel" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#D8DCE3" />
                <stop offset="70%" stopColor="#8A92A0" />
                <stop offset="100%" stopColor="#EAEFF5" />
              </linearGradient>

              <linearGradient id="tubeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF4500" />
                <stop offset="50%" stopColor="#FFA31A" />
                <stop offset="100%" stopColor="#FF2200" />
              </linearGradient>

              <filter id="neonBloom" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* ═══════════ "DRUM" (Built with Drums, Cymbals & Microphones) ═══════════ */}
            <g id="letter-D" transform="translate(15, 10)">
              {/* Bass Drum Rim & Shell */}
              <path
                d="M 20 20 L 20 130 C 75 130, 95 105, 95 75 C 95 45, 75 20, 20 20 Z"
                fill="none"
                stroke="url(#chromeSteel)"
                strokeWidth="11"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Inner Resonant Head Texture */}
              <path
                d="M 32 32 L 32 118 C 68 118, 80 100, 80 75 C 80 50, 68 32, 32 32 Z"
                fill="none"
                stroke="url(#goldBrass)"
                strokeWidth="3.5"
                opacity="0.85"
              />
              {/* Drum Tuning Lugs / Chrome Tension Rods */}
              <circle cx="20" cy="20" r="5" fill="url(#goldBrass)" />
              <circle cx="20" cy="55" r="4" fill="url(#chromeSteel)" />
              <circle cx="20" cy="95" r="4" fill="url(#chromeSteel)" />
              <circle cx="20" cy="130" r="5" fill="url(#goldBrass)" />
              <circle cx="68" cy="24" r="4" fill="url(#chromeSteel)" />
              <circle cx="95" cy="75" r="5.5" fill="url(#goldBrass)" />
              <circle cx="68" cy="126" r="4" fill="url(#chromeSteel)" />
              {/* Kick Drum Beater Head inside D */}
              <line x1="32" y1="75" x2="62" y2="75" stroke="url(#chromeSteel)" strokeWidth="3" />
              <rect x="58" y="66" width="9" height="18" rx="3" fill="url(#goldBrass)" />
            </g>

            <g id="letter-R" transform="translate(130, 10)">
              {/* Condenser Mic Stand Stem */}
              <line x1="20" y1="20" x2="20" y2="130" stroke="url(#chromeSteel)" strokeWidth="11" strokeLinecap="round" />
              {/* Microphone Capsule Mesh Arch */}
              <path
                d="M 20 20 L 65 20 C 85 20, 85 68, 65 68 L 20 68"
                fill="none"
                stroke="url(#goldBrass)"
                strokeWidth="11"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Boom Arm Diagonal Support forming the leg of R */}
              <path
                d="M 45 68 L 82 130"
                stroke="url(#chromeSteel)"
                strokeWidth="11"
                strokeLinecap="round"
              />
              {/* Microphone Shock Mount Ring */}
              <circle cx="50" cy="44" r="14" fill="none" stroke="url(#chromeSteel)" strokeWidth="2.5" strokeDasharray="4 2" />
              <circle cx="50" cy="44" r="6" fill="url(#tubeGlow)" opacity="0.9" />
            </g>

            <g id="letter-U" transform="translate(235, 10)">
              {/* Audio Cable & Headphone Band Arc */}
              <path
                d="M 22 20 L 22 85 C 22 130, 80 130, 80 85 L 80 20"
                fill="none"
                stroke="url(#chromeSteel)"
                strokeWidth="11"
                strokeLinecap="round"
              />
              {/* Gold Plated 1/4" Jack Connectors at Tips of U */}
              <rect x="17" y="14" width="10" height="18" rx="2" fill="url(#goldBrass)" />
              <rect x="75" y="14" width="10" height="18" rx="2" fill="url(#goldBrass)" />
              <circle cx="22" cy="14" r="2.5" fill="#000" />
              <circle cx="80" cy="14" r="2.5" fill="#000" />
              {/* Inner Cable Coil */}
              <path
                d="M 33 24 L 33 82 C 33 115, 69 115, 69 82 L 69 24"
                fill="none"
                stroke="url(#goldBrass)"
                strokeWidth="2.5"
                opacity="0.75"
              />
            </g>

            <g id="letter-M" transform="translate(340, 10)">
              {/* Twin Angled Dynamic Stage Mics forming M */}
              <line x1="18" y1="130" x2="18" y2="24" stroke="url(#chromeSteel)" strokeWidth="10" strokeLinecap="round" />
              {/* Mic Grille 1 */}
              <circle cx="18" cy="22" r="9" fill="url(#goldBrass)" />
              {/* Diagonal Cross-over */}
              <path
                d="M 18 26 L 56 95 L 94 26"
                fill="none"
                stroke="url(#chromeSteel)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Right Vertical */}
              <line x1="94" y1="24" x2="94" y2="130" stroke="url(#chromeSteel)" strokeWidth="10" strokeLinecap="round" />
              {/* Mic Grille 2 */}
              <circle cx="94" cy="22" r="9" fill="url(#goldBrass)" />
              {/* Center Mixer Peak Indicator */}
              <circle cx="56" cy="95" r="4.5" fill="url(#tubeGlow)" />
            </g>

            {/* ═══════════ "ASIA" (Crossed Drumsticks, Guitar Strings, Faders) ═══════════ */}
            <g id="word-ASIA" transform="translate(480, 15)">
              {/* Background Crossed Drumsticks */}
              <line x1="20" y1="125" x2="230" y2="25" stroke="url(#goldBrass)" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
              <line x1="20" y1="25" x2="230" y2="125" stroke="url(#goldBrass)" strokeWidth="4" strokeLinecap="round" opacity="0.3" />

              {/* A */}
              <g transform="translate(0, 0)">
                <path d="M 28 125 L 52 25 L 76 125" fill="none" stroke="url(#chromeSteel)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="38" y1="90" x2="66" y2="90" stroke="url(#goldBrass)" strokeWidth="5" strokeLinecap="round" />
              </g>

              {/* S (Curved Microphone XLR snake cable) */}
              <g transform="translate(70, 0)">
                <path
                  d="M 52 38 C 50 25, 20 24, 20 50 C 20 80, 56 75, 56 102 C 56 128, 22 128, 16 112"
                  fill="none"
                  stroke="url(#chromeSteel)"
                  strokeWidth="8.5"
                  strokeLinecap="round"
                />
                <circle cx="52" cy="38" r="3.5" fill="url(#goldBrass)" />
                <circle cx="16" cy="112" r="3.5" fill="url(#goldBrass)" />
              </g>

              {/* I (Guitar Fretboard & String with Volume Knob) */}
              <g transform="translate(136, 0)">
                <line x1="22" y1="25" x2="22" y2="125" stroke="url(#chromeSteel)" strokeWidth="9" strokeLinecap="round" />
                <line x1="12" y1="25" x2="32" y2="25" stroke="url(#goldBrass)" strokeWidth="4" strokeLinecap="round" />
                <line x1="12" y1="125" x2="32" y2="125" stroke="url(#goldBrass)" strokeWidth="4" strokeLinecap="round" />
                {/* Volume Knob centered on I */}
                <circle cx="22" cy="75" r="7" fill="#15171B" stroke="url(#goldBrass)" strokeWidth="2.5" />
                <line x1="22" y1="71" x2="22" y2="75" stroke="#FFF" strokeWidth="1.5" />
              </g>

              {/* A */}
              <g transform="translate(178, 0)">
                <path d="M 28 125 L 52 25 L 76 125" fill="none" stroke="url(#chromeSteel)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="38" y1="90" x2="66" y2="90" stroke="url(#goldBrass)" strokeWidth="5" strokeLinecap="round" />
              </g>
            </g>

            {/* ═══════════ "LIVE" (Illuminated Vacuum Tube & VU Meter Neon) ═══════════ */}
            <g id="badge-LIVE" transform="translate(745, 12)">
              {/* Glowing Vintage Vacuum Tube Housing */}
              <rect
                x="0"
                y="15"
                width="155"
                height="115"
                rx="10"
                fill="#0B0D11"
                stroke="url(#tubeGlow)"
                strokeWidth="2.5"
                filter="url(#neonBloom)"
              />
              <rect
                x="4"
                y="19"
                width="147"
                height="107"
                rx="8"
                fill="#151820"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />

              {/* Analog VU Meter Arc & Pulsing Needle */}
              <path
                d="M 25 50 Q 77 30 130 50"
                fill="none"
                stroke="rgba(255, 163, 26, 0.4)"
                strokeWidth="2"
              />
              <line
                x1="77"
                y1="52"
                x2={pulse ? "105" : "90"}
                y2="34"
                stroke="#FF4500"
                strokeWidth="2"
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
              <circle cx="77" cy="52" r="3" fill="url(#goldBrass)" />

              {/* Glowing "LIVE" Letters */}
              <text
                x="77"
                y="105"
                textAnchor="middle"
                fontFamily="'Anton', Impact, sans-serif"
                fontSize="42"
                letterSpacing="4"
                fill="url(#goldBrass)"
                filter="url(#neonBloom)"
                className="font-bold"
              >
                LIVE
              </text>

              {/* Status Indicator Lamps */}
              <circle cx="20" cy="30" r="3" fill="#37D18A" className="animate-pulse" />
              <circle cx="135" cy="30" r="3" fill="#E1332B" className="animate-pulse" />
            </g>
          </svg>
        </div>

        {/* Bottom Studio Console Spec Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline/80 pt-3 sm:pt-4 text-[11px] text-ink-mid">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 tech text-[10px] uppercase tracking-wider text-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              DRUMS · GUITARS · KEYS · PA · RECORDING
            </span>
          </div>

          <div className="flex items-center gap-2 tech text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
            DESA SRI HARTAMAS · KUALA LUMPUR
          </div>
        </div>
      </div>
    </div>
  );
}
