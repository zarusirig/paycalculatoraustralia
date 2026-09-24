/**
 * seo-brain collect — join the static export with GSC + DataForSEO data and
 * emit typed page signals plus a ranked opportunity list.
 *
 *   node scripts/seo-brain/collect.mts                  # reads ./out, writes docs/seo/seo-brain/<today>/
 *   node scripts/seo-brain/collect.mts --data=<dir>      # GSC / DataForSEO CSV directory
 *   node scripts/seo-brain/collect.mts --out=<dir>       # output directory
 *
 * Inputs (CSV, from the DataForSEO/GSC pull in docs/seo/data/…):
 *   gsc-pages-28d.csv      Top pages,Clicks,Impressions,CTR,Position
 *   gsc-queries-28d.csv    Top queries,Clicks,Impressions,CTR,Position
 *   our-ranked-keywords.csv kw,vol,kd,intent,pos,url,etv
 *   competitor-gap.csv     kw,vol,kd,ncomp,best,bpos,burl,our,oururl
 */
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { expectedCtr, Opportunity, PageSignals, SiteSignals, type Level, type Opportunity as Opp, type PageSignals as Page, type Template } from "./schema.mts";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const repo = resolve(root, "..");
const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, "").split("="); return [k, v ?? true]; }));
const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
const outDir = resolve(root, typeof args.out === "string" ? args.out : join(repo, "docs/seo/seo-brain", today));
const dataDir = resolve(root, typeof args.data === "string" ? args.data : join(repo, "docs/seo/data/2026-09-23-dataforseo"));
const exportDir = resolve(root, "out");
const BASE = "https://pay-calculator-australia.com";

// ---------- helpers ----------

function csv(path: string): Record<string, string>[] {
  if (!existsSync(path)) { console.warn(`[collect] missing ${relative(repo, path)}`); return []; }
  const text = readFileSync(path, "utf8").replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/).filter((l) => l.length);
  const parse = (line: string) => {
    const cells: string[] = []; let cur = ""; let q = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (q) { if (c === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
      else if (c === '"') q = true;
      else if (c === ",") { cells.push(cur); cur = ""; }
      else cur += c;
    }
    cells.push(cur);
    return cells;
  };
  const head = parse(lines[0]);
  return lines.slice(1).map((l) => Object.fromEntries(parse(l).map((v, i) => [head[i], v])));
}
const pct = (s: string) => { const n = Number(String(s ?? "").replace("%", "").trim()); return Number.isFinite(n) ? n / 100 : 0; };
const num = (s: string | undefined) => { const n = Number(s); return Number.isFinite(n) ? n : 0; };
const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
const strip = (html: string) => decode(html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const toRoute = (u: string) => { try { const p = new URL(u, BASE).pathname; return p.endsWith("/") ? p : p + "/"; } catch { return null; } };

function walk(dir: string, files: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) walk(full, files); else if (e.name === "index.html") files.push(full);
  }
  return files;
}

const STATES = /^(nsw|vic|qld|wa|sa|tas|act|nt)$/;
function classify(route: string): Template {
  if (route === "/") return "home";
  const segs = route.split("/").filter(Boolean);
  const first = segs[0];
  if (first === "news") return "news";
  if (/^(about|contact|privacy-policy|terms|disclaimer|editorial-policy|methodology)$/.test(first)) return "legal";
  if (segs.length === 1 && /^(award-rates|job-pay-rates|pay-rates|take-home-pay-on|tax-on|salary-to-hourly|hourly-to-salary|payroll-tax|public-service-pay-scales|teacher-pay-australia|nurse-pay-australia|centrelink-payment-rates|public-holiday-pay|minimum-wage-by-age|site-directory)$/.test(first)) return "hub";
  if (/^(take-home-pay-on|tax-on|salary-to-hourly|hourly-to-salary|minimum-wage-by-age)$/.test(first) && segs.length === 2) return "programmatic-salary";
  if (first === "pay-rates" && segs.length === 2) return "employer";
  if (first === "job-pay-rates" && segs.length === 2) return "job";
  if (segs.length === 2 && STATES.test(segs[1])) return "state";
  if (/-award-rates$/.test(first) || /^(junior-pay-rates|penalty-rates|minimum-wage-australia)$/.test(first)) return "award";
  if (/tax-table|payg-withholding/.test(first)) return "tax-table";
  if (/centrelink|jobseeker|pension|carer|family-tax|parenting-payment|rent-assistance|austudy|youth-allowance|disability-support|child-care-subsidy|deeming|seniors-health|paid-parental|cost-of-living/.test(first)) return "centrelink";
  if (/-calculator$/.test(first) || /^(hourly-to-salary|salary-to-hourly)$/.test(first)) return "calculator";
  return "guide";
}

