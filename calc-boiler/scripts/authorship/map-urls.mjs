#!/usr/bin/env node
// Maps every sitemap URL to its source: app/<route>/page.tsx -> the content
// modules it imports -> the lib/data and lib/constants files those import.
//
//   node scripts/authorship/map-urls.mjs <urls.txt> <out.tsv>
//
// Follows @/ and relative imports into modules/, lib/data/, lib/constants/ and
// components/ (components are listed separately: they are shared chrome).
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const root = resolve(dirname(new URL(import.meta.url).pathname), "../..");
const [urlsFile, outFile] = process.argv.slice(2);
const BASE = "https://pay-calculator-australia.com";

const EXT = [".tsx", ".ts", "/index.tsx", "/index.ts"];
function resolveImport(from, spec) {
  let p;
  if (spec.startsWith("@/")) p = join(root, spec.slice(2));
  else if (spec.startsWith(".")) p = resolve(dirname(from), spec);
  else return null;
  if (existsSync(p) && statSync(p).isFile()) return p;
  for (const e of EXT) if (existsSync(p + e)) return p + e;
  return null;
}

const importCache = new Map();
function importsOf(file) {
  if (importCache.has(file)) return importCache.get(file);
  const src = readFileSync(file, "utf8");
  const out = [];
  for (const m of src.matchAll(/(?:import|export)\s[^;]*?from\s+["']([^"']+)["']/g)) {
    if (/^import\s+type\s/.test(m[0])) continue;
    const r = resolveImport(file, m[1]);
    if (r) out.push(r);
  }
  importCache.set(file, out);
  return out;
}

const CONTENT = /^(modules|lib\/data|lib\/constants)\//;
const SHARED = /^components\//;
function walk(entry) {
  const seen = new Set([entry]);
  const stack = [entry];
  while (stack.length) {
    const f = stack.pop();
    for (const d of importsOf(f)) {
      const rel = relative(root, d);
      if (seen.has(d)) continue;
      if (!CONTENT.test(rel) && !SHARED.test(rel)) continue;
      seen.add(d);
      // components are shared chrome: record, do not descend
      if (!SHARED.test(rel)) stack.push(d);
    }
  }
  seen.delete(entry);
  return [...seen].map((f) => relative(root, f));
}

/** Route path -> app page file, trying static then dynamic segments. */
function pageFor(path) {
  const segs = path.split("/").filter(Boolean);
  function go(dir, i) {
    if (i === segs.length) {
      const f = join(dir, "page.tsx");
      return existsSync(f) ? f : null;
    }
    const exact = join(dir, segs[i]);
    if (existsSync(exact)) {
      const r = go(exact, i + 1);
      if (r) return r;
    }
    try {
      for (const d of require_readdir(dir)) {
        if (/^\[.+\]$/.test(d)) {
          const r = go(join(dir, d), i + 1);
          if (r) return r;
        }
      }
    } catch {}
    return null;
  }
  return go(join(root, "app"), 0);
}
import { readdirSync } from "node:fs";
const require_readdir = (d) => readdirSync(d);

const urls = readFileSync(urlsFile, "utf8").split("\n").map((s) => s.trim()).filter(Boolean);
const rows = ["url\troute\tpage_file\tcontent_files\tshared_components"];
let missing = 0;
for (const u of urls) {
  const path = u.replace(BASE, "") || "/";
  const page = pageFor(path);
  if (!page) { missing++; rows.push(`${u}\t${path}\t-\t-\t-`); continue; }
  const deps = walk(page);
  const content = deps.filter((d) => CONTENT.test(d)).sort();
  const shared = deps.filter((d) => SHARED.test(d)).sort();
  rows.push([u, path, relative(root, page), content.join(","), shared.join(",")].join("\t"));
}
writeFileSync(outFile, rows.join("\n") + "\n");
console.log(`mapped ${urls.length - missing}/${urls.length} urls -> ${outFile}`);
