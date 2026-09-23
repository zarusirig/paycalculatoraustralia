"""Cannibalisation: normalise ranked keywords to a stem key, find keys where 2+ URLs rank."""
import csv, collections, re, sys, json
D = '/Users/surajgiri/Desktop/paycalculatoraustralia/.claude/worktrees/agent-a16ff129cca6463a3/docs/seo/data/2026-09-23-dataforseo/'
H = 'https://pay-calculator-australia.com'
STOP = {"australia", "australian", "au", "aus", "the", "for", "in", "of", "a", "an", "to", "my", "on", "and", "calculator", "calc", "calculate", "calculation",
        "2024", "2025", "2026", "2027", "2025-26", "2026-27", "2024-25", "nsw", "how", "much", "is", "what", "ato", "online", "free", "per", "vs", "with", "by", "rates", "rate"}
SYN = {"payg": "withholding", "withheld": "withholding", "wage": "wage", "wages": "wage", "salary": "salary", "salaries": "salary", "tables": "table",
       "brackets": "bracket", "levels": "level", "payments": "payment", "leaves": "leave", "returns": "return", "refunds": "refund", "estimator": "",
       "mls": "medicare levy surcharge", "lito": "low income tax offset", "tfn": "tax file number", "hecs": "hecs", "help": "hecs", "juniors": "junior",
       "minimum": "minimum", "min": "minimum"}


def key(kw):
    toks = []
    for t in re.findall(r"[a-z0-9$.,'-]+", kw.lower()):
        t = SYN.get(t, t)
        for u in t.split():
            if u and u not in STOP:
                toks.append(u)
    return " ".join(sorted(set(toks)))


rows = list(csv.DictReader(open(D + 'our-ranked-keywords.csv')))
groups = collections.defaultdict(list)
for r in rows:
    k = key(r['kw'])
    if k:
        groups[k].append(r)

out = []
for k, v in groups.items():
    urls = collections.defaultdict(list)
    for r in v:
        urls[r['url'].replace(H, '')].append(r)
    if len(urls) < 2:
        continue
    vol = sum(int(r['vol'] or 0) for r in v)
    detail = []
    for u, rs in urls.items():
        best = min(int(r['pos']) for r in rs)
        detail.append((u, best, len(rs), sum(int(r['vol'] or 0) for r in rs), rs[0]['kw']))
    detail.sort(key=lambda d: d[1])
    out.append((vol, k, detail))
out.sort(key=lambda x: -x[0])
n = int(sys.argv[1]) if len(sys.argv) > 1 else 80
for vol, k, detail in out[:n]:
    print(f"{vol:7} [{k}]")
    for d in detail:
        print(f"         pos {d[1]:3}  kws {d[2]:3} vol {d[3]:6}  {d[0]}   e.g. '{d[4]}'")
json.dump(out, open('/private/tmp/claude-501/-Users-surajgiri-Desktop-paycalculatoraustralia/2db63a49-56d2-4026-9acd-36333f25ab84/scratchpad/cannibal.json', 'w'))
print(len(out), "groups")
