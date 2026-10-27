#!/usr/bin/env python3
"""Compares a new static export with the base export, page by page.

  python3 -I scripts/authorship/compare-html.py <base_out> <new_out> <urls.txt>

FAILS when a sitemap page is missing, or when any of these differ from base:
internal link count, set of internal link targets, tables, inputs, ordered lists,
FAQ items, h1/h2/h3 text, JSON-LD block count. FAILS when the visible text gains
"undefined", "NaN", a stray "{" or "}", an em/en dash, or a banned phrase.
Also reports title and meta description changes (both are locked).
"""
import json, os, re, sys
from bs4 import BeautifulSoup
base, new, urls = sys.argv[1:4]
BASE = "https://pay-calculator-australia.com"
BANNED = ["delve", "crucial", "pivotal", "seamless", "robust", "landscape", "in today's", "whether you're", "additionally", "furthermore", "moreover", "in order to", "it is important to note", "rest assured", "unlock", "empower", "game-changer", "peace of mind", "tapestry", "testament", "vibrant", "showcase", "underscore", "foster", "garner", "leverage"]
def state(path):
    if not os.path.exists(path): return None
    soup = BeautifulSoup(open(path, encoding="utf-8").read(), "lxml")
    title = soup.title.get_text() if soup.title else ""
    md = soup.find("meta", attrs={"name": "description"})
    ld = len(soup.find_all("script", type="application/ld+json"))
    for t in soup.find_all(["script", "style", "noscript", "template"]): t.decompose()
    main = soup.find("main") or soup.body
    links = [a["href"].replace(BASE, "") for a in soup.find_all("a", href=True) if a["href"].startswith("/") or a["href"].startswith(BASE)]
    text = main.get_text(" ")
    return {
        "title": title, "desc": md["content"] if md else "", "ld": ld,
        "links": sorted(links), "tables": len(main.find_all("table")), "inputs": len(main.find_all(["input", "select"])),
        "ol": len(main.find_all("ol")), "faq": len(main.select('[data-slot="accordion-trigger"]')) + len(main.find_all("summary")),
        "heads": [h.get_text(" ", strip=True) for h in main.find_all(["h1", "h2", "h3"])],
        "bad": {"undefined": len(re.findall(r"\bundefined\b", text)), "NaN": len(re.findall(r"\bNaN\b", text)), "{": text.count("{"), "}": text.count("}"), "dash": len(re.findall("[—–]", text))},
        "banned": {w: len(re.findall(r"(?<![A-Za-z])" + re.escape(w), text, re.I)) for w in BANNED},
        "words": len(text.split()),
    }
fails, notes, n = [], [], 0
for u in [l.strip() for l in open(urls) if l.strip()]:
    p = u.replace(BASE, "").strip("/")
    rel = os.path.join(p, "index.html") if p else "index.html"
    a, b = state(os.path.join(base, rel)), state(os.path.join(new, rel))
    n += 1
    if b is None: fails.append(f"{u}: missing in new build"); continue
    if a is None: notes.append(f"{u}: not in base build"); continue
    for k in ("links", "tables", "inputs", "ol", "faq", "heads", "ld"):
        if a[k] != b[k]:
            d = f"{len(a[k])} -> {len(b[k])}" if isinstance(a[k], list) else f"{a[k]} -> {b[k]}"
            fails.append(f"{u}: {k} changed ({d})")
    for k in ("title", "desc"):
        if a[k] != b[k]: fails.append(f"{u}: {k} changed (locked)")
    for k, v in b["bad"].items():
        if v > a["bad"][k]: fails.append(f"{u}: visible text gained {k} ({a['bad'][k]} -> {v})")
    for k, v in b["banned"].items():
        if v > a["banned"][k]: fails.append(f"{u}: banned phrase gained '{k}'")
    if b["words"] < 0.8 * a["words"]: notes.append(f"{u}: words {a['words']} -> {b['words']}")
print(f"compared {n} pages: {len(fails)} failures, {len(notes)} notes")
for f in fails[:80]: print("FAIL", f)
for x in notes[:30]: print("note", x)
sys.exit(1 if fails else 0)
