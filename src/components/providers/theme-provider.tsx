"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { GELS, type GelId } from "@/config/gels";

export { GELS, type GelId };

const STORAGE_KEY = "da-gel";

interface ThemeContextValue {
  gel: GelId;
  setGel: (id: GelId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function initialGel(): GelId {
  if (typeof window === "undefined") return "drum-stage";
  // A beforeInteractive script may already have stamped `data-gel` on <html>.
  const stamped = document.documentElement.getAttribute("data-gel");
  if (stamped && GELS.some((g) => g.id === stamped)) return stamped as GelId;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && GELS.some((g) => g.id === saved)) return saved as GelId;
  } catch {
    /* private mode etc. */
  }
  return "drum-stage";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [gel, setGelState] = useState<GelId>("drum-stage");

  useEffect(() => {
    setGelState(initialGel());
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-gel", gel);
    try {
      window.localStorage.setItem(STORAGE_KEY, gel);
    } catch {
      /* noop */
    }
  }, [gel]);

  const setGel = useCallback((next: GelId) => {
    if (next === document.documentElement.getAttribute("data-gel")) return;
    const root = document.documentElement;

    // Lighting-board cue: fade out 200ms → swap gel → fade in 200ms.
    root.classList.add("gel-transition");
    root.classList.remove("gel-settled");

    window.setTimeout(() => {
      root.setAttribute("data-gel", next);
      setGelState(next);
      root.classList.add("gel-settled");
      window.setTimeout(() => {
        root.classList.remove("gel-transition", "gel-settled");
      }, 200);
    }, 200);
  }, []);

  return <ThemeContext.Provider value={{ gel, setGel }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}
