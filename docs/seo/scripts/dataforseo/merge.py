#!/usr/bin/env python3
"""Merge the 19 Oct disavow file with new DataForSEO domains and verify the result.

Usage: python3 -I merge.py <tsv> <old_disavow> <out_disavow>
"""
import collections
import csv
import sys

tsv, old_path, out_path = sys.argv[1:4]
HEADER = "# pay-calculator-australia.com disavow, updated 2026-10-22"
REAL = {"katteb.com", "airswift.com", "aussiestockforums.com", "wealthcollective.co"}

old = set()
with open(old_path) as f:
    for line in f:
        line = line.strip()
        if line.startswith("domain:"):
            old.add(line[len("domain:"):].strip().lower())

rows = {}
with open(tsv) as f:
    for r in csv.DictReader(f, delimiter="\t"):
        rows[r["domain"].strip().lower()] = r

new = set(rows) - old - REAL
add = {d for d in new if int(rows[d]["spam"] or 0) >= 30}
skipped = new - add
merged = sorted((old | add) - REAL)

with open(out_path, "w", newline="\n") as f:
    f.write(HEADER + "\n")
    for d in merged:
        f.write(f"domain:{d}\n")

# verify what was written
text = open(out_path, encoding="ascii").read()
assert text.endswith("\n"), "no trailing newline"
lines = text.split("\n")[:-1]
assert lines[0] == HEADER, lines[0]
body = lines[1:]
assert all(l.startswith("domain:") for l in body), "non-domain line"
assert all(l == l.strip() and " " not in l for l in body), "whitespace in a line"
assert len(body) == len(set(body)), "duplicates"
assert body == sorted(body), "not sorted"
doms = {l[len("domain:"):] for l in body}
assert not (doms & REAL), "real domain present"
assert old <= doms, "an old domain was dropped"
assert len(body) == len(old) + len(add), (len(body), len(old), len(add))
assert len(body) == 2203, len(body)

days = collections.Counter(rows[d]["first_seen"] for d in add)
print("new domains by first_seen:", dict(sorted(days.items())))
assert sum(v for k, v in days.items() if "2026-10-19" <= k <= "2026-10-22") == 364, days
assert days["2026-10-02"] == 1, days
assert not skipped, skipped
print(f"OK: {len(old)} old + {len(add)} new = {len(body)} domain lines, {len(skipped)} skipped")
