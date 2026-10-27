#!/usr/bin/env node
// Shows the prose changes of one or more units as old -> new pairs.
//   node scripts/authorship/diff.mjs <unit-id> [...]
import { analyse, loadLookups, parse } from "./lib.mjs";
import { baseText, splice } from "./check.mjs";
import { readFileSync } from "node:fs";
import { join } from "node:path";
const ids = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const DIR = join(new URL("../..", import.meta.url).pathname, "../docs/authorship-2026-10-27");
const jobs = new Map(JSON.parse(readFileSync(join(DIR, "jobs.json"), "utf8")).map((j) => [j.id, j]));
const { lookups } = loadLookups();
const clean = (s) => s.replace(/\s+/g, " ").trim();
for (const id of ids) {
  const u = jobs.get(id);
  const base = baseText(u.file);
  const A = analyse(parse(base, u.file), lookups);
  const B = analyse(parse(splice(u.file, [u]), u.file), lookups, A.strings.map((s) => s.reason));
  let n = 0;
  console.log(`### ${id} (${u.file}:${u.start}-${u.end})`);
  for (let i = 0; i < Math.min(A.strings.length, B.strings.length); i++) {
    if (A.strings[i].text === B.strings[i].text) continue;
    n++;
    console.log(`\n[${n}] line ${A.strings[i].line}${A.strings[i].locked ? ` LOCKED(${A.strings[i].reason})` : ""}\n- ${clean(A.strings[i].text)}\n+ ${clean(B.strings[i].text)}`);
  }
  console.log(`\n${n} changed strings`);
}
