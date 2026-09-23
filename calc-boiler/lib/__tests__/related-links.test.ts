// =============================================================================
// "What to check next" related links — every card must point at a page that
// is actually prerendered, never at the page itself, and never twice.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { getRelatedLinks } from "../related-links";
import { hasPage } from "../data/salary-pages";

const APP = path.join(process.cwd(), "app");
const STATES = ["nsw", "vic", "qld", "wa", "sa", "tas", "act", "nt"];

/** True when `href` is a route the static export actually emits. */
function routeExists(href: string): boolean {
  const segs = href.split("/").filter(Boolean);
  if (fs.existsSync(path.join(APP, ...segs, "page.tsx"))) return true;
  if (segs.length !== 2) return false;
  const [family, slug] = segs;
  switch (family) {
    case "job-pay-rates":
      return fs.existsSync(path.join(process.cwd(), "lib/data/job-pay-rates", `${slug}.ts`));
    case "pay-rates":
      return fs.existsSync(path.join(process.cwd(), "lib/data/employer-pay", `${slug}.ts`));
    case "payroll-tax":
    case "long-service-leave-calculator":
    case "teacher-pay-australia":
      return STATES.includes(slug);
    case "minimum-wage-by-age":
      return /^(1[4-9]|20)$/.test(slug);
    case "take-home-pay-on":
      return hasPage("take-home", Number(slug));
    case "tax-on":
      return hasPage("tax-on", Number(slug));
    case "salary-to-hourly":
      return hasPage("salary-to-hourly", Number(slug));
    case "news":
      return fs.existsSync(path.join(process.cwd(), "modules/news/articles", `${slug}.tsx`));
    default:
      return false;
  }
}

/** Every static route in app/ plus a sample of each dynamic family. */
function samplePaths(): string[] {
  const out: string[] = [];
  const walk = (dir: string, rel: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!e.isDirectory() || e.name.startsWith("[") || e.name.startsWith("_")) continue;
      const r = `${rel}${e.name}/`;
      if (fs.existsSync(path.join(dir, e.name, "page.tsx"))) out.push(r);
      walk(path.join(dir, e.name), r);
    }
  };
  walk(APP, "/");
  out.push("/");
  for (const s of STATES) out.push(`/payroll-tax/${s}/`, `/long-service-leave-calculator/${s}/`, `/pay-calculator-${s}/`);
  for (const a of [14, 15, 16, 17, 18, 19, 20]) out.push(`/minimum-wage-by-age/${a}/`);
  for (const f of fs.readdirSync(path.join(process.cwd(), "lib/data/job-pay-rates"))) {
    if (/^[a-z-]+\.ts$/.test(f) && !/(common|index|types|sectors)/.test(f)) out.push(`/job-pay-rates/${f.replace(/\.ts$/, "")}/`);
  }
  for (const f of fs.readdirSync(path.join(process.cwd(), "lib/data/employer-pay"))) {
    if (/^[a-z-]+\.ts$/.test(f) && !/(index|types)/.test(f)) out.push(`/pay-rates/${f.replace(/\.ts$/, "")}/`);
  }
  out.push("/take-home-pay-on/45000/", "/take-home-pay-on/85000/", "/take-home-pay-on/150000/", "/tax-on/40000/", "/tax-on/120000/", "/salary-to-hourly/60000/", "/hourly-to-salary/30/", "/news/deeming-rates-change-2026/");
  return out;
}

test("every related link resolves to a prerendered route", () => {
  const bad: string[] = [];
  for (const p of samplePaths()) {
    for (const l of getRelatedLinks(p)) {
      if (!routeExists(l.href)) bad.push(`${p} -> ${l.href}`);
    }
  }
  assert.deepEqual(bad, []);
});

test("no self links, no duplicates, 3 to 6 cards, never an odd count above 4", () => {
  for (const p of samplePaths()) {
    const links = getRelatedLinks(p);
    const hrefs = links.map((l) => l.href);
    assert.ok(!hrefs.includes(p), `${p} links to itself`);
    assert.equal(new Set(hrefs).size, hrefs.length, `${p} repeats a destination`);
    assert.ok(links.length >= 3 && links.length <= 6, `${p} has ${links.length} cards`);
    assert.ok(links.length <= 4 || links.length % 2 === 0, `${p} has an odd ${links.length} cards`);
  }
});

test("award, job and employer pages cross-link", () => {
  const hrefs = (p: string) => getRelatedLinks(p).map((l) => l.href);
  assert.ok(hrefs("/retail-award-rates/").includes("/job-pay-rates/retail-worker/"));
  assert.ok(hrefs("/retail-award-rates/").includes("/pay-rates/coles/"));
  assert.ok(hrefs("/job-pay-rates/retail-worker/").includes("/pay-rates/coles/"));
  assert.ok(hrefs("/pay-rates/mcdonalds/").includes("/fast-food-award-rates/"));
  assert.ok(hrefs("/pay-rates/coles/").includes("/job-pay-rates/retail-worker/"));
  assert.ok(hrefs("/minimum-wage-by-age/15/").includes("/pay-rates/mcdonalds/"));
});

test("salary tables point at the tax-core page for their income", () => {
  const hrefs = (p: string) => getRelatedLinks(p).map((l) => l.href);
  assert.ok(hrefs("/take-home-pay-on/45000/").includes("/low-income-tax-offset/"));
  assert.ok(hrefs("/take-home-pay-on/85000/").includes("/tax-free-threshold/"));
  assert.ok(hrefs("/tax-on/120000/").includes("/medicare-levy-surcharge-calculator/"));
});

test("state pay pages link that state's payroll tax and long service leave pages", () => {
  const hrefs = getRelatedLinks("/pay-calculator-qld/").map((l) => l.href);
  assert.ok(hrefs.includes("/payroll-tax/qld/"));
  assert.ok(hrefs.includes("/long-service-leave-calculator/qld/"));
});
