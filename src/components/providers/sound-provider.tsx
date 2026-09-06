"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * SoundProvider — all site audio starts muted, always (SECTION 2.1 MASTER MUTE).
 * The AudioContext is created ONLY after a genuine user gesture (first unmute),
 * and is suspended when the tab is blurred.
 */
interface SoundContextValue {
  muted: boolean;
  toggleMuted: () => void;
  /** Lazily create + resume the shared AudioContext. `null` if unsupported. */
  ensureContext: () => AudioContext | null;
}

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(true);
  const ctxRef = useRef<AudioContext | null>(null);

  const ensureContext = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    if (!ctxRef.current) {
      try {
        ctxRef.current = new Ctor();
      } catch {
        return null;
      }
    }
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  }, []);

  const toggleMuted = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      if (!next) {
        // Unmuting IS the user gesture that authorises audio.
        const ctx = ensureContext();
        if (ctx?.state === "suspended") void ctx.resume();
      } else {
        ctxRef.current?.suspend();
      }
      return next;
    });
  }, [ensureContext]);

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        void ctxRef.current?.suspend();
      } else if (!muted) {
        void ctxRef.current?.resume();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [muted]);

  return (
    <SoundContext.Provider value={{ muted, toggleMuted, ensureContext }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within <SoundProvider>");
  return ctx;
}
