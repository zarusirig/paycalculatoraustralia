/**
 * seo-brain rank — Jev picks among LLM-written candidates and gates them.
 *
 *   node scripts/seo-brain/rank.mts [--dir=…] [--in=candidates] [--out=decisions-ranked.json]
 *
 * Reads every JSON file in <dir>/candidates/. Each file is one work order's
 * candidates (see README). Jev never writes text: it selects and judges.
 * Code enforces lengths, keepTokens and thresholds. Output is a DecisionBatch
 * that validate.mts then gates.
 *
 * Candidate file shapes:
 *   { orderId, kind: "title_description", route, candidates: [{ title, description, figureSource }] }
 *   { orderId, kind: "citation_lead",     route, candidates: [{ lead, source? }] }
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ask, choice, noul, pool, report, score } from "./jev.mts";
import { Decision, DecisionBatch, DESCRIPTION_MAX, SiteSignals, TITLE_MAX, type Decision as D } from "./schema.mts";
import type { WorkOrder } from "./decide.mts";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "../../..");
const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, "").split("="); return [k, v ?? true]; }));
const base = join(repo, "docs/seo/seo-brain");
const dir = resolve(repo, typeof args.dir === "string" ? args.dir : join(base, readdirSync(base).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort().pop()!));
const inDir = join(dir, typeof args.in === "string" ? args.in : "candidates");
const outFile = join(dir, typeof args.out === "string" ? args.out : "decisions-ranked.json");

const site = SiteSignals.parse(JSON.parse(readFileSync(join(dir, "signals.json"), "utf8")));
const byRoute = new Map(site.pages.map((p) => [p.route, p]));
const orders: WorkOrder[] = JSON.parse(readFileSync(join(dir, "workorders.json"), "utf8"));
const orderById = new Map(orders.map((o) => [o.id, o]));
const files = existsSync(inDir) ? readdirSync(inDir).filter((f) => f.endsWith(".json")) : [];
const decisions: D[] = [];
const rejected: { orderId: string; why: string }[] = [];
let seq = 0;
const slug = (r: string) => r.replace(/^\/|\/$/g, "").replace(/\//g, "-") || "home";
const n = (x: any) => (typeof x?.noul === "number" ? x.noul : typeof x?.score === "number" ? x.score : NaN);

await pool(files, 6, async (f) => {
  const c = JSON.parse(readFileSync(join(inDir, f), "utf8"));
  const order = orderById.get(c.orderId);
  if (!order) { rejected.push({ orderId: c.orderId, why: "unknown work order" }); return; }
  const p = byRoute.get(c.route)!;
  if (!p) { rejected.push({ orderId: c.orderId, why: `route ${c.route} not in export` }); return; }

  if (c.kind === "title_description" && order.kind === "title_description") {
    // Code gates first: length, keepTokens, no hype, differs from current.
    const cands = (c.candidates as { title: string; description: string; figureSource?: string }[]).map((x, i) => ({ ...x, i, ok: [] as string[] }));
    for (const x of cands) {
      if (x.title.length > TITLE_MAX) x.ok.push(`title ${x.title.length} chars`);
      if (x.description.length > DESCRIPTION_MAX) x.ok.push(`description ${x.description.length} chars`);
      for (const t of order.keepTokens) if (!x.title.toLowerCase().includes(t.toLowerCase())) x.ok.push(`missing keepToken "${t}"`);
      if (/\b(best|ultimate|#1|top)\b/i.test(x.title)) x.ok.push("hype");
      if (!/\d/.test(x.description)) x.ok.push("description has no figure");
    }
    const live = cands.filter((x) => !x.ok.length);
    if (!live.length) { rejected.push({ orderId: c.orderId, why: `all candidates failed code gates: ${cands.map((x) => x.ok.join(",")).join(" | ")}` }); return; }
    const queries = order.queries.slice(0, 3).map((q) => q.query);
    const state = { current_title: order.currentTitle, queries, candidates: live.map((x) => ({ title: x.title, description: x.description })) };
    const qs: Record<string, any> = {
      best_title: choice("Which candidate's `title` would a searcher of `queries[0]` be most likely to click, given it must honestly describe the page and read as current?", Object.fromEntries(live.map((x, k) => [`c${k}`, x.title]))),
      best_description: choice("Which candidate's `description` gives the most concrete, useful answer for a searcher of `queries[0]`?", Object.fromEntries(live.map((x, k) => [`c${k}`, x.description]))),
    };
    live.forEach((x, k) => {
      queries.forEach((_, qi) => { qs[`c${k}_q${qi}`] = noul(`Would a searcher who typed \`queries[${qi}]\` recognise \`candidates[${k}].title\` as directly answering that search?`); });
      qs[`c${k}_natural`] = noul(`Does \`candidates[${k}].title\` read as natural English a careful editor would publish, not keyword-stuffed?`);
      qs[`c${k}_promise`] = noul(`Does \`candidates[${k}].title\` promise only what a calculator or reference page can deliver (no guarantees, no advice claims)?`);
    });
    const a = await ask(state, qs);
    const pickT = Number(String(a.best_title.choice).slice(1)); const pickD = Number(String(a.best_description.choice).slice(1));
    const t = live[pickT]; const dsc = live[pickD];
    const recog = queries.map((_, qi) => n(a[`c${pickT}_q${qi}`]));
    const gate = { natural: n(a[`c${pickT}_natural`]), promise: n(a[`c${pickT}_promise`]), recognisedTop: recog[0] };
    if (order.needTitle) {
      if (gate.natural < 0.6 || gate.promise < 0.6 || gate.recognisedTop < 0.6 || t.title === order.currentTitle) rejected.push({ orderId: c.orderId, why: `winning title failed gates ${JSON.stringify(gate)}` });
      else decisions.push({ kind: "rewrite_title", id: `ctr-${slug(c.route)}-${++seq}`, level: "ctr", priority: Math.min(100, order.priority / 5), confidence: Math.min(a.best_title.confidence ?? 0.5, gate.recognisedTop), rationale: `Jev chose this among ${live.length} candidates for "${queries[0]}" (recognised p=${recog.map((r) => r.toFixed(2)).join("/")} for ${queries.join(" / ")}; natural ${gate.natural.toFixed(2)}, honest promise ${gate.promise.toFixed(2)}). Findings that triggered the rewrite: ${order.findings.join("; ").slice(0, 400)}`, evidence: { gsc: p.gsc, keywords: p.ranked.slice(0, 5), note: `candidates: ${live.map((x) => x.title).join(" | ")}` }, targetQueries: queries, route: c.route, current: order.currentTitle, proposed: t.title, keepTokens: order.keepTokens });
    }
    if (order.needDescription && dsc.description !== order.currentDescription) {
      decisions.push({ kind: "rewrite_description", id: `ctr-${slug(c.route)}-${++seq}`, level: "ctr", priority: Math.min(100, order.priority / 6), confidence: a.best_description.confidence ?? 0.5, rationale: `Jev chose this description among ${live.length} candidates as the most concrete answer for "${queries[0]}" (confidence ${(a.best_description.confidence ?? 0).toFixed(2)}). Figures must be rendered from constants at build time, never typed.`, evidence: { gsc: p.gsc, keywords: p.ranked.slice(0, 3) }, targetQueries: queries, route: c.route, current: order.currentDescription, proposed: dsc.description, figureSource: dsc.figureSource ?? "lib/constants (see page)" });
    }
  }

  if (c.kind === "citation_lead" && order.kind === "citation_lead") {
    const cands = (c.candidates as { lead: string; source?: string }[]).filter((x) => x.lead.length >= 60 && x.lead.length <= 420);
    if (!cands.length) { rejected.push({ orderId: c.orderId, why: "no candidate within 60–420 chars" }); return; }
    const state = { h1: order.h1, top_query: order.topQuery, current_opening: order.currentLead, candidates: cands.map((x) => x.lead) };
    const qs: Record<string, any> = { best: choice("Which of `candidates` is the best self-contained opening an AI assistant could quote as the answer for `top_query`?", Object.fromEntries(cands.map((x, k) => [`c${k}`, x.lead]))) };
    cands.forEach((_, k) => {
      qs[`c${k}_citable`] = score(`How well does \`candidates[${k}]\` work as a self-contained answer for \`top_query\`?`, ["No direct answer", "Answers in general terms, no figure or date", "Concrete figure or rule but no financial year or date", "Direct answer with a concrete figure and the financial year or date"]);
      qs[`c${k}_defines`] = noul(`Does \`candidates[${k}]\` state what the subject of \`h1\` is or how it is worked out in its first sentence?`);
      qs[`c${k}_claims`] = noul(`Does \`candidates[${k}]\` promise an outcome, give personal advice, or use superlatives?`, { true: "it advises, guarantees or hypes", false: "it only states facts, rules and figures" });
    });
    const a = await ask(state, qs);
    const k = Number(String(a.best.choice).slice(1));
    const g = { citable: n(a[`c${k}_citable`]), defines: n(a[`c${k}_defines`]), claims: n(a[`c${k}_claims`]) };
    if (g.citable < 2.4 || g.defines < 0.6 || g.claims > 0.4) { rejected.push({ orderId: c.orderId, why: `winning lead failed gates ${JSON.stringify(g)}` }); return; }
    decisions.push({ kind: "citation_lead", id: `schema-${slug(c.route)}-${++seq}`, level: "schema", priority: Math.min(100, Math.max(1, order.priority)), confidence: Math.min(a.best.confidence ?? 0.5, g.defines), rationale: `Current opening scored ${order.citable.toFixed(2)}/3 as a quotable answer for "${order.topQuery}"; Jev picked this candidate (citable ${g.citable.toFixed(2)}/3, defines-subject ${g.defines.toFixed(2)}, no advice/hype p=${g.claims.toFixed(2)}). Figures in [[CONSTANT]] placeholders must be rendered from lib/constants.`, evidence: { gsc: p.gsc, keywords: p.ranked.slice(0, 3), note: `was: ${order.currentLead.slice(0, 200)}` }, targetQueries: [order.topQuery], route: c.route, proposedLead: cands[k].lead, addPrimarySource: cands[k].source && /^https?:/.test(cands[k].source!) ? cands[k].source : undefined });
  }
});

const batch = DecisionBatch.parse({ level: "ctr", author: "seo-brain rank.mts (agent candidates → Jev selection → code gates)", createdAt: new Date().toISOString(), signalsGeneratedAt: site.generatedAt, decisions: decisions.length ? decisions.map((d) => Decision.parse(d)) : [{ kind: "no_action", id: "ctr-site-0", level: "ctr", route: null, priority: 0, confidence: 1, rationale: "No candidate survived the ranking gates in this run; nothing to apply. Inspect rejected.json for the reasons.", evidence: { keywords: [] }, targetQueries: ["none"] }] });
writeFileSync(outFile, JSON.stringify(batch, null, 1));
writeFileSync(join(dir, "rejected.json"), JSON.stringify(rejected, null, 1));
report("rank");
console.log(`[rank] ${decisions.length} decisions from ${files.length} candidate files (${rejected.length} rejected) → ${outFile}`);
