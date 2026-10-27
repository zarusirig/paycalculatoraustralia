/**
 * Step 7 triage: one TypeSafe (Jev) request per unique fact question.
 *
 *   node scripts/authorship/fact-triage.mts [--limit=N]
 *
 * Reads docs/authorship-2026-10-27/fact-questions.json (writer + reviewer
 * questions and reviewer notes), merges questions on the same file line,
 * writes docs/fact-fix-2026-10-27/triage.json and triage.tsv. Jev judges only.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { ask, choice, noul, pool, report, score, type AnswerMap } from "../seo-brain/jev.mts";

const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, "").split("="); return [k, v ?? true]; }));
const LIMIT = typeof args.limit === "string" ? Number(args.limit) : Infinity;
const A = resolve("../docs/authorship-2026-10-27");
const OUT = resolve("../docs/fact-fix-2026-10-27");

type FQ = { job: string; src: string; page?: string; file?: string; line?: number | string; claim?: string; why?: string; constant?: string; unit?: string };
const all: FQ[] = JSON.parse(readFileSync(`${A}/fact-questions.json`, "utf8"));
const notes = all.filter((q) => q.src === "reviewer-note");
const qs = all.filter((q) => q.src !== "reviewer-note");

// Merge questions on the same file + line.
const groups = new Map<string, { file: string; line: string; page: string; claims: string[]; whys: string[]; constants: string[]; jobs: Set<string>; reviewerNotes: string[] }>();
for (const q of qs) {
  const file = (q.file ?? "").replace(/^calc-boiler\//, "");
  const key = `${file}:${q.line ?? ""}`;
  const g = groups.get(key) ?? { file, line: String(q.line ?? ""), page: q.page ?? "", claims: [], whys: [], constants: [], jobs: new Set(), reviewerNotes: [] };
  if (q.claim && !g.claims.includes(q.claim)) g.claims.push(q.claim);
  if (q.why && !g.whys.includes(q.why)) g.whys.push(q.why);
  if (q.constant && !g.constants.includes(q.constant)) g.constants.push(q.constant);
  g.jobs.add(q.job);
  groups.set(key, g);
}
// Attach reviewer notes from the same job whose line matches.
for (const n of notes) for (const g of groups.values()) if (g.jobs.has(n.job) && String(n.line) === g.line && n.why) g.reviewerNotes.push(n.why);

const items = [...groups.entries()].map(([key, g]) => ({ key, ...g, jobs: [...g.jobs] })).slice(0, LIMIT);
const out: Record<string, { item: (typeof items)[number]; answers: AnswerMap }> = {};
await pool(items, 6, async (it) => {
  const state = {
    site: "pay-calculator-australia.com, Australian pay and tax calculators (YMYL). Today is 27 October 2026. Financial year 2026-27 started 1 July 2026.",
    file: it.file, line: it.line, page: it.page,
    claim_on_page: it.claims.slice(0, 3), why_flagged: it.whys.slice(0, 3).map((w) => w.slice(0, 700)),
    suggested_source_of_truth: it.constants.slice(0, 2),
    independent_reviewer_notes: it.reviewerNotes.length ? it.reviewerNotes.slice(0, 2).map((w) => w.slice(0, 700)) : "none",
  };
  const answers = await ask(state, {
    kind: choice("What kind of problem is flagged?", {
      "stale-or-changing": "a rate, threshold, date, status or rule that has changed or will change soon, so the page may be out of date",
      "wrong-fact": "the claim contradicts the law, an official source, or the site's own figures as described",
      "internal-mismatch": "the prose disagrees with another part of the same site or with the site's own data or calculator",
      "unsourced-population-claim": "a claim like 'many', 'most' or 'usually' about people or employers with no source",
      "citation-or-source": "a source name, decision number, URL or citation that may be wrong or outdated",
      "wording-only": "not a factual problem: style, clarity or scope wording only",
    }),
    reviewer_rejected: noul("Do `independent_reviewer_notes` say the flagged claim is actually correct, so no fix is needed?", { true: "the reviewer showed the claim is correct", false: "no reviewer note, or the reviewer agrees or adds doubt" }),
    severity: score("If the claim is wrong, how much harm to a reader who uses the page to check their pay, tax or entitlement?", [
      "none: no effect on any figure or decision",
      "low: background detail only",
      "medium: could mislead a minority of readers",
      "high: a figure, date or rule a reader would act on",
      "critical: a core rate, threshold or entitlement that would give the wrong pay or tax",
    ]),
    needs_owner: noul("Does fixing this need a business decision by the site owner (remove a claim, change scope, choose an approach), rather than a fact a primary source can settle?", { true: "an owner decision", false: "a primary source or the site's own data can settle it" }),
  });
  out[it.key] = { item: it, answers };
});
writeFileSync(`${OUT}/triage.json`, JSON.stringify(out, null, 1));
const n = (a?: { noul?: number; score?: number }) => (typeof a?.score === "number" ? a.score + 1 : a?.noul ?? NaN);
const head = ["key", "file", "line", "page", "kind", "kind_p", "severity", "reviewer_rejected", "needs_owner", "claim", "why"];
const rows = [head.join("\t")];
for (const { item, answers: a } of Object.values(out).sort((x, y) => n(y.answers.severity) - n(x.answers.severity))) {
  rows.push([item.key, item.file, item.line, item.page, a.kind?.choice, (a.kind?.probabilities?.[a.kind.choice!] ?? 0).toFixed(2), n(a.severity).toFixed(2), n(a.reviewer_rejected).toFixed(2), n(a.needs_owner).toFixed(2), item.claims[0] ?? "", (item.whys[0] ?? "").slice(0, 400)].map((x) => String(x ?? "").replace(/[\t\n]/g, " ")).join("\t"));
}
writeFileSync(`${OUT}/triage.tsv`, rows.join("\n") + "\n");
console.log(`triaged ${Object.keys(out).length} unique questions (${qs.length} raw, ${notes.length} reviewer notes)`);
report("fact-triage");
