/**
 * Truthful <lastmod> values for the sitemap (build-time only, Node APIs).
 *
 * A page's lastmod is the most recent git commit that touched the files that
 * produce its content:
 *   - every file in its app/ route directory (excluding nested child routes),
 *   - the @/modules/* and @/lib/data/* files it imports, followed transitively
 *     (relative imports too) so a page body that lives in modules/guide/*.tsx,
 *     or an FAQ file next to it, counts.
 * Shared chrome (components/, lib/navigation, layout, modules/seo) and lib/constants are
 * deliberately NOT followed: nearly every page imports formatAUD/SITE_CONFIG
 * from there, and a nav or helper change is not a content change for Google.
 *
 * The page's visible "last reviewed" date (lib/authors.ts GUIDE_AUTHORSHIP) is
 * also honoured when it is later than the last commit.
 *
 * Fallbacks: if git is unavailable or the clone is shallow (every file would
 * report the shallow tip's date), or a file has no history yet (uncommitted),
 * the build date is used for that page.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APP = path.join(ROOT, "app");
const SOURCE_EXT = [".tsx", ".ts", ".json", ".md", ".mdx"];
const FOLLOW_PREFIXES = ["modules/", "lib/data/"];

let gitIndex: Map<string, number> | null | undefined;

/** path (relative to calc-boiler/) -> latest commit time (ms). null if git unusable. */
function loadGitIndex(): Map<string, number> | null {
  if (gitIndex !== undefined) return gitIndex;
  try {
    const shallow = execFileSync("git", ["rev-parse", "--is-shallow-repository"], {
      cwd: ROOT,
      encoding: "utf8",
    }).trim();
    if (shallow === "true") {
      console.warn("[sitemap] shallow git clone: lastmod falls back to build date");
      gitIndex = null;
      return gitIndex;
    }
    const log = execFileSync(
      "git",
      ["log", "--format=%x00%cI", "--name-only", "--no-renames", "--relative", "--", "app", "modules", "lib/data"],
      { cwd: ROOT, encoding: "utf8", maxBuffer: 256 * 1024 * 1024 },
    );
    const index = new Map<string, number>();
    let current = 0;
    for (const line of log.split("\n")) {
      if (line.startsWith("\0")) {
        current = Date.parse(line.slice(1));
      } else if (line && !index.has(line)) {
        index.set(line, current); // log is newest-first: first sighting wins
      }
    }
    gitIndex = index;
  } catch {
    console.warn("[sitemap] git unavailable: lastmod falls back to build date");
    gitIndex = null;
  }
  return gitIndex;
}

function isRouteDir(dir: string): boolean {
  return fs.existsSync(path.join(dir, "page.tsx")) || fs.existsSync(path.join(dir, "page.ts"));
}

/** Files that belong to a route directory, excluding nested child routes. */
function routeDirFiles(dir: string, isRoot: boolean): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (isRoot || isRouteDir(full)) continue; // app/ root: only its own files
      out.push(...routeDirFiles(full, false));
    } else if (SOURCE_EXT.some((e) => entry.name.endsWith(e))) {
      // The root layout, sitemap, not-found etc. are site chrome, not page content.
      if (isRoot && entry.name !== "page.tsx") continue;
      out.push(full);
    }
  }
  return out;
}

