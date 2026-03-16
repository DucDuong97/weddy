#!/usr/bin/env node
/**
 * Usage:
 *   CDN_URL=https://cdn.example.com node scripts/build-cdn.js
 *
 * Reads index.html, rewrites all local asset references to point at the
 * CDN origin, and writes the result to dist/index.html.
 *
 * Patterns handled:
 *   src="assets/…"            → src="<CDN>/assets/…"
 *   data-full="assets/…"      → data-full="<CDN>/assets/…"
 *   url('assets/…')           → url('<CDN>/assets/…')
 *   href="fav.webp/png"       → href="<CDN>/fav.…"
 *   src="fav.webp"            → src="<CDN>/fav.webp"
 *   href="style.css…"         → href="<CDN>/style.css…"
 *   src="script.js…"          → src="<CDN>/script.js…"
 */

const fs   = require("fs");
const path = require("path");

const CDN_URL = (process.env.CDN_URL || "").replace(/\/$/, "");

if (!CDN_URL) {
  console.error("ERROR: CDN_URL environment variable is required.");
  console.error("  CDN_URL=https://cdn.example.com node scripts/build-cdn.js");
  process.exit(1);
}

const SRC  = path.resolve(__dirname, "../index.html");
const DIST = path.resolve(__dirname, "../dist/index.html");

let html = fs.readFileSync(SRC, "utf8");

const rules = [
  // <img src="assets/…"> / <audio src="assets/…"> / <script src="assets/…">
  [/(src=")assets\//g,       `$1${CDN_URL}/assets/`],

  // data-full="assets/…"  (gallery lightbox)
  [/(data-full=")assets\//g, `$1${CDN_URL}/assets/`],

  // background-image: url('assets/…')
  [/(url\(')assets\//g,      `$1${CDN_URL}/assets/`],

  // Favicon hrefs/srcs at root: fav.webp, fav.png
  [/((?:src|href)=")(fav\.[a-z]+)/g, `$1${CDN_URL}/$2`],

  // <link rel="stylesheet" href="style.css…">
  [/(href=")(style\.css)/g,  `$1${CDN_URL}/$2`],

  // <script src="script.js…">
  [/(src=")(script\.js)/g,   `$1${CDN_URL}/$2`],
];

for (const [pattern, replacement] of rules) {
  html = html.replace(pattern, replacement);
}

fs.mkdirSync(path.dirname(DIST), { recursive: true });
fs.writeFileSync(DIST, html, "utf8");

console.log(`✓  Written → ${path.relative(process.cwd(), DIST)}`);
console.log(`   CDN base: ${CDN_URL}`);
