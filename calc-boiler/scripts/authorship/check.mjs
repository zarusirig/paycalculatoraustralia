#!/usr/bin/env node
// Safety checker for one or more work units.
//
//   node scripts/authorship/check.mjs <unit-id> [<unit-id> ...] [--json] [--dir=...]
//   node scripts/authorship/check.mjs --file=<repo-relative file>   (all units of a file, combined)
//
// Splices the unit's edited chunk (work/chunks/<id>.txt) into the BASE version
// of its file (git show <BASE_COMMIT>:path), parses both with the TypeScript
// compiler API and FAILS on any of:
//   syntax error; any code/structure change (AST skeleton with prose blanked);
//   a locked string changed (metadata, schema, headings, link text, table cells,
//   JSX attributes, FAQ questions, labels, lookup keys, dash keys, short labels);
//   a test literal lost; a number added or removed; a link changed; an em/en
//   dash, spaced hyphen or double hyphen added; text cut below 60%; a banned
//   phrase or US spelling added; "{", "}", "undefined" or "NaN" added to prose.
// WARNS on: watched words that remain, numbers moved between strings,
// number words changed, first sentence changed, curly quotes added.
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { analyse, countWord, linksIn, loadLookups, multisetDiff, numbersIn, parse, ROOT, syntaxErrors, US_SPELLING, WARN_WORDS, WATCH_ADD } from "./lib.mjs";

const argv = process.argv.slice(2);
const opts = Object.fromEntries(argv.filter((a) => a.startsWith("--")).map((a) => { const [k, v] = a.replace(/^--/, "").split("="); return [k, v ?? true]; }));
const ids = argv.filter((a) => !a.startsWith("--"));
export const DIR = resolve(opts.dir ?? join(ROOT, "../docs/authorship-2026-10-27"));
const BASE_COMMIT = readFileSync(join(DIR, "BASE_COMMIT"), "utf8").trim();
const JOBS = JSON.parse(readFileSync(join(DIR, "jobs.json"), "utf8"));
const byId = new Map(JOBS.map((j) => [j.id, j]));

const baseCache = new Map();
export function baseText(file) {
  if (!baseCache.has(file)) baseCache.set(file, execSync(`git show ${BASE_COMMIT}:calc-boiler/${file}`, { cwd: ROOT, maxBuffer: 64 << 20 }).toString());
  return baseCache.get(file);
}
export const chunkPath = (id, orig) => join(DIR, "work/chunks", `${id}${orig ? ".orig" : ""}.txt`);

/** Splice edited chunks for `units` (same file) into the base text, bottom-up. */
export function splice(file, units) {
  const lines = baseText(file).split("\n");
  for (const u of [...units].sort((a, b) => b.start - a.start)) {
    const body = readFileSync(chunkPath(u.id), "utf8");
    const orig = readFileSync(chunkPath(u.id, true), "utf8");
    if (lines.slice(u.start - 1, u.end).join("\n") !== orig) throw new Error(`${u.id}: base text no longer matches .orig.txt (re-run make-units)`);
    lines.splice(u.start - 1, u.end - u.start + 1, ...body.split("\n"));
  }
  return lines.join("\n");
}

const firstSentence = (s) => (s.trim().match(/^[\s\S]*?[.!?](?=\s|$)/) ?? [s.trim()])[0];
const NUMBER_WORDS = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "twenty", "thirty", "forty", "fifty", "hundred", "thousand", "million", "billion", "half", "quarter", "double", "triple", "twice", "percent", "per cent"];

