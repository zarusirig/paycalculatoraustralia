"""Page layout outline and before/after diff for the Step 6 structure pass.

  python3 -I scripts/authorship/page-diff.py <path> --outline   # outline of the built page in out/
  python3 -I scripts/authorship/page-diff.py <path>             # base (live build) vs out/: outline diff + counts + text diff

Base defaults to the copy of the live build in the session scratchpad; set PCA_BASE_OUT to override.
"""
import difflib
import html
import os
import re
import sys

BASE = os.environ.get("PCA_BASE_OUT", "/private/tmp/claude-501/-Users-surajgiri/81cb8fe6-1248-4e3f-a281-2be6f4761e39/scratchpad/out-live")
NEW = "out"


def load(root, path):
    f = os.path.join(root, path.strip("/"), "index.html") if path.strip("/") else os.path.join(root, "index.html")
    return open(f, encoding="utf-8", errors="ignore").read()


def main_html(h):
    h = re.sub(r"<script.*?</script>|<style.*?</style>|<svg.*?</svg>", "", h, flags=re.S)
    m = re.search(r"<main\b.*?</main>", h, flags=re.S)
    return m.group(0) if m else h


def text(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()


def outline(h):
    h = main_html(h)
    out = []
    tok = re.compile(r"<(h[1-4]|p|table|ol|ul|input|select|details|form)\b[^>]*>(.*?)</\1>|<(input|select)\b[^>]*>", re.S)
    for m in tok.finditer(h):
        tag = (m.group(1) or m.group(3)).lower()
        inner = m.group(2) or ""
        if tag in ("h1", "h2", "h3", "h4"):
            out.append(f"{tag.upper()} {text(inner)[:90]}")
        elif tag == "p":
            t = text(inner)
            if len(t) > 25:
                out.append(f"  p {t[:80]}")
        elif tag == "table":
            rows = len(re.findall(r"<tr\b", inner))
            head = text(" | ".join(re.findall(r"<th\b[^>]*>(.*?)</th>", inner, flags=re.S)[:5]))[:80]
            out.append(f"  TABLE {rows} rows [{head}]")
        elif tag in ("ol", "ul"):
            n = len(re.findall(r"<li\b", inner))
            if n:
                out.append(f"  {tag.upper()} {n} items: {text(inner)[:60]}")
        elif tag in ("input", "select"):
            if not out or not out[-1].startswith("  CALC"):
                out.append("  CALC input")
        elif tag == "details":
            out.append(f"  FAQ {text(inner)[:70]}")
    return out


def counts(h):
    m = main_html(h)
    return {
        "links": len(re.findall(r"<a\b[^>]*href=", h)),
        "main_words": len(text(m).split()),
        "tables": len(re.findall(r"<table\b", m)),
        "ol": len(re.findall(r"<ol\b", m)),
        "inputs": len(re.findall(r"<input\b|<select\b", m)),
        "faq": len(re.findall(r"<details\b", m)),
        "h2": len(re.findall(r"<h2\b", m)),
        "jsonld": len(re.findall(r'application/ld\+json', h)),
        "mv": len(re.findall(r"mv-(?:sidebar|content)", h)),
    }


def first_input_pos(o):
    return next((i for i, l in enumerate(o) if l.startswith("  CALC")), None)


path = sys.argv[1] if len(sys.argv) > 1 else "/"
if "--outline" in sys.argv:
    o = outline(load(NEW, path))
    print("\n".join(o))
    print("counts", counts(load(NEW, path)), "| first calculator block at line", first_input_pos(o))
    sys.exit(0)
a, b = load(BASE, path), load(NEW, path)
oa, ob = outline(a), outline(b)
print("== outline diff (base -> new)")
print("\n".join(difflib.unified_diff(oa, ob, "base", "new", n=1, lineterm="")) or "(same outline)")
ca, cb = counts(a), counts(b)
print("== counts", {k: (ca[k], cb[k]) for k in ca if ca[k] != cb[k]} or "(all equal)", "| calc line", first_input_pos(oa), "->", first_input_pos(ob))
wa, wb = set(re.findall(r"[^.!?]{20,}[.!?]", text(main_html(a)))), set(re.findall(r"[^.!?]{20,}[.!?]", text(main_html(b))))
gone, added = sorted(wa - wb), sorted(wb - wa)
print(f"== sentences removed {len(gone)}, added {len(added)}")
for s in gone[:15]:
    print("  - " + s.strip()[:200])
for s in added[:15]:
    print("  + " + s.strip()[:200])
