#!/usr/bin/env python3
"""Fetches live AU search results for each page's main query via the Firecrawl
REST API (key from ~/.config/firecrawl/env), cached per query, ~7 requests/min.

  python3 -I scripts/authorship/serp.py <page-state.jsonl> <cache_dir> [--tiers=1,2]
"""
import hashlib, json, os, re, sys, time, urllib.request
state_file, cache = sys.argv[1], sys.argv[2]
os.makedirs(cache, exist_ok=True)
key = re.search(r"FIRECRAWL_API_KEY=(\S+)", open(os.path.expanduser("~/.config/firecrawl/env")).read()).group(1).strip("'\"")
T3 = re.compile(r"^/(tax-on|take-home-pay-on|salary-to-hourly|hourly-to-salary)/[^/]+/")
queries = []
for l in open(state_file):
    r = json.loads(l)
    if T3.match(r["path"]) or not r.get("main_query"): continue
    if r["main_query"] not in queries: queries.append(r["main_query"])
print(len(queries), "queries", flush=True)
import threading
lock = threading.Lock()
done = 0
todo = [q for q in queries if not os.path.exists(os.path.join(cache, hashlib.sha1(q.encode()).hexdigest()[:16] + ".json"))]
print(len(todo), "to fetch", flush=True)
def worker(chunk):
    global done
    for q in chunk:
        fetch(q)
        with lock:
            done += 1
            if done % 10 == 0: print(done, time.strftime("%H:%M:%S"), flush=True)
def fetch(q):
    f = os.path.join(cache, hashlib.sha1(q.encode()).hexdigest()[:16] + ".json")
    body = json.dumps({"query": q, "limit": 10, "location": "Australia", "country": "au"}).encode()
    t0 = time.time()
    for attempt in range(4):
        try:
            req = urllib.request.Request("https://api.firecrawl.dev/v2/search", data=body, headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
            d = json.load(urllib.request.urlopen(req, timeout=90))
            web = d.get("data", {}).get("web", [])
            json.dump({"query": q, "results": [{"url": x.get("url"), "title": x.get("title"), "description": x.get("description")} for x in web]}, open(f, "w"))
            break
        except Exception as e:
            print("retry", q, e, flush=True); time.sleep(30 * (attempt + 1))
    time.sleep(float(os.environ.get("SERP_SLEEP", "20")))
N = int(os.environ.get("SERP_WORKERS", "3"))
ts = [threading.Thread(target=worker, args=(todo[i::N],)) for i in range(N)]
[t.start() for t in ts]; [t.join() for t in ts]
print("finished", done, flush=True)
