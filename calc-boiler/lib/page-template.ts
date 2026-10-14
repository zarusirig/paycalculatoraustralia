/**
 * Page template per URL — the semantic <body> class Mediavine targets ads with.
 *
 * The markup is all Tailwind utilities, so Mediavine (Oct 2026) asked for one
 * semantic class on <body> per page layout: `home`, `calculator`, `pay-rates`,
 * ... They scope every ad selector to it (`body.guide article`,
 * `body.pay-rates .mv-sidebar`), which is what makes in-content and sidebar
 * targeting stable across 700 pages that otherwise all look alike to a CSS
 * selector.
 *
 * Why URL rules and not the page itself: the App Router renders <body> in the
 * root layout, which cannot see which page it is wrapping (static export, no
 * request). So the class is derived from the pathname, in two places that both
 * read TEMPLATE_RULES:
 *   1. the inline script from bodyClassScript(), first child of <body>, which
 *      runs synchronously while the page parses — so Mediavine's async <head>
 *      script finds the class without waiting for React to hydrate;
 *   2. <BodyTemplateClass/> (components/common/body-template-class.tsx) on
 *      every client-side navigation, when the root layout's <body> persists.
 * lib/__tests__/page-template.test.ts checks both against every app/**\/page.tsx
 * and the module (layout) it imports.
 *
 * Templates follow the DOM, not the URL words. Mediavine writes one in-content
 * selector per class, so a page built on the guide layout (article + .mv-sidebar)
 * is `guide` even when its URL ends in -calculator/; the `calculator` class is
 * reserved for the calculator layout (hero widget + full-width sections, no
 * sidebar). `pay-rates`, `pay-scales` and `guide` share the guide layout and
 * differ only so Mediavine can tune density per section.
 */
export const PAGE_TEMPLATES = [
  "home",
  "calculator",
  "pay-rates",
  "pay-scales",
  "salary-tables",
  "tax-tables",
  "news",
  "guide",
  "utility",
] as const;

export type PageTemplate = (typeof PAGE_TEMPLATES)[number];

type MatchKind = "x" | "p" | "s"; // exact | prefix | suffix

/**
 * First match wins; no match is `guide`. Kept as plain data (no functions) so
 * bodyClassScript() can serialise it into the inline script unchanged.
 */
