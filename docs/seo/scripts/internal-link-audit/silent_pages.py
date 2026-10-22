"""Measure inbound links and sibling similarity for a list of "silent" pages.

Usage: silent_pages.py <out_dir> <urls.txt> <json_out> [label]

For every path in urls.txt (one per line, trailing slash) it reports, from the
built static export:

  exists      out/<path>/index.html is present
  sitemap     the path is listed in out/sitemap.xml
  body        number of OTHER pages whose <main> or <footer> carries
              <a href="<path>"> (breadcrumb nav and /site-directory/ excluded)
  prose       of those, pages where the link is in article prose, a table or a
              list: NOT the "What to check next" cards and NOT the sidebar <aside>
  cards       pages where the link is only in related cards / sidebar / footer
  outside     body pages that are not in the page's own sibling set
  header      pages linking from the fixed site <header> (nav) only
  sim         difflib SequenceMatcher ratio of the page's <main> visible words
              (digits masked) against its closest sibling, and that sibling

Siblings: pages under the same dynamic family (/job-pay-rates/*, /apprentice-pay/*,
/prison-officer-pay/*, /<freq>-tax-table/*), every /*-award-rates/ page, the
public-holiday guide set, or (for a page with no family) every other page.
"""
import difflib
import html as htmlmod
import json
import os
import re
import sys
from html.parser import HTMLParser

OUT, URLS, JSON_OUT = sys.argv[1], sys.argv[2], sys.argv[3]
LABEL = sys.argv[4] if len(sys.argv) > 4 else ""
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}
SKIP_SOURCES = {"/site-directory/"}
HOLIDAY_SET = {
    "/christmas-day-pay-rates/", "/boxing-day-pay-rates/", "/new-years-day-pay-rates/", "/public-holidays-2027/",
    "/melbourne-cup-day-pay/", "/easter-public-holiday-pay/", "/australia-day-public-holiday-pay/",
    "/christmas-shutdown-annual-leave/", "/public-holiday-pay/",
}


def norm(href):
    if not href or href.startswith(("#", "mailto:", "tel:", "javascript:", "http://", "https://", "//")):
        if href and href.startswith(("http://", "https://")) and "pay-calculator-australia.com" in href:
            href = re.sub(r"^https?://(www\.)?pay-calculator-australia\.com", "", href)
        else:
            return None
    path = href.split("#")[0].split("?")[0]
    if not path.startswith("/"):
        return None
    if re.search(r"\.(png|jpe?g|svg|webp|avif|xml|txt|ico|pdf|json|js|css|csv|ics)$", path):
        return None
    if not path.endswith("/"):
        path += "/"
    return path


class LinkParser(HTMLParser):
    """Records (target, region) for every internal <a>. Regions:
    header  inside the top-level site <header> (the fixed nav)
    footer  inside the top-level <footer>
    crumb   inside a <nav aria-label="breadcrumb"> within <main>
    cards   inside <main>: the "What to check next" section, any <aside>, or the "Jobs by sector" anchor nav
    prose   anywhere else inside <main>
    other   outside all of the above (ads, skip link)
    """

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.depth = {"header": 0, "footer": 0, "main": 0, "crumb": 0, "cards": 0}
        self.links = []
        self.a = None

    def handle_starttag(self, tag, attrs):
        if tag in VOID:
            return
        d = dict(attrs)
        flags = set()
        top = self.depth["main"] == 0
        if tag == "header" and top and d.get("id") == "site-header":
            flags.add("header")
        if tag == "footer" and top:
            flags.add("footer")
        if tag == "main":
            flags.add("main")
        if self.depth["main"] > 0:
            label = (d.get("aria-label") or "").lower()
            if tag == "nav" and "breadcrumb" in label:
                flags.add("crumb")
            if tag == "aside" or (tag == "section" and (d.get("aria-labelledby") or "").startswith("whats-next")) or (tag == "nav" and label):
                flags.add("cards")
        for f in flags:
            self.depth[f] += 1
        self.stack.append((tag, flags))
        if tag == "a":
            self.a = d.get("href")

    def handle_endtag(self, tag):
        if tag == "a" and self.a is not None:
            tgt = norm(self.a)
            self.a = None
            if tgt is not None:
                if self.depth["header"]:
                    region = "header"
                elif self.depth["footer"]:
                    region = "footer"
                elif self.depth["main"]:
                    region = "crumb" if self.depth["crumb"] else ("cards" if self.depth["cards"] else "prose")
                else:
                    region = "other"
                self.links.append((tgt, region))
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                for _, f in self.stack[i:]:
                    for k in f:
                        self.depth[k] -= 1
                del self.stack[i:]
                break


