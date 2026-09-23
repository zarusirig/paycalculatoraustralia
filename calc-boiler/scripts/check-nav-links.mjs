#!/usr/bin/env node
/**
 * Assert every internal href in the header and footer is a built route.
 *
 *   npm run check:nav                 # against ./out (run `next build --webpack` first)
 *   npm run check:nav -- --out=dir    # against another export directory
 *   npm run check:nav -- --url=http://localhost:3000   # against a running server
 *
 * The header and footer read all their links from lib/navigation.ts
 * (allNavHrefs()). That file is import-free so Node loads it directly with
 * type stripping (Node >= 22.18). Legacy lists in the same file that feed
 * /site-directory/ are checked too, so a dead link cannot hide there either.
 */
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);

const nav = await import(pathToFileURL(join(root, "lib/navigation.ts")).href);

const hrefs = new Set(nav.allNavHrefs());
const legacy = [
  ...nav.CALCULATOR_CATEGORIES.flatMap((c) => c.calculators),
  ...nav.GUIDE_CATEGORIES.flatMap((c) => c.guides),
  ...nav.STATE_CATEGORIES.flatMap((c) => c.states),
  ...nav.TAX_ON_SALARY_CATEGORIES.flatMap((c) => c.salaries),
  ...Object.entries(nav)
    .filter(([k, v]) => k.startsWith("FOOTER_") && Array.isArray(v))
    .flatMap(([, v]) => v),
];
for (const l of legacy) if (l && typeof l.href === "string") hrefs.add(l.href);

const problems = [];
for (const href of hrefs) {
  if (!href.startsWith("/")) problems.push(`${href}: not a root-relative internal link`);
  else if (href !== "/" && !href.endsWith("/")) problems.push(`${href}: missing trailing slash (trailingSlash export)`);
}

async function exists(href) {
  if (args.url) {
    const res = await fetch(new URL(href, args.url), { method: "GET", redirect: "manual" });
    return res.status === 200;
  }
  const out = resolve(root, typeof args.out === "string" ? args.out : "out");
  if (!existsSync(out)) {
    console.error(`No export at ${out}. Run \`npx next build --webpack\` first, or pass --url=.`);
    process.exit(2);
  }
  return existsSync(join(out, href, "index.html"));
}

const missing = [];
for (const href of [...hrefs].sort()) {
  if (href.startsWith("/") && !(await exists(href))) missing.push(href);
}

console.log(`Checked ${hrefs.size} navigation hrefs (${nav.allNavHrefs().length} in header/footer).`);
for (const p of problems) console.error(`  format: ${p}`);
for (const m of missing) console.error(`  missing route: ${m}`);
if (problems.length || missing.length) process.exit(1);
console.log("All navigation hrefs resolve to built routes.");
