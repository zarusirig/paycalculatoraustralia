#!/usr/bin/env node
// Applies edited units to the source files after a combined per-file check.
//   node scripts/authorship/apply.mjs            dry run: check every edited unit, print a summary
//   node scripts/authorship/apply.mjs --write    write passing files (failing files are skipped and listed)
//   node scripts/authorship/apply.mjs --only=<id,id>   limit to these units
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./lib.mjs";
import { checkFile, chunkPath, splice, DIR } from "./check.mjs";
const opts = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, "").split("="); return [k, v ?? true]; }));
const only = opts.only ? new Set(String(opts.only).split(",")) : null;
const jobs = JSON.parse(readFileSync(join(DIR, "jobs.json"), "utf8"));
const edited = jobs.filter((j) => (!only || only.has(j.id)) && readFileSync(chunkPath(j.id), "utf8") !== readFileSync(chunkPath(j.id, true), "utf8"));
const byFile = new Map();
for (const u of edited) { if (!byFile.has(u.file)) byFile.set(u.file, []); byFile.get(u.file).push(u); }
let pass = 0, fail = 0, strings = 0;
const failed = [];
for (const [file, us] of byFile) {
  const r = checkFile(file, us);
  if (!r.ok) { fail++; failed.push(r); continue; }
  pass++; strings += r.changed;
  if (opts.write) writeFileSync(join(ROOT, file), splice(file, us));
}
console.log(`${opts.write ? "WROTE" : "DRY RUN"}: ${pass} files pass (${strings} strings, ${edited.length} units), ${fail} files fail`);
for (const r of failed) { console.log(`FAIL ${r.file}`); for (const f of r.fails.slice(0, 5)) console.log(`  ${f}`); }
process.exit(fail ? 1 : 0);