// ---------- sitemap ----------
const sitemap = new Map<string, { lastmod: string | null; priority: number | null }>();
const smPath = join(exportDir, "sitemap.xml");
if (existsSync(smPath)) {
  for (const m of readFileSync(smPath, "utf8").matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = m[1].match(/<loc>([^<]+)<\/loc>/)?.[1];
    const r = loc && toRoute(loc);
    if (!r) continue;
    sitemap.set(r, { lastmod: m[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.slice(0, 10) ?? null, priority: m[1].match(/<priority>([^<]+)<\/priority>/) ? Number(m[1].match(/<priority>([^<]+)<\/priority>/)![1]) : null });
  }
}

// ---------- external data ----------
const gscPages = new Map<string, { clicks: number; impressions: number; ctr: number; position: number }>();
for (const r of csv(join(dataDir, "gsc-pages-28d.csv"))) {
  const route = toRoute(r["Top pages"]); if (!route) continue;
  gscPages.set(route, { clicks: num(r.Clicks), impressions: num(r.Impressions), ctr: pct(r.CTR), position: num(r.Position) });
}
const queries = csv(join(dataDir, "gsc-queries-28d.csv")).map((r) => ({ query: r["Top queries"], clicks: num(r.Clicks), impressions: num(r.Impressions), ctr: pct(r.CTR), position: num(r.Position) }));
const ranked = new Map<string, Page["ranked"]>();
const kwToRoutes = new Map<string, { route: string; pos: number; vol: number }[]>();
for (const r of csv(join(dataDir, "our-ranked-keywords.csv"))) {
  const route = toRoute(r.url); if (!route) continue;
  const row = { kw: r.kw, vol: num(r.vol), kd: r.kd === "" ? null : Math.round(num(r.kd)), intent: r.intent || null, pos: Math.max(1, Math.round(num(r.pos))) };
  (ranked.get(route) ?? ranked.set(route, []).get(route)!).push(row);
  (kwToRoutes.get(r.kw) ?? kwToRoutes.set(r.kw, []).get(r.kw)!).push({ route, pos: row.pos, vol: row.vol });
}
const unowned = csv(join(dataDir, "competitor-gap.csv")).filter((r) => !r.our && !r.oururl).map((r) => ({ kw: r.kw, vol: num(r.vol), kd: r.kd === "" ? null : Math.round(num(r.kd)), best: r.best, burl: r.burl, ncomp: num(r.ncomp) }));

// ---------- crawl the export ----------
const PRIMARY = /https?:\/\/(www\.)?(ato\.gov\.au|fairwork\.gov\.au|fwc\.gov\.au|servicesaustralia\.gov\.au|legislation\.gov\.au|dss\.gov\.au|abs\.gov\.au|treasury\.gov\.au|legislation\.[a-z]+\.gov\.au|[a-z]+\.gov\.au)/i;
const pages: Page[] = [];
const inlinks = new Map<string, Map<string, number>>(); // to -> anchor -> n
const inlinkCount = new Map<string, number>();

for (const file of walk(exportDir)) {
  const rel = relative(exportDir, dirname(file)).split("\\").join("/");
  const route = rel === "" ? "/" : `/${rel}/`;
  if (route === "/404/" || route === "/_not-found/") continue;
  const html = readFileSync(file, "utf8");
  const head = html.slice(0, html.indexOf("</head>"));
  const g = (re: RegExp, s = head) => s.match(re)?.[1] ?? "";
  const noindex = /<meta name="robots" content="[^"]*noindex/i.test(head);
  const mainStart = html.search(/<main[\s>]/); const mainEnd = html.indexOf("</main>");
  const main = mainStart >= 0 && mainEnd > mainStart ? html.slice(mainStart, mainEnd) : html;
  const text = strip(main);
  const h1 = decode(strip(g(/<h1[^>]*>([\s\S]*?)<\/h1>/i, main)));
  const h2s = [...main.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => strip(m[1])).filter(Boolean);
  const afterH1 = main.slice(main.search(/<\/h1>/i) + 5);
  const firstP = afterH1.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] ?? "";
  const lead = strip(firstP).slice(0, 320);
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => { try { return JSON.parse(decode(m[1])); } catch { return null; } }).filter(Boolean);
  const types = new Set<string>();
  const visit = (o: unknown) => { if (Array.isArray(o)) o.forEach(visit); else if (o && typeof o === "object") { const t = (o as Record<string, unknown>)["@type"]; if (typeof t === "string") types.add(t); Object.values(o as object).forEach(visit); } };
  ld.forEach(visit);
  const faqCount = (JSON.stringify(ld).match(/"@type":"Question"/g) ?? []).length;
  // Contextual links only: anchors inside <main>. Header/footer nav links every
  // page to ~200 routes, which says nothing about topical proximity.
  const anchors = [...main.matchAll(/<a\s[^>]*href="(\/[^"#?]*)"[^>]*>([\s\S]*?)<\/a>/gi)];
  const out = new Set<string>();
  for (const a of anchors) {
    const to = a[1].endsWith("/") ? a[1] : a[1] + "/";
    if (to === route) continue;
    out.add(to);
    const anchor = strip(a[2]).toLowerCase().slice(0, 80);
    const m = inlinks.get(to) ?? inlinks.set(to, new Map()).get(to)!;
    m.set(anchor, (m.get(anchor) ?? 0) + 1);
  }
  for (const to of out) inlinkCount.set(to, (inlinkCount.get(to) ?? 0) + 1);
  const primary = (html.match(/href="https?:\/\/[^"]+"/g) ?? []).filter((h) => PRIMARY.test(h)).length;
  pages.push({
    route, template: classify(route), noindex,
    title: decode(g(/<title>([^<]*)<\/title>/)),
    description: decode(g(/<meta name="description" content="([^"]*)"/)),
    canonical: g(/<link rel="canonical" href="([^"]*)"/),
    h1, h2s, h3Count: (main.match(/<h3[\s>]/gi) ?? []).length,
    wordCount: text ? text.split(" ").length : 0,
    tableCount: (main.match(/<table[\s>]/gi) ?? []).length,
    lead, leadHasNumber: /\d/.test(lead),
    schemaTypes: [...types].sort(), hasFaqSchema: types.has("FAQPage"), faqCount,
    ogImage: /<meta property="og:image"/.test(head),
    primarySourceLinks: primary,
    outlinks: [...out].filter((r) => /^\/([a-z0-9-]+\/)*$/.test(r)).sort(),
    inlinkCount: 0, inlinkAnchors: [],
    sitemapLastmod: sitemap.get(route)?.lastmod ?? null, sitemapPriority: sitemap.get(route)?.priority ?? null,
    gsc: gscPages.get(route) ?? null,
    ranked: (ranked.get(route) ?? []).sort((a, b) => b.vol - a.vol),
  });
}
for (const p of pages) {
  p.inlinkCount = inlinkCount.get(p.route) ?? 0;
  p.inlinkAnchors = [...(inlinks.get(p.route)?.entries() ?? [])].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([a]) => a);
}
pages.sort((a, b) => a.route.localeCompare(b.route));

