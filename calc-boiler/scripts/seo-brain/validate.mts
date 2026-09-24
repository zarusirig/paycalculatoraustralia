/**
 * seo-brain validate — gate any decision file before it touches a page.
 *
 *   node scripts/seo-brain/validate.mts <decisions.json> [--dir=…] [--strict]
 *
 * Schema (zod) + cross-checks against signals.json:
 *   - every route named exists in the export (or, for new_page, does NOT exist)
 *   - rewrite_title: unique across the site + batch, keepTokens survive, length
 *   - rewrite_description: length, contains a digit
 *   - add_internal_link: from/to exist, from does not already link to to
 *   - consolidate: keeper != losers, all exist
 *   - new_page: border literal-true, inlinksFrom exist
 *   - targetQueries: warn when none appear in GSC/ranked/gap data (--strict: error)
 * Exit 1 on any error. Prints a per-decision verdict.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DecisionBatch, SiteSignals, TITLE_MAX, DESCRIPTION_MAX } from "./schema.mts";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "../../..");
const argv = process.argv.slice(2);
const file = argv.find((a) => !a.startsWith("--"));
if (!file) { console.error("usage: validate.mts <decisions.json> [--dir=…] [--strict]"); process.exit(2); }
const args = Object.fromEntries(argv.filter((a) => a.startsWith("--")).map((a) => { const [k, v] = a.replace(/^--/, "").split("="); return [k, v ?? true]; }));
const base = join(repo, "docs/seo/seo-brain");
const dir = resolve(repo, typeof args.dir === "string" ? args.dir : join(base, readdirSync(base).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort().pop()!));
const strict = Boolean(args.strict);

const site = SiteSignals.parse(JSON.parse(readFileSync(join(dir, "signals.json"), "utf8")));
const byRoute = new Map(site.pages.map((p) => [p.route, p]));
const knownQueries = new Set<string>([...site.queries.map((q) => q.query.toLowerCase()), ...site.pages.flatMap((p) => p.ranked.map((k) => k.kw.toLowerCase())), ...site.unowned.map((u) => u.kw.toLowerCase())]);
const siteTitles = new Map(site.pages.map((p) => [p.title.toLowerCase(), p.route]));

const parsed = DecisionBatch.safeParse(JSON.parse(readFileSync(resolve(file), "utf8")));
if (!parsed.success) {
  console.error(`[validate] schema errors in ${file}:`);
  for (const i of parsed.error.issues) console.error(`  ${i.path.join(".")}: ${i.message}`);
  process.exit(1);
}
const batch = parsed.data;
let errors = 0, warnings = 0;
const err = (id: string, m: string) => { errors++; console.log(`  ERROR ${id}: ${m}`); };
const warn = (id: string, m: string) => { if (strict) return err(id, m); warnings++; console.log(`  warn  ${id}: ${m}`); };
const exists = (id: string, r: string, what = "route") => { if (!byRoute.has(r)) err(id, `${what} ${r} is not in the export`); };
const batchTitles = new Map<string, string>();
const ids = new Set<string>();

for (const d of batch.decisions) {
  if (ids.has(d.id)) err(d.id, "duplicate id"); ids.add(d.id);
  const tq = d.targetQueries.filter((q) => knownQueries.has(q.toLowerCase()));
  if (!tq.length) warn(d.id, `none of targetQueries [${d.targetQueries.join("; ")}] appear in GSC / ranked / gap data`);
  switch (d.kind) {
    case "rewrite_title": {
      exists(d.id, d.route);
      const p = byRoute.get(d.route);
      if (p && p.title !== d.current) warn(d.id, `current title in decision differs from export ("${p.title}")`);
      const low = d.proposed.toLowerCase();
      const clash = siteTitles.get(low); if (clash && clash !== d.route) err(d.id, `proposed title already used by ${clash}`);
      const bclash = batchTitles.get(low); if (bclash && bclash !== d.route) err(d.id, `proposed title duplicates ${bclash} in this batch`);
      batchTitles.set(low, d.route);
      for (const t of d.keepTokens) if (!low.includes(t.toLowerCase())) err(d.id, `keepToken "${t}" missing from proposed title`);
      if (d.proposed === d.current) err(d.id, "proposed equals current");
      if (d.proposed.length > TITLE_MAX) err(d.id, `title ${d.proposed.length} > ${TITLE_MAX}`);
      if (!/\d{4}-\d{2}|20\d\d/.test(d.proposed) && /\d{4}-\d{2}/.test(d.current)) warn(d.id, "current title carried a financial year; proposed drops it");
      break;
    }
    case "rewrite_description": {
      exists(d.id, d.route);
      if (d.proposed.length > DESCRIPTION_MAX) err(d.id, `description ${d.proposed.length} > ${DESCRIPTION_MAX}`);
      if (d.proposed === d.current) err(d.id, "proposed equals current");
      break;
    }
    case "add_section": exists(d.id, d.route); { const p = byRoute.get(d.route); if (p && p.h2s.some((h) => h.toLowerCase() === d.heading.toLowerCase())) err(d.id, `heading "${d.heading}" already exists on the page`); } break;
    case "add_faq": exists(d.id, d.route); break;
    case "citation_lead": exists(d.id, d.route); if (/\b(best|ultimate|#1)\b/i.test(d.proposedLead)) err(d.id, "hype in lead"); break;
    case "add_internal_link": {
      exists(d.id, d.fromRoute, "fromRoute"); exists(d.id, d.toRoute, "toRoute");
      if (d.fromRoute === d.toRoute) err(d.id, "self link");
      const from = byRoute.get(d.fromRoute);
      if (from?.outlinks.includes(d.toRoute)) warn(d.id, `${d.fromRoute} already links to ${d.toRoute} in-content`);
      if (d.anchor.length > 70) err(d.id, "anchor too long");
      break;
    }
    case "consolidate": {
      exists(d.id, d.keepRoute, "keepRoute"); d.loserRoutes.forEach((r) => exists(d.id, r, "loserRoute"));
      if (d.loserRoutes.includes(d.keepRoute)) err(d.id, "keeper listed as loser");
      if (d.method === "redirect_301" && d.loserRoutes.some((r) => (byRoute.get(r)?.gsc?.clicks ?? 0) > 50)) err(d.id, "redirecting a page with >50 clicks/28d needs a human decision");
      break;
    }
    case "add_schema": if (typeof d.scope === "string") exists(d.id, d.scope); break;
    case "technical_fix": if (typeof d.scope === "string" && d.scope !== "*") exists(d.id, d.scope); break;
    case "new_page": {
      if (byRoute.has(d.route)) err(d.id, `route ${d.route} already exists`);
      d.inlinksFrom.forEach((r) => exists(d.id, r, "inlinksFrom"));
      if (d.border.degreesFromCentralEntity > 3) err(d.id, "outside border: >3 degrees");
      const low = d.title.toLowerCase(); if (siteTitles.has(low)) err(d.id, "title already used on the site");
      break;
    }
    case "no_action": if (d.route) exists(d.id, d.route); break;
  }
}
console.log(`[validate] ${file}: ${batch.decisions.length} decisions, ${errors} errors, ${warnings} warnings`);
process.exit(errors ? 1 : 0);
