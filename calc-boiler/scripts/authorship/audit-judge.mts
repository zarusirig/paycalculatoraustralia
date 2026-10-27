/**
 * Step 1 audit: one TypeSafe (Jev) request per Tier 1 + Tier 2 page.
 *
 *   node scripts/authorship/audit-judge.mts [--dir=../docs/authorship-2026-10-27] [--limit=N] [--only=/path/,/path/]
 *
 * Reads page-state.jsonl, similar.json and serp-cache/, writes AUDIT.tsv and
 * audit-raw.json. Jev judges; it never writes text, counts or does arithmetic.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { ask, choice, noul, pool, report, score, type Answer } from "../seo-brain/jev.mts";

const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, "").split("="); return [k, v ?? true]; }));
const DIR = resolve(typeof args.dir === "string" ? args.dir : "../docs/authorship-2026-10-27");
const LIMIT = typeof args.limit === "string" ? Number(args.limit) : Infinity;
const ONLY = typeof args.only === "string" ? new Set(args.only.split(",")) : null;
const T3 = /^\/(tax-on|take-home-pay-on|salary-to-hourly|hourly-to-salary)\/[^/]+\//;

type State = { url: string; path: string; h1: string; opening: string[]; h2: string[]; components: Record<string, number | null>; main_query: string; gsc_pre28: Record<string, string>; top_queries: string };
const pages: State[] = readFileSync(join(DIR, "page-state.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l)).filter((p: State) => !T3.test(p.path) && !("error" in p));
const byPath = new Map(pages.map((p) => [p.path, p]));
const similar: Record<string, { path: string; jaccard: number }[]> = JSON.parse(readFileSync(join(DIR, "similar.json"), "utf8"));

function serp(q: string) {
  const f = join(DIR, "serp-cache", createHash("sha1").update(q).digest("hex").slice(0, 16) + ".json");
  if (!existsSync(f)) return null;
  return (JSON.parse(readFileSync(f, "utf8")).results as { url: string; title: string; description: string }[]).slice(0, 5).map((r) => ({ domain: new URL(r.url).hostname.replace(/^www\./, ""), title: r.title, description: (r.description ?? "").slice(0, 300) }));
}
const overlap = (j: number) => (j >= 0.7 ? "most of the body text is shared" : j >= 0.45 ? "about half the body text is shared" : j >= 0.25 ? "some template text is shared" : "little text shared");
const ctrBucket = (pos: number, ctr: number) => (pos > 0 && pos <= 5 && ctr < 0.01 ? "top-5 position but under 1% click-through" : pos > 0 && pos <= 10 && ctr < 0.005 ? "page-1 position but under 0.5% click-through" : "normal click-through for its position");

const INTENTS = {
  "calculate": "the searcher wants to enter their own figures and get a computed result",
  "lookup-rate-table": "the searcher wants a published rate, scale, threshold or table to look up",
  "definition": "the searcher wants to know what something is or means",
  "how-to-steps": "the searcher wants ordered steps to do or work something out",
  "comparison": "the searcher wants two or more options compared",
  "news-update": "the searcher wants a recent change, decision or announcement",
  "eligibility-check": "the searcher wants to know whether they qualify or are covered",
  "experience/opinion": "the searcher wants other people's experience or a recommendation",
};

const todo = pages.filter((p) => !ONLY || ONLY.has(p.path)).slice(0, LIMIT);
const raw: Record<string, { answers: Record<string, Answer>; serp: boolean }> = existsSync(join(DIR, "audit-raw.json")) ? JSON.parse(readFileSync(join(DIR, "audit-raw.json"), "utf8")) : {};
let missingSerp = 0;
await pool(todo, 6, async (p) => {
  const s = serp(p.main_query);
  if (!s) missingSerp++;
  const pos = Number(p.gsc_pre28.pre28_pos || 0), ctr = Number(p.gsc_pre28.pre28_ctr || 0);
  const c = p.components;
  const state = {
    page: {
      h1: p.h1,
      opening_sentences: p.opening,
      section_headings: p.h2.slice(0, 16),
      has_calculator: Number(c.inputs) > 0,
      paragraphs_before_calculator: c.paragraphs_before_first_input,
      tables: c.tables,
      paragraphs_before_first_table: c.paragraphs_before_first_table,
      ordered_lists: c.ordered_lists,
      faq_items: c.faq_items,
    },
    main_query: p.main_query,
    other_queries: p.top_queries ? p.top_queries.split(" | ").map((q) => q.replace(/ \(\d+\)$/, "")).slice(0, 5) : [],
    google_click_through: ctrBucket(pos, ctr),
    serp_top_results: s ?? "not fetched",
    similar_pages: (similar[p.path] ?? []).map((x) => ({ h1: byPath.get(x.path)?.h1 ?? x.path, main_query: byPath.get(x.path)?.main_query ?? "", overlap: overlap(x.jaccard) })),
  };
  const answers = await ask(state, {
    intent: choice("Which intent does a searcher of `main_query` (and `other_queries`) have?", INTENTS),
    format_fit: score("How well does the page's main format match what a searcher of `main_query` needs first? (A calculate intent needs the calculator near the top, with few paragraphs before it. A rate lookup needs a real table early. How-to needs ordered steps. A definition needs a short direct paragraph.)", [
      "Wrong format: the page's main format does not serve this intent",
      "The right format exists but is buried far down the page",
      "The right format is present but preceded by a lot of other content",
      "The right format is near the top with minor delay",
      "The right format comes first and serves the intent directly",
    ]),
    centerpiece: score("How well do `page.opening_sentences` name the page's main entity, answer `main_query` directly with a concrete figure or rule, and state its defining attributes (award or agreement, classification, state, financial year or effective date, pay period, source)?", [
      "Does not answer: introduces the page, the site or the reader instead",
      "Mentions the topic but gives no direct answer or figure",
      "Gives a direct answer but misses most defining attributes or buries the answer after other sentences",
      "Direct answer early with some defining attributes",
      "Direct answer in the first sentence, exact entity named, all relevant attributes stated",
    ]),
    serp_answered: noul("Is `main_query` something Google answers directly on the results page (a single number, date, count or short definition), so most searchers get the answer without clicking? Use `google_click_through` and `serp_top_results` as evidence.", { true: "the results page itself answers it", false: "searchers need to open a page (a tool, a full table, a detailed explanation)" }),
    deserves_page: choice("Does this page deserve its own URL, compared with `similar_pages`?", {
      "distinct intent": "it serves a query and answer that no page in similar_pages serves",
      "near-duplicate": "a page in similar_pages targets the same query and gives essentially the same answer",
      "thin variant": "it differs from a sibling only by a number, state, level or name and would serve readers better merged into a parent page",
    }),
    factual_vs_opinion: choice("What kind of content does `main_query` call for?", {
      "factual-structured": "rules, rates or figures best shown as tables, lists or a calculator",
      "factual-prose": "rules or facts best explained in short paragraphs",
      "needs labelled editorial judgment": "a choice between options where the reader also needs a clearly labelled recommendation with a stated reason (for example salary sacrifice or not)",
    }),
  });
  raw[p.path] = { answers, serp: !!s };
});
writeFileSync(join(DIR, "audit-raw.json"), JSON.stringify(raw, null, 1));

// ---------- AUDIT.tsv ----------
const n = (a?: Answer) => (typeof a?.score === "number" ? a.score + 1 : typeof a?.noul === "number" ? a.noul : NaN);
const head = ["url", "path", "h1", "main_query", "intent", "intent_p", "format_fit", "centerpiece", "serp_answered", "serp_answered_p", "deserves_page", "deserves_p", "factual_vs_opinion", "nearest_sibling", "nearest_jaccard", "pre28_clicks", "pre28_impr", "pre28_pos", "serp_fetched", "notes"];
const rows = [head.join("\t")];
for (const p of pages) {
  const r = raw[p.path]; if (!r) continue;
  const a = r.answers;
  const sib = similar[p.path]?.[0];
  rows.push([
    p.url, p.path, p.h1, p.main_query,
    a.intent?.choice, (a.intent?.probabilities?.[a.intent.choice!] ?? 0).toFixed(2),
    n(a.format_fit).toFixed(2), n(a.centerpiece).toFixed(2),
    n(a.serp_answered) >= 0.5 ? "yes" : "no", n(a.serp_answered).toFixed(2),
    a.deserves_page?.choice, (a.deserves_page?.probabilities?.[a.deserves_page.choice!] ?? 0).toFixed(2),
    a.factual_vs_opinion?.choice,
    sib?.path ?? "", sib?.jaccard ?? "",
    p.gsc_pre28.pre28_clicks, p.gsc_pre28.pre28_impr, p.gsc_pre28.pre28_pos,
    r.serp ? "yes" : "no", "",
  ].map((x) => String(x ?? "").replace(/\t/g, " ")).join("\t"));
}
writeFileSync(join(DIR, "AUDIT.tsv"), rows.join("\n") + "\n");
console.log(`audited ${Object.keys(raw).length} pages (${missingSerp} without SERP this run) -> AUDIT.tsv`);
report("audit");
