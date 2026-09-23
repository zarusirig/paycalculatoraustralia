"""Build a contextual internal-link graph from a Next static export.

Usage: linkgraph.py <out_dir> <json_out>

Contextual = links inside <main id="main-content"> plus the post-article
"What to check next" block, excluding any <header>, <footer>, <nav> (menus,
breadcrumbs, TOCs rendered as <nav>) regions. Links from /site-directory/ (an
HTML sitemap) and /news/ index are tracked but reported separately.
"""
import json, os, re, sys
from html.parser import HTMLParser
from urllib.parse import urlparse

OUT, JSON_OUT = sys.argv[1], sys.argv[2]
HOST = "pay-calculator-australia.com"
EXCLUDED_TAGS = {"header", "footer", "nav"}
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}


def norm(href, base):
    if not href or href.startswith(("#", "mailto:", "tel:", "javascript:")):
        return None
    u = urlparse(href)
    if u.netloc and u.netloc.replace("www.", "") != HOST:
        return None
    path = u.path
    if not path:
        return None
    if not path.startswith("/"):
        path = os.path.normpath(os.path.join(os.path.dirname(base), path))
    if re.search(r"\.(png|jpe?g|svg|webp|avif|xml|txt|ico|pdf|json|js|css|csv)$", path):
        return None
    if not path.endswith("/"):
        path += "/"
    return path


class P(HTMLParser):
    def __init__(self, page):
        super().__init__(convert_charrefs=True)
        self.page = page
        self.stack = []  # (tag, flags)
        self.excl = 0
        self.in_main = 0
        self.in_next = 0
        self.a = None
        self.links = []  # (target, anchor, region)

    def handle_starttag(self, tag, attrs):
        if tag in VOID:
            if tag == "a":
                pass
            return
        d = dict(attrs)
        flags = set()
        label = (d.get("aria-label") or "").lower()
        # Next streams the page body into hidden <div id="S:n"> nodes after the
        # footer, so <main> itself is an empty shell. Treat everything outside the
        # top-level site <header>/<footer> and non-contextual <nav>s as body.
        top = len(self.stack) <= 3
        is_excl = (tag in ("header", "footer") and top) or (
            tag == "nav" and ("breadcrumb" in label or "table of contents" in label or "main navigation" in label or top)
        )
        if is_excl:
            self.excl += 1; flags.add("excl")
        if tag == "main":
            self.in_main += 1; flags.add("main")
        if tag == "section" and d.get("aria-labelledby") == "whats-next-heading":
            self.in_next += 1; flags.add("next")
        self.stack.append((tag, flags))
        if tag == "a":
            self.a = [d.get("href"), ""]

    def handle_endtag(self, tag):
        # pop to matching tag
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                for t, f in self.stack[i:]:
                    if "excl" in f: self.excl -= 1
                    if "main" in f: self.in_main -= 1
                    if "next" in f: self.in_next -= 1
                del self.stack[i:]
                break
        if tag == "a" and self.a is not None:
            href, text = self.a
            self.a = None
            tgt = norm(href, self.page)
            if tgt is None:
                return
            if self.excl > 0:
                region = "chrome"
            elif self.in_next > 0:
                region = "related"
            else:
                region = "body"
            self.links.append((tgt, re.sub(r"\s+", " ", text).strip(), region))

    def handle_data(self, data):
        if self.a is not None:
            self.a[1] += data


pages = {}
for root, _, files in os.walk(OUT):
    for f in files:
        if f != "index.html":
            continue
        full = os.path.join(root, f)
        rel = "/" + os.path.relpath(root, OUT).replace(os.sep, "/") + "/"
        rel = rel.replace("/./", "/") if rel != "/./" else "/"
        if rel.startswith("/_next") or rel.startswith("/404"):
            continue
        p = P(rel)
        p.feed(open(full, encoding="utf-8", errors="ignore").read())
        pages[rel] = p.links

json.dump(pages, open(JSON_OUT, "w"))
print(len(pages), "pages")
