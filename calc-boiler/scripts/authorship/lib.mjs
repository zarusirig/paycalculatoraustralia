// Shared core for the authorship/humanizer pass: parses a .ts/.tsx file with the
// TypeScript compiler API and classifies every string as EDITABLE prose or
// LOCKED (code, keys, labels, metadata, schema, link text, headings...).
//
// The skeleton is the file's AST with editable prose blanked. Two versions of a
// file that differ only in editable prose have identical skeletons, so any code,
// structure, attribute or locked-string change shows up as a skeleton diff.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import ts from "typescript";

export const ROOT = new URL("../..", import.meta.url).pathname.replace(/\/$/, "");

/** Object property names whose whole value subtree is locked. */
export const LOCKED_PROPS = new Set([
  "title", "metaTitle", "description", "metaDescription", "h1", "heading", "headings",
  "question", "q", "name", "label", "labels", "key", "id", "slug", "href", "url", "urls",
  "category", "categories", "tags", "keywords", "author", "authors", "reviewer", "reviewedBy",
  "award", "awardName", "instrument", "instrumentName", "classification", "classifications",
  "level", "levels", "unit", "units", "source", "sources", "sourceUrl", "sourceName", "sourceLabel",
  "openGraph", "twitter", "alternates", "robots", "canonical", "image", "images", "alt",
  "headline", "anchor", "anchorText", "linkText", "path", "route", "routes", "icon", "className",
  "variant", "type", "kind", "status", "state", "code", "column", "columns", "header", "headers",
  "shortName", "fullName", "title2", "subtitle", "caption", "tab", "tabs", "menu", "nav",
  "employer", "occupation", "grade", "grades", "band", "step", "stream", "role", "period", "fy",
  "financialYear", "effective", "effectiveFrom", "effectiveDate", "asAt", "verifiedOn", "updated",
  "lastUpdated", "published", "modified", "inForce", "isLaw", "official", "pdf", "file",
]);
const LOCKED_PROP_RE = /^(cta|button|date|meta|og|seo|title|label|heading|href|url|link|slug|source|key)/i;

/** JSX tags whose text content is locked. */
export const LOCKED_TAGS = new Set([
  "h1", "h2", "h3", "h4", "h5", "h6", "a", "Link", "button", "th", "td", "caption", "summary",
  "title", "option", "label", "AccordionTrigger", "Button", "TableHead", "TableCell", "dt",
]);

/** Variable / function names whose contents are locked (metadata and schema). */
const LOCKED_DECL_RE = /(metadata|schema|jsonld|breadcrumb|webapp|howto|faqpage|titlefor|descfor|descriptionfor|title$|^title|description$|^meta|^og|keywords)/i;

/** Calls whose string arguments are prose (data helpers). Everything else locks its args. */
export const PROSE_CALLS = new Set([]);

/** Calls whose string arguments are lookups; their literals are collected repo-wide. */
const LOOKUP_CALL_RE = /^(find|findIndex|filter|some|every|split|replace|replaceAll|startsWith|endsWith|includes|indexOf|lastIndexOf|has|get|set|test|match|matchAll|search|at|findAwardRate|peaRow|getEmployerPay|getRate|lookup|byLabel|byName)$/;

export const WARN_WORDS = [
  "delve", "crucial", "pivotal", "seamless", "seamlessly", "robust", "navigate", "navigating", "landscape",
  "in today's", "whether you're", "additionally", "furthermore", "moreover", "in order to",
  "it is important to note", "it's important to note", "rest assured", "unlock", "empower", "game-changer",
  "game changer", "peace of mind", "tapestry", "testament", "vibrant", "showcase", "underscore",
  "foster", "garner", "leverage", "streamline", "elevate", "comprehensive guide", "let's dive",
  "dive into", "here's what you need to know", "in conclusion", "ever-evolving", "embark",
  "realm", "harness", "boasts", "nestled", "stands as", "serves as a", "it's worth noting",
  "worth noting", "a myriad", "plethora", "hassle-free", "look no further", "unleash",
  // brand-identity.md forbidden words
  "guarantee", "hack", "guru", "synergy", "utilize", "utilise", "best-in-class", "cutting-edge", "revolutionary", "disrupting", "actionable",
];
/** Brand words forbidden "for tax advice": adding one is a warning the reviewer must clear. */
export const WATCH_ADD = ["always", "never", "experts", "studies show", "many people", "most people", "users say"];

export function isTsx(file) { return file.endsWith(".tsx"); }

export function parse(text, file) {
  return ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, isTsx(file) ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
}

/** Parse diagnostics (syntax errors only). */
export function syntaxErrors(sf) {
  return (sf.parseDiagnostics ?? []).map((d) => {
    const { line } = sf.getLineAndCharacterOfPosition(d.start ?? 0);
    return `line ${line + 1}: ${ts.flattenDiagnosticMessageText(d.messageText, "\n")}`;
  });
}

