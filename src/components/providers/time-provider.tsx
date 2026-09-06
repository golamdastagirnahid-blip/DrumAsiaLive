"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { nowInKL } from "@/lib/time";

/**
 * Kuala Lumpur wall-clock time, correct on ANY visitor device.
 * `now` is a Date whose local fields equal KL time (see lib/time.ts).
 *
 * Starts `null` and hydrates on mount — consumers render a static placeholder
 * until then, so server markup and first client paint always match (no
 * hydration mismatch on the timecode).
 */
interface TimeContextValue {
  now: Date | null;
}

const TimeContext = createContext<TimeContextValue>({ now: null });

export function TimeProvider({ children }: { children: ReactNode }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(nowInKL());
    const id = window.setInterval(() => setNow(nowInKL()), 500);
    return () => window.clearInterval(id);
  }, []);

  return <TimeContext.Provider value={{ now }}>{children}</TimeContext.Provider>;
}

export function useTime(): TimeContextValue {
  return useContext(TimeContext);
}
