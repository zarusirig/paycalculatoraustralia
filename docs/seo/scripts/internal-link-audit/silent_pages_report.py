"""Render the silent-pages audit document from silent_pages.py JSON output.

Usage: silent_pages_report.py <before.json> [<after.json>] > docs/seo/<date>-silent-pages-audit.md

With only a before file it writes the pre-change table. With both it writes the
before and after columns side by side plus the bucket summary.
"""
import json
import sys

before = json.load(open(sys.argv[1]))
after = json.load(open(sys.argv[2])) if len(sys.argv) > 2 else None
after_rows = {r["path"]: r for r in after["rows"]} if after else {}


def bucket(n):
    return "0" if n == 0 else "1 to 2" if n <= 2 else "3+"


def buckets(rows, key):
    out = {"0": 0, "1 to 2": 0, "3+": 0}
    for r in rows:
        out[bucket(r[key])] += 1
    return out


def fmt_sim(r):
    if r["sim"] is None:
        return ""
    return f"**{r['sim']:.3f}**" if r["sim"] > 0.75 else f"{r['sim']:.3f}"


print("# Silent Pages Audit: 79 URLs with Zero Impressions (22 Oct 2026)\n")
print(
    "**Problem.** Google Search Console for the 28 days to 20 October 2026 shows 79 published pages with zero impressions; "
    "the Pages report lists 80 URLs as \"Discovered, currently not indexed\" and 6 as \"Crawled, currently not indexed\". "
    "The list is `docs/seo/data/2026-10-22-silent-urls.txt`.\n"
)
print(
    "**Method.** Static export (`npx next build --webpack`), then every `out/**/index.html` is parsed by "
    "`docs/seo/scripts/internal-link-audit/silent_pages.py`. For each silent URL it records whether the page exists in "
    "`out/` and in `out/sitemap.xml`; the number of OTHER pages whose `<main>` or `<footer>` carries an `<a href>` to it "
    "(\"body\"), split into links in article prose, tables and lists (\"prose\") and links that sit only in the related-link "
    "cards, the in-page sidebar `<aside>` or the footer (\"cards\"); the number of those body links that come from pages "
    "outside the silent page's own sibling set (\"outside\"); the number of pages linking only from the fixed site header and "
    "its navigation (\"header\"), which is on every page and counted separately; and the difflib `SequenceMatcher` ratio of "
    "the page's `<main>` visible words (digits masked to `#`) against its closest sibling, flagged in bold above 0.75. "
    "Breadcrumb `<nav>`s inside `<main>` and the `/site-directory/` HTML sitemap are not counted as sources.\n"
)
print(
    "**Sibling sets.** `/job-pay-rates/*` pages are siblings of each other, as are `/apprentice-pay/*`, `/prison-officer-pay/*`, "
    "the two financial-year pages of each tax-table cycle, every `*-award-rates/` page (plus `/schads-award-pay-rates/`), and the "
    "public holiday guide set together with `/public-holiday-pay/`. A page with no family (for example `/allowances-guide/`) has "
    "no sibling set for the link count, and its similarity is measured against the closest page on the whole site.\n"
)

rows = before["rows"]
print(f"## Before ({before['pages']} pages in the export)\n")
print("| Path | Exists | Sitemap | Body | Prose | Cards | Outside siblings | Header | Similarity | Closest sibling |")
print("|---|---|---|---|---|---|---|---|---|---|")
for r in rows:
    print(
        f"| {r['path']} | {'yes' if r['exists'] else 'NO'} | {'yes' if r['sitemap'] else 'NO'} | {r['body']} | {r['prose']} | "
        f"{r['cards']} | {r['outside']} | {r['header']} | {fmt_sim(r)} | {r['closest'] or ''} |"
    )
b = buckets(rows, "outside")
print(f"\nOutside-sibling body inbound links before: **{b['0']} pages with 0, {b['1 to 2']} with 1 to 2, {b['3+']} with 3 or more.**")
flagged = [r for r in rows if r["sim"] is not None and r["sim"] > 0.75]
print(f"\nSibling similarity above 0.75 before: **{len(flagged)} pages** ({', '.join(r['path'] for r in flagged)}).\n")

if after:
    print(f"## Before and after ({after['pages']} pages in the export after the change)\n")
    print("| Path | Body before | Body after | Outside siblings before | Outside siblings after | Prose after | Similarity before | Similarity after |")
    print("|---|---|---|---|---|---|---|---|")
    for r in rows:
        a = after_rows.get(r["path"])
        if not a:
            print(f"| {r['path']} | {r['body']} | missing | {r['outside']} | missing | | {fmt_sim(r)} | |")
            continue
        print(
            f"| {r['path']} | {r['body']} | {a['body']} | {r['outside']} | {a['outside']} | {a['prose']} | {fmt_sim(r)} | {fmt_sim(a)} |"
        )
    ab = buckets([after_rows[r["path"]] for r in rows if r["path"] in after_rows], "outside")
    print("\n### Summary\n")
    print("| Outside-sibling body inbound links | Before | After |")
    print("|---|---|---|")
    for k in ("0", "1 to 2", "3+"):
        print(f"| {k} | {b[k]} | {ab[k]} |")
    aflag = [after_rows[r["path"]] for r in rows if r["path"] in after_rows and after_rows[r["path"]]["sim"] is not None and after_rows[r["path"]]["sim"] > 0.75]
    print(f"\nSibling similarity above 0.75 after: **{len(aflag)} pages**{(' (' + ', '.join(r['path'] for r in aflag) + ')') if aflag else ''}.")
    under3 = [after_rows[r["path"]] for r in rows if r["path"] in after_rows and after_rows[r["path"]]["outside"] < 3]
    if under3:
        print("\nPages still under 3 outside-sibling body links after the change:\n")
        for r in under3:
            print(f"- {r['path']}: {r['outside']} (sources: {', '.join(r['body_sources']) or 'none'})")
    else:
        print("\nEvery silent page has at least 3 body inbound links from outside its sibling set after the change.")