class TextParser(HTMLParser):
    """Visible words inside <main>, digits masked."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.in_main = 0
        self.skip = 0
        self.stack = []
        self.words = []

    def handle_starttag(self, tag, attrs):
        if tag in VOID:
            return
        self.stack.append(tag)
        if tag == "main":
            self.in_main += 1
        if tag in ("script", "style", "noscript", "svg", "template"):
            self.skip += 1

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i] == tag:
                for t in self.stack[i:]:
                    if t == "main":
                        self.in_main -= 1
                    if t in ("script", "style", "noscript", "svg", "template"):
                        self.skip -= 1
                del self.stack[i:]
                break

    def handle_data(self, data):
        if self.in_main and not self.skip:
            self.words.extend(re.sub(r"\d", "#", data).lower().split())


def page_path(root):
    rel = os.path.relpath(root, OUT).replace(os.sep, "/")
    return "/" if rel == "." else f"/{rel}/"


pages = {}
for root, _, files in os.walk(OUT):
    if "index.html" not in files:
        continue
    p = page_path(root)
    if p.startswith("/_next") or p.startswith("/404"):
        continue
    with open(os.path.join(root, "index.html"), encoding="utf-8", errors="ignore") as fh:
        pages[p] = fh.read()

sitemap = open(os.path.join(OUT, "sitemap.xml"), encoding="utf-8").read()
sitemap_paths = set(re.findall(r"<loc>https?://[^/<]+(/[^<]*)</loc>", sitemap))

# Inbound index: target -> source -> set(regions)
inbound = {}
for src, html in pages.items():
    lp = LinkParser()
    lp.feed(html)
    for tgt, region in lp.links:
        inbound.setdefault(tgt, {}).setdefault(src, set()).add(region)

silent = [l.strip() for l in open(URLS, encoding="utf-8") if l.strip()]


def family(p):
    m = re.match(r"^/(job-pay-rates|apprentice-pay|prison-officer-pay|weekly-tax-table|fortnightly-tax-table|monthly-tax-table)/[^/]+/$", p)
    if m:
        return m.group(1)
    if p.endswith("-award-rates/") or p == "/schads-award-pay-rates/":
        return "award"
    if p in HOLIDAY_SET:
        return "holiday"
    return None


def siblings(p):
    fam = family(p)
    if fam is None:
        return [q for q in pages if q != p]
    return [q for q in pages if q != p and family(q) == fam]


word_cache = {}


def words(p):
    if p not in word_cache:
        tp = TextParser()
        tp.feed(pages[p])
        word_cache[p] = tp.words
    return word_cache[p]


rows = []
for p in silent:
    exists = p in pages
    srcs = inbound.get(p, {})
    # Similarity is measured against the closest page in the family (or, for a
    # page with no family, the closest page on the site). The "outside sibling
    # set" link count only excludes a real family: a single page has none.
    sib = set(siblings(p)) if exists else set()
    link_sib = sib if family(p) else set()
    body = {s for s, r in srcs.items() if s != p and s not in SKIP_SOURCES and (r & {"prose", "cards", "footer"})}
    prose = {s for s in body if "prose" in srcs[s]}
    header = {s for s, r in srcs.items() if s != p and "header" in r}
    outside = {s for s in body if s not in link_sib}
    outside_prose = {s for s in prose if s not in link_sib}
    sim, closest = None, None
    if exists:
        a = words(p)
        cands = []
        for q in sib:
            sm = difflib.SequenceMatcher(None, a, words(q), autojunk=False)
            cands.append((sm.quick_ratio(), q))
        cands.sort(reverse=True)
        best = (0.0, None)
        for _, q in cands[:6]:
            r = difflib.SequenceMatcher(None, a, words(q), autojunk=False).ratio()
            if r > best[0]:
                best = (r, q)
        sim, closest = best
    rows.append({
        "path": p,
        "exists": exists,
        "sitemap": p in sitemap_paths,
        "body": len(body),
        "prose": len(prose),
        "cards": len(body - prose),
        "outside": len(outside),
        "outside_prose": len(outside_prose),
        "header": len(header),
        "sim": None if sim is None else round(sim, 3),
        "closest": closest,
        "body_sources": sorted(body),
        "prose_sources": sorted(prose),
    })

json.dump({"label": LABEL, "pages": len(pages), "rows": rows}, open(JSON_OUT, "w"), indent=1)

print(f"{len(pages)} pages; {len(silent)} silent URLs")
print("| Path | Exists | Sitemap | Body | Prose | Cards | Outside sib | Header | Sim | Closest |")
print("|---|---|---|---|---|---|---|---|---|---|")
for r in rows:
    flag = " **>0.75**" if r["sim"] is not None and r["sim"] > 0.75 else ""
    print(f"| {r['path']} | {'y' if r['exists'] else 'NO'} | {'y' if r['sitemap'] else 'NO'} | {r['body']} | {r['prose']} | {r['cards']} | {r['outside']} | {r['header']} | {r['sim']}{flag} | {r['closest'] or ''} |")
buckets = {"0": 0, "1-2": 0, "3+": 0}
for r in rows:
    n = r["outside"]
    buckets["0" if n == 0 else "1-2" if n <= 2 else "3+"] += 1
print("outside-sibling body inbound buckets:", buckets)