const wordCount = (s) => (s.trim().match(/[A-Za-z][A-Za-z'’]*/g) ?? []).length;

function propName(n) {
  if (!n) return null;
  if (ts.isIdentifier(n) || ts.isStringLiteral(n) || ts.isNumericLiteral(n) || ts.isPrivateIdentifier(n)) return n.text;
  return null;
}

function jsxTagName(el) {
  const opening = ts.isJsxElement(el) ? el.openingElement : el;
  const t = opening.tagName;
  return t.getText();
}

function calleeName(call) {
  const e = call.expression;
  if (ts.isIdentifier(e)) return e.text;
  if (ts.isPropertyAccessExpression(e)) return e.name.text;
  return null;
}

/**
 * Why a string-ish node is locked, or null if it is editable prose.
 * `lookups` is the repo-wide set of literals used in lookups/comparisons/tests.
 */
export function lockReason(node, text, lookups) {
  // Em dashes and spaced en dashes mark official names and lookup keys. A bare
  // en dash inside a range ("7am–11pm", "2025–26") in a long prose string is
  // style debt, not a key: it stays editable (the edit must remove the dash).
  if (/—|\s–|–\s/.test(text) || (/–/.test(text) && wordCount(text) < 6)) return "dash-key";
  if (!text.trim()) return "blank";
  if (wordCount(text) < 4) return "short";
  if (lookups && lookups.has(text.trim())) return "lookup-literal";
  let child = node;
  for (let p = node.parent; p; child = p, p = p.parent) {
    if (ts.isImportDeclaration(p) || ts.isExportDeclaration(p) || ts.isImportTypeNode?.(p)) return "import";
    if (ts.isTypeNode(p) && !ts.isExpressionWithTypeArguments(p)) return "type";
    if (ts.isJsxAttribute(p)) return "jsx-attribute";
    if (ts.isCaseClause(p) && p.expression === child) return "case";
    if (ts.isElementAccessExpression(p) && p.argumentExpression === child) return "element-access";
    if (ts.isBinaryExpression(p) && [ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.EqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsToken, ts.SyntaxKind.InKeyword].includes(p.operatorToken.kind)) return "comparison";
    if (ts.isCallExpression(p) && p.arguments.includes(child)) {
      const name = calleeName(p);
      if (!name || !PROSE_CALLS.has(name)) return `call-arg:${name ?? "?"}`;
    }
    if (ts.isNewExpression(p) && p.arguments?.includes(child)) return "new-arg";
    if (ts.isPropertyAssignment(p)) {
      if (p.name === child) return "property-name";
      const n = propName(p.name);
      if (n && (LOCKED_PROPS.has(n) || LOCKED_PROP_RE.test(n) || n.startsWith("@"))) return `prop:${n}`;
    }
    if (ts.isObjectLiteralExpression(p) && p.properties.some((q) => ts.isPropertyAssignment(q) && propName(q.name)?.startsWith("@"))) return "schema-object";
    if (ts.isJsxElement(p) || ts.isJsxSelfClosingElement(p)) {
      const tag = jsxTagName(p);
      if (LOCKED_TAGS.has(tag)) return `tag:${tag}`;
    }
    if ((ts.isVariableDeclaration(p) || ts.isFunctionDeclaration(p) || ts.isMethodDeclaration(p)) && p.name && ts.isIdentifier(p.name) && LOCKED_DECL_RE.test(p.name.text) && !/^METAL/.test(p.name.text)) return `decl:${p.name.text}`;
    if (ts.isEnumDeclaration(p)) return "enum";
  }
  return null;
}

/** Text of a string-ish node as the reader sees it (template parts joined with a marker). */
function nodeText(n) {
  if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) return n.text;
  if (ts.isTemplateExpression(n)) return n.head.text + n.templateSpans.map((s) => "{…}" + s.literal.text).join("");
  if (ts.isJsxText(n)) return n.text;
  return "";
}

function isStringish(n) {
  return ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isTemplateExpression(n) || ts.isJsxText(n);
}

/**
 * Walk a file. Returns { skeleton, strings } where strings carry
 * { start, end, line, text, raw, locked, reason } in source order.
 *
 * `flags` (optional) forces each string's editable/locked decision by index,
 * so an edited file is judged by the ORIGINAL file's decisions (a prose string
 * that an edit makes short does not silently turn into a locked one).
 */
export function analyse(sf, lookups, flags) {
  const strings = [];
  const out = [];
  let idx = 0;
  const visitAll = (n) => {
    if (isStringish(n)) {
      const text = nodeText(n);
      if (ts.isJsxText(n) && !text.trim()) return; // formatting whitespace
      const i = idx++;
      const reason = flags ? (i < flags.length ? flags[i] : "extra-string") : lockReason(n, text, lookups);
      const { line } = sf.getLineAndCharacterOfPosition(n.getStart(sf));
      strings.push({ i, start: n.getStart(sf), end: n.getEnd(), line: line + 1, text, raw: n.getText(sf), locked: !!reason, reason, kind: ts.SyntaxKind[n.kind] });
      if (reason) out.push(`${ts.SyntaxKind[n.kind]}=${JSON.stringify(text)}`);
      else if (ts.isTemplateExpression(n)) {
        out.push("TPL(");
        for (const s of n.templateSpans) { out.push("${"); visitAll(s.expression); out.push("}"); }
        out.push(")");
      } else out.push(ts.isJsxText(n) ? "JSXTEXT" : "STR");
      return;
    }
    const kids = n.getChildren(sf);
    if (!kids.length) { out.push(n.getText(sf)); return; }
    out.push(`<${ts.SyntaxKind[n.kind]}`);
    for (const k of kids) {
      if (k.kind === ts.SyntaxKind.SyntaxList) { for (const kk of k.getChildren(sf)) visitAll(kk); }
      else visitAll(k);
    }
    out.push(">");
  };
  visitAll(sf);
  return { skeleton: out, strings };
}

/** Literals used as lookups anywhere in the code (calls, comparisons, cases) plus every test literal. */
let LOOKUPS = null;
let TEST_LITERALS = null;
function* walkFiles(dir) {
  for (const d of readdirSync(dir)) {
    if (d === "node_modules" || d.startsWith(".") || d === "out") continue;
    const p = join(dir, d);
    const st = statSync(p);
    if (st.isDirectory()) yield* walkFiles(p);
    else if (/\.(ts|tsx|mts|mjs)$/.test(d)) yield p;
  }
}
export function loadLookups() {
  if (LOOKUPS) return { lookups: LOOKUPS, testLiterals: TEST_LITERALS };
  LOOKUPS = new Set();
  TEST_LITERALS = new Set();
  for (const dir of ["app", "modules", "lib", "components", "scripts"]) {
    for (const f of walkFiles(join(ROOT, dir))) {
      if (f.includes("/scripts/authorship/")) continue;
      const text = readFileSync(f, "utf8");
      const sf = ts.createSourceFile(f, text, ts.ScriptTarget.Latest, true, f.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
      const isTest = /__tests__|\.test\./.test(f) || f.includes("/scripts/");
      const v = (n) => {
        if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) {
          const t = n.text.trim();
          if (isTest) { if (t.length >= 6) TEST_LITERALS.add(n.text); }
          else {
            const p = n.parent;
            const lookup =
              (ts.isCallExpression(p) && p.arguments.includes(n) && LOOKUP_CALL_RE.test(calleeName(p) ?? "")) ||
              (ts.isBinaryExpression(p) && /Equals/.test(ts.SyntaxKind[p.operatorToken.kind])) ||
              (ts.isCaseClause(p) && p.expression === n);
            if (lookup && t.length >= 3) LOOKUPS.add(t);
          }
        }
        if (isTest && ts.isRegularExpressionLiteral(n)) {
          const src = n.text.replace(/^\/|\/[a-z]*$/g, "");
          const plain = src.replace(/\\(.)/g, "$1");
          if (/^[\w\s$,.%'’()–—-]{6,}$/.test(plain)) TEST_LITERALS.add(plain);
        }
        n.forEachChild(v);
      };
      v(sf);
    }
  }
  return { lookups: LOOKUPS, testLiterals: TEST_LITERALS };
}

export const rel = (f) => relative(ROOT, f);

/** Numbers in prose, normalised ("1,234.50" -> "1234.50"). */
export function numbersIn(s) { return (s.match(/\d[\d,]*(?:\.\d+)?/g) ?? []).map((x) => x.replace(/,(?=\d{3}\b)/g, "")); }
/** Links in prose: absolute URLs and site paths. */
export function linksIn(s) { return [...(s.match(/https?:\/\/[^\s)"'<>]+/g) ?? []), ...(s.match(/(?<![\w.])\/[a-z0-9][a-z0-9-]*(?:\/[a-z0-9-]+)*\//g) ?? [])]; }

export function multisetDiff(a, b) {
  const m = new Map();
  for (const x of a) m.set(x, (m.get(x) ?? 0) + 1);
  for (const x of b) m.set(x, (m.get(x) ?? 0) - 1);
  const removed = [], added = [];
  for (const [k, v] of m) { if (v > 0) removed.push(`${k}${v > 1 ? ` x${v}` : ""}`); if (v < 0) added.push(`${k}${v < -1 ? ` x${-v}` : ""}`); }
  return { removed, added };
}

export function countWord(s, w, stem = false) {
  const re = new RegExp(`(?<![A-Za-z])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/'/g, "['’]")}${stem ? "[a-z]*" : ""}(?![A-Za-z])`, "gi");
  return (s.match(re) ?? []).length;
}

export const US_SPELLING = /\b(?!(?:size|sizes|sized|prize|prizes|seize|seized|citizen|citizens|capsize)\b)[a-z]{3,}iz(?:e|es|ed|ing|ation|ations)\b|\b(?:color|colors|favor|favors|favorite|behavior|behaviors|center|centers|labor(?!\s+(?:party|government))|analyze|analyzed|catalog|license\s+(?:is|was))\b/gi;
