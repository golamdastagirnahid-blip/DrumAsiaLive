// One-off helper: downloads self-hosted Latin-subset woff2 files from Google
// Fonts into src/app/fonts/, for use with next/font/local. Run with:
//   node scripts/fetch-fonts.mjs
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("src/app/fonts");
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

const REQUESTS = [
  { family: "Anton", weights: [400] },
  { family: "JetBrains Mono", weights: [400, 500, 700] },
  { family: "Inter", weights: [400, 500, 600, 700] },
];

const cssUrl = (family, weights) => {
  const f = family.replace(/ /g, "+");
  const w = weights.map((x) => `0,${x}`).join(";");
  return `https://fonts.googleapis.com/css2?family=${f}:ital,wght@${w}&display=swap`;
};

function slug(family) {
  return family.toLowerCase().replace(/ /g, "-");
}

await mkdir(OUT, { recursive: true });

const downloads = [];

for (const req of REQUESTS) {
  const res = await fetch(cssUrl(req.family, req.weights), {
    headers: { "User-Agent": UA },
  });
  const css = await res.text();

  // Split into @font-face blocks.
  const blocks = css.match(/@font-face\s*{[^}]+}/g) ?? [];
  for (const block of blocks) {
    // Keep only the latin subset (unicode-range U+0000-00FF).
    if (!/U\+0000-00FF/.test(block)) continue;
    const weight = (block.match(/font-weight:\s*(\d+)/) ?? [])[1] ?? "400";
    const url = (block.match(/url\((https:[^)]+\.woff2)\)/) ?? [])[1];
    if (!url) continue;
    const filename = `${slug(req.family)}-latin-${weight}.woff2`;
    downloads.push({ filename, url, family: req.family, weight });
  }
}

for (const d of downloads) {
  const res = await fetch(d.url, { headers: { "User-Agent": UA } });
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(path.join(OUT, d.filename), buf);
  console.log(`✓ ${d.filename} (${buf.length} bytes)`);
}

console.log(`\nDownloaded ${downloads.length} font files.`);