function resolveImport(spec: string, fromFile: string): string | null {
  let base: string;
  if (spec.startsWith("@/")) base = path.join(ROOT, spec.slice(2));
  else if (spec.startsWith(".")) base = path.resolve(path.dirname(fromFile), spec);
  else return null;
  const rel = path.relative(ROOT, base);
  if (!FOLLOW_PREFIXES.some((p) => rel.startsWith(p)) && !rel.startsWith("app/")) return null;
  if (rel.startsWith("modules/seo/")) return null; // JSON-LD plumbing, not visible content
  for (const candidate of [base, ...SOURCE_EXT.map((e) => base + e), ...SOURCE_EXT.map((e) => path.join(base, "index" + e))]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

const IMPORT_RE = /(?:import|export)\s[^'"]*?from\s*["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g;

/** Route files plus the content modules they import, transitively. */
function contentFiles(seed: string[]): string[] {
  const seen = new Set<string>();
  const queue = [...seed];
  while (queue.length) {
    const file = queue.pop()!;
    if (seen.has(file)) continue;
    seen.add(file);
    let src = "";
    try {
      src = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const m of src.matchAll(IMPORT_RE)) {
      const resolved = resolveImport(m[1] ?? m[2], file);
      if (resolved && !seen.has(resolved)) queue.push(resolved);
    }
  }
  return [...seen];
}

/** Map a URL slug ("tax-on/50000") to its app/ route directory ("app/tax-on/[salary]"). */
function routeDirForSlug(slug: string): string | null {
  let dir = APP;
  for (const segment of slug.split("/").filter(Boolean)) {
    const literal = path.join(dir, segment);
    if (fs.existsSync(literal) && fs.statSync(literal).isDirectory()) {
      dir = literal;
      continue;
    }
    const dynamic = fs
      .readdirSync(dir, { withFileTypes: true })
      .find((e) => e.isDirectory() && /^\[[^.\]]+\]$/.test(e.name));
    if (!dynamic) return null;
    dir = path.join(dir, dynamic.name);
  }
  return isRouteDir(dir) ? dir : null;
}

const dirCache = new Map<string, number | null>();

/** Latest commit time for the files producing a route directory, or null. */
function gitTimeForRouteDir(dir: string): number | null {
  if (dirCache.has(dir)) return dirCache.get(dir)!;
  const index = loadGitIndex();
  let latest: number | null = null;
  if (index) {
    for (const file of contentFiles(routeDirFiles(dir, dir === APP))) {
      const t = index.get(path.relative(ROOT, file));
      if (t === undefined) {
        latest = null; // uncommitted file: content is newer than any commit
        break;
      }
      if (latest === null || t > latest) latest = t;
    }
  }
  dirCache.set(dir, latest);
  return latest;
}

/**
 * lastModified for a sitemap slug ("" = homepage). `reviewed` is an optional
 * ISO date (YYYY-MM-DD) the page displays as its last review.
 */
export function lastModifiedForSlug(slug: string, buildDate: Date, reviewed?: string): Date {
  const dir = routeDirForSlug(slug);
  let t = dir ? gitTimeForRouteDir(dir) : null;
  if (t === null) return buildDate;
  if (reviewed) {
    const r = Date.parse(`${reviewed}T00:00:00+10:00`);
    if (!Number.isNaN(r) && r > t) t = r;
  }
  return new Date(Math.min(t, buildDate.getTime()));
}

/** True if the slug maps to a real app/ route (guards the sitemap against 404s). */
export function slugHasRoute(slug: string): boolean {
  return routeDirForSlug(slug) !== null;
}

/** A page that opts out of indexing (robots: { index: false } / "noindex") must not be auto-listed. */
function isNoindex(dir: string): boolean {
  try {
    const src = fs.readFileSync(path.join(dir, fs.existsSync(path.join(dir, "page.tsx")) ? "page.tsx" : "page.ts"), "utf8");
    return /robots\s*:\s*\{[^}]*\bindex\s*:\s*false/.test(src) || /robots\s*:\s*["'`][^"'`]*noindex/.test(src);
  } catch {
    return false;
  }
}

/** Every static (non-dynamic), indexable route under app/, as slugs ("" = homepage). */
export function discoverStaticSlugs(): string[] {
  const slugs: string[] = [];
  const walk = (dir: string, prefix: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const name = entry.name;
      if (name.startsWith("[") || name.startsWith("_") || name.startsWith("(") || name.startsWith("@")) continue;
      const full = path.join(dir, name);
      const slug = prefix ? `${prefix}/${name}` : name;
      if (isRouteDir(full) && !isNoindex(full)) slugs.push(slug);
      walk(full, slug);
    }
  };
  if (isRouteDir(APP)) slugs.push("");
  walk(APP, "");
  return slugs;
}
