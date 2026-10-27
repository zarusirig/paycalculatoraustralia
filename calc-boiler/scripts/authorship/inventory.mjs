#!/usr/bin/env node
// Lists editable vs locked prose per source file.  node scripts/authorship/inventory.mjs <MAP.tsv> <out.tsv>
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { analyse, loadLookups, parse, ROOT } from "./lib.mjs";
const [mapFile, outFile] = process.argv.slice(2);
const files = new Set();
for (const line of readFileSync(mapFile, "utf8").split("\n").slice(1)) {
  const c = line.split("\t"); if (c.length < 4) continue;
  files.add(c[2]); for (const f of c[3].split(",")) if (f && f !== "-") files.add(f);
}
const { lookups } = loadLookups();
const reasons = new Map();
const rows = ["file\tbytes\teditable_strings\teditable_chars\tlocked_strings\tlocked_prose_chars"];
let tot = 0;
for (const f of [...files].sort()) {
  const text = readFileSync(join(ROOT, f), "utf8");
  const { strings } = analyse(parse(text, f), lookups);
  const ed = strings.filter((s) => !s.locked);
  const lk = strings.filter((s) => s.locked);
  for (const s of lk) { const r = s.reason.replace(/:.*/, ":*") === "call-arg:*" ? s.reason : s.reason.split(":")[0]; reasons.set(r, (reasons.get(r) ?? 0) + s.text.length); }
  const ec = ed.reduce((a, s) => a + s.text.length, 0); tot += ec;
  const lpc = lk.filter((s) => s.reason !== "short" && s.reason !== "blank").reduce((a, s) => a + s.text.length, 0);
  rows.push([f, text.length, ed.length, ec, lk.length, lpc].join("\t"));
}
writeFileSync(outFile, rows.join("\n") + "\n");
console.log("files", files.size, "editable chars", tot);
console.log([...reasons].sort((a, b) => b[1] - a[1]).slice(0, 40).map(([k, v]) => `${k} ${v}`).join("\n"));
