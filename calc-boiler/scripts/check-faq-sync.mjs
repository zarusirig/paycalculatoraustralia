#!/usr/bin/env node
// Checks that every page's FAQPage JSON-LD matches the FAQ a reader can see.
//
// Run after a static export:  npx next build --webpack && npm run check:faq
//
// For every HTML file under out/ it:
//   1. collects the Question/Answer pairs from FAQPage JSON-LD (top level,
//      arrays and @graph);
//   2. builds the page's visible text (everything outside <script>/<style>/
//      <template>/<noscript>, entities decoded, tags removed);
//   3. collects the visible FAQ questions: Radix accordion triggers
//      (data-slot="accordion-trigger") and <summary> elements that end in "?".
//
// It fails when:
//   - a JSON-LD question is not visible on the page;
//   - a JSON-LD answer is not visible on the page as the same text
//     (whitespace-insensitive, so inline <strong>/<a> and line breaks don't matter);
//   - a page has FAQPage markup and a visible FAQ question that the markup omits.
//
// Pages that show question accordions but carry no FAQPage markup are listed
// as a note (missing markup is not a mismatch).
//
// Usage: node scripts/check-faq-sync.mjs [outDir] [--verbose]

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const args = process.argv.slice(2);
const verbose = args.includes("--verbose");
const outDir = args.find((a) => !a.startsWith("--")) ?? "out";

try {
  statSync(outDir);
} catch {
  console.error(`check-faq-sync: ${outDir}/ not found. Run \`npx next build --webpack\` first.`);
  process.exit(2);
}

const NAMED = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", mdash: "—", ndash: "–", hellip: "…", times: "×", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", middot: "·", bull: "•", minus: "−", divide: "÷", le: "≤", ge: "≥", rarr: "→", larr: "←", copy: "©", reg: "®", trade: "™", deg: "°", frac12: "½", frac14: "¼", frac34: "¾", cent: "¢", pound: "£", euro: "€", sup2: "²", asymp: "≈", plusmn: "±" };

function decode(s) {
  return s.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z0-9]+);/gi, (m, e) => {
    if (e[0] === "#") {
      const n = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    return NAMED[e.toLowerCase()] ?? m;
  });
}

/** Comparison key: decoded, typographic quotes folded, all whitespace removed. */
function key(s) {
  return decode(s)
    .replace(/[‘’‛′]/g, "'")
    .replace(/[“”″]/g, '"')
    .replace(/[\s ​]+/g, "");
}

function stripTags(html) {
  return html.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, " ");
}

function visibleText(html) {
  const body = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<template\b[\s\S]*?<\/template>/gi, " ")
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<head\b[\s\S]*?<\/head>/i, " ");
  return stripTags(body);
}

function faqFromJsonLd(html, file, problems) {
  const out = [];
  const re = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  const visit = (node) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) return node.forEach(visit);
    const type = node["@type"];
    const isFaq = type === "FAQPage" || (Array.isArray(type) && type.includes("FAQPage"));
    if (isFaq) {
      const entities = [].concat(node.mainEntity ?? []);
      for (const q of entities) {
        const ans = [].concat(q?.acceptedAnswer ?? [])[0];
        out.push({ q: String(q?.name ?? ""), a: String(ans?.text ?? "") });
      }
    }
    if (node["@graph"]) visit(node["@graph"]);
  };
  while ((m = re.exec(html))) {
    try {
      visit(JSON.parse(m[1]));
    } catch (e) {
      problems.push(`JSON-LD parse error: ${e.message}`);
    }
  }
  return out;
}

function visibleQuestions(html) {
  const qs = [];
  const trig = /<button[^>]*data-slot="accordion-trigger"[^>]*>([\s\S]*?)<\/button>/gi;
  const summ = /<summary\b[^>]*>([\s\S]*?)<\/summary>/gi;
  for (const re of [trig, summ]) {
    let m;
    while ((m = re.exec(html))) {
      const text = decode(stripTags(m[1])).replace(/\s+/g, " ").trim();
      if (text.endsWith("?")) qs.push(text);
    }
  }
  return qs;
}

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (name === "_next") continue;
      yield* htmlFiles(p);
    } else if (name.endsWith(".html")) yield p;
  }
}

function urlOf(file) {
  const rel = relative(outDir, file).split(sep).join("/");
  if (rel === "index.html") return "/";
  return "/" + rel.replace(/(^|\/)index\.html$/, "/").replace(/\.html$/, "/");
}

let pages = 0;
let faqPages = 0;
let jsonLdQuestions = 0;
const failures = []; // { url, problems[] }
const unmarked = []; // pages with visible question accordions and no FAQPage
let mismatchCount = 0;

for (const file of htmlFiles(outDir)) {
  const html = readFileSync(file, "utf8");
  pages++;
  const problems = [];
  const ld = faqFromJsonLd(html, file, problems);
  const visible = visibleQuestions(html);
  const url = urlOf(file);

  if (ld.length === 0) {
    if (visible.length > 0) unmarked.push({ url, count: visible.length });
    if (problems.length) failures.push({ url, problems });
    continue;
  }

  faqPages++;
  jsonLdQuestions += ld.length;
  const text = key(visibleText(html));
  const ldQKeys = new Set(ld.map((f) => key(f.q)));

  for (const f of ld) {
    if (!f.q.trim() || !f.a.trim()) {
      problems.push(`empty question or answer in JSON-LD: "${f.q}"`);
      mismatchCount++;
      continue;
    }
    if (!text.includes(key(f.q))) {
      problems.push(`JSON-LD question not visible: "${f.q}"`);
      mismatchCount++;
    } else if (!text.includes(key(f.a))) {
      problems.push(`JSON-LD answer differs from visible text: "${f.q}"` + (verbose ? `\n        JSON-LD: ${f.a}` : ""));
      mismatchCount++;
    }
  }
  for (const q of visible) {
    if (!ldQKeys.has(key(q))) {
      problems.push(`visible FAQ question missing from JSON-LD: "${q}"`);
      mismatchCount++;
    }
  }
  if (problems.length) failures.push({ url, problems });
}

// Group identical problem sets across programmatic pages so the report stays readable.
for (const { url, problems } of failures) {
  console.log(`\n${url}`);
  for (const p of problems) console.log(`  - ${p}`);
}

if (unmarked.length && verbose) {
  console.log(`\nNote: ${unmarked.length} page(s) show question accordions without FAQPage markup (not a mismatch):`);
  for (const u of unmarked) console.log(`  ${u.url} (${u.count})`);
}

console.log(
  `\ncheck-faq-sync: ${pages} pages, ${faqPages} with FAQPage (${jsonLdQuestions} questions), ` +
    `${mismatchCount} mismatch(es) on ${failures.length} page(s)` +
    (unmarked.length ? `; ${unmarked.length} page(s) with unmarked question accordions` : ""),
);
process.exit(failures.length ? 1 : 0);
