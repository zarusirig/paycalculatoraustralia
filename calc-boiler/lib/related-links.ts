/**
 * "What's next" internal linking.
 *
 * Every href here is checked against a real route in `app/` — no dynamic
 * segments ([salary], [rate], [slug]) and no invented paths.
 *
 * Why this exists: the site earns per ad impression, and impressions scale with
 * pages per session, not with traffic. Moving a visitor from one page to two
 * roughly doubles the inventory shown to them at zero acquisition cost — and it
 * simultaneously flips a single-page session to "engaged" in GA4. It is the one
 * lever where the ad revenue goal and the engagement goal point the same way.
 */

export type RelatedLink = {
  href: string;
  title: string;
  blurb: string;
};

/** Shown when a page has no cluster of its own. Broadest-appeal destinations. */
const DEFAULT_LINKS: RelatedLink[] = [
  { href: "/take-home-pay-calculator/", title: "Take-Home Pay Calculator", blurb: "See your actual pay after tax, super and Medicare." },
  { href: "/income-tax-calculator/", title: "Income Tax Calculator", blurb: "Work out your tax for the current financial year." },
  { href: "/tax-brackets/", title: "Tax Brackets", blurb: "Current ATO rates and thresholds explained." },
];

const TAKE_HOME: RelatedLink = { href: "/take-home-pay-calculator/", title: "Take-Home Pay Calculator", blurb: "See your actual pay after tax, super and Medicare." };
const INCOME_TAX: RelatedLink = { href: "/income-tax-calculator/", title: "Income Tax Calculator", blurb: "Work out your tax for the current financial year." };
const TAX_BRACKETS: RelatedLink = { href: "/tax-brackets/", title: "Tax Brackets", blurb: "Current ATO rates and thresholds explained." };
const SUPER_CALC: RelatedLink = { href: "/superannuation-calculator/", title: "Superannuation Calculator", blurb: "Check your employer is paying the right super." };
const HECS_CALC: RelatedLink = { href: "/hecs-help-calculator/", title: "HECS-HELP Calculator", blurb: "Estimate your compulsory repayment this year." };
const AWARD_RATES: RelatedLink = { href: "/award-rates/", title: "Award Pay Rates", blurb: "Minimum rates for the awards that cover most workers." };
const PAYSLIP: RelatedLink = { href: "/understanding-your-payslip/", title: "Understanding Your Payslip", blurb: "Decode every line on your payslip." };
const OVERTIME: RelatedLink = { href: "/overtime-pay-calculator/", title: "Overtime Pay Calculator", blurb: "Penalty rates and overtime, worked out for you." };

/**
 * Wider pool used to top up a page that filtered itself out of its own cluster.
 * Ordered by breadth of appeal — the first entries suit almost any visitor.
 */
const TOP_UP_POOL: RelatedLink[] = [
  TAKE_HOME,
  INCOME_TAX,
  TAX_BRACKETS,
  PAYSLIP,
  SUPER_CALC,
  { href: "/pay-rise-calculator/", title: "Pay Rise Calculator", blurb: "What a raise actually adds to each pay." },
  { href: "/tax-return-calculator/", title: "Tax Return Calculator", blurb: "Estimate your refund before you lodge." },
  { href: "/salary-sacrifice-calculator/", title: "Salary Sacrifice Calculator", blurb: "See if sacrificing into super leaves you better off." },
  HECS_CALC,
  { href: "/site-directory/", title: "All Calculators", blurb: "Every calculator and guide on the site." },
];

/**
 * Cluster rules, evaluated in order. First match wins, so put narrow patterns
 * above broad ones.
 */
