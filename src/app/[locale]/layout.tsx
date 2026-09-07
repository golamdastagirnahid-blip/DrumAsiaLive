import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import { routing } from "@/i18n/routing";
import { site } from "@/config/site";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TimeProvider } from "@/components/providers/time-provider";
import { SoundProvider } from "@/components/providers/sound-provider";
import { SkipLink } from "@/components/skip-link";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TransportBar } from "@/components/transport-bar";
import { InstrumentThemeBackground } from "@/components/instrument-theme-background";
import { business } from "@/config/business";

import "../globals.css";
import "@fontsource/anton/latin-400.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-500.css";
import "@fontsource/jetbrains-mono/latin-700.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: { default: t("title"), template: `%s — ${business.brand}` },
    description: t("description"),
    metadataBase: new URL(site.url),
    alternates: {
      canonical: "/",
      languages: { en: "/en", ms: "/ms" },
    },
    openGraph: {
      siteName: business.brand,
      type: "website",
      title: t("title"),
      description: t("description"),
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: site.themeColor,
  width: 1280,
  initialScale: 0.3,
  minimumScale: 0.2,
  maximumScale: 5,
  userScalable: true,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Script id="da-gel-init" strategy="beforeInteractive">
          {`(function(){try{var g=localStorage.getItem('da-gel');if(!g||['console','drum-stage','guitar-lounge','synth-keys','sky-session','pure-dark','stage-lights','amber-wash','cool-wash','house-lights'].indexOf(g)===-1){g='drum-stage';}document.documentElement.setAttribute('data-gel',g);}catch(e){document.documentElement.setAttribute('data-gel','drum-stage');}})();`}
        </Script>
        <NextIntlClientProvider>
          <ThemeProvider>
            <InstrumentThemeBackground />
            <TimeProvider>
              <SoundProvider>
                <SkipLink />
                <AnnouncementBar />
                <Header />
                <main id="main">{children}</main>
                <Footer />
                <TransportBar />
                <div className="grain" aria-hidden />
              </SoundProvider>
            </TimeProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
