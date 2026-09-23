"""Analyse a link graph JSON from linkgraph.py.

Usage: analyze.py <graph.json> <csv_out> <summary_json_out>
"""
import csv, json, sys, collections

G = json.load(open(sys.argv[1]))
pages = set(G)
SITEMAPS = {"/site-directory/"}  # HTML sitemap: not a contextual source

inl = collections.defaultdict(set)       # contextual (body + related), excl sitemap sources
inl_body = collections.defaultdict(set)  # body only
inl_any = collections.defaultdict(set)   # incl chrome
anchors = collections.defaultdict(set)
outl = collections.defaultdict(set)
broken = collections.Counter()
for src, links in G.items():
    for tgt, text, region in links:
        if tgt == src:
            continue
        if tgt not in pages:
            broken[tgt] += 1
            continue
        inl_any[tgt].add(src)
        if region == "chrome":
            continue
        if src in SITEMAPS:
            continue
        inl[tgt].add(src)
        outl[src].add(tgt)
        anchors[tgt].add(text.lower())
        if region == "body":
            inl_body[tgt].add(src)


def cluster(p):
    rules = [
        ("take-home-pay-on", lambda p: p.startswith("/take-home-pay-on/")),
        ("tax-on", lambda p: p.startswith("/tax-on/")),
        ("salary-to-hourly", lambda p: p.startswith("/salary-to-hourly/")),
        ("hourly-to-salary", lambda p: p.startswith("/hourly-to-salary/")),
        ("job-pay-rates", lambda p: p.startswith("/job-pay-rates/")),
        ("employer-pay", lambda p: p.startswith("/pay-rates/")),
        ("minimum-wage-by-age", lambda p: p.startswith("/minimum-wage-by-age/")),
        ("payroll-tax", lambda p: p.startswith("/payroll-tax")),
        ("awards", lambda p: p.endswith("-award-rates/") or p in ("/award-rates/", "/schads-award-pay-rates/")),
        ("state-pay", lambda p: p.startswith("/pay-calculator-")),
        ("centrelink", lambda p: any(k in p for k in ("centrelink", "jobseeker", "austudy", "age-pension", "carer", "parenting-payment", "family-tax", "rent-assistance", "cost-of-living", "pension-age"))),
        ("lsl", lambda p: p.startswith("/long-service-leave-calculator/")),
        ("teacher", lambda p: p.startswith("/teacher-pay-australia/")),
        ("nurse", lambda p: p.startswith("/healthcare-worker-pay/")),
        ("public-service", lambda p: p.startswith("/public-service-pay-scales/")),
        ("adf", lambda p: p.startswith("/adf-pay-scales/")),
        ("news", lambda p: p.startswith("/news/")),
    ]
    for name, f in rules:
        if f(p):
            return name
    return "core"


rows = []
for p in sorted(pages):
    rows.append({
        "url": p,
        "cluster": cluster(p),
        "contextual_inlinks": len(inl[p]),
        "body_inlinks": len(inl_body[p]),
        "all_inlinks_incl_nav": len(inl_any[p]),
        "contextual_outlinks": len(outl[p]),
        "distinct_anchors": len(anchors[p]),
    })

with open(sys.argv[2], "w", newline="") as fh:
    w = csv.DictWriter(fh, fieldnames=list(rows[0]))
    w.writeheader(); w.writerows(rows)

# Hub/spoke checks
HUBS = {
    "/job-pay-rates/": lambda p: p.startswith("/job-pay-rates/"),
    "/pay-rates/": lambda p: p.startswith("/pay-rates/"),
    "/payroll-tax/": lambda p: p.startswith("/payroll-tax/"),
    "/award-rates/": lambda p: p.endswith("-award-rates/") or p == "/schads-award-pay-rates/",
    "/minimum-wage-by-age/": lambda p: p.startswith("/minimum-wage-by-age/"),
    "/centrelink-income-test/": lambda p: p in ("/jobseeker-payment-calculator/", "/austudy-youth-allowance-calculator/", "/age-pension-income-test-calculator/", "/parenting-payment-calculator/", "/carer-payment-calculator/", "/centrelink-working-credit-calculator/"),
    "/long-service-leave-calculator/": lambda p: p.startswith("/long-service-leave-calculator/"),
    "/teacher-pay-australia/": lambda p: p.startswith("/teacher-pay-australia/"),
    "/healthcare-worker-pay/": lambda p: p.startswith("/healthcare-worker-pay/"),
    "/public-service-pay-scales/": lambda p: p.startswith("/public-service-pay-scales/"),
    "/adf-pay-scales/": lambda p: p.startswith("/adf-pay-scales/"),
    "/take-home-pay-on/": lambda p: p.startswith("/take-home-pay-on/"),
    "/tax-on/": lambda p: p.startswith("/tax-on/"),
    "/salary-to-hourly/": lambda p: p.startswith("/salary-to-hourly/"),
    "/hourly-to-salary/": lambda p: p.startswith("/hourly-to-salary/"),
    "/payg-withholding-tables/": lambda p: p.endswith("-tax-table/"),
}
hubs = {}
for hub, f in HUBS.items():
    if hub not in pages:
        hubs[hub] = {"missing_hub": True}
        continue
    spokes = [p for p in pages if f(p) and p != hub]
    hub_out = {t for t, _, r in G[hub] if r != "chrome"}
    missing_down = sorted(s for s in spokes if s not in hub_out)
    missing_up = sorted(s for s in spokes if hub not in {t for t, _, r in G[s] if r != "chrome"})
    hubs[hub] = {"spokes": len(spokes), "hub_missing_spokes": missing_down, "spokes_not_linking_hub": missing_up}

summary = {
    "pages": len(pages),
    "orphans": sorted(p for p in pages if len(inl[p]) == 0 and p != "/"),
    "weak": sorted(p for p in pages if 0 < len(inl[p]) < 3 and p != "/"),
    "body_orphans": sorted(p for p in pages if len(inl_body[p]) == 0 and p != "/"),
    "nav_only_orphans": sorted(p for p in pages if len(inl_any[p]) == 0 and p != "/"),
    "hubs": hubs,
    "broken": broken.most_common(50),
    "by_cluster": {},
}
bc = collections.defaultdict(lambda: {"pages": 0, "orphans": 0, "weak": 0, "median_in": []})
for r in rows:
    c = bc[r["cluster"]]
    c["pages"] += 1
    if r["url"] != "/" and r["contextual_inlinks"] == 0: c["orphans"] += 1
    if r["url"] != "/" and 0 < r["contextual_inlinks"] < 3: c["weak"] += 1
    c["median_in"].append(r["contextual_inlinks"])
for k, c in bc.items():
    m = sorted(c["median_in"]); c["median_in"] = m[len(m) // 2]
summary["by_cluster"] = bc
json.dump(summary, open(sys.argv[3], "w"), indent=1)
print("pages", len(pages), "orphans", len(summary["orphans"]), "weak(<3)", len(summary["weak"]), "body-orphans", len(summary["body_orphans"]), "broken", len(broken))
for k, c in sorted(bc.items()):
    print(f"  {k:22} pages={c['pages']:4} orphans={c['orphans']:4} weak={c['weak']:4} median_in={c['median_in']}")
for h, v in hubs.items():
    if v.get("missing_hub"):
        print("  HUB MISSING", h); continue
    print(f"  hub {h:34} spokes={v['spokes']:4} hub_missing={len(v['hub_missing_spokes']):4} spokes_not_back={len(v['spokes_not_linking_hub']):4}")
