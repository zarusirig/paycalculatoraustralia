#!/usr/bin/env node
// Cuts every source file that carries editable prose into work units (line
// ranges), tiers them by the pages that use them, and writes the chunk files.
//
//   node scripts/authorship/make-units.mjs --dir=../docs/authorship-2026-10-27 [--target=12000] [--max-bytes=60000]
//
// Writes <dir>/jobs.json and <dir>/work/chunks/<id>.orig.txt + <id>.txt.
// Units cut only at lines where a node at depth <= 8 starts, so each unit holds
// whole statements, array elements, object entries or JSX children.
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import ts from "typescript";
import { analyse, loadLookups, parse, ROOT } from "./lib.mjs";

const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, "").split("="); return [k, v ?? true]; }));
const DIR = resolve(args.dir ?? "../docs/authorship-2026-10-27");
const TARGET = Number(args.target ?? 12000);
const MAX_BYTES = Number(args["max-bytes"] ?? 60000);
const BASE = "https://pay-calculator-australia.com";

// ---------- tiers ----------
const clicks = new Map();
for (const line of readFileSync(join(DIR, "BASELINE-gsc.tsv"), "utf8").split("\n").slice(1)) {
  const c = line.split("\t"); if (c.length > 3) clicks.set(c[0], Number(c[2]));
}
const T1 = [/^\/$/, /^\/pay-rates\//, /^\/public-service-pay-scales\//, /^\/school-support-staff-pay\//, /^\/teacher-pay-australia\//, /^\/healthcare-worker-pay\//, /nurs/, /^\/bonus-tax-calculator\//, /^\/news\//, /^\/adf-pay-scales\//, /^\/(weekly|fortnightly|monthly)-tax-table\//, /^\/payg-withholding-tables\//, /tax-table/];
const T3 = /^\/(tax-on|take-home-pay-on|salary-to-hourly|hourly-to-salary)\/[^/]+\//;
export function tierOf(url) {
  const path = url.replace(BASE, "") || "/";
  if (T3.test(path)) return 3;
  if (T1.some((r) => r.test(path))) return 1;
  if ((clicks.get(url) ?? 0) >= 200) return 1;
  if (/-calculator\/$/.test(path) && (clicks.get(url) ?? 0) >= 100) return 1;
  return 2;
}

const pagesOf = new Map();
for (const line of readFileSync(join(DIR, "MAP.tsv"), "utf8").split("\n").slice(1)) {
  const c = line.split("\t"); if (c.length < 4) continue;
  for (const f of [c[2], ...c[3].split(",")]) {
    if (!f || f === "-") continue;
    if (!pagesOf.has(f)) pagesOf.set(f, []);
    pagesOf.get(f).push(c[0]);
  }
}
const SHARED_LIMIT = 90;
function fileTier(f) {
  const pages = pagesOf.get(f) ?? [];
  if (!pages.length) return 2;
  if (pages.length > SHARED_LIMIT) return 2;
  return Math.min(...pages.map(tierOf));
}

// ---------- cut points ----------
function cutLines(sf) {
  const lines = new Set([1]);
  const text = sf.getFullText();
  const lineStarts = sf.getLineStarts();
  const isLineStart = (pos) => {
    const { line } = sf.getLineAndCharacterOfPosition(pos);
    return text.slice(lineStarts[line], pos).trim() === "" ? line + 1 : 0;
  };
  const visit = (n, depth) => {
    if (depth > 8) return;
    const l = isLineStart(n.getStart(sf));
    if (l) {
      // a leading comment block belongs to the node: cut above it
      const full = n.getFullStart();
      const lead = ts.getLeadingCommentRanges(text, full);
      const startPos = lead && lead.length ? lead[0].pos : n.getStart(sf);
      const l2 = isLineStart(startPos) || l;
      lines.add(l2);
    }
    n.forEachChild((k) => visit(k, depth + 1));
  };
  sf.forEachChild((k) => visit(k, 1));
  return [...lines].sort((a, b) => a - b);
}

// ---------- units ----------
const { lookups } = loadLookups();
const inv = readFileSync(args.inventory ?? join(DIR, "inventory.tsv"), "utf8").split("\n").slice(1).map((l) => l.split("\t")).filter((c) => Number(c[3]) > 0);
const jobs = [];
mkdirSync(join(DIR, "work/chunks"), { recursive: true });
for (const [file] of inv) {
  if (/^components\//.test(file)) continue;
  const text = readFileSync(join(ROOT, file), "utf8");
  const sf = parse(text, file);
  const { strings } = analyse(sf, lookups);
  const lines = text.split("\n");
  const perLine = new Array(lines.length + 2).fill(0);
  for (const s of strings) if (!s.locked) perLine[s.line] += s.text.length;
  const cuts = cutLines(sf);
  const nLines = lines.length;
  // greedy: grow a unit to TARGET editable chars or MAX_BYTES, then cut at the last cut line
  const segs = [];
  let start = 1;
  const cutSet = cuts.filter((l) => l > 1);
  while (start <= nLines) {
    let ed = 0, bytes = 0, end = start - 1, lastCut = null;
    for (let l = start; l <= nLines; l++) {
      if (l > start && cutSet.includes(l)) {
        lastCut = l - 1;
        if (ed >= TARGET || bytes >= MAX_BYTES) break;
      }
      ed += perLine[l]; bytes += lines[l - 1].length + 1; end = l;
    }
    if (end < nLines && lastCut && lastCut >= start && (ed >= TARGET || bytes >= MAX_BYTES)) end = lastCut;
    segs.push([start, end]);
    start = end + 1;
  }
  const pages = pagesOf.get(file) ?? [];
  const tier = fileTier(file);
  let k = 0;
  for (const [a, b] of segs) {
    let ed = 0; for (let l = a; l <= b; l++) ed += perLine[l];
    if (!ed) continue;
    const id = `${file.replace(/\.(tsx?|mts)$/, "").replace(/[^A-Za-z0-9]+/g, "_")}__${String(++k).padStart(2, "0")}`;
    const body = lines.slice(a - 1, b).join("\n");
    const orig = join(DIR, "work/chunks", `${id}.orig.txt`);
    writeFileSync(orig, body);
    const work = join(DIR, "work/chunks", `${id}.txt`);
    if (!existsSync(work) || args.reset) writeFileSync(work, body);
    jobs.push({ id, file, start: a, end: b, tier, editableChars: ed, bytes: body.length, pageCount: pages.length, pages: pages.length > SHARED_LIMIT ? [] : pages });
  }
}
jobs.sort((x, y) => x.tier - y.tier || y.editableChars - x.editableChars);
writeFileSync(join(DIR, "jobs.json"), JSON.stringify(jobs, null, 1));
const by = (t) => jobs.filter((j) => j.tier === t);
console.log(`units ${jobs.length}: tier1 ${by(1).length} (${by(1).reduce((a, j) => a + j.editableChars, 0)} chars), tier2 ${by(2).length} (${by(2).reduce((a, j) => a + j.editableChars, 0)}), tier3 ${by(3).length} (${by(3).reduce((a, j) => a + j.editableChars, 0)})`);