export function checkFile(file, units) {
  const fails = [], warns = [];
  const { lookups, testLiterals } = loadLookups();
  const base = baseText(file);
  let edited;
  try { edited = splice(file, units); } catch (e) { return { file, units: units.map((u) => u.id), ok: false, fails: [String(e.message)], warns, changed: 0 }; }
  if (edited === base) return { file, units: units.map((u) => u.id), ok: true, fails, warns, changed: 0 };
  const sfA = parse(base, file), sfB = parse(edited, file);
  const syn = syntaxErrors(sfB);
  if (syn.length) return { file, units: units.map((u) => u.id), ok: false, fails: syn.slice(0, 5).map((s) => `syntax: ${s}`), warns, changed: 0 };
  const A = analyse(sfA, lookups);
  const B = analyse(sfB, lookups, A.strings.map((s) => s.reason));
  if (A.strings.length !== B.strings.length) {
    fails.push(`structure: string count ${A.strings.length} -> ${B.strings.length} (a string or JSX text node was added, removed, split or merged)`);
  }
  // locked strings must be byte-identical
  const n = Math.min(A.strings.length, B.strings.length);
  for (let i = 0; i < n; i++) {
    const a = A.strings[i], b = B.strings[i];
    if (a.locked && a.text !== b.text) fails.push(`locked (${a.reason}) line ${a.line} changed: ${JSON.stringify(a.text.slice(0, 90))} -> ${JSON.stringify(b.text.slice(0, 90))}`);
  }
  // code / structure
  if (!fails.length) {
    const sa = A.skeleton, sb = B.skeleton;
    if (sa.length !== sb.length || sa.some((t, i) => t !== sb[i])) {
      let i = 0; while (i < sa.length && sa[i] === sb[i]) i++;
      fails.push(`structure/code changed near: ${sa.slice(Math.max(0, i - 6), i + 6).join(" ").slice(0, 300)}  ==>  ${sb.slice(Math.max(0, i - 6), i + 6).join(" ").slice(0, 300)}`);
    }
  }
  // prose checks on changed editable strings
  let changed = 0;
  const numsA = [], numsB = [], linksA = [], linksB = [];
  for (let i = 0; i < n; i++) {
    const a = A.strings[i], b = B.strings[i];
    if (a.locked) continue;
    numsA.push(...numbersIn(a.text)); numsB.push(...numbersIn(b.text));
    linksA.push(...linksIn(a.text)); linksB.push(...linksIn(b.text));
    if (a.text === b.text) continue;
    changed++;
    const at = `line ${a.line}`;
    const snip = JSON.stringify(b.text.trim().slice(0, 80));
    if (/[—–]/.test(b.text)) fails.push(`${at}: em/en dash in edited prose ${snip}`);
    if ((b.text.match(/\s-\s|--/g) ?? []).length > (a.text.match(/\s-\s|--/g) ?? []).length) fails.push(`${at}: spaced hyphen or "--" used as a dash ${snip}`);
    if (a.text.trim().length >= 40 && b.text.trim().length < 0.6 * a.text.trim().length) fails.push(`${at}: text cut to ${Math.round((100 * b.text.trim().length) / a.text.trim().length)}% of its old length ${snip}`);
    for (const ch of ["{", "}"]) if (b.text.split(ch).length > a.text.split(ch).length) fails.push(`${at}: "${ch}" added to prose ${snip}`);
    for (const w of ["undefined", "NaN", "null"]) if (countWord(b.text, w) > countWord(a.text, w)) fails.push(`${at}: "${w}" added to prose`);
    for (const t of testLiterals) if ((a.text.trim() === t.trim() || (t.length >= 12 && /\s/.test(t.trim()))) && a.text.includes(t) && !b.text.includes(t)) fails.push(`${at}: lost text a test or script matches: ${JSON.stringify(t.slice(0, 80))}`);
    for (const w of WARN_WORDS) {
      const stem = !/\s/.test(w); const ent = (x) => x.replace(/&apos;|&#39;|&rsquo;|’/g, "'").replace(/&quot;/g, '"'); const ca = countWord(ent(a.text), w, stem), cb = countWord(ent(b.text), w, stem);
      if (cb > ca) fails.push(`${at}: banned phrase added "${w}"`);
      else if (cb > 0) warns.push(`${at}: watched phrase remains "${w}"`);
    }
    for (const w of WATCH_ADD) if (countWord(b.text, w) > countWord(a.text, w)) warns.push(`${at}: added "${w}" (brand: never for tax advice; vague attribution) — reviewer must confirm`);
    const usA = (a.text.match(US_SPELLING) ?? []).length, usB = (b.text.match(US_SPELLING) ?? []).length;
    if (usB > usA) fails.push(`${at}: US spelling added (${(b.text.match(US_SPELLING) ?? []).join(", ")})`);
    if (/\b(most|many|majority of|almost all|nearly all)\s+(australians|workers|employees|people|teachers|nurses|employers|casuals)\b/i.test(b.text)) warns.push(`${at}: population claim ("most/many ...") with no figure: source it or list it in factQuestions`);
    if (/[‘’“”]/.test(b.text) && (b.text.match(/[‘’“”]/g) ?? []).length > (a.text.match(/[‘’“”]/g) ?? []).length) warns.push(`${at}: curly quotes added`);
    const na = multisetDiff(numbersIn(a.text), numbersIn(b.text));
    if (na.added.length || na.removed.length) warns.push(`${at}: numbers moved in this string (-${na.removed.join(",")} +${na.added.join(",")})`);
    for (const w of NUMBER_WORDS) if (countWord(b.text, w) !== countWord(a.text, w)) { warns.push(`${at}: number word "${w}" count changed`); break; }
    if (a.text.trim().length > 80 && firstSentence(a.text) !== firstSentence(b.text)) warns.push(`${at}: first sentence changed (protected for answers/FAQ answers; check it is still the direct answer)`);
  }
  const nd = multisetDiff(numsA, numsB);
  if (nd.added.length) fails.push(`numbers added: ${nd.added.join(", ")} (figures must come from code, never retyped)`);
  if (nd.removed.length) fails.push(`numbers removed: ${nd.removed.join(", ")}`);
  const ld = multisetDiff(linksA, linksB);
  if (ld.added.length || ld.removed.length) fails.push(`links changed: -${ld.removed.join(" ")} +${ld.added.join(" ")}`);
  return { file, units: units.map((u) => u.id), ok: fails.length === 0, fails, warns, changed };
}

export function checkUnits(unitIds) {
  const byFile = new Map();
  for (const id of unitIds) {
    const u = byId.get(id);
    if (!u) return [{ file: "?", units: [id], ok: false, fails: [`unknown unit ${id}`], warns: [], changed: 0 }];
    if (!byFile.has(u.file)) byFile.set(u.file, []);
    byFile.get(u.file).push(u);
  }
  return [...byFile].map(([f, us]) => checkFile(f, us));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  let list = ids;
  if (opts.file) list = JOBS.filter((j) => j.file === opts.file).map((j) => j.id);
  const res = checkUnits(list);
  if (opts.json) console.log(JSON.stringify(res, null, 1));
  else for (const r of res) {
    console.log(`${r.ok ? "PASS" : "FAIL"} ${r.file} [${r.units.join(" ")}] changed strings: ${r.changed}`);
    for (const f of r.fails) console.log(`  FAIL ${f}`);
    for (const w of r.warns.slice(0, 40)) console.log(`  warn ${w}`);
    if (r.warns.length > 40) console.log(`  ... ${r.warns.length - 40} more warnings`);
  }
  process.exit(res.every((r) => r.ok) ? 0 : 1);
}
