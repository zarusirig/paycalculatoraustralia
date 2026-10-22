#!/usr/bin/env python3
"""Pull every referring domain for pay-calculator-australia.com from DataForSEO.

Usage: python3 -I pull_refdomains.py <out_dir>
Writes page-<offset>.json (raw responses) and referring_domains.tsv into <out_dir>.
"""
import base64
import csv
import json
import pathlib
import sys
import urllib.error
import urllib.request

TARGET = "pay-calculator-australia.com"
URL = "https://api.dataforseo.com/v3/backlinks/referring_domains/live"
PAGE = 1000

cred = pathlib.Path("/Users/surajgiri/.dataforseo/credentials").read_text().strip()
AUTH = "Basic " + base64.b64encode(cred.encode()).decode()

out = pathlib.Path(sys.argv[1])
out.mkdir(parents=True, exist_ok=True)


def call(offset, order_by):
    body = [{
        "target": TARGET,
        "limit": PAGE,
        "offset": offset,
        "order_by": order_by,
        "backlinks_status_type": "all",
        "internal_list_limit": 5,
    }]
    req = urllib.request.Request(
        URL,
        data=json.dumps(body).encode(),
        headers={"Authorization": AUTH, "Content-Type": "application/json"},
    )
    r = json.load(urllib.request.urlopen(req, timeout=180))
    t = r["tasks"][0]
    if t["status_code"] != 20000:
        raise RuntimeError(f"offset {offset}: {t['status_code']} {t['status_message']}")
    return r, t


order_by = ["backlinks_spam_score,desc", "domain,asc"]
try:
    call(0, order_by)
except RuntimeError as e:
    print(f"secondary sort rejected ({e}); falling back to spam score only", file=sys.stderr)
    order_by = ["backlinks_spam_score,desc"]

items_all = []
total = None
cost = 0.0
offset = 0
while True:
    r, t = call(offset, order_by)
    res = t["result"][0]
    (out / f"page-{offset}.json").write_text(json.dumps(r))
    items = res.get("items") or []
    total = res["total_count"]
    cost += t.get("cost", 0)
    items_all += items
    print(f"offset {offset}: {len(items)} items, total_count {total}, cost {t.get('cost')}", file=sys.stderr)
    if len(items) < PAGE or offset + PAGE >= total:
        break
    offset += PAGE

by_domain = {}
for it in items_all:
    by_domain.setdefault(it["domain"], it)

with open(out / "referring_domains.tsv", "w", newline="") as f:
    w = csv.writer(f, delimiter="\t")
    w.writerow(["domain", "spam", "rank", "backlinks", "ref_pages", "first_seen", "lost_date", "nofollow_pages"])
    for d in sorted(by_domain):
        it = by_domain[d]
        w.writerow([
            d,
            it.get("backlinks_spam_score"),
            it.get("rank"),
            it.get("backlinks"),
            it.get("referring_pages"),
            (it.get("first_seen") or "")[:10],
            (it.get("lost_date") or "")[:10],
            it.get("referring_pages_nofollow") or 0,
        ])

print(
    f"pulled {len(items_all)} rows, {len(by_domain)} unique domains, API total_count {total}, cost ${cost:.4f}",
    file=sys.stderr,
)
if len(by_domain) != total:
    print("WARNING: unique domains != total_count; paging may have shuffled", file=sys.stderr)
