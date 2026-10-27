#!/usr/bin/env node
// Prints the context packet for a writing job: units, files, line ranges, the
// pages that use them, and their AUDIT rows (intent, scores, top queries).
//   node scripts/authorship/job.mjs <unit-id> [...]
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { DIR, chunkPath } from "./check.mjs";
const ids = process.argv.slice(2);
const jobs = new Map(JSON.parse(readFileSync(join(DIR, "jobs.json"), "utf8")).map((j) => [j.id, j]));
const audit = new Map();
if (existsSync(join(DIR, "AUDIT.tsv"))) {
  const [head, ...rows] = readFileSync(join(DIR, "AUDIT.tsv"), "utf8").trim().split("\n").map((l) => l.split("\t"));
  for (const r of rows) audit.set(r[0], Object.fromEntries(head.map((h, i) => [h, r[i]])));
}
const base = new Map();
for (const l of readFileSync(join(DIR, "BASELINE-gsc.tsv"), "utf8").split("\n").slice(1)) { const c = l.split("\t"); if (c[0]) base.set(c[0], c); }
for (const id of ids) {
  const u = jobs.get(id);
  if (!u) { console.log(`unknown unit ${id}`); continue; }
  console.log(`## ${id}\nfile: calc-boiler/${u.file} lines ${u.start}-${u.end} (tier ${u.tier}, ${u.editableChars} editable chars)\nedit ONLY: ${chunkPath(id)}\noriginal:  ${chunkPath(id, true)}`);
  console.log(u.pageCount > u.pages.length ? `shared file: used by ${u.pageCount} pages` : `used by ${u.pages.length} page(s):`);
  const stem = u.file.split("/").pop().replace(/\.(tsx?|mts)$/, "");
  const pages = [...u.pages].sort((a, b) => Number(b.includes(`/${stem}/`)) - Number(a.includes(`/${stem}/`)));
  for (const p of pages.slice(0, 12)) {
    const a = audit.get(p), b = base.get(p);
    console.log(`- ${p}${b ? `  pre-crash 28d: ${b[2]} clicks, ${b[3]} impr, pos ${b[5]}; top queries: ${b[9]}` : ""}`);
    if (!a) console.log(`  AUDIT: none for this page (Tier 3 page, or not audited): centerpiece rules apply only if this unit holds a page opening`);
    if (a) console.log(`  AUDIT: intent=${a.intent} format_fit=${a.format_fit} centerpiece=${a.centerpiece} serp_answered=${a.serp_answered} deserves_page=${a.deserves_page} factual=${a.factual_vs_opinion}${a.notes ? `  notes: ${a.notes}` : ""}`);
  }
  if (u.pages.length > 12) console.log(`  ... ${u.pages.length - 12} more pages use this file`);
}
