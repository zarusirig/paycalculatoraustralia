#!/usr/bin/env python3
"""Nearest sibling pages by shared body text (word 5-gram Jaccard, digits masked).

  python3 -I scripts/authorship/similar.py <out_dir> <page-state.jsonl> <out.json>
"""
import json, os, re, sys
from bs4 import BeautifulSoup
out_dir, state_file, dest = sys.argv[1:4]
pages = [json.loads(l) for l in open(state_file)]
sh = {}
for p in pages:
    f = os.path.join(out_dir, p["path"].strip("/"), "index.html") if p["path"] != "/" else os.path.join(out_dir, "index.html")
    if not os.path.exists(f): continue
    soup = BeautifulSoup(open(f, encoding="utf-8").read(), "lxml")
    m = soup.find("main") or soup.body
    for t in m.find_all(["script", "style", "nav", "aside", "footer"]): t.decompose()
    words = re.sub(r"\d[\d,.]*", "#", m.get_text(" ")).lower().split()
    sh[p["path"]] = {" ".join(words[i:i + 5]) for i in range(max(0, len(words) - 4))}
paths = list(sh)
res = {}
for a in paths:
    A = sh[a]; best = []
    for b in paths:
        if a == b: continue
        B = sh[b]
        if not A or not B: continue
        inter = len(A & B)
        if not inter: continue
        j = inter / len(A | B)
        best.append((j, b))
    best.sort(reverse=True)
    res[a] = [{"path": b, "jaccard": round(j, 3)} for j, b in best[:3]]
json.dump(res, open(dest, "w"))
print("done", len(res))
