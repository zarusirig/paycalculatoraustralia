#!/usr/bin/env node
/**
 * Meta / structured-data hygiene check on the static export.
 *
 *   npm run check:meta                 # against ./out (run `next build --webpack` first)
 *   npm run check:meta -- --out=dir    # against another export directory
 *   npm run check:meta -- --verbose    # list every offending URL (default: first 15 per rule)
 *   npm run check:meta -- --strict     # exit 1 on length warnings too
 *
 * Errors (exit 1):
 *   - indexable page without og:image or og:url
 *   - JSON-LD dateModified equal to the build date (a `new Date()` in the page,
 *     i.e. fake freshness) when the page's truthful last-modified date
 *     (lib/sitemap-lastmod.ts) is not also the build day
 *   - JSON-LD that does not parse
 * Warnings (exit 0 unless --strict):
 *   - <title> longer than 65 characters, meta description longer than 165
 *   - description ending in "…" (fitDescription had to cut mid-sentence)
 *   - Article / NewsArticle / BlogPosting without datePublished, or with
 *     datePublished later than dateModified
 * Also an error: any `dateModified/datePublished: new Date()` in app/ or modules/.
 *
 * Pages with <meta name="robots" content="noindex"> are skipped.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);
const outDir = resolve(root, typeof args.out === "string" ? args.out : "out");
const LIMIT = args.verbose ? Infinity : 15;
const TITLE_MAX = 65;
const DESC_MAX = 165;

// Truthful per-page dates. lib/sitemap-lastmod.ts has only node: imports, so
// Node (>= 22.18) loads it directly with type stripping. It resolves paths
// from process.cwd().
process.chdir(root);
let lastmod = null;
try {
  lastmod = await import(pathToFileURL(join(root, "lib/sitemap-lastmod.ts")).href);
} catch (e) {
  console.warn(`[check:meta] could not load lib/sitemap-lastmod.ts (${e.message}); build-date check is strict`);
}

function walk(dir, files = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) walk(full, files);
    else if (e.name.endsWith(".html")) files.push(full);
  }
  return files;
}

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);

function metaContent(html, attr, name) {
  const re = new RegExp(`<meta\\s[^>]*${attr}="${name}"[^>]*>`, "i");
  const tag = html.match(re)?.[0];
  if (!tag) return null;
  const c = tag.match(/content="([^"]*)"/i);
  return c ? decode(c[1]) : "";
}

const dayIn = (d, tz) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);

let files;
try {
  files = walk(outDir);
} catch {
  console.error(`[check:meta] no export at ${outDir}. Run \`npx next build --webpack\` first.`);
  process.exit(2);
}
const buildTime = statSync(join(outDir, "index.html")).mtime;
const buildDays = new Set([dayIn(buildTime, "UTC"), dayIn(buildTime, "Australia/Sydney")]);

const problems = {
  "missing og:image": [],
  "missing og:url": [],
  "JSON-LD parse error": [],
  "JSON-LD dateModified = build date": [],
  [`title > ${TITLE_MAX} chars`]: [],
  [`description > ${DESC_MAX} chars`]: [],
  "description cut with …": [],
  "Article without datePublished": [],
  "datePublished after dateModified": [],
};
const ERRORS = new Set(["missing og:image", "missing og:url", "JSON-LD parse error", "JSON-LD dateModified = build date"]);
let checked = 0;

function* nodes(value) {
  if (Array.isArray(value)) for (const v of value) yield* nodes(v);
  else if (value && typeof value === "object") {
    yield value;
    for (const v of Object.values(value)) yield* nodes(v);
  }
}

for (const file of files) {
  const html = readFileSync(file, "utf8");
  const robots = metaContent(html, "name", "robots") ?? "";
  if (/noindex/i.test(robots)) continue;
  const rel = relative(outDir, file);
  if (rel === "404.html" || rel.startsWith("_not-found")) continue;
  const url = "/" + rel.replace(/index\.html$/, "").replace(/\.html$/, "/");
  checked++;

  if (!metaContent(html, "property", "og:image")) problems["missing og:image"].push(url);
  if (!metaContent(html, "property", "og:url")) problems["missing og:url"].push(url);

  const title = decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  if (title.length > TITLE_MAX) problems[`title > ${TITLE_MAX} chars`].push(`${url}  (${title.length}) ${title}`);
  const desc = metaContent(html, "name", "description") ?? "";
  if (desc.length > DESC_MAX) problems[`description > ${DESC_MAX} chars`].push(`${url}  (${desc.length})`);
  // lib/seo-title.ts fitDescription() cut it mid-sentence: add a shorter form.
  if (desc.endsWith("…")) problems["description cut with …"].push(url);

  // The page's truthful last-modified time (ms), or null if unknown.
  let truthfulMs;
  const truthful = () => {
    if (truthfulMs === undefined) {
      const slug = url.replace(/^\/|\/$/g, "");
      truthfulMs = lastmod ? lastmod.lastModifiedForSlug(slug, buildTime).getTime() : null;
    }
    return truthfulMs;
  };
  // A build-day value is fine when the content really changed that day. Allow
  // 36h either side: date-only values are ambiguous between UTC and AEST.
  const matchesTruth = (ms) => truthful() !== null && Math.abs(truthful() - ms) < 36 * 3600e3;

  for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    let data;
    try {
      data = JSON.parse(m[1]);
    } catch {
      problems["JSON-LD parse error"].push(url);
      continue;
    }
    for (const node of nodes(data)) {
      const type = [].concat(node["@type"] ?? []);
      if (type.some((t) => ["Article", "NewsArticle", "BlogPosting", "TechArticle"].includes(t)) && !node.datePublished) {
        problems["Article without datePublished"].push(url);
      }
      if (typeof node.datePublished === "string" && typeof node.dateModified === "string" &&
          node.datePublished.slice(0, 10) > node.dateModified.slice(0, 10)) {
        problems["datePublished after dateModified"].push(`${url}  (${node.datePublished} > ${node.dateModified})`);
      }
      if (typeof node.dateModified === "string") {
        const d = new Date(node.dateModified.length === 10 ? `${node.dateModified}T12:00:00Z` : node.dateModified);
        const day = node.dateModified.length === 10 ? node.dateModified : dayIn(d, "Australia/Sydney");
        const nearBuild = node.dateModified.length > 10 && Math.abs(d.getTime() - buildTime.getTime()) < 3 * 3600e3;
        if ((buildDays.has(day) || nearBuild) && !matchesTruth(d.getTime())) {
          problems["JSON-LD dateModified = build date"].push(`${url}  (${node.dateModified})`);
        }
      }
    }
  }
}

// The HTML check above cannot tell a build-date value from a real edit made on
// the build day, so also catch the cause in the source: a JSON-LD date built
// from `new Date()` at render time.
problems["source: date* from new Date()"] = [];
ERRORS.add("source: date* from new Date()");
for (const dir of ["app", "modules"]) {
  for (const e of readdirSync(join(root, dir), { recursive: true, withFileTypes: true })) {
    if (!e.isFile() || !/\.tsx?$/.test(e.name)) continue;
    const full = join(e.parentPath ?? e.path, e.name);
    readFileSync(full, "utf8")
      .split("\n")
      .forEach((line, i) => {
        if (/\bdate(Modified|Published)\s*:\s*new Date\(\s*\)/.test(line)) {
          problems["source: date* from new Date()"].push(`${relative(root, full)}:${i + 1}`);
        }
      });
  }
}

let errors = 0;
let warnings = 0;
console.log(`[check:meta] ${checked} indexable pages in ${relative(root, outDir) || "."} (build ${buildTime.toISOString()})`);
for (const [rule, list] of Object.entries(problems)) {
  const unique = [...new Set(list)];
  const isError = ERRORS.has(rule);
  if (isError) errors += unique.length;
  else warnings += unique.length;
  console.log(`\n${isError ? "ERROR" : "warn "} ${rule}: ${unique.length}`);
  for (const line of unique.slice(0, LIMIT)) console.log(`   ${line}`);
  if (unique.length > LIMIT) console.log(`   … ${unique.length - LIMIT} more (--verbose)`);
}
console.log(`\n[check:meta] ${errors} error(s), ${warnings} warning(s)`);
process.exit(errors || (args.strict && warnings) ? 1 : 0);
