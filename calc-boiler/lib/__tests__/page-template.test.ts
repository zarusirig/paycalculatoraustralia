// =============================================================================
// Mediavine <body> template class — lib/page-template.ts.
//
// Run with: npm test
//
// Every app/**/page.tsx is classified two ways and the two must agree:
//   1. templateFor(route), the URL rules Mediavine's targeting is built on;
//   2. the layout family the page actually renders, read from which
//      modules/* folder its page.tsx imports (calculator vs guide vs ...).
// A new page that lands in the wrong family (say a calculator-layout page
// whose URL does not end in -calculator/) fails here, before Mediavine's
// in-content selector silently misses it in production.
//
// The inline <body> script is also run against every route and must give the
// same answer as templateFor(), since it is a hand-written ES5 copy of it.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { PAGE_TEMPLATES, TEMPLATE_RULES, bodyClassScript, templateFor, type PageTemplate } from "../page-template";

const ROOT = process.cwd();
const APP = path.join(ROOT, "app");

const ARTICLE_FAMILY: ReadonlySet<PageTemplate> = new Set(["guide", "pay-rates", "pay-scales", "tax-tables"]);

/** Sample slugs so dynamic routes become real-looking URLs. */
const SAMPLE_SLUG: Record<string, string> = {
  "[state]": "nsw",
  "[fy]": "2025-26",
  "[salary]": "80000",
  "[amount]": "80000",
  "[rate]": "35",
  "[age]": "17",
  "[trade]": "electrician",
  "[employer]": "coles",
  "[occupation]": "nurse",
  "[service]": "army",
  "[jurisdiction]": "aps",
  "[grade]": "aps-6",
  "[slug]": "sample-story",
};

type Page = { route: string; modules: string[] };

function listPages(dir: string, out: Page[] = []): Page[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listPages(full, out);
    } else if (entry.name === "page.tsx") {
      const rel = path.relative(APP, path.dirname(full));
      const route =
        rel === ""
          ? "/"
          : "/" +
            rel
              .split(path.sep)
              .map((seg) => SAMPLE_SLUG[seg] ?? seg.replace(/^\[.*\]$/, "sample"))
              .join("/") +
            "/";
      const src = fs.readFileSync(full, "utf8");
      const modules = [...src.matchAll(/from "@\/modules\/([a-z-]+)/g)].map((m) => m[1]).filter((m) => m !== "seo");
      out.push({ route, modules: [...new Set(modules)] });
    }
  }
  return out;
}

/** Layout family a page must land in, from the module folder(s) it renders. */
function expectedFamily(page: Page): ReadonlySet<PageTemplate> {
  const { route, modules } = page;
  if (route === "/") return new Set(["home"]);
  if (route.startsWith("/embed/") || modules.length === 0) return new Set(["utility"]);
  if (modules.includes("news")) return new Set(["news"]);
  if (modules.includes("programmatic")) return new Set([route === "/site-directory/" ? "utility" : "salary-tables"]);
  if (modules.includes("calculator") || modules.includes("state")) return new Set(["calculator"]);
  if (modules.includes("tax-tables")) return new Set(["tax-tables"]);
  // guide, guides, payroll-tax: article + sidebar layout.
  return ARTICLE_FAMILY;
}

const pages = listPages(APP);

test("every app route is classified into the layout family it renders", () => {
  assert.ok(pages.length > 200, `expected the full app tree, found ${pages.length} pages`);
  const wrong: string[] = [];
  for (const page of pages) {
    const got = templateFor(page.route);
    const allowed = expectedFamily(page);
    if (!allowed.has(got)) wrong.push(`${page.route} → ${got} (modules: ${page.modules.join(",") || "none"}; allowed: ${[...allowed].join("|")})`);
  }
  assert.deepEqual(wrong, []);
});

test("the inline <body> script agrees with templateFor() on every route", () => {
  const script = bodyClassScript();
  const run = (pathname: string): string => {
    let added = "";
    const document = { body: { classList: { add: (c: string) => (added = c) } } };
    new Function("location", "document", script)({ pathname }, document);
    return added;
  };
  for (const page of pages) assert.equal(run(page.route), templateFor(page.route), page.route);
  // Edge cases the rules must survive.
  assert.equal(run("/"), "home");
  assert.equal(run("/tax-on/80000"), "salary-tables"); // no trailing slash
  assert.equal(run("/does-not-exist/"), "guide");
});

test("rules only use known templates and both calculator layouts stay apart", () => {
  for (const [template] of TEMPLATE_RULES) assert.ok(PAGE_TEMPLATES.includes(template), template);
  // Guide-layout pages that end in -calculator/ must not be classed calculator.
  assert.equal(templateFor("/annual-leave-calculator/"), "guide");
  assert.equal(templateFor("/payroll-tax-calculator/"), "guide");
  assert.equal(templateFor("/fair-work-pay-calculator/"), "pay-rates");
  // Calculator-layout pages that do not end in -calculator/.
  assert.equal(templateFor("/long-service-leave-calculator/vic/"), "calculator");
  assert.equal(templateFor("/pay-calculator-nsw/"), "calculator");
  assert.equal(templateFor("/deeming-rates/"), "calculator");
  // Section split inside the guide layout.
  assert.equal(templateFor("/pay-rates/coles/"), "pay-rates");
  assert.equal(templateFor("/job-pay-rates/nurse/"), "pay-rates");
  assert.equal(templateFor("/minimum-wage-by-age/17/"), "pay-rates");
  assert.equal(templateFor("/public-service-pay-scales/aps/el1/"), "pay-scales");
  assert.equal(templateFor("/pilot-salary/"), "pay-scales");
  assert.equal(templateFor("/ote-salary/"), "guide");
  assert.equal(templateFor("/weekly-tax-table/2025-26/"), "tax-tables");
  assert.equal(templateFor("/news/some-story/"), "news");
  assert.equal(templateFor("/privacy/"), "utility");
});