const CLUSTERS: { match: (p: string) => boolean; links: RelatedLink[] }[] = [
  // --- Junior / first job / award rates ---
  {
    match: (p) => ["/junior-pay-rates/", "/first-job-pay-guide/", "/new-job-checklist/"].includes(p),
    links: [
      AWARD_RATES,
      { href: "/retail-award-rates/", title: "Retail Award Rates", blurb: "The award covering most junior retail workers." },
      { href: "/hospitality-award-rates/", title: "Hospitality Award Rates", blurb: "Cafe, pub and restaurant minimum rates." },
      PAYSLIP,
    ],
  },
  // --- Award rate pages ---
  {
    match: (p) => p.endsWith("-award-rates/") || p === "/award-rates/" || p === "/schads-award-pay-rates/",
    links: [
      { href: "/junior-pay-rates/", title: "Junior Pay Rates", blurb: "What under-21s must legally be paid." },
      OVERTIME,
      { href: "/overtime-penalty-rates-guide/", title: "Penalty Rates Guide", blurb: "Weekends, public holidays and late nights." },
      TAKE_HOME,
    ],
  },
  // --- Superannuation ---
  {
    match: (p) => p.includes("super") || p === "/division-293-tax/",
    links: [
      SUPER_CALC,
      { href: "/salary-sacrifice-calculator/", title: "Salary Sacrifice Calculator", blurb: "See if sacrificing into super leaves you better off." },
      { href: "/super-guarantee-rate-history/", title: "Super Guarantee Rate History", blurb: "Every SG rate change, year by year." },
      TAKE_HOME,
    ],
  },
  // --- Bonuses, commissions and other additional payments (Schedule 5) ---
  {
    match: (p) => p.includes("bonus") || p.includes("commission") || p === "/schedule-5-tax-table/" || p === "/backpay-calculator/",
    links: [
      { href: "/bonus-tax-calculator/", title: "Bonus Tax Calculator", blurb: "Tax on a bonus at your marginal rate." },
      { href: "/commission-tax-calculator/", title: "Commission Tax Calculator", blurb: "Annual tax on commission and what is withheld from the pay." },
      { href: "/schedule-5-tax-table/", title: "Schedule 5 Tax Table", blurb: "ATO withholding on bonuses, commissions and back pay." },
      { href: "/pay-rise-calculator/", title: "Pay Rise Calculator", blurb: "What a permanent increase is worth after tax." },
      TAKE_HOME,
    ],
  },
  // --- HECS / student debt ---
  {
    match: (p) => p.includes("hecs") || p === "/stsl-on-payslip/",
    links: [
      HECS_CALC,
      { href: "/extra-super-vs-hecs-repayment/", title: "Extra Super vs HECS", blurb: "Which is the better use of a spare dollar?" },
      TAKE_HOME,
    ],
  },
  // --- State pay calculators ---
  {
    match: (p) => p.startsWith("/pay-calculator-"),
    links: [TAKE_HOME, INCOME_TAX, AWARD_RATES, { href: "/site-directory/", title: "All Calculators", blurb: "Every calculator and guide on the site." }],
  },
  // --- Tax tables / withholding ---
  {
    match: (p) => p.endsWith("-tax-table/") || p === "/payg-withholding-tables/",
    links: [
      TAKE_HOME,
      { href: "/weekly-tax-table/", title: "Weekly Tax Table", blurb: "PAYG withholding for weekly pay cycles." },
      { href: "/fortnightly-tax-table/", title: "Fortnightly Tax Table", blurb: "PAYG withholding for fortnightly pay cycles." },
      PAYSLIP,
    ],
  },
  // --- Leave, redundancy, final pay ---
  {
    match: (p) => ["/annual-leave-guide/", "/leave-calculator/", "/redundancy-pay-calculator/", "/final-pay-calculator/", "/parental-leave-pay/"].includes(p),
    links: [
      { href: "/leave-calculator/", title: "Leave Calculator", blurb: "Annual and personal leave balances." },
      { href: "/final-pay-calculator/", title: "Final Pay Calculator", blurb: "What you're owed when employment ends." },
      { href: "/redundancy-pay-calculator/", title: "Redundancy Pay Calculator", blurb: "Severance entitlements by years of service." },
      TAKE_HOME,
    ],
  },
  // --- Contractor / employment type ---
  {
    match: (p) => p.includes("contractor") || p.includes("employment-type") || p === "/employee-vs-sole-trader-vs-company/" || p === "/full-time-vs-part-time-vs-casual/" || p === "/salary-vs-hourly/" || p === "/gig-economy-pay-guide/",
    links: [
      { href: "/contractor-pay-calculator/", title: "Contractor Pay Calculator", blurb: "Convert a contract rate to real take-home." },
      { href: "/contractor-vs-employee-calculator/", title: "Contractor vs Employee", blurb: "Compare both sides on the same income." },
      { href: "/employer-cost-calculator/", title: "Employer Cost Calculator", blurb: "The full cost of employing someone." },
      TAKE_HOME,
    ],
  },
  // --- Tax guides / deductions / returns ---
  {
    match: (p) => p.includes("tax-refund") || p.includes("deduction") || p === "/tax-return-calculator/" || p === "/notice-of-assessment/" || p === "/work-from-home-deductions/" || p === "/tax-calendar/",
    links: [
      { href: "/tax-return-calculator/", title: "Tax Return Calculator", blurb: "Estimate your refund before you lodge." },
      { href: "/tax-deductions-guide/", title: "Tax Deductions Guide", blurb: "What you can actually claim." },
      INCOME_TAX,
      TAX_BRACKETS,
    ],
  },
  // --- Pay frequency calculators ---
  {
    match: (p) => ["/weekly-pay-calculator/", "/fortnightly-pay-calculator/", "/monthly-pay-calculator/", "/annual-pay-calculator/", "/gross-pay-calculator/", "/hourly-to-salary/", "/hourly-to-annual-salary-calculator/", "/ytd-income-calculator/", "/work-hours-calculator/"].includes(p),
    links: [TAKE_HOME, INCOME_TAX, OVERTIME, PAYSLIP],
  },
  // --- Occupation / salary guides ---
  {
    match: (p) => ["/teacher-pay-australia/", "/healthcare-worker-pay/", "/construction-trades-pay/", "/mining-fifo-pay-guide/", "/tech-salary-guide-australia/", "/retail-hospitality-pay-guide/", "/average-salary-australia/"].includes(p),
    links: [TAKE_HOME, { href: "/pay-rise-calculator/", title: "Pay Rise Calculator", blurb: "What a raise actually adds to each pay." }, AWARD_RATES, INCOME_TAX],
  },
];

export function getRelatedLinks(pathname: string): RelatedLink[] {
  // Normalise to a trailing slash so `/tax-brackets` and `/tax-brackets/` match.
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;

  const cluster = CLUSTERS.find((c) => c.match(path));
  const links = cluster ? cluster.links : DEFAULT_LINKS;

  // Never link a page to itself.
  const filtered = links.filter((l) => l.href !== path);

  // Top up if self-filtering left us short. This draws from a wider pool than
  // DEFAULT_LINKS on purpose: a page that IS one of the defaults would
  // otherwise filter itself out and have nothing left to top up with.
  if (filtered.length < 3) {
    for (const fallback of TOP_UP_POOL) {
      if (filtered.length >= 4) break;
      if (fallback.href !== path && !filtered.some((l) => l.href === fallback.href)) {
        filtered.push(fallback);
      }
    }
  }

  return filtered.slice(0, 4);
}
