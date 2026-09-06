/**
 * Self-hosted fonts (subset to Latin) via @fontsource.
 * Served from our own bundle — no third-party font requests.
 * Per spec: preload ONLY the display face used in the hero.
 */
import "@fontsource/anton/latin-400.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-500.css";
import "@fontsource/jetbrains-mono/latin-700.css";

// Preload the hero display face (Anton 400).
export { default as displayFontWoff2 } from "@fontsource/anton/files/anton-latin-400-normal.woff2";