let buildCommit = "unknown";
try { buildCommit = execSync("git rev-parse --short HEAD", { cwd: root }).toString().trim(); } catch {}
const site = SiteSignals.parse({ generatedAt: new Date().toISOString(), buildCommit, dataDate: dataDir.match(/(\d{4}-\d{2}-\d{2})/)?.[1] ?? "unknown", pages, queries, unowned });

// ---------- opportunities ----------
const opps: Opp[] = [];
const push = (level: Level, route: string | null, score: number, summary: string, facts: Opp["facts"]) => {
  const slug = (route ?? "site").replace(/^\/|\/$/g, "").replace(/\//g, "-") || "home";
  opps.push({ id: `${level}-${slug}-${opps.filter((o) => o.level === level && o.route === route).length + 1}`, level, route, score: Math.round(score), summary, facts });
};
const byRoute = new Map(pages.map((p) => [p.route, p]));
const titles = new Map<string, string[]>();
const descs = new Map<string, string[]>();

for (const p of pages) {
  if (p.noindex) continue;
  (titles.get(p.title) ?? titles.set(p.title, []).get(p.title)!).push(p.route);
  (descs.get(p.description) ?? descs.set(p.description, []).get(p.description)!).push(p.route);
  const g = p.gsc;
  // A. CTR gap: impressions and a CTR well under what the position should earn.
  if (g && g.impressions >= 400) {
    const exp = expectedCtr(g.position);
    if (g.ctr < exp * 0.6) {
      const lost = g.impressions * (exp - g.ctr);
      push("ctr", p.route, lost, `${g.impressions.toLocaleString()} impr at pos ${g.position.toFixed(1)} earn ${(g.ctr * 100).toFixed(2)}% CTR; expected ~${(exp * 100).toFixed(1)}% → ~${Math.round(lost)} clicks/28d recoverable`, { impressions: g.impressions, position: g.position, ctr: g.ctr, expectedCtr: exp, title: p.title, titleLen: p.title.length, description: p.description, descLen: p.description.length, topKeywords: p.ranked.slice(0, 6).map((k) => `${k.kw} (${k.vol}, #${k.pos})`) });
    }
  }
  // B. Striking distance: volume keywords at 4–20.
  const striking = p.ranked.filter((k) => k.pos >= 4 && k.pos <= 20 && k.vol >= 200);
  if (striking.length) {
    const gain = striking.reduce((s, k) => s + k.vol * (expectedCtr(3) - expectedCtr(k.pos)), 0);
    if (gain >= 60) push("striking", p.route, gain, `${striking.length} keywords at 4–20 worth ~${Math.round(gain)} clicks/mo at #3: ${striking.slice(0, 4).map((k) => `${k.kw} (${k.vol}, #${k.pos})`).join("; ")}`, { keywords: striking.slice(0, 12).map((k) => `${k.kw}|${k.vol}|${k.kd ?? ""}|${k.pos}`), wordCount: p.wordCount, h2s: p.h2s.slice(0, 14), tables: p.tableCount, faqs: p.faqCount, inlinks: p.inlinkCount, gscPos: g?.position ?? null, gscImpr: g?.impressions ?? null });
  }
  // D. Weakly linked pages that have demand.
  const demand = (g?.impressions ?? 0) + p.ranked.reduce((s, k) => s + (k.pos <= 30 ? k.vol : 0), 0);
  if (p.inlinkCount < 4 && demand >= 300 && p.template !== "programmatic-salary") {
    push("links", p.route, demand / (p.inlinkCount + 1), `${p.inlinkCount} inlinks for a page with ${(g?.impressions ?? 0).toLocaleString()} impr + ranked volume ${p.ranked.reduce((s, k) => s + (k.pos <= 30 ? k.vol : 0), 0).toLocaleString()}`, { inlinks: p.inlinkCount, anchors: p.inlinkAnchors, impressions: g?.impressions ?? null, topKeywords: p.ranked.slice(0, 5).map((k) => `${k.kw} (${k.vol}, #${k.pos})`), template: p.template });
  }
  // E. Schema / citation readiness.
  const missing: string[] = [];
  if (!p.hasFaqSchema && p.faqCount === 0 && ["calculator", "guide", "award", "tax-table", "centrelink", "state", "employer", "job"].includes(p.template)) missing.push("FAQPage");
  if (!p.schemaTypes.includes("BreadcrumbList") && p.template !== "home") missing.push("BreadcrumbList");
  if (p.template === "tax-table" && !p.schemaTypes.includes("Dataset")) missing.push("Dataset");
  if (["guide", "award", "centrelink", "state", "employer", "job"].includes(p.template) && !p.schemaTypes.some((t) => /Article|WebPage|FAQPage|Dataset/.test(t))) missing.push("Article");
  const cite: string[] = [];
  if (!p.leadHasNumber && ["calculator", "guide", "award", "tax-table", "centrelink", "state", "employer", "job"].includes(p.template)) cite.push("lead lacks a figure");
  if (p.primarySourceLinks === 0 && ["guide", "award", "tax-table", "centrelink", "state", "employer", "job"].includes(p.template)) cite.push("no primary-source link");
  if ((missing.length || cite.length) && demand >= 200) {
    push("schema", p.route, demand * (missing.length + cite.length) / 4, `${[...missing.map((m) => `missing ${m}`), ...cite].join("; ")}`, { missingSchema: missing, citation: cite, schemaTypes: p.schemaTypes, lead: p.lead, primarySourceLinks: p.primarySourceLinks, demand, template: p.template });
  }
  // F. Technical.
  const tech: string[] = [];
  if (!p.ogImage) tech.push("missing_og_image");
  if (p.wordCount < 350 && p.template !== "programmatic-salary" && p.template !== "legal") tech.push("thin_page");
  if (p.h2s.length === 0 && p.template !== "legal") tech.push("no_h2");
  if (p.title.length > 65) tech.push("long_title");
  if (p.description.length > 165) tech.push("long_description");
  if (p.inlinkCount === 0) tech.push("orphan");
  if (p.sitemapLastmod === null) tech.push("not_in_sitemap");
  if (tech.length) push("technical", p.route, Math.max(demand, 50) * tech.length, tech.join(", "), { issues: tech, wordCount: p.wordCount, titleLen: p.title.length, descLen: p.description.length, inlinks: p.inlinkCount, template: p.template });
}
for (const [t, routes] of titles) if (routes.length > 1) push("technical", null, 200 * routes.length, `duplicate title "${t}" on ${routes.length} pages`, { issues: ["duplicate_title"], routes, title: t });
for (const [d, routes] of descs) if (routes.length > 1) push("technical", null, 150 * routes.length, `duplicate description on ${routes.length} pages`, { issues: ["duplicate_description"], routes, description: d.slice(0, 120) });

// C. Cannibalisation: one query, two of our URLs inside the top 50.
for (const [kw, rows] of kwToRoutes) {
  const top = rows.filter((r) => r.pos <= 50 && byRoute.has(r.route)).sort((a, b) => a.pos - b.pos);
  if (top.length >= 2 && top[0].vol >= 150) {
    const best = top[0];
    push("cannibal", best.route, best.vol * top.length / (best.pos <= 3 ? 4 : 1), `"${kw}" (${best.vol}) ranks ${top.map((r) => `${r.route} #${r.pos}`).join(", ")}`, { keyword: kw, vol: best.vol, routes: top.map((r) => `${r.route}|${r.pos}`), bestPos: best.pos });
  }
}
// C2. Cannibal candidates from title/H1 overlap (DataForSEO keeps one URL per keyword,
// so real SERP-level cannibalisation needs a judgment; code only proposes pairs).
const STOP = new Set("a an the and or of for in on to by with your you how much is are what when calculator australia australian au 2026-27 2025-26 2026 2027 pay tax rates rate guide".split(" "));
const tokens = (s: string) => new Set(s.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((t) => t.length > 2 && !STOP.has(t)));
const cand = pages.filter((p) => !p.noindex && !["programmatic-salary", "news", "legal"].includes(p.template) && ((p.gsc?.impressions ?? 0) > 200 || p.ranked.length > 0));
for (let i = 0; i < cand.length; i++) for (let j = i + 1; j < cand.length; j++) {
  const a = cand[i], b = cand[j];
  if (a.template === "state" && b.template === "state") continue;
  const ta = tokens(a.title + " " + a.h1), tb = tokens(b.title + " " + b.h1);
  const shared = [...ta].filter((t) => tb.has(t));
  const jacc = shared.length / new Set([...ta, ...tb]).size;
  if (shared.length >= 2 && jacc >= 0.45) {
    const demand = (a.gsc?.impressions ?? 0) + (b.gsc?.impressions ?? 0);
    if (demand < 300) continue;
    push("cannibal", a.route, demand * jacc, `titles overlap (${shared.join(", ")}): ${a.route} vs ${b.route}`, { routes: [a.route, b.route], shared, titleA: a.title, titleB: b.title, imprA: a.gsc?.impressions ?? null, imprB: b.gsc?.impressions ?? null, posA: a.gsc?.position ?? null, posB: b.gsc?.position ?? null, kwA: a.ranked.slice(0, 4).map((k) => `${k.kw}|${k.vol}|${k.pos}`), kwB: b.ranked.slice(0, 4).map((k) => `${k.kw}|${k.vol}|${k.pos}`) });
  }
}
// G. Expansion: unowned in-border-looking demand (agent must still run the border test).
const inBorder = /pay|salary|wage|tax|super|hecs|help|award|penalty|overtime|leave|centrelink|pension|allowance|payslip|payg|withhold|casual|contractor|redundancy|bonus|medicare|levy|threshold|rate|hourly|fortnight|weekly|monthly|annual|income|earn/i;
for (const u of unowned.filter((u) => u.vol >= 500 && (u.kd ?? 100) <= 25 && inBorder.test(u.kw)).sort((a, b) => b.vol - a.vol).slice(0, 120)) {
  push("expansion", null, u.vol * (1 - (u.kd ?? 0) / 100) / 10, `"${u.kw}" ${u.vol.toLocaleString()}/mo KD ${u.kd ?? "?"}, held by ${u.best} (${u.ncomp} competitors rank, we don't)`, { keyword: u.kw, vol: u.vol, kd: u.kd, best: u.best, burl: u.burl, ncomp: u.ncomp });
}

opps.sort((a, b) => b.score - a.score);
const oppsOut = opps.map((o) => Opportunity.parse(o));

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "signals.json"), JSON.stringify(site));
writeFileSync(join(outDir, "opportunities.json"), JSON.stringify(oppsOut, null, 1));
const byLevel = Object.fromEntries([..."technical ctr striking cannibal links schema expansion".split(" ")].map((l) => [l, oppsOut.filter((o) => o.level === l)]));
const md = [
  `# seo-brain signals — ${today} (build ${buildCommit}, data ${site.dataDate})`,
  ``,
  `Pages crawled: ${pages.length} (${pages.filter((p) => p.noindex).length} noindex). GSC rows matched: ${pages.filter((p) => p.gsc).length}. Ranked-keyword rows: ${[...ranked.values()].reduce((s, r) => s + r.length, 0)}. Opportunities: ${oppsOut.length}.`,
  ``,
  ...Object.entries(byLevel).flatMap(([l, list]) => [
    `## ${l} (${list.length})`,
    ``,
    `| # | score | route | summary |`, `|---|---|---|---|`,
    ...list.slice(0, 40).map((o, i) => `| ${i + 1} | ${o.score.toLocaleString()} | ${o.route ?? "site"} | ${o.summary.replace(/\|/g, "/")} |`),
    ``,
  ]),
].join("\n");
writeFileSync(join(outDir, "signals.md"), md);
console.log(`[collect] ${pages.length} pages, ${oppsOut.length} opportunities → ${relative(repo, outDir)}`);
for (const [l, list] of Object.entries(byLevel)) console.log(`  ${l.padEnd(10)} ${String(list.length).padStart(4)}   top: ${list[0]?.route ?? "-"} (${list[0]?.score.toLocaleString() ?? ""})`);
