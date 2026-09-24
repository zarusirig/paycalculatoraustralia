/**
 * seo-brain judge — ask Jev narrow, typed questions about each opportunity and
 * write the raw judgments. No policy here: thresholds live in decide.mts.
 *
 *   node scripts/seo-brain/judge.mts [--dir=docs/seo/seo-brain/<date>] [--levels=ctr,striking,...] [--limit=N]
 *
 * Each level packs the questions for one opportunity into one request (fan-out
 * pattern) and keeps the state to the fields those questions need.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ask, choice, noul, pool, report, score, type Question } from "./jev.mts";
import { SiteSignals, type Opportunity, type PageSignals } from "./schema.mts";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "../../..");
const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, "").split("="); return [k, v ?? true]; }));
const dir = resolve(repo, typeof args.dir === "string" ? args.dir : latestDir());
const levels = new Set(typeof args.levels === "string" ? args.levels.split(",") : ["ctr", "striking", "cannibal", "links", "schema", "expansion"]);
const LIMIT = typeof args.limit === "string" ? Number(args.limit) : Infinity;

function latestDir() {
  const base = join(repo, "docs/seo/seo-brain");
  const dirs = readdirSync(base).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort();
  return join(base, dirs[dirs.length - 1]);
}

const site = SiteSignals.parse(JSON.parse(readFileSync(join(dir, "signals.json"), "utf8")));
const opps: Opportunity[] = JSON.parse(readFileSync(join(dir, "opportunities.json"), "utf8"));
const byRoute = new Map(site.pages.map((p) => [p.route, p]));
const pick = (level: string) => opps.filter((o) => o.level === level).slice(0, LIMIT);

const PAGE_KINDS = {
  calculator: "an interactive tool where the user enters their own figures and gets a computed result",
  table: "a lookup table of published figures (rates, thresholds, pay scales, dates)",
  figure: "one specific number or short factual answer (how much, what rate, when)",
  guide: "an explanation of how something works, eligibility or rules",
  comparison: "a comparison between two options or categories",
};
const promises = (title: string, h1: string) => ({ title, h1 });

export type Judgments = Record<string, Record<string, unknown>>;
const out: Judgments = existsSync(join(dir, "judgments.json")) ? JSON.parse(readFileSync(join(dir, "judgments.json"), "utf8")) : {};
const save = () => writeFileSync(join(dir, "judgments.json"), JSON.stringify(out, null, 1));

// ---------- CTR ----------
if (levels.has("ctr")) {
  await pool(pick("ctr"), 6, async (o) => {
    const p = byRoute.get(o.route!)!;
    const queries = p.ranked.slice(0, 5).map((k) => ({ query: k.kw, position_bucket: k.pos <= 3 ? "top 3" : k.pos <= 10 ? "page 1" : "page 2+", volume_bucket: k.vol >= 5000 ? "very high" : k.vol >= 1000 ? "high" : "medium" }));
    if (!queries.length) return;
    const state = { page: promises(p.title, p.h1), description: p.description, queries };
    const qs: Record<string, Question> = {
      title_promises: choice("Which kind of page does `page.title` promise?", PAGE_KINDS),
      description_answers: noul("Does `description` state a concrete figure or direct answer that a searcher of `queries[0].query` would want to see before clicking?"),
      description_reads_current: noul("Does `description` name the financial year or a date that makes it read as up to date?"),
      title_generic: noul("Could `page.title` describe many different pages on the same topic, rather than this specific one?", { true: "vague or interchangeable wording", false: "specific: names the exact tool, table or figure the page gives" }),
    };
    queries.forEach((q, i) => {
      qs[`q${i}_wants`] = choice(`Which kind of page does a searcher of \`queries[${i}].query\` want?`, PAGE_KINDS);
      qs[`q${i}_recognised`] = noul(`Would a searcher who typed \`queries[${i}].query\` recognise a result headed \`page.title\` as directly answering that search?`, { true: "the title clearly covers this exact search", false: "the searcher would have to guess, or the title is about something adjacent" });
    });
    out[o.id] = { level: "ctr", route: o.route, queries: queries.map((q) => q.query), answers: await ask(state, qs) };
  });
  save(); report("ctr");
}

// ---------- Striking distance ----------
if (levels.has("striking")) {
  await pool(pick("striking"), 6, async (o) => {
    const p = byRoute.get(o.route!)!;
    const kws = (o.facts.keywords as string[]).slice(0, 6).map((s) => { const [kw, vol, , pos] = s.split("|"); return { kw, vol: Number(vol), pos: Number(pos) }; });
    const state = { page: { title: p.title, h1: p.h1, headings: p.h2s.slice(0, 16), has_table: p.tableCount > 0, has_faq: p.faqCount > 0, opening: p.lead }, keywords: kws.map((k) => k.kw) };
    const qs: Record<string, Question> = {};
    kws.forEach((_, i) => {
      qs[`k${i}_wants`] = choice(`Which kind of page does a searcher of \`keywords[${i}]\` want?`, PAGE_KINDS);
      qs[`k${i}_heading_covers`] = noul(`Does one of \`page.headings\` directly address \`keywords[${i}]\` (same subject, not merely a related topic)?`);
      qs[`k${i}_title_covers`] = noul(`Does \`page.title\` or \`page.h1\` name the subject of \`keywords[${i}]\` in words a searcher would recognise?`);
      qs[`k${i}_opening_answers`] = noul(`Does \`page.opening\` give the direct answer a searcher of \`keywords[${i}]\` is looking for?`);
      qs[`k${i}_needs_table`] = noul(`Would a searcher of \`keywords[${i}]\` expect a table of figures on the page?`);
    });
    out[o.id] = { level: "striking", route: o.route, keywords: kws, answers: await ask(state, qs) };
  });
  save(); report("striking");
}

// ---------- Cannibalisation ----------
if (levels.has("cannibal")) {
  await pool(pick("cannibal"), 6, async (o) => {
    const [ra, rb] = o.facts.routes as string[];
    const a = byRoute.get(ra)!, b = byRoute.get(rb)!;
    const kws = [...(o.facts.kwA as string[]), ...(o.facts.kwB as string[])].map((s) => s.split("|")[0]).filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 4);
    const state = { page_a: { route: ra, title: a.title, h1: a.h1, opening: a.lead, headings: a.h2s.slice(0, 8) }, page_b: { route: rb, title: b.title, h1: b.h1, opening: b.lead, headings: b.h2s.slice(0, 8) }, queries: kws };
    const qs: Record<string, Question> = {
      same_intent: noul("Do `page_a` and `page_b` serve the same searcher need, such that a search engine would struggle to pick one over the other?", { true: "both pages answer the same question in the same format", false: "they answer different questions or one is a tool and the other a reference" }),
      distinct_purpose: choice("How do `page_a` and `page_b` relate?", { duplicate: "same purpose and content type; one should absorb the other", overlap: "different purpose but the titles/openings blur the difference; sharpen wording", complementary: "clearly different jobs; keep both and cross-link" }),
    };
    kws.forEach((_, i) => { qs[`q${i}_better`] = choice(`For a searcher of \`queries[${i}]\`, which page is the better landing page?`, { page_a: "page_a", page_b: "page_b" }); });
    out[o.id] = { level: "cannibal", routes: [ra, rb], queries: kws, answers: await ask(state, qs) };
  });
  save(); report("cannibal");
}

// ---------- Internal links ----------
if (levels.has("links")) {
  // Targets: striking + ctr pages (demand exists). Sources: pages with impressions
  // that share title tokens with the target and do not already link to it in-content.
  const STOP = new Set("a an the and or of for in on to by with your you how much is are what when calculator australia australian au 2026-27 2025-26 2026 2027 pay tax rates rate guide".split(" "));
  const tokens = (s: string) => new Set(s.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((t) => t.length > 2 && !STOP.has(t)));
  const targets = [...new Set([...pick("striking"), ...pick("ctr")].map((o) => o.route!))].slice(0, LIMIT === Infinity ? 45 : LIMIT);
  const sources = site.pages.filter((p) => !p.noindex && (p.gsc?.impressions ?? 0) >= 300 && p.template !== "programmatic-salary");
  await pool(targets, 6, async (route) => {
    const t = byRoute.get(route)!;
    const tt = tokens(t.title + " " + t.h1 + " " + t.ranked.slice(0, 5).map((k) => k.kw).join(" "));
    const cands = sources.filter((s) => s.route !== route && !s.outlinks.includes(route)).map((s) => ({ s, shared: [...tokens(s.title + " " + s.h1)].filter((x) => tt.has(x)).length })).filter((c) => c.shared >= 1).sort((a, b) => b.shared - a.shared || (b.s.gsc?.impressions ?? 0) - (a.s.gsc?.impressions ?? 0)).slice(0, 8);
    if (!cands.length) return;
    const anchors = [...new Set([t.h1, ...t.ranked.slice(0, 3).map((k) => k.kw)])].filter((a) => a && a.length <= 70).slice(0, 4);
    const state = { target: { title: t.title, h1: t.h1, opening: t.lead }, anchors, sources: cands.map((c) => ({ title: c.s.title, h1: c.s.h1, opening: c.s.lead.slice(0, 200) })) };
    const qs: Record<string, Question> = {
      anchor: choice("Which of `anchors` reads as the most natural link text for a sentence that sends a reader to `target`?", Object.fromEntries(anchors.map((a, i) => [`a${i}`, a]))),
    };
    cands.forEach((_, i) => { qs[`s${i}_needs`] = noul(`Would a reader who came for \`sources[${i}]\` plausibly want \`target\` as their next page?`, { true: "the target answers a natural follow-up question from the source page", false: "the pages are only loosely related; the link would be filler" }); });
    out[`links-${route.replace(/^\/|\/$/g, "").replace(/\//g, "-")}`] = { level: "links", route, anchors, sources: cands.map((c) => c.s.route), answers: await ask(state, qs) };
  });
  save(); report("links");
}

// ---------- Schema / AI citation ----------
if (levels.has("schema")) {
  const demand = (p: PageSignals) => (p.gsc?.impressions ?? 0) + p.ranked.reduce((s, k) => s + (k.pos <= 30 ? k.vol : 0), 0);
  const pages = site.pages.filter((p) => !p.noindex && !["programmatic-salary", "news", "legal", "hub", "home"].includes(p.template)).sort((a, b) => demand(b) - demand(a)).slice(0, LIMIT === Infinity ? 80 : LIMIT);
  await pool(pages, 8, async (p) => {
    const state = { h1: p.h1, opening: p.lead, top_query: p.ranked[0]?.kw ?? p.h1 };
    out[`schema-${p.route.replace(/^\/|\/$/g, "").replace(/\//g, "-")}`] = { level: "schema", route: p.route, answers: await ask(state, {
      citable: score("How well does `opening` work as a self-contained answer an AI assistant could quote for `top_query`?", [
        "No direct answer: introduces the page or the reader rather than answering",
        "Answers in general terms but gives no figure, rate or date",
        "Gives a concrete figure or rule but no financial year or date, so it could be stale",
        "Gives a definition or direct answer with a concrete figure and the financial year or date",
      ]),
      defines_subject: noul("Does `opening` start by stating what the subject of `h1` is or how it is worked out, before anything else?"),
      addresses_reader: noul("Does `opening` talk to the reader (you, your) about their own situation?"),
    }) };
  });
  save(); report("schema");
}

// ---------- Expansion (new in-border nodes) ----------
if (levels.has("expansion")) {
  const SITE = "pay-calculator-australia.com publishes Australian pay, income tax, superannuation, HECS, award pay rate, leave and Centrelink payment calculators and reference pages, for employees checking what they should be paid and what lands in their bank account. Its central entity is Australian pay calculation. Property, mortgages, GST, investing, business accounting and general personal finance are outside its scope.";
  const STOP = new Set("a an the and or of for in on to by with your you how much is are what when australia australian au 2026 2027 2026-27 2025-26".split(" "));
  const stem = (t: string) => t.replace(/(ies)$/, "y").replace(/(s|es)$/, "").replace(/(calculat)(or|ion|e|ing)$/, "$1");
  const tokens = (s: string) => new Set(s.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((t) => t.length > 2 && !STOP.has(t)).map(stem));
  const routes = site.pages.filter((p) => !p.noindex && !["programmatic-salary", "news", "legal"].includes(p.template));
  // Normalise state names and common synonyms so "victorian teacher salary" finds /teacher-pay-australia/vic/.
  const SYN: Record<string, string> = { victoria: "vic", victorian: "vic", queensland: "qld", "new-south-wale": "nsw", nsw: "nsw", tasmania: "tas", tasmanian: "tas", "western-australia": "wa", "south-australia": "sa", "northern-territory": "nt", canberra: "act", wage: "pay", wages: "pay", salary: "pay", salarie: "pay", earning: "pay", income: "pay", withholding: "payg", withheld: "payg", estimate: "calculator", estimator: "calculator", calculate: "calculator", teaching: "teacher", nursing: "nurse", superannuation: "super" };
  const norm = (t: string) => SYN[t] ?? t;
  const ktoks = (s: string) => new Set([...tokens(s.replace(/new south wales/gi, "nsw").replace(/western australia/gi, "wa").replace(/south australia/gi, "sa").replace(/northern territory/gi, "nt"))].map(norm));
  await pool(pick("expansion"), 8, async (o) => {
    const kw = o.facts.keyword as string;
    const kt = ktoks(kw);
    const near = routes.map((p) => ({ p, n: [...ktoks(p.title + " " + p.h1 + " " + p.route.replace(/[\/-]/g, " "))].filter((x) => kt.has(x)).length })).filter((c) => c.n > 0).sort((a, b) => b.n - a.n || (b.p.gsc?.impressions ?? 0) - (a.p.gsc?.impressions ?? 0)).slice(0, 6);
    const state = { site: SITE, keyword: kw, competitor_page_url: o.facts.burl, existing_pages: near.map((c) => ({ route: c.p.route, title: c.p.title })) };
    const covered: Record<string, string> = Object.fromEntries(near.map((c, i) => [`e${i}`, `${c.p.title}`]));
    covered.none = "none of the existing pages is about this keyword's subject";
    out[o.id] = { level: "expansion", keyword: kw, near: near.map((c) => c.p.route), answers: await ask(state, {
      in_scope: noul("Is `keyword` about pay, income tax, superannuation, employee entitlements, award wages or government income-support payments received by a worker, as described in `site`?", { true: "the searcher wants to know what they are paid, taxed or entitled to", false: "the searcher wants something about property, business, investing, GST, or an unrelated topic" }),
      links_to_calculator: noul("Would a page answering `keyword` naturally end with the reader using a pay, tax or entitlement calculator to check their own figure?"),
      payslip_check: noul("Would the answer to `keyword` help a worker check that a payslip, payment or tax deduction is correct?"),
      wants: choice("Which kind of page does a searcher of `keyword` want?", PAGE_KINDS),
      covered_by: choice("Which of `existing_pages` already covers the exact subject of `keyword`?", covered),
      jurisdiction_specific: noul("Does `keyword` name a state, territory, employer, occupation or award, so the answer depends on which one?"),
    }) };
  });
  save(); report("expansion");
}

console.log(`[judge] wrote ${Object.keys(out).length} judgments → ${join(dir, "judgments.json")}`);
