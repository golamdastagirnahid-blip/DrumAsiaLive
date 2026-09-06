"use client";

import { useEffect, useState } from "react";
import {
  Car,
  Bus,
  Footprints,
  Bike,
  Grab as GrabIcon,
  MapPin,
  Copy,
  Share2,
  Check,
} from "lucide-react";
import { branches, getBranch, transit, type Branch } from "@/config/business";
import { grabDeepLink, wazeLink, googleMapsLink, appleMapsLink } from "@/config/rides";
import { buildWhatsAppLink, openWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { Confirm } from "@/components/confirm";

type Mode = "grab" | "car" | "moto" | "transit" | "walk";

const MODES: { id: Mode; label: string; Icon: typeof Car }[] = [
  { id: "grab", label: "Grab / E-hailing", Icon: GrabIcon },
  { id: "car", label: "My car", Icon: Car },
  { id: "moto", label: "Motorbike", Icon: Bike },
  { id: "transit", label: "Public transport", Icon: Bus },
  { id: "walk", label: "Walking", Icon: Footprints },
];

/**
 * <LoadIn> — arrival intelligence (MILESTONE 4, static-fallback edition).
 * No fabricated mode detection: real signals only (saved preference, optional
 * permission-gated geolocation). Works fully with no permission and no JS APIs.
 */
export function LoadIn() {
  const [branchId, setBranchId] = useState<Branch["id"]>("hartamas");
  const [mode, setMode] = useState<Mode | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("da-arrival-mode");
      if (saved && MODES.some((m) => m.id === saved)) setMode(saved as Mode);
      else setMode("grab");
    } catch {
      setMode("grab");
    }
  }, []);

  const select = (m: Mode) => {
    setMode(m);
    try {
      window.localStorage.setItem("da-arrival-mode", m);
    } catch {
      /* noop */
    }
  };

  const branch = getBranch(branchId);
  const target = branch.geo ?? { lat: 3.16319, lng: 101.65226 };
  const rideTarget = { name: branch.name, ...target };

  const copyAddress = async () => {
    const text = branch.address ?? branch.name;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const shareWithBand = () => {
    openWhatsApp({
      intent: "general",
      source: "Load-In / Share location",
      subject: "Studio location — see you there",
      message: `${branch.name}\n${branch.address ?? ""}\nWaze: search "${branch.wazeTerm ?? "Drum Asia Hartamas"}"`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Branch switcher */}
      <div role="tablist" aria-label="Branch" className="flex flex-wrap gap-2">
        {branches.map((b) => (
          <button
            key={b.id}
            role="tab"
            aria-selected={branchId === b.id}
            onClick={() => setBranchId(b.id)}
            className={cn(
              "tech rounded-[4px] border px-3 py-2 text-[12px] uppercase tracking-[0.14em] transition-colors",
              branchId === b.id
                ? "border-accent bg-panel-2 text-accent"
                : "border-hairline text-ink-mid hover:text-ink",
            )}
          >
            {b.shortName}
          </button>
        ))}
      </div>

      {/* Destination card */}
      <div className="panel p-6">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
          <div className="min-w-0 flex-1">
            <h3 className="text-[1.2rem] text-ink">{branch.name}</h3>
            <p className="tech mt-1 text-[13px] leading-relaxed text-ink-mid">
              {branch.address ?? (
                <Confirm note="Full street address pending">Full address — confirm on WhatsApp</Confirm>
              )}
            </p>
            {branch.venueNote && (
              <p className="mt-1.5 text-[13px] italic text-ink-dim">{branch.venueNote}</p>
            )}
            {branch.hoursNote && (
              <p className="tech mt-1.5 text-[11px] text-ink-dim">{branch.hoursNote}</p>
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={copyAddress} className="btn btn--ghost h-10 px-3 text-[11px]">
            {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
            {copied ? "Copied" : "Copy address"}
          </button>
          <button type="button" onClick={shareWithBand} className="btn btn--ghost h-10 px-3 text-[11px]">
            <Share2 className="h-3.5 w-3.5" aria-hidden />
            Share location with my band
          </button>
        </div>
      </div>

      {/* Mode selector */}
      <div>
        <div className="tech mb-2 text-[10px] uppercase tracking-[0.2em] text-ink-dim">
          How are you getting here?
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5" role="group" aria-label="Travel mode">
          {MODES.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => select(id)}
              aria-pressed={mode === id}
              className={cn(
                "flex min-h-[64px] flex-col items-center justify-center gap-1.5 rounded-[6px] border p-2 text-center transition-colors",
                mode === id ? "border-accent bg-panel-2" : "border-hairline hover:border-hairline-strong",
              )}
            >
              <Icon className={cn("h-5 w-5", mode === id ? "text-accent" : "text-ink-mid")} aria-hidden />
              <span className="tech text-[9px] uppercase tracking-[0.08em] text-ink-mid">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mode panels */}
      {mode === "grab" && (
        <div className="panel p-6">
          <h3 className="text-[1.15rem] text-ink">Grab / E-hailing</h3>
          <p className="mt-1 text-[14px] text-ink-mid">
            Book a Grab straight to the studio — the destination name and coordinates are pre-filled.
          </p>
          <a href={grabDeepLink(rideTarget)} className="btn btn--accent mt-4 px-5" target="_blank" rel="noopener noreferrer">
            Book a Grab to DrumAsia
          </a>
          <p className="tech mt-3 text-[11px] text-ink-dim">
            On desktop, scan the QR in the Grab app — the link opens the Grab app on mobile.
          </p>
        </div>
      )}

      {mode === "car" && (
        <div className="panel p-6">
          <h3 className="text-[1.15rem] text-ink">Driving</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <a href={wazeLink(branch.wazeTerm ?? "Drum Asia Hartamas", rideTarget)} target="_blank" rel="noopener noreferrer" className="btn btn--ghost h-11 px-3 text-[12px]">
              Waze
            </a>
            <a href={googleMapsLink(rideTarget)} target="_blank" rel="noopener noreferrer" className="btn btn--ghost h-11 px-3 text-[12px]">
              Google Maps
            </a>
            <a href={appleMapsLink(rideTarget)} target="_blank" rel="noopener noreferrer" className="btn btn--ghost h-11 px-3 text-[12px]">
              Apple Maps
            </a>
          </div>
          <p className="tech mt-3 text-[11px] text-ink-dim">
            Search Waze for “{branch.wazeTerm ?? "Drum Asia Hartamas"}”.
          </p>
          <div className="mt-3 border-t border-hairline pt-3">
            <p className="text-[14px] text-ink-mid">
              Parking at Wisma CKL — availability, cost and after-hours access{" "}
              <Confirm note="Parking details pending">to be confirmed</Confirm>. Nearest load-in
              bay and lift/stairs{" "}
              <Confirm note="Load-in details pending">to be confirmed</Confirm>.
            </p>
          </div>
        </div>
      )}

      {mode === "moto" && (
        <div className="panel p-6">
          <h3 className="text-[1.15rem] text-ink">Motorbike</h3>
          <p className="mt-1 text-[14px] text-ink-mid">
            Bike parking location and shelter{" "}
            <Confirm note="Bike parking details pending">to be confirmed</Confirm>. Rain
            warning (live weather) is coming in the next milestone.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <a href={wazeLink(branch.wazeTerm ?? "Drum Asia Hartamas", rideTarget)} target="_blank" rel="noopener noreferrer" className="btn btn--ghost h-11 px-3 text-[12px]">
              Waze
            </a>
            <a href={googleMapsLink(rideTarget)} target="_blank" rel="noopener noreferrer" className="btn btn--ghost h-11 px-3 text-[12px]">
              Google Maps
            </a>
            <a href={appleMapsLink(rideTarget)} target="_blank" rel="noopener noreferrer" className="btn btn--ghost h-11 px-3 text-[12px]">
              Apple Maps
            </a>
          </div>
        </div>
      )}

      {mode === "transit" && (
        <div className="panel p-6">
          <h3 className="text-[1.15rem] text-ink">Public transport</h3>
          <p className="tech mt-2 text-[12px] text-ink-mid">
            Buses {transit.buses.join(" · ")}
          </p>
          <ul className="mt-4 space-y-2">
            {transit.stops.map((s) => (
              <li key={s.name} className="flex items-start gap-3 text-[14px] text-ink-mid">
                <span className="lamp lamp--open mt-1.5" aria-hidden />
                <span>
                  <strong className="text-ink">{s.name}</strong>
                  {s.code && <span className="tech text-ink-dim"> ({s.code})</span>} — {s.distance}
                  {s.walk ? ` · ${s.walk}` : ""}
                  {s.confidence === "confirm" && " · [CONFIRM]"}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[14px] text-ink-mid">
            Nearest KTM: <strong className="text-ink">{transit.nearestKtm.name}</strong>{" "}
            {transit.nearestKtm.distance} · {transit.nearestKtm.walk}.
          </p>
          <p className="mt-2 text-[14px] text-ink-mid">{transit.fromSemantanHint}</p>
          <a href={googleMapsLink(rideTarget)} target="_blank" rel="noopener noreferrer" className="btn btn--ghost mt-4 px-5">
            Walking route from the stop
          </a>
        </div>
      )}

      {mode === "walk" && (
        <div className="panel p-6">
          <h3 className="text-[1.15rem] text-ink">Walking</h3>
          <p className="mt-1 text-[14px] text-ink-mid">
            Landmarks: {transit.surrounding.join(" · ")}. We&apos;re at{" "}
            {branch.address ?? branch.name}.
          </p>
          <a href={googleMapsLink(rideTarget)} target="_blank" rel="noopener noreferrer" className="btn btn--ghost mt-4 px-5">
            Walking directions
          </a>
        </div>
      )}
    </div>
  );
}
