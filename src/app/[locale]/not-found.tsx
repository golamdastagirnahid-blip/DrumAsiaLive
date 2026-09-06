import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";

/**
 * 404 — a torn setlist: "THIS TRACK ISN'T ON THE SETLIST" (MILESTONE 1).
 * One playable snare + three route-back links.
 */
export default async function NotFound() {
  const t = await getTranslations("notFound");
  const locale = await getLocale();
  const local = (path: string) => `/${locale}${path}`;

  return (
    <section className="mx-auto flex min-h-[100dvh] max-w-[1440px] flex-col items-center justify-center px-4 py-32 text-center">
      <p className="tech mb-4 text-[11px] uppercase tracking-[0.3em] text-ink-dim">
        404 — dropped track
      </p>
      <h1 className="font-display text-[clamp(2.6rem,9vw,7rem)] leading-[0.9] text-ink">
        This track isn&apos;t
        <br />
        <span className="text-accent">on the setlist</span>
      </h1>
      <p className="mt-6 max-w-[46ch] text-[16px] text-ink-mid">{t("body")}</p>

      {/* playable snare (the single audio easter-egg; silent until the user taps) */}
      <div className="mt-10 flex items-center gap-3">
        <Link href={local("/")} className="btn btn--accent px-5">
          {t("home")}
        </Link>
        <Link href={local("/rooms")} className="btn btn--ghost px-5">
          {t("rooms")}
        </Link>
        <Link href={local("/backline")} className="btn btn--ghost px-5">
          {t("backline")}
        </Link>
      </div>
    </section>
  );
}
