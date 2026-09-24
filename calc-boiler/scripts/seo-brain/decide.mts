/**
 * seo-brain decide — policy. Turns Jev judgments + collector facts into:
 *   decisions.json   fully specified, schema-valid decisions (links, consolidation,
 *                    technical fixes, expansion verdicts, no-actions)
 *   workorders.json  typed requests for a generative step (title/description
 *                    rewrites, new sections, citation leads) that an LLM agent
 *                    fills in; rank.mts then has Jev pick among the candidates
 *                    and validate.mts gates the result.
 *
 * Thresholds are explicit and live here, not inside the questions.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { Decision, DecisionBatch, Route, SiteSignals, type Decision as D, type Opportunity, type PageSignals } from "./schema.mts";
import { num as n, type AnswerMap } from "./jev.mts";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "../../..");
const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, "").split("="); return [k, v ?? true]; }));
const base = join(repo, "docs/seo/seo-brain");
const dir = resolve(repo, typeof args.dir === "string" ? args.dir : join(base, readdirSync(base).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort().pop()!));

const site = SiteSignals.parse(JSON.parse(readFileSync(join(dir, "signals.json"), "utf8")));
const opps: Opportunity[] = JSON.parse(readFileSync(join(dir, "opportunities.json"), "utf8"));
const J: Record<string, { level: string; route?: string; answers: AnswerMap; [k: string]: unknown }> = JSON.parse(readFileSync(join(dir, "judgments.json"), "utf8"));
const byRoute = new Map(site.pages.map((p) => [p.route, p]));
const oppById = new Map(opps.map((o) => [o.id, o]));

// ---------- thresholds ----------
const T = {
  recognised: 0.6, // below: the title does not read as answering the query
  descriptionAnswers: 0.5,
  titleGeneric: 0.6,
  headingCovers: 0.5,
  openingAnswers: 0.5,
  needsTable: 0.7,
  sameIntent: 0.6,
  linkNeeds: 0.55,
  citable: 2.4, // score out of 3
  border: 0.7,
  coveredByNone: 0.6,
  minCtrClicks: 40, // recoverable clicks/28d to bother rewriting a title
  minStrikingGain: 150,
};

// ---------- work orders (generative steps) ----------
export const WorkOrder = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("title_description"), id: z.string(), route: Route, priority: z.number(), currentTitle: z.string(), currentDescription: z.string(), queries: z.array(z.object({ query: z.string(), vol: z.number(), pos: z.number(), wants: z.string(), recognised: z.number() })), findings: z.array(z.string()), keepTokens: z.array(z.string()), needTitle: z.boolean(), needDescription: z.boolean() }),
  z.object({ kind: z.literal("section"), id: z.string(), route: Route, priority: z.number(), keywords: z.array(z.object({ kw: z.string(), vol: z.number(), pos: z.number(), wants: z.string(), needsTable: z.boolean(), headingCovers: z.number(), openingAnswers: z.number() })), existingHeadings: z.array(z.string()), findings: z.array(z.string()) }),
  z.object({ kind: z.literal("citation_lead"), id: z.string(), route: Route, priority: z.number(), h1: z.string(), currentLead: z.string(), topQuery: z.string(), citable: z.number(), findings: z.array(z.string()) }),
  z.object({ kind: z.literal("new_page"), id: z.string(), keyword: z.string(), vol: z.number(), kd: z.number().nullable(), wants: z.string(), competitorUrl: z.string(), border: z.object({ inScope: z.number(), linksToCalculator: z.number(), payslipCheck: z.number() }), jurisdictionSpecific: z.number(), nearestRoutes: z.array(Route), priority: z.number() }),
]);
export type WorkOrder = z.infer<typeof WorkOrder>;

const decisions: D[] = [];
const orders: WorkOrder[] = [];
const skipped: { id: string; why: string }[] = [];
const slug = (r: string) => r.replace(/^\/|\/$/g, "").replace(/\//g, "-") || "home";
let seq = 0;
const nid = (level: string, r: string) => `${level}-${slug(r)}-${++seq}`;

// ---------- CTR ----------
for (const [id, j] of Object.entries(J).filter(([, j]) => j.level === "ctr")) {
  const o = oppById.get(id)!; const p = byRoute.get(j.route!)!; const a = j.answers;
  if (o.score < T.minCtrClicks) { skipped.push({ id, why: `only ${o.score} recoverable clicks` }); continue; }
  const queries = (j.queries as string[]).map((q, i) => { const k = p.ranked.find((r) => r.kw === q)!; return { query: q, vol: k.vol, pos: k.pos, wants: a[`q${i}_wants`].choice as string, recognised: n(a[`q${i}_recognised`]) }; });
  const findings: string[] = [];
  const weak = queries.filter((q) => q.recognised < T.recognised);
  if (weak.length) findings.push(`title not recognised for: ${weak.map((q) => `"${q.query}" (${q.vol}/mo, p=${q.recognised.toFixed(2)})`).join(", ")}`);
  const promised = a.title_promises.choice as string;
  const mismatch = queries.filter((q) => q.wants !== promised && q.vol >= 300);
  if (mismatch.length) findings.push(`title promises a ${promised}; searchers want a ${mismatch.map((q) => `${q.wants} ("${q.query}")`).join(", ")}`);
  if (n(a.title_generic) >= T.titleGeneric) findings.push(`title reads generic (p=${n(a.title_generic).toFixed(2)})`);
  const needDescription = n(a.description_answers) < T.descriptionAnswers || n(a.description_reads_current) < 0.5 || p.description.length > 165;
  if (n(a.description_answers) < T.descriptionAnswers) findings.push(`description gives no concrete answer for "${queries[0].query}" (p=${n(a.description_answers).toFixed(2)})`);
  if (p.description.length > 165) findings.push(`description is ${p.description.length} chars; Google truncates ~155–165`);
  const needTitle = weak.length > 0 || mismatch.length > 0 || n(a.title_generic) >= T.titleGeneric;
  if (!needTitle && !needDescription) { decisions.push({ kind: "no_action", id: nid("ctr", p.route), level: "ctr", route: p.route, priority: 10, confidence: 0.7, rationale: `Title and description already match the top queries (min recognised ${Math.min(...queries.map((q) => q.recognised)).toFixed(2)}); the CTR gap is likely SERP features rather than the snippet. Revisit after position data refreshes.`, evidence: { gsc: p.gsc, keywords: p.ranked.slice(0, 5) }, targetQueries: queries.map((q) => q.query) }); continue; }
  // Tokens from the current title that hold current rankings: query words present in the title.
  const keep = [...new Set(queries.filter((q) => q.recognised >= T.recognised).flatMap((q) => q.query.split(" ")).filter((w) => w.length > 3 && p.title.toLowerCase().includes(w.toLowerCase())))];
  if (p.template === "programmatic-salary") findings.unshift(`TEMPLATE PAGE: the title comes from the ${p.route.split("/")[1]} template; change the template once (all pages), never one slug. Queries like "N after tax" belong to /take-home-pay-on/N/ — prefer a cross-link with that anchor over retitling this page`);
  orders.push({ kind: "title_description", id, route: p.route, priority: o.score, currentTitle: p.title, currentDescription: p.description, queries, findings, keepTokens: keep, needTitle, needDescription });
}

// ---------- Striking ----------
for (const [id, j] of Object.entries(J).filter(([, j]) => j.level === "striking")) {
  const o = oppById.get(id)!; const p = byRoute.get(j.route!)!; const a = j.answers;
  if (o.score < T.minStrikingGain) { skipped.push({ id, why: `gain ${o.score} below ${T.minStrikingGain}` }); continue; }
  const kws = (j.keywords as { kw: string; vol: number; pos: number }[]).map((k, i) => ({ ...k, wants: a[`k${i}_wants`].choice as string, needsTable: n(a[`k${i}_needs_table`]) >= T.needsTable, headingCovers: n(a[`k${i}_heading_covers`]), openingAnswers: n(a[`k${i}_opening_answers`]), titleCovers: n(a[`k${i}_title_covers`]) }));
  const findings: string[] = [];
  const uncovered = kws.filter((k) => k.headingCovers < T.headingCovers);
  if (uncovered.length) findings.push(`no heading addresses: ${uncovered.map((k) => `"${k.kw}" (${k.vol}/mo, #${k.pos})`).join(", ")}`);
  const noAnswer = kws.filter((k) => k.openingAnswers < T.openingAnswers && k.vol >= 500);
  if (noAnswer.length) findings.push(`opening paragraph does not answer: ${noAnswer.map((k) => `"${k.kw}"`).join(", ")}`);
  const tableGap = kws.filter((k) => k.needsTable && p.tableCount === 0);
  if (tableGap.length) findings.push(`searchers expect a table and the page has none: ${tableGap.map((k) => `"${k.kw}"`).join(", ")}`);
  const kindGap = kws.filter((k) => k.wants === "calculator" && p.template !== "calculator" && p.template !== "home" && k.vol >= 500);
  if (kindGap.length) findings.push(`searchers want a calculator; page is a ${p.template}: ${kindGap.map((k) => `"${k.kw}"`).join(", ")}`);
  if (!findings.length) { decisions.push({ kind: "no_action", id: nid("striking", p.route), level: "striking", route: p.route, priority: 10, confidence: 0.6, rationale: `Headings, opening and format already cover the striking-distance keywords (min heading coverage ${Math.min(...kws.map((k) => k.headingCovers)).toFixed(2)}). Movement here needs links or authority, not on-page changes.`, evidence: { gsc: p.gsc, keywords: p.ranked.slice(0, 6) }, targetQueries: kws.map((k) => k.kw) }); continue; }
  orders.push({ kind: "section", id, route: p.route, priority: o.score, keywords: kws.map(({ titleCovers, ...k }) => k), existingHeadings: p.h2s, findings });
}

// ---------- Cannibal ----------
for (const [id, j] of Object.entries(J).filter(([, j]) => j.level === "cannibal")) {
  const o = oppById.get(id)!; const [ra, rb] = j.routes as string[]; const a = j.answers;
  const same = n(a.same_intent); const rel = a.distinct_purpose.choice as string;
  const votes = (j.queries as string[]).map((q, i) => a[`q${i}_better`].choice as string);
  const aWins = votes.filter((v) => v === "page_a").length; const keep = aWins >= votes.length / 2 ? ra : rb; const lose = keep === ra ? rb : ra;
  if (same >= 0.75 && rel === "duplicate") {
    decisions.push({ kind: "consolidate", id: nid("cannibal", keep), level: "cannibal", priority: Math.min(100, o.score / 100), confidence: same, rationale: `Jev judged the two pages serve the same searcher need (p=${same.toFixed(2)}, relation=${rel}); ${keep} won ${keep === ra ? aWins : votes.length - aWins}/${votes.length} query votes. Retarget the loser to a distinct query rather than redirect, so no ranking URL is lost.`, evidence: { keywords: [], note: `queries voted: ${(j.queries as string[]).join("; ")}` }, targetQueries: j.queries as string[], keepRoute: keep, loserRoutes: [lose], method: "retarget_loser" });
  } else if (rel === "overlap" || rel === "duplicate" || same >= T.sameIntent) {
    decisions.push({ kind: "consolidate", id: nid("cannibal", keep), level: "cannibal", priority: Math.min(100, o.score / 200), confidence: 1 - same, rationale: `Different purpose but the titles and openings blur it (same-intent p=${same.toFixed(2)}). Sharpen the loser's title/opening so each page names its own job; keep both URLs.`, evidence: { keywords: [], note: `titles: ${byRoute.get(ra)!.title} | ${byRoute.get(rb)!.title}` }, targetQueries: j.queries as string[], keepRoute: keep, loserRoutes: [lose], method: "differentiate" });
  } else {
    decisions.push({ kind: "no_action", id: nid("cannibal", keep), level: "cannibal", route: keep, priority: 5, confidence: 1 - same, rationale: `Jev judged ${ra} and ${rb} complementary (same-intent p=${same.toFixed(2)}): one is a tool, the other a reference, or they answer different questions. Keep both and cross-link.`, evidence: { keywords: [] }, targetQueries: j.queries as string[] });
  }
}

// ---------- Links ----------
const perSource = new Map<string, number>();
for (const [id, j] of Object.entries(J).filter(([, j]) => j.level === "links")) {
  const route = j.route as string; const a = j.answers; const anchors = j.anchors as string[]; const sources = j.sources as string[];
  let anchor = anchors[Number(String(a.anchor.choice).slice(1))] ?? anchors[0];
  const t = byRoute.get(route)!;
  if (anchor.length > 55) anchor = [...anchors].filter((x) => x.length <= 55).sort((x, y) => x.length - y.length)[0] ?? t.ranked[0]?.kw ?? anchor.slice(0, 55);
  let perTarget = 0;
  sources.map((from, i) => ({ from, i, p: n(a[`s${i}_needs`]) })).sort((x, y) => y.p - x.p).forEach(({ from, i, p }) => {
    if (p < T.linkNeeds) return;
    if (byRoute.get(from)!.outlinks.includes(route)) return;
    if (perTarget >= 3 || (perSource.get(from) ?? 0) >= 3) return;
    perTarget++; perSource.set(from, (perSource.get(from) ?? 0) + 1);
    decisions.push({ kind: "add_internal_link", id: nid("links", route), level: "links", priority: Math.min(100, Math.round(p * 100)), confidence: p, rationale: `A reader of ${from} plausibly wants ${route} next (Jev p=${p.toFixed(2)}); ${from} does not yet link there in its content. Anchor chosen by Jev among the target's H1 and top queries. Target has ${t.inlinkCount} contextual inlinks and ${(t.gsc?.impressions ?? 0).toLocaleString()} impr/28d.`, evidence: { gsc: t.gsc, keywords: t.ranked.slice(0, 3) }, targetQueries: t.ranked.slice(0, 3).map((k) => k.kw).concat(t.h1).filter(Boolean), fromRoute: from, toRoute: route, anchor, placement: "in_content" });
  });
}

// ---------- Schema / citation ----------
for (const [id, j] of Object.entries(J).filter(([, j]) => j.level === "schema")) {
  const route = j.route as string; const p = byRoute.get(route)!; const a = j.answers;
  const citable = n(a.citable);
  const findings: string[] = [];
  if (citable < T.citable) findings.push(`opening scores ${citable.toFixed(2)}/3 as a quotable answer`);
  if (n(a.defines_subject) < 0.5) findings.push(`opening does not define the subject first (p=${n(a.defines_subject).toFixed(2)})`);
  if (findings.length) orders.push({ kind: "citation_lead", id, route, priority: (p.gsc?.impressions ?? 0) / 100 + citable * -10, h1: p.h1, currentLead: p.lead, topQuery: p.ranked[0]?.kw ?? p.h1, citable, findings });
  // Missing structured data is a code fact, not a judgment.
  const so = opps.find((o) => o.level === "schema" && o.route === route);
  for (const m of ((so?.facts.missingSchema as string[]) ?? [])) {
    if (!["FAQPage", "BreadcrumbList", "Dataset", "Article"].includes(m)) continue;
    decisions.push({ kind: "add_schema", id: nid("schema", route), level: "schema", priority: Math.min(100, (p.gsc?.impressions ?? 0) / 200), confidence: 0.95, rationale: `Page has ${p.schemaTypes.join(", ") || "no JSON-LD"}; the ${p.template} template elsewhere on the site carries ${m}. Consistent structured data across a template is a crawl-side fix with no content risk.`, evidence: { gsc: p.gsc, keywords: p.ranked.slice(0, 3) }, targetQueries: [p.ranked[0]?.kw ?? p.h1], scope: route, schemaType: m as "FAQPage" | "BreadcrumbList" | "Dataset" | "Article", requiredFields: m === "FAQPage" ? ["mainEntity[].name", "mainEntity[].acceptedAnswer.text (must match visible FAQ)"] : m === "Dataset" ? ["name", "description", "temporalCoverage", "creator", "license", "distribution"] : m === "Article" ? ["headline", "datePublished", "dateModified", "author", "publisher"] : ["itemListElement"] });
  }
}

// ---------- Expansion ----------
for (const [id, j] of Object.entries(J).filter(([, j]) => j.level === "expansion")) {
  const o = oppById.get(id)!; const a = j.answers; const kw = j.keyword as string;
  const inScope = n(a.in_scope), calc = n(a.links_to_calculator), payslip = n(a.payslip_check);
  const coveredP = a.covered_by.probabilities as Record<string, number>; const covered = a.covered_by.choice as string;
  const near = j.near as string[];
  if (covered !== "none" && (coveredP[covered] ?? 0) >= T.coveredByNone) {
    const r = near[Number(covered.slice(1))];
    decisions.push({ kind: "no_action", id: nid("expansion", r), level: "expansion", route: r, priority: 5, confidence: coveredP[covered], rationale: `"${kw}" (${o.facts.vol}/mo) is already the subject of ${r} (Jev p=${coveredP[covered].toFixed(2)}). We do not rank for it yet, so this is a striking-distance/links problem for that page, not a new page.`, evidence: { keywords: [{ kw, vol: o.facts.vol as number, kd: o.facts.kd as number | null, intent: null, pos: 100 }] }, targetQueries: [kw] });
    continue;
  }
  const pass = inScope >= T.border && calc >= T.border && payslip >= T.border;
  if (!pass) { decisions.push({ kind: "no_action", id: nid("expansion", "site"), level: "expansion", route: null, priority: 1, confidence: 1 - Math.min(inScope, calc, payslip), rationale: `"${kw}" fails the contextual border (in-scope ${inScope.toFixed(2)}, links-to-calculator ${calc.toFixed(2)}, payslip-check ${payslip.toFixed(2)}; all must be ≥ ${T.border}). Volume ${o.facts.vol}/mo is not a reason to drift outside the topical border.`, evidence: { keywords: [] }, targetQueries: [kw] }); continue; }
  orders.push({ kind: "new_page", id, keyword: kw, vol: o.facts.vol as number, kd: o.facts.kd as number | null, wants: a.wants.choice as string, competitorUrl: String(o.facts.burl), border: { inScope, linksToCalculator: calc, payslipCheck: payslip }, jurisdictionSpecific: n(a.jurisdiction_specific), nearestRoutes: near, priority: o.score });
}

// ---------- Technical (code facts only) ----------
for (const o of opps.filter((o) => o.level === "technical")) {
  const issues = o.facts.issues as string[];
  for (const issue of issues) {
    const scope = o.route ?? "*";
    const fix = issue === "long_description" ? `Trim the meta description on ${scope} to ≤165 characters, keeping the leading figure and the FY. Use fitDescription() forms so the cut is at a sentence end.`
      : issue === "long_title" ? `Shorten the <title> on ${scope} to ≤65 characters with fitTitle() forms; keep the head term first.`
      : issue === "duplicate_title" ? `Routes ${(o.facts.routes as string[]).join(", ")} share the title "${o.facts.title}". Give each a title that names its own job.`
      : issue === "duplicate_description" ? `Routes ${(o.facts.routes as string[]).join(", ")} share one meta description. Write one per page with that page's own figure.`
      : issue === "orphan" ? `${scope} has no contextual inlinks. Add it to the related-links cluster of its hub and at least two sibling pages.`
      : issue === "thin_page" ? `${scope} has ${o.facts.wordCount} words in <main>. Either give it a real section with a figure and source, or fold it into its parent.`
      : issue === "no_h2" ? `${scope} has no H2. Add a heading per section so passages can rank on their own.`
      : issue === "missing_og_image" ? `${scope} has no og:image. Add images: ["/og-image.png"] to openGraph.`
      : `${scope}: ${issue}`;
    decisions.push({ kind: "technical_fix", id: nid("technical", o.route ?? "site"), level: "technical", priority: Math.min(100, o.score / 300), confidence: 1, rationale: `Collector found ${issue} on ${scope}; this is a deterministic check (scripts/check-meta.mjs warns on it) with no judgment involved. Fixing it cannot lose rankings and removes a truncation or duplication signal.`, evidence: { keywords: [] }, targetQueries: [byRoute.get(o.route ?? "")?.ranked[0]?.kw ?? "site hygiene"], scope: scope as "*" | `/${string}`, issue: (["missing_og_image", "thin_page", "no_h2", "no_schema", "noindex_in_sitemap", "orphan", "slow_template", "duplicate_title", "duplicate_description", "long_title", "long_description", "missing_primary_source"].includes(issue) ? issue : "other") as "other", fix });
  }
}

// ---------- validate + write ----------
const batch = DecisionBatch.parse({ level: "technical", author: "seo-brain decide.mts (Jev jev-1.13.0 judgments + code policy)", createdAt: new Date().toISOString(), signalsGeneratedAt: site.generatedAt, decisions: decisions.map((d) => Decision.parse(d)) });
writeFileSync(join(dir, "decisions.json"), JSON.stringify(batch, null, 1));
orders.sort((a, b) => b.priority - a.priority);
writeFileSync(join(dir, "workorders.json"), JSON.stringify(orders.map((w) => WorkOrder.parse(w)), null, 1));
writeFileSync(join(dir, "skipped.json"), JSON.stringify(skipped, null, 1));
const count = (k: string) => decisions.filter((d) => d.kind === k).length;
console.log(`[decide] ${decisions.length} decisions: ${["add_internal_link", "consolidate", "add_schema", "technical_fix", "no_action"].map((k) => `${k}=${count(k)}`).join(" ")}`);
console.log(`[decide] ${orders.length} work orders: ${["title_description", "section", "citation_lead", "new_page"].map((k) => `${k}=${orders.filter((w) => w.kind === k).length}`).join(" ")}; skipped ${skipped.length}`);
