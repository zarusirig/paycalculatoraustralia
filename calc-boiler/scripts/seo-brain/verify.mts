/**
 * seo-brain verify — after `next build`, prove each applied decision landed in
 * the export. Rebuild first; this reads ./out.
 *
 *   node scripts/seo-brain/verify.mts <decisions.json> [<more.json>…] [--dir=…]
 *
 * Checks per kind (unverifiable kinds are listed as "manual"):
 *   rewrite_title         <title> equals proposed
 *   rewrite_description   meta description equals proposed
 *   add_internal_link     from-page <main> links to toRoute (anchor text noted)
 *   add_section           an H2/H3 on the page equals heading
 *   citation_lead         first <p> after H1 starts with the first 40 chars of proposedLead
 *                         (with [[CONSTANT]] placeholders stripped)
 *   add_schema            JSON-LD on the page contains @type
 *   technical_fix         long_title/long_description: now within limits; orphan: has ≥1 contextual inlink
 *   new_page              route exists, title present, ≥2 of inlinksFrom link to it
 *   consolidate           differentiate: titles differ; retarget: loser title changed
 * Exit 1 if any decision that is not no_action fails.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DecisionBatch, TITLE_MAX, DESCRIPTION_MAX } from "./schema.mts";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const repo = resolve(root, "..");
const argv = process.argv.slice(2);
const files = argv.filter((a) => !a.startsWith("--"));
const args = Object.fromEntries(argv.filter((a) => a.startsWith("--")).map((a) => { const [k, v] = a.replace(/^--/, "").split("="); return [k, v ?? true]; }));
const base = join(repo, "docs/seo/seo-brain");
const dir = resolve(repo, typeof args.dir === "string" ? args.dir : join(base, readdirSync(base).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort().pop()!));
const outDir = join(root, "out");
if (!files.length) { console.error("usage: verify.mts <decisions.json>…"); process.exit(2); }

const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");
const strip = (h: string) => decode(h.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const cache = new Map<string, string | null>();
const html = (route: string) => { if (!cache.has(route)) { const f = join(outDir, route === "/" ? "index.html" : route.slice(1) + "index.html"); cache.set(route, existsSync(f) ? readFileSync(f, "utf8") : null); } return cache.get(route)!; };
const main = (h: string) => { const s = h.search(/<main[\s>]/); const e = h.indexOf("</main>"); return s >= 0 && e > s ? h.slice(s, e) : h; };
const title = (h: string) => decode(h.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
const desc = (h: string) => decode(h.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
const headings = (h: string) => [...main(h).matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)].map((m) => strip(m[1]).toLowerCase());
const linksTo = (h: string, to: string) => [...main(h).matchAll(/<a\s[^>]*href="([^"#?]*)"[^>]*>([\s\S]*?)<\/a>/gi)].filter((m) => (m[1].endsWith("/") ? m[1] : m[1] + "/") === to).map((m) => strip(m[2]));
const lead = (h: string) => { const m = main(h); const after = m.slice(m.search(/<\/h1>/i) + 5); return strip(after.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] ?? ""); };
const ldTypes = (h: string) => new Set([...h.matchAll(/"@type":"([A-Za-z]+)"/g)].map((m) => m[1]));
const norm = (s: string) => s.replace(/\[\[[^\]]+\]\]/g, "").replace(/\s+/g, " ").trim().toLowerCase();

let pass = 0, fail = 0, manual = 0;
const ok = (id: string, m: string) => { pass++; console.log(`  ok    ${id}: ${m}`); };
const bad = (id: string, m: string) => { fail++; console.log(`  FAIL  ${id}: ${m}`); };
const man = (id: string, m: string) => { manual++; console.log(`  manual ${id}: ${m}`); };

for (const f of files) {
  const batch = DecisionBatch.parse(JSON.parse(readFileSync(resolve(f), "utf8")));
  console.log(`[verify] ${f} (${batch.decisions.length} decisions)`);
  for (const d of batch.decisions) {
    switch (d.kind) {
      case "no_action": break;
      case "rewrite_title": { const h = html(d.route); if (!h) { bad(d.id, "page missing"); break; } const t = title(h); t === d.proposed ? ok(d.id, `title = "${t}"`) : bad(d.id, `title is "${t}", expected "${d.proposed}"`); break; }
      case "rewrite_description": { const h = html(d.route); if (!h) { bad(d.id, "page missing"); break; } const t = desc(h); t === d.proposed ? ok(d.id, `description set (${t.length} chars)`) : bad(d.id, `description is "${t.slice(0, 80)}…"`); break; }
      case "add_internal_link": { const h = html(d.fromRoute); if (!h) { bad(d.id, "from page missing"); break; } const a = linksTo(h, d.toRoute); a.length ? ok(d.id, `${d.fromRoute} → ${d.toRoute} anchor "${a[0]}"`) : bad(d.id, `${d.fromRoute} has no in-content link to ${d.toRoute}`); break; }
      case "add_section": { const h = html(d.route); if (!h) { bad(d.id, "page missing"); break; } headings(h).includes(d.heading.toLowerCase()) ? ok(d.id, `heading "${d.heading}"`) : bad(d.id, `heading "${d.heading}" not found; page has: ${headings(h).slice(0, 12).join(" | ")}`); break; }
      case "add_faq": { const h = html(d.route); if (!h) { bad(d.id, "page missing"); break; } strip(main(h)).toLowerCase().includes(d.question.toLowerCase()) ? ok(d.id, "faq present") : bad(d.id, "faq question not on page"); break; }
      case "citation_lead": { const h = html(d.route); if (!h) { bad(d.id, "page missing"); break; } const l = norm(lead(h)); const want = norm(d.proposedLead).slice(0, 40); l.startsWith(want.slice(0, 25)) ? ok(d.id, `lead starts "${l.slice(0, 60)}…"`) : bad(d.id, `lead is "${l.slice(0, 80)}…"; expected to start "${want}"`); break; }
      case "add_schema": { if (typeof d.scope !== "string") { man(d.id, "template-scoped schema"); break; } const h = html(d.scope); if (!h) { bad(d.id, "page missing"); break; } ldTypes(h).has(d.schemaType) ? ok(d.id, `${d.schemaType} on ${d.scope}`) : bad(d.id, `${d.schemaType} missing on ${d.scope}`); break; }
      case "technical_fix": {
        if (typeof d.scope !== "string" || d.scope === "*") { man(d.id, d.issue); break; }
        const h = html(d.scope); if (!h) { bad(d.id, "page missing"); break; }
        if (d.issue === "long_title") title(h).length <= TITLE_MAX ? ok(d.id, `title ${title(h).length} chars`) : bad(d.id, `title still ${title(h).length} chars`);
        else if (d.issue === "long_description") desc(h).length <= DESCRIPTION_MAX ? ok(d.id, `description ${desc(h).length} chars`) : bad(d.id, `description still ${desc(h).length} chars`);
        else if (d.issue === "missing_og_image") /<meta property="og:image"/.test(h) ? ok(d.id, "og:image present") : bad(d.id, "og:image still missing");
        else if (d.issue === "no_h2") /<h2[\s>]/i.test(main(h)) ? ok(d.id, "has H2") : bad(d.id, "still no H2");
        else man(d.id, d.issue);
        break;
      }
      case "new_page": { const h = html(d.route); if (!h) { bad(d.id, `${d.route} not built`); break; } const from = d.inlinksFrom.filter((r) => { const s = html(r); return s && linksTo(s, d.route).length; }); from.length >= 2 ? ok(d.id, `${d.route} built, linked from ${from.join(", ")}`) : bad(d.id, `${d.route} built but only linked from ${from.join(", ") || "nothing"}`); break; }
      case "consolidate": { const k = html(d.keepRoute); const ls = d.loserRoutes.map((r) => html(r)); if (!k || ls.some((x) => !x)) { bad(d.id, "page missing"); break; } const same = ls.some((x) => title(x!) === title(k)); same ? bad(d.id, "keeper and loser still share a title") : man(d.id, `titles differ: "${title(k)}" vs ${ls.map((x) => `"${title(x!)}"`).join(", ")}; check openings by eye`); break; }
    }
  }
}
console.log(`[verify] ${pass} ok, ${fail} failed, ${manual} manual`);
process.exit(fail ? 1 : 0);
