import { existsSync } from "node:fs";
import path from "node:path";
import { business } from "@/config/business";

/**
 * Which portrait file the client has dropped in public/founder/ — or a remote
 * URL set via NEXT_PUBLIC_FOUNDER_PORTRAIT_URL.
 * The founders page + homepage use this server-side check so the UI upgrades
 * automatically once the photo lands, and never shows a broken image.
 */
const CANDIDATES = ["portrait.jpg", "portrait.png", "portrait.webp", "portrait.jpeg"];

export function getFounderPortrait(): { src: string; hasImage: boolean } {
  // 1) Explicit remote URL (env var) — wins over the local drop-slot.
  const remote = process.env.NEXT_PUBLIC_FOUNDER_PORTRAIT_URL;
  if (remote && /^https?:\/\//.test(remote)) {
    return { src: remote, hasImage: true };
  }

  // 2) Local drop-slot: public/founder/portrait.{jpg,png,webp,jpeg}
  const dir = path.join(process.cwd(), "public", "founder");
  for (const file of CANDIDATES) {
    if (existsSync(path.join(dir, file))) {
      return { src: `/founder/${file}`, hasImage: true };
    }
  }

  return { src: business.founder.portraitPath, hasImage: false };
}
