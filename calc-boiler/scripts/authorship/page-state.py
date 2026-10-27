#!/usr/bin/env python3
"""Extracts each page's on-page state from a static export.

  python3 -I scripts/authorship/page-state.py <out_dir> <urls.txt> <docs_dir> <out.jsonl>

Per URL: H1, the first 7 sentences of body prose, H2 list, component counts
(calculator inputs, tables, ordered lists, FAQ items), where the first input and
first table sit in the reading order, internal link count, main query
(23 Oct meta pass primary_query, else top pre-crash GSC query, else H1) and the
top 5 pre-crash GSC queries with clicks/impressions/position.
"""
import csv, glob, json, os, re, sys
from bs4 import BeautifulSoup

out_dir, urls_file, docs, dest = sys.argv[1:5]
BASE = "https://pay-calculator-australia.com"
csv.field_size_limit(10**9)

primary = {}
for f in glob.glob(os.path.join(docs, "..", "seo", "data", "2026-10-23-meta", "g*.tsv")):
    for r in csv.DictReader(open(f), delimiter="\t"):
        if r.get("primary_query"):
            primary[r["path"]] = r["primary_query"].strip('"')

gsc = {}
for r in csv.DictReader(open(os.path.join(docs, "BASELINE-gsc.tsv")), delimiter="\t"):
    gsc[r["url"]] = r

def sentences(text, n):
    parts = re.split(r"(?<=[.!?])\s+(?=[A-Z$0-9\"'(])", text)
    return [p.strip() for p in parts if len(p.strip()) > 2][:n]

BYLINE = re.compile(r"^(by |written by|reviewed by|fact[- ]checked|last (updated|reviewed|verified)|updated |published |rates verified|share|home\b)", re.I)

with open(dest, "w") as out:
    for url in [u.strip() for u in open(urls_file) if u.strip()]:
        path = url.replace(BASE, "") or "/"
        f = os.path.join(out_dir, path.strip("/"), "index.html") if path != "/" else os.path.join(out_dir, "index.html")
        if not os.path.exists(f):
            out.write(json.dumps({"url": url, "path": path, "error": "missing html"}) + "\n"); continue
        soup = BeautifulSoup(open(f, encoding="utf-8").read(), "lxml")
        main = soup.find("main") or soup.body
        for t in main.find_all(["script", "style", "noscript", "template"]):
            t.decompose()
        h1 = main.find("h1")
        h1t = h1.get_text(" ", strip=True) if h1 else ""
        h2s = [h.get_text(" ", strip=True) for h in main.find_all("h2")]
        # reading order of blocks
        order, paras = [], []
        first_input = first_table = None
        for el in main.find_all(["p", "input", "select", "table", "h2", "ol", "li", "dd"]):
            if el.name in ("input", "select") and first_input is None:
                if el.get("type") not in ("hidden", "radio", "checkbox", "search"):
                    first_input = len(paras)
            elif el.name == "table" and first_table is None:
                first_table = len(paras)
            elif el.name == "p":
                if el.find_parent(["nav", "footer", "aside", "table", "details", "figure", "label", "button"]):
                    continue
                t = el.get_text(" ", strip=True)
                if len(t) < 30 or BYLINE.search(t):
                    continue
                paras.append(t)
        opening = sentences(" ".join(paras[:6]), 7)
        faq = len(main.select('[data-slot="accordion-trigger"]')) + len([s for s in main.find_all("summary") if s.get_text(strip=True).endswith("?")])
        g = gsc.get(url, {})
        tops = g.get("top5_queries_pre28", "")
        mq = primary.get(path) or (tops.split(" (")[0] if tops else "") or h1t
        rec = {
            "url": url, "path": path, "h1": h1t, "opening": opening, "h2": h2s[:20],
            "components": {
                "inputs": len([i for i in main.find_all(["input", "select"]) if i.get("type") not in ("hidden",)]),
                "tables": len(main.find_all("table")), "ordered_lists": len(main.find_all("ol")),
                "faq_items": faq, "paragraphs_before_first_input": first_input, "paragraphs_before_first_table": first_table,
                "internal_links": len([a for a in soup.find_all("a", href=True) if a["href"].startswith("/") or a["href"].startswith(BASE)]),
                "main_links": len([a for a in main.find_all("a", href=True) if a["href"].startswith("/") or a["href"].startswith(BASE)]),
            },
            "main_query": mq,
            "gsc_pre28": {k: g.get(k) for k in ("pre28_clicks", "pre28_impr", "pre28_ctr", "pre28_pos")},
            "top_queries": tops,
        }
        out.write(json.dumps(rec) + "\n")
print("done")
