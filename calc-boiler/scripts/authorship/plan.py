#!/usr/bin/env python3
"""Builds PLAN.md from AUDIT.tsv.  python3 -I scripts/authorship/plan.py <docs_dir>"""
import csv, sys, os, collections
d = sys.argv[1]
rows = list(csv.DictReader(open(os.path.join(d, "AUDIT.tsv")), delimiter="\t"))
f = lambda r, k: float(r[k] or 0)
clicks = lambda r: int(r["pre28_clicks"] or 0)
low_fmt = sorted([r for r in rows if f(r, "format_fit") <= 2.5], key=lambda r: -clicks(r))
low_cp = sorted([r for r in rows if f(r, "centerpiece") <= 3.0], key=lambda r: -clicks(r))
merge = sorted([r for r in rows if r["deserves_page"] != "distinct intent"], key=lambda r: (r["deserves_page"], -f(r, "nearest_jaccard")))
answered = sorted([r for r in rows if r["serp_answered"] == "yes"], key=lambda r: -int(r["pre28_impr"] or 0))
opinion = [r for r in rows if r["factual_vs_opinion"] == "needs labelled editorial judgment"]
intents = collections.Counter(r["intent"] for r in rows)
out = []
w = out.append
w("# Authorship + humanizer plan, 27 Oct 2026\n")
w(f"Source: `AUDIT.tsv` ({len(rows)} Tier 1 + Tier 2 pages, one TypeSafe Jev request each). Scores: format_fit and centerpiece 1-5 (expected value over the rubric). Context: the site lost 97% of Google impressions on 19 Oct 2026; the owner's diagnosis is a scaled-AI-content demotion.\n")
w("Intent mix: " + ", ".join(f"{k} {v}" for k, v in intents.most_common()) + "\n")
w(f"## 1. STEP 6 structure list: format_fit <= 2.5 ({len(low_fmt)} pages)\n")
w("| page | intent | format_fit | pre-crash clicks | main query |\n|---|---|---|---|---|")
for r in low_fmt: w(f"| {r['path']} | {r['intent']} | {r['format_fit']} | {clicks(r)} | {r['main_query']} |")
w(f"\n## 2. Pass A opening rewrites: centerpiece <= 3.0 ({len(low_cp)} pages)\n")
w("The writer brief tells each writer to rewrite the opening of these pages. Pages built from shared templates get the fix once in the template.\n")
w("| page | centerpiece | intent | pre-crash clicks |\n|---|---|---|---|")
for r in low_cp: w(f"| {r['path']} | {r['centerpiece']} | {r['intent']} | {clicks(r)} |")
w(f"\n## 3. Merge proposals for the owner (NOT applied: no URL is deleted, redirected or noindexed without your OK) ({len(merge)} pages)\n")
w("| page | Jev verdict | p | nearest sibling | shared 5-gram text | pre-crash clicks / impr |\n|---|---|---|---|---|---|")
for r in merge: w(f"| {r['path']} | {r['deserves_page']} | {r['deserves_p']} | {r['nearest_sibling']} | {r['nearest_jaccard']} | {clicks(r)} / {r['pre28_impr']} |")
w(f"\n## 4. SERP already answers the query ({len(answered)} pages): no title work, improve the on-page answer + next-step links\n")
w("| page | p | main query | pre-crash impr | pos |\n|---|---|---|---|---|")
for r in answered: w(f"| {r['path']} | {r['serp_answered_p']} | {r['main_query']} | {r['pre28_impr']} | {r['pre28_pos']} |")
w(f"\n## 5. Pages that need labelled editorial judgment ({len(opinion)})\n")
for r in opinion: w(f"- {r['path']} ({r['main_query']})")
open(os.path.join(d, "PLAN.md"), "w").write("\n".join(out) + "\n")
print(f"PLAN.md: {len(low_fmt)} structure, {len(low_cp)} centerpiece, {len(merge)} merge, {len(answered)} answered, {len(opinion)} opinion")