export const TEMPLATE_RULES: ReadonlyArray<readonly [PageTemplate, MatchKind, string]> = [
  ["home", "x", "/"],

  // Site chrome and embeds. Listed so Mediavine can keep ads off them.
  ["utility", "x", "/about/"],
  ["utility", "x", "/contact/"],
  ["utility", "x", "/privacy/"],
  ["utility", "x", "/terms/"],
  ["utility", "x", "/disclaimer/"],
  ["utility", "x", "/site-directory/"],
  ["utility", "p", "/embed/"],

  ["news", "p", "/news/"],

  // modules/programmatic: one salary per page, centred column, no sidebar.
  ["salary-tables", "p", "/tax-on/"],
  ["salary-tables", "p", "/take-home-pay-on/"],
  ["salary-tables", "p", "/salary-to-hourly/"],
  ["salary-tables", "p", "/hourly-to-salary/"],

  // modules/tax-tables: PAYG withholding tables, article + sidebar.
  ["tax-tables", "p", "/weekly-tax-table/"],
  ["tax-tables", "p", "/fortnightly-tax-table/"],
  ["tax-tables", "p", "/monthly-tax-table/"],
  ["tax-tables", "x", "/schedule-5-tax-table/"],
  ["tax-tables", "x", "/payg-withholding-tables/"],

  // URLs that end in -calculator/ but are built on the guide layout
  // (article + sidebar). Must come before the `-calculator/` suffix rule.
  ["guide", "x", "/annual-leave-calculator/"],
  ["guide", "x", "/capital-gains-tax-calculator/"],
  ["guide", "x", "/carry-forward-concessional-contributions-calculator/"],
  ["guide", "x", "/casual-loading-calculator/"],
  ["guide", "x", "/centrelink-working-credit-calculator/"],
  ["guide", "x", "/employer-cost-calculator/"],
  ["guide", "x", "/fifo-pay-calculator/"],
  ["guide", "x", "/leave-loading-calculator/"],
  ["guide", "x", "/listo-calculator/"],
  ["guide", "x", "/medicare-levy-surcharge-calculator/"],
  ["guide", "x", "/net-pay-calculator/"],
  ["guide", "x", "/payroll-tax-calculator/"],
  ["guide", "x", "/pro-rata-salary-calculator/"],
  ["guide", "x", "/sapto-calculator/"],
  ["guide", "x", "/sick-leave-calculator/"],
  ["guide", "x", "/tax-withheld-calculator/"],
  ["guide", "x", "/termination-payment-tax-calculator/"],
  ["guide", "x", "/work-hours-calculator/"],
  ["pay-rates", "x", "/fair-work-pay-calculator/"],

  // modules/calculator and modules/state: calculator layout.
  ["calculator", "s", "-calculator/"],
  ["calculator", "p", "/long-service-leave-calculator/"],
  ["calculator", "p", "/pay-calculator-"],
  ["calculator", "x", "/carer-allowance/"],
  ["calculator", "x", "/centrelink-advance-payment/"],
  ["calculator", "x", "/centrelink-crisis-payment/"],
  ["calculator", "x", "/centrelink-debt/"],
  ["calculator", "x", "/commonwealth-seniors-health-card/"],
  ["calculator", "x", "/cost-of-living-payment-2026/"],
  ["calculator", "x", "/deeming-rates/"],
  ["calculator", "x", "/parental-leave-pay/"],
  ["calculator", "x", "/payslip-generator/"],

  // Pay rates: awards, minimum and junior wages, by job, by employer, holidays.
  ["pay-rates", "s", "-award-rates/"],
  ["pay-rates", "x", "/award-rates/"],
  ["pay-rates", "s", "-pay-rates/"],
  ["pay-rates", "p", "/pay-rates/"],
  ["pay-rates", "p", "/job-pay-rates/"],
  ["pay-rates", "p", "/minimum-wage"],
  ["pay-rates", "p", "/apprentice-pay"],
  ["pay-rates", "p", "/public-holiday-pay/"],
  ["pay-rates", "s", "-public-holiday-pay/"],
  ["pay-rates", "x", "/public-holidays-2027/"],
  ["pay-rates", "x", "/melbourne-cup-day-pay/"],
  ["pay-rates", "x", "/delivery-driver-pay-rate/"],
  ["pay-rates", "x", "/overtime-penalty-rates-guide/"],

  // Pay scales: public sector and occupation salary pages.
  ["pay-scales", "p", "/public-service-pay-scales/"],
  ["pay-scales", "p", "/teacher-pay-australia/"],
  ["pay-scales", "p", "/school-support-staff-pay/"],
  ["pay-scales", "p", "/healthcare-worker-pay/"],
  ["pay-scales", "p", "/adf-pay-scales/"],
  ["pay-scales", "p", "/paramedic-pay/"],
  ["pay-scales", "p", "/police-pay/"],
  ["pay-scales", "p", "/firefighter-pay/"],
  ["pay-scales", "p", "/prison-officer-pay/"],
  ["guide", "x", "/ote-salary/"], // a definition, not a salary page
  ["pay-scales", "s", "-salary/"],
];

const DEFAULT_TEMPLATE: PageTemplate = "guide";

function normalise(pathname: string): string {
  const p = pathname || "/";
  return p.endsWith("/") ? p : `${p}/`;
}

export function templateFor(pathname: string): PageTemplate {
  const p = normalise(pathname);
  for (const [template, kind, s] of TEMPLATE_RULES) {
    const hit = kind === "x" ? p === s : kind === "p" ? p.startsWith(s) : p.endsWith(s);
    if (hit) return template;
  }
  return DEFAULT_TEMPLATE;
}

/**
 * The inline script for the first child of <body>. ES5 on purpose; it must run
 * in every browser Mediavine bids on. Same matching as templateFor() — the test
 * runs this string against every route and compares.
 */
export function bodyClassScript(): string {
  return (
    "(function(){" +
    'var p=location.pathname||"/";if(p.slice(-1)!=="/")p+="/";' +
    `var r=${JSON.stringify(TEMPLATE_RULES)},t="${DEFAULT_TEMPLATE}";` +
    "for(var i=0;i<r.length;i++){var k=r[i][1],s=r[i][2];" +
    'if(k==="x"?p===s:k==="p"?p.indexOf(s)===0:p.slice(-s.length)===s){t=r[i][0];break}}' +
    "document.body.classList.add(t)})()"
  );
}
