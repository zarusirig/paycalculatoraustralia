#!/usr/bin/env node
// Packs work units into writer jobs of ~TARGET editable chars.
//   node scripts/authorship/batch-jobs.mjs [--target=12000] [--maxfiles=6]
// Units of one file stay together (a file over the target gives one job per
// unit). Small files are packed with others from the same directory and tier.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { DIR } from "./check.mjs";
const opts = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, "").split("="); return [k, v ?? true]; }));
const TARGET = Number(opts.target ?? 12000), MAXFILES = Number(opts.maxfiles ?? 6);
const units = JSON.parse(readFileSync(join(DIR, "jobs.json"), "utf8"));
const byFile = new Map();
for (const u of units) { if (!byFile.has(u.file)) byFile.set(u.file, []); byFile.get(u.file).push(u); }
const jobs = [];
const small = new Map();
for (const [file, us] of byFile) {
  const chars = us.reduce((a, u) => a + u.editableChars, 0);
  const tier = Math.min(...us.map((u) => u.tier));
  if (chars > TARGET * 1.2) { for (const u of us) jobs.push({ tier, files: [file], units: [u.id], chars: u.editableChars }); continue; }
  if (chars >= TARGET * 0.5) { jobs.push({ tier, files: [file], units: us.map((u) => u.id), chars }); continue; }
  const key = `${tier}|${file.split("/").slice(0, -1).join("/")}`;
  if (!small.has(key)) small.set(key, []);
  small.get(key).push({ file, units: us.map((u) => u.id), chars, tier });
}
for (const [, list] of small) {
  list.sort((a, b) => a.file.localeCompare(b.file));
  let cur = null;
  for (const f of list) {
    if (!cur || cur.chars + f.chars > TARGET || cur.files.length >= MAXFILES) { cur = { tier: f.tier, files: [], units: [], chars: 0 }; jobs.push(cur); }
    cur.files.push(f.file); cur.units.push(...f.units); cur.chars += f.chars;
  }
}
jobs.sort((a, b) => a.tier - b.tier || b.chars - a.chars);
jobs.forEach((j, i) => { j.name = `t${j.tier}-${String(i + 1).padStart(3, "0")}-${j.files[0].split("/").pop().replace(/\.(tsx?|mts)$/, "")}`; });
writeFileSync(join(DIR, "workjobs.json"), JSON.stringify(jobs, null, 1));
for (const t of [1, 2, 3]) { const js = jobs.filter((j) => j.tier === t); console.log(`tier ${t}: ${js.length} jobs, ${js.reduce((a, j) => a + j.chars, 0)} chars`); }
