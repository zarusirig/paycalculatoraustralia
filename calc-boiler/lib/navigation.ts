export type NavigationItem = {
  href: string;
  label: string;
  hasMegaMenu?: boolean;
};

export type NavigationLogo = {
  href: string;
  label: string;
};

export const navigationLogo: NavigationLogo = {
  href: "/",
  label: "Pay Calculator Australia",
};

// =====================================================================
// MAIN MENU + FOOTER (Sep 2026 IA rebuild)
//
// The header and footer are server-rendered from the data below, so every
// link here is in the static HTML of every page (the old framer-motion mega
// menu only mounted its links after a click). This file stays import-free:
// scripts/check-nav-links.mjs loads it directly with Node to assert every
// href is a built route.
//
// Curation rule: hubs + the 5–8 most-visited leaves per group (GSC 28 days to
// 23 Sep 2026, docs/seo/data/2026-09-23-dataforseo/gsc-pages-28d.csv). Every
// leaf is still reachable from its hub and from /site-directory/, so a page
// leaving the menu is not orphaned. To add a page, put it in the group whose
// hub links to it; do not add a sixth top-level menu.
// =====================================================================

export type MenuLink = {
  href: string;
  label: string;
  /** One line under the label in the desktop "Start here" rail. */
  description?: string;
};

export type MenuGroup = {
  title: string;
  /** The group's hub. The heading links here and "All …" repeats it. */
  href?: string;
  links: readonly MenuLink[];
};

export type StateRow = {
  code: string;
  name: string;
  /** Per-topic state page, or undefined where no page exists for that state. */
  cells: Partial<Record<StateTopicKey, string>>;
};

export type StateTopicKey = "pay" | "payrollTax" | "lsl" | "teachers" | "nurses" | "publicService";

export type MegaMenu = {
  id: string;
  label: string;
  /** Short line at the top of the panel's rail, and on mobile. */
  intro: string;
  /** Hubs shown in the "Start here" rail. */
  featured: readonly MenuLink[];
  groups: readonly MenuGroup[];
  /** Only the By state menu: rendered as a state × topic grid on desktop. */
  stateGrid?: { topics: readonly { key: StateTopicKey; label: string; hub: string }[]; rows: readonly StateRow[] };
};

const tho = (n: number) => ({ href: `/take-home-pay-on/${n}/`, label: `Take-home on $${(n / 1000).toFixed(0)}k` });
const taxOn = (n: number) => ({ href: `/tax-on/${n}/`, label: `Tax on $${(n / 1000).toFixed(0)}k` });
const s2h = (n: number) => ({ href: `/salary-to-hourly/${n}/`, label: `$${(n / 1000).toFixed(0)}k a year hourly` });
const h2s = (n: number) => ({ href: `/hourly-to-salary/${n}/`, label: `$${n} an hour yearly` });

const STATES = [
  ["nsw", "NSW", "New South Wales"],
  ["vic", "VIC", "Victoria"],
  ["qld", "QLD", "Queensland"],
  ["wa", "WA", "Western Australia"],
  ["sa", "SA", "South Australia"],
  ["tas", "TAS", "Tasmania"],
  ["act", "ACT", "Australian Capital Territory"],
  ["nt", "NT", "Northern Territory"],
] as const;

// Which states have a built page in each state-split cluster. The route
// check fails if one of these is removed without updating the list.
const NURSE_STATES = ["nsw", "vic", "qld", "wa", "sa", "tas"];
const PUBLIC_SERVICE_STATES = ["nsw", "vic", "qld", "wa", "sa"];

export const MEGA_MENU: readonly MegaMenu[] = [
  {
    id: "calculators",
    label: "Calculators",
    intro: "Free calculators on current ATO and Fair Work rates.",
    featured: [
      { href: "/", label: "Pay Calculator", description: "Take-home pay on any salary" },
      { href: "/income-tax-calculator/", label: "Income Tax Calculator", description: "Tax, Medicare levy and brackets" },
      { href: "/bonus-tax-calculator/", label: "Bonus Tax Calculator", description: "Tax withheld on a bonus" },
      { href: "/superannuation-calculator/", label: "Super Calculator", description: "Employer super at 12%" },
    ],
    groups: [
      {
        title: "Take-home & pay",
        href: "/take-home-pay-calculator/",
        links: [
          { href: "/take-home-pay-calculator/", label: "Take-home pay" },
          { href: "/fortnightly-pay-calculator/", label: "Fortnightly pay" },
          { href: "/fortnights-in-a-year/", label: "Fortnights in a year" },
          { href: "/weekly-pay-calculator/", label: "Weekly pay" },
          { href: "/monthly-pay-calculator/", label: "Monthly pay" },
          { href: "/hourly-to-annual-salary-calculator/", label: "Hourly to annual salary" },
          { href: "/gross-pay-calculator/", label: "Gross pay" },
          { href: "/pay-rise-calculator/", label: "Pay rise" },
          { href: "/salary-package-calculator/", label: "Salary package" },
        ],
      },
      {
        title: "Tax",
        href: "/tax-brackets/",
        links: [
          { href: "/tax-brackets/", label: "Tax brackets 2026-27" },
          { href: "/tax-withheld-calculator/", label: "Tax withheld" },
          { href: "/tax-return-calculator/", label: "Tax return estimate" },
          { href: "/second-job-tax-calculator/", label: "Second job tax" },
          { href: "/tax-free-threshold/", label: "Tax-free threshold" },
          { href: "/medicare-levy/", label: "Medicare levy" },
          { href: "/medicare-levy-surcharge-calculator/", label: "Medicare levy surcharge" },
          { href: "/hecs-help-calculator/", label: "HECS-HELP repayments" },
        ],
      },
      {
        title: "Super",
        href: "/superannuation-guide/",
        links: [
          { href: "/superannuation-calculator/", label: "Superannuation" },
          { href: "/salary-sacrifice-calculator/", label: "Salary sacrifice" },
          { href: "/concessional-contributions-cap/", label: "Concessional cap" },
          { href: "/payday-super/", label: "Payday Super" },
          { href: "/super-guarantee-rate-history/", label: "Super guarantee rate" },
          { href: "/novated-lease-calculator/", label: "Novated lease" },
        ],
      },
      {
        title: "Work & leave",
        links: [
          { href: "/overtime-pay-calculator/", label: "Overtime pay" },
          { href: "/leave-calculator/", label: "Annual leave payout" },
          { href: "/leave-loading-calculator/", label: "Leave loading" },
          { href: "/time-in-lieu/", label: "Time in lieu (TOIL)" },
          { href: "/sick-leave-calculator/", label: "Sick & carer's leave" }, // G3
          { href: "/compassionate-leave/", label: "Compassionate leave" }, // G3
          { href: "/redundancy-pay-calculator/", label: "Redundancy pay" },
          { href: "/long-service-leave-calculator/", label: "Long service leave" },
          { href: "/casual-loading-calculator/", label: "Casual loading" },
          { href: "/pro-rata-salary-calculator/", label: "Pro-rata salary" },
          { href: "/backpay-calculator/", label: "Backpay" },
        ],
      },
      {
        title: "Centrelink",
        href: "/centrelink-income-test/",
        links: [
          { href: "/centrelink-income-test/", label: "Income test explained" },
          { href: "/jobseeker-payment-calculator/", label: "JobSeeker" },
          { href: "/age-pension-income-test-calculator/", label: "Age Pension income test" },
          { href: "/disability-support-pension-calculator/", label: "Disability Support Pension" }, // G3
          { href: "/austudy-youth-allowance-calculator/", label: "Austudy & Youth Allowance" },
          { href: "/family-tax-benefit-calculator/", label: "Family Tax Benefit" },
          { href: "/parenting-payment-calculator/", label: "Parenting Payment" },
          { href: "/parental-leave-pay/", label: "Paid Parental Leave" },
          { href: "/centrelink-working-credit-calculator/", label: "Working Credit" },
          { href: "/centrelink-payment-dates/", label: "Payment dates" },
        ],
      },
      {
        title: "Contractors & employers",
        links: [
          { href: "/contractor-pay-calculator/", label: "Contractor pay" },
          { href: "/contractor-vs-employee-calculator/", label: "Contractor vs employee" },
          { href: "/employment-type-calculator/", label: "Full-time vs casual" },
          { href: "/employer-cost-calculator/", label: "Employer cost" },
          { href: "/payroll-tax-calculator/", label: "Payroll tax" },
          { href: "/payslip-generator/", label: "Payslip generator" },
        ],
      },
    ],
  },
  {
    id: "pay-rates",
    label: "Pay rates",
    intro: "Minimum rates from Fair Work awards, agreements and pay scales.",
    featured: [
      { href: "/award-rates/", label: "Award Rates", description: "14 modern awards, every level" },
      { href: "/job-pay-rates/", label: "Pay Rates by Job", description: "41 jobs, award to average" },
      { href: "/pay-rates/", label: "Pay Rates by Employer", description: "Coles, Woolworths, Bunnings…" },
      { href: "/minimum-wage-australia/", label: "Minimum Wage", description: "National rate from 1 July 2026" },
    ],
    groups: [
      {
        title: "Award rates",
        href: "/award-rates/",
        links: [
          { href: "/hospitality-award-rates/", label: "Hospitality" },
          { href: "/retail-award-rates/", label: "Retail" },
          { href: "/schads-award-pay-rates/", label: "SCHADS" },
          { href: "/fast-food-award-rates/", label: "Fast food" },
          { href: "/aged-care-award-rates/", label: "Aged care" },
          { href: "/nurses-award-rates/", label: "Nurses" },
          { href: "/clerks-award-rates/", label: "Clerks" },
          { href: "/overtime-penalty-rates-guide/", label: "Penalty rates" },
        ],
      },
      {
        title: "Minimum & junior wages",
        href: "/minimum-wage-australia/",
        links: [
          { href: "/junior-pay-rates/", label: "Junior pay rates" },
          { href: "/minimum-wage-by-age/16/", label: "Minimum wage at 16" },
          { href: "/minimum-wage-by-age/17/", label: "Minimum wage at 17" },
          { href: "/minimum-wage-by-age/18/", label: "Minimum wage at 18" },
          { href: "/minimum-wage-history-australia/", label: "Minimum wage history" },
        ],
      },
      {
        title: "By job",
        href: "/job-pay-rates/",
        links: [
          { href: "/job-pay-rates/nurse/", label: "Nurse" },
          { href: "/job-pay-rates/electrician/", label: "Electrician" },
          { href: "/job-pay-rates/truck-driver/", label: "Truck driver" },
          { href: "/job-pay-rates/disability-support-worker/", label: "Disability support worker" },
          { href: "/job-pay-rates/childcare-worker/", label: "Childcare worker" },
          { href: "/job-pay-rates/chef/", label: "Chef" },
          { href: "/job-pay-rates/pharmacist/", label: "Pharmacist" },
        ],
      },
      {
        title: "By employer",
        href: "/pay-rates/",
        links: [
          { href: "/pay-rates/coles/", label: "Coles" },
          { href: "/pay-rates/woolworths/", label: "Woolworths" },
          { href: "/pay-rates/bunnings/", label: "Bunnings" },
          { href: "/pay-rates/mcdonalds/", label: "McDonald’s" },
          { href: "/pay-rates/kmart/", label: "Kmart" },
          { href: "/pay-rates/chemist-warehouse/", label: "Chemist Warehouse" },
        ],
      },
      {
        title: "Public sector",
        href: "/public-service-pay-scales/",
        links: [
          { href: "/public-service-pay-scales/", label: "Public service pay scales" },
          { href: "/public-service-pay-scales/aps/", label: "APS pay scales" },
          { href: "/public-service-pay-scales/vic/", label: "VPS pay scales" },
          { href: "/teacher-pay-australia/", label: "Teacher pay" },
          { href: "/teacher-pay-australia/qld/", label: "QLD teacher pay" },
          { href: "/healthcare-worker-pay/", label: "Nurse & healthcare pay" },
          { href: "/adf-pay-scales/", label: "ADF pay scales" },
          { href: "/paramedic-pay/", label: "Paramedics" },
          { href: "/police-pay/", label: "Police" },
          { href: "/firefighter-pay/", label: "Firefighters" },
        ],
      },
      {
        title: "Salary benchmarks",
        href: "/average-salary-australia/",
        links: [
          { href: "/average-salary-australia/", label: "Average salary Australia" },
          { href: "/australian-pay-report-2026/", label: "Australian Pay Report 2026" },
          { href: "/mining-fifo-pay-guide/", label: "Mining & FIFO" },
          { href: "/fifo-pay-calculator/", label: "FIFO pay calculator" },
          { href: "/tech-salary-guide-australia/", label: "IT & tech" },
          { href: "/construction-trades-pay/", label: "Construction & trades" },
          { href: "/retail-hospitality-pay-guide/", label: "Retail & hospitality" },
        ],
      },
    ],
  },
  {
    id: "salary-tables",
    label: "Salary tables",
    intro: "Every salary worked out: tax, take-home and hourly.",
    featured: [
      { href: "/take-home-pay-on/", label: "Take-home Pay on Every Salary", description: "$20k to $500k, after tax" },
      { href: "/tax-on/", label: "Tax on Every Salary", description: "Income tax and Medicare levy" },
      { href: "/salary-to-hourly/", label: "Salary to Hourly", description: "Any salary as an hourly rate" },
      { href: "/hourly-to-annual-salary-calculator/", label: "Hourly to Salary", description: "Any hourly rate as a salary" },
    ],
    groups: [
      { title: "Take-home pay on", href: "/take-home-pay-on/", links: [65000, 80000, 100000, 110000, 130000, 140000, 160000, 200000].map(tho) },
      { title: "Tax on", href: "/tax-on/", links: [40000, 50000, 60000, 70000, 100000, 130000, 150000].map(taxOn) },
      { title: "Salary to hourly", href: "/salary-to-hourly/", links: [60000, 75000, 80000, 90000, 100000, 110000, 150000].map(s2h) },
      { title: "Hourly to salary", href: "/hourly-to-annual-salary-calculator/", links: [25, 30, 32, 35, 40, 45, 50].map(h2s) },
      {
        title: "PAYG tax tables",
        href: "/payg-withholding-tables/",
        links: [
          { href: "/payg-withholding-tables/", label: "PAYG withholding tables" },
          { href: "/weekly-tax-table/", label: "Weekly tax table" },
          { href: "/fortnightly-tax-table/", label: "Fortnightly tax table" },
          { href: "/monthly-tax-table/", label: "Monthly tax table" },
          { href: "/schedule-5-tax-table/", label: "Schedule 5 tax table" },
        ],
      },
    ],
  },
  {
    id: "by-state",
    label: "By state",
    intro: "State pay calculators, payroll tax and state pay scales.",
    featured: [
      { href: "/payroll-tax/", label: "Payroll Tax by State", description: "Rates and thresholds, all 8" },
      { href: "/long-service-leave-calculator/", label: "Long Service Leave", description: "Every state’s LSL rules" },
      { href: "/teacher-pay-australia/", label: "Teacher Pay by State", description: "Salary by step and state" },
      { href: "/public-service-pay-scales/", label: "Public Service Pay", description: "APS and state pay scales" },
    ],
    groups: [
      { title: "Pay calculator", links: STATES.map(([c, abbr]) => ({ href: `/pay-calculator-${c}/`, label: `Pay calculator ${abbr}` })) },
      { title: "Payroll tax", href: "/payroll-tax/", links: STATES.map(([c, abbr]) => ({ href: `/payroll-tax/${c}/`, label: `${abbr} payroll tax` })) },
      { title: "Long service leave", href: "/long-service-leave-calculator/", links: STATES.map(([c, abbr]) => ({ href: `/long-service-leave-calculator/${c}/`, label: `${abbr} long service leave` })) },
      { title: "Teacher pay", href: "/teacher-pay-australia/", links: STATES.map(([c, abbr]) => ({ href: `/teacher-pay-australia/${c}/`, label: `${abbr} teacher pay` })) },
      { title: "Nurse pay", href: "/healthcare-worker-pay/", links: NURSE_STATES.map((c) => ({ href: `/healthcare-worker-pay/${c}/`, label: `${c.toUpperCase()} nurse pay` })) },
      {
        title: "Public service",
        href: "/public-service-pay-scales/",
        links: [
          { href: "/public-service-pay-scales/aps/", label: "APS (Commonwealth)" },
          ...PUBLIC_SERVICE_STATES.map((c) => ({ href: `/public-service-pay-scales/${c}/`, label: `${c.toUpperCase()} public service` })),
        ],
      },
    ],
    stateGrid: {
      topics: [
        { key: "pay", label: "Pay calculator", hub: "/" },
        { key: "payrollTax", label: "Payroll tax", hub: "/payroll-tax/" },
        { key: "lsl", label: "Long service leave", hub: "/long-service-leave-calculator/" },
        { key: "teachers", label: "Teachers", hub: "/teacher-pay-australia/" },
        { key: "nurses", label: "Nurses", hub: "/healthcare-worker-pay/" },
        { key: "publicService", label: "Public service", hub: "/public-service-pay-scales/" },
      ],
      rows: STATES.map(([c, abbr, name]) => ({
        code: abbr,
        name,
        cells: {
          pay: `/pay-calculator-${c}/`,
          payrollTax: `/payroll-tax/${c}/`,
          lsl: `/long-service-leave-calculator/${c}/`,
          teachers: `/teacher-pay-australia/${c}/`,
          nurses: NURSE_STATES.includes(c) ? `/healthcare-worker-pay/${c}/` : undefined,
          publicService: PUBLIC_SERVICE_STATES.includes(c) ? `/public-service-pay-scales/${c}/` : undefined,
        },
      })),
    },
  },
  {
    id: "guides",
    label: "Guides",
    intro: "Plain-English guides to tax, super and your payslip.",
    featured: [
      { href: "/understanding-your-payslip/", label: "Understanding Your Payslip", description: "What every line means" },
      { href: "/tax-return-2026/", label: "Tax Return 2026", description: "Deadline, refund and rates" },
      { href: "/tax-changes-2026-27/", label: "Tax Changes 2026-27", description: "What changed on 1 July" },
      { href: "/news/", label: "Pay & Tax News", description: "Rate changes as they land" },
    ],
    groups: [
      {
        title: "Tax",
        links: [
          { href: "/tax-refund-guide/", label: "Tax refund guide" },
          { href: "/low-income-tax-offset/", label: "Low income tax offset" },
          { href: "/tax-bracket-history/", label: "Tax bracket history" },
          { href: "/stage-3-tax-cuts/", label: "Stage 3 tax cuts" },
          { href: "/tax-calendar/", label: "Tax calendar" },
          { href: "/notice-of-assessment/", label: "Notice of assessment" },
        ],
      },
      {
        title: "Deductions & allowances",
        href: "/tax-deductions-guide/",
        links: [
          { href: "/tax-deductions-guide/", label: "Tax deductions" },
          { href: "/work-from-home-deductions/", label: "Work-from-home deductions" },
          { href: "/cents-per-km/", label: "Cents per km (car)" },
          { href: "/travel-allowance/", label: "Travel allowance" },
          { href: "/fringe-benefits-tax/", label: "Fringe benefits tax" },
        ],
      },
      {
        title: "Super & packaging",
        href: "/superannuation-guide/",
        links: [
          { href: "/superannuation-guide/", label: "How super works" },
          { href: "/super-guarantee-charge/", label: "Super guarantee charge" },
          { href: "/division-293-tax/", label: "Division 293 tax" },
          { href: "/super-co-contribution/", label: "Super co-contribution" },
          { href: "/salary-packaging-guide/", label: "Salary packaging" },
          { href: "/novated-lease-guide/", label: "How a novated lease works" },
        ],
      },
      {
        title: "Work & employment",
        links: [
          { href: "/first-job-pay-guide/", label: "Your first job" },
          { href: "/gross-vs-net-pay/", label: "Gross vs net pay" },
          { href: "/enterprise-agreement/", label: "Enterprise agreements" },
          { href: "/annual-leave-guide/", label: "Annual leave" },
          { href: "/full-time-vs-part-time-vs-casual/", label: "Full-time vs part-time vs casual" },
          { href: "/gig-economy-pay-guide/", label: "Gig economy pay" },
          { href: "/new-job-checklist/", label: "New job checklist" },
        ],
      },
      {
        title: "Special situations",
        links: [
          { href: "/working-holiday-tax/", label: "Working holiday tax" },
          { href: "/non-resident-tax/", label: "Non-resident tax" },
          { href: "/zone-tax-offset/", label: "Zone tax offset" },
          { href: "/sapto-calculator/", label: "Seniors tax offset (SAPTO)" },
          { href: "/pension-age-australia/", label: "Pension age" },
          { href: "/centrelink-debt/", label: "Centrelink debt" },
        ],
      },
      {
        title: "Latest news",
        href: "/news/",
        links: [
          { href: "/news/july-1-2026-money-changes/", label: "July 1 money changes" },
          { href: "/news/minimum-wage-increase-july-2026/", label: "Minimum wage increase 2026" },
          { href: "/news/payday-super-starts-july-2026/", label: "Payday Super starts" },
          { href: "/news/hecs-indexation-2026/", label: "HECS indexation 2026" },
        ],
      },
    ],
  },
];

/** Plain links after the menus in the top bar. */
export const PRIMARY_NAV_LINKS: readonly MenuLink[] = [{ href: "/news/", label: "News" }];

/** The top-bar call to action. */
export const NAV_CTA: MenuLink = { href: "/", label: "Calculate pay" };

// ----- Footer -----
export type FooterColumn = { title: string; href?: string; links: readonly MenuLink[] };

/**
 * Footer columns mirror the menu clusters: hub first, then the key leaves.
 * Salary tables are rendered by the footer itself (it adds live take-home
 * figures from the tax engine) from FOOTER_TAKE_HOME_SALARIES.
 */
export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    title: "Calculators",
    links: [
      { href: "/", label: "Pay calculator" },
      { href: "/income-tax-calculator/", label: "Income tax" },
      { href: "/take-home-pay-calculator/", label: "Take-home pay" },
      { href: "/bonus-tax-calculator/", label: "Bonus tax" },
      { href: "/superannuation-calculator/", label: "Superannuation" },
      { href: "/hecs-help-calculator/", label: "HECS-HELP" },
      { href: "/fortnightly-pay-calculator/", label: "Fortnightly pay" },
      { href: "/overtime-pay-calculator/", label: "Overtime pay" },
      { href: "/redundancy-pay-calculator/", label: "Redundancy pay" },
      { href: "/jobseeker-payment-calculator/", label: "JobSeeker" },
    ],
  },
  {
    title: "Pay rates",
    links: [
      { href: "/award-rates/", label: "Award rates" },
      { href: "/job-pay-rates/", label: "Pay rates by job" },
      { href: "/pay-rates/", label: "Pay rates by employer" },
      { href: "/minimum-wage-australia/", label: "Minimum wage" },
      { href: "/junior-pay-rates/", label: "Junior pay rates" },
      { href: "/public-service-pay-scales/", label: "Public service pay" },
      { href: "/teacher-pay-australia/", label: "Teacher pay" },
      { href: "/healthcare-worker-pay/", label: "Nurse pay" },
      { href: "/adf-pay-scales/", label: "ADF pay scales" },
      { href: "/average-salary-australia/", label: "Average salary" },
      { href: "/australian-pay-report-2026/", label: "Pay Report 2026" },
    ],
  },
  {
    title: "Tax & super guides",
    links: [
      { href: "/tax-brackets/", label: "Tax brackets" },
      { href: "/medicare-levy/", label: "Medicare levy" },
      { href: "/tax-free-threshold/", label: "Tax-free threshold" },
      { href: "/payg-withholding-tables/", label: "PAYG tax tables" },
      { href: "/tax-return-2026/", label: "Tax return 2026" },
      { href: "/tax-deductions-guide/", label: "Tax deductions" },
      { href: "/superannuation-guide/", label: "How super works" },
      { href: "/concessional-contributions-cap/", label: "Concessional cap" },
      { href: "/payday-super/", label: "Payday Super" },
      { href: "/understanding-your-payslip/", label: "Your payslip" },
    ],
  },
  {
    title: "States",
    links: [
      ...STATES.map(([c, abbr]) => ({ href: `/pay-calculator-${c}/`, label: `Pay calculator ${abbr}` })),
      { href: "/payroll-tax/", label: "Payroll tax by state" },
      { href: "/long-service-leave-calculator/", label: "LSL by state" },
    ],
  },
];

/** Salaries listed (with live weekly take-home) in the footer's Salary tables column. */
export const FOOTER_TAKE_HOME_SALARIES = [50_000, 65_000, 80_000, 100_000, 120_000, 150_000] as const;

export const FOOTER_SALARY_HUBS: readonly MenuLink[] = [
  { href: "/take-home-pay-on/", label: "Take-home on every salary" },
  { href: "/tax-on/", label: "Tax on every salary" },
  { href: "/salary-to-hourly/", label: "Salary to hourly" },
  { href: "/hourly-to-annual-salary-calculator/", label: "Hourly to salary" },
];

export const FOOTER_COMPANY: readonly MenuLink[] = [
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
  { href: "/news/", label: "News" },
  { href: "/embed/", label: "Embed our calculator" },
  { href: "/privacy/", label: "Privacy policy" },
  { href: "/terms/", label: "Terms of use" },
  { href: "/site-directory/", label: "Site directory" },
];

/** Every internal href the header and footer render. Used by the route check. */
export function allNavHrefs(): string[] {
  const out = new Set<string>([NAV_CTA.href, ...PRIMARY_NAV_LINKS.map((l) => l.href)]);
  for (const m of MEGA_MENU) {
    m.featured.forEach((l) => out.add(l.href));
    m.groups.forEach((g) => {
      if (g.href) out.add(g.href);
      g.links.forEach((l) => out.add(l.href));
    });
    m.stateGrid?.topics.forEach((t) => out.add(t.hub));
    m.stateGrid?.rows.forEach((r) => Object.values(r.cells).forEach((h) => h && out.add(h)));
  }
  FOOTER_COLUMNS.forEach((c) => c.links.forEach((l) => out.add(l.href)));
  FOOTER_TAKE_HOME_SALARIES.forEach((s) => out.add(`/take-home-pay-on/${s}/`));
  FOOTER_SALARY_HUBS.forEach((l) => out.add(l.href));
  FOOTER_COMPANY.forEach((l) => out.add(l.href));
  return [...out];
}

// ===== Legacy navigation data =====
// The lists below no longer render in the header or footer. They feed
// /site-directory/ (every link in them is listed there), so keep adding new
// pages to them as before; the curated MEGA_MENU / FOOTER_COLUMNS above are
// the only header/footer sources.

/** @deprecated The header renders MEGA_MENU. Kept for external imports. */
export const navigationItems: NavigationItem[] = [
  ...MEGA_MENU.map((m) => ({ href: "#", label: m.label, hasMegaMenu: true })),
  ...PRIMARY_NAV_LINKS,
];

// ===== Mega menu content =====

export const CALCULATOR_CATEGORIES = [
  {
    title: "Core Calculators",
    calculators: [
      { href: "/income-tax-calculator/", label: "Income Tax Calculator", description: "Calculate your income tax with bracket breakdown" },
      { href: "/take-home-pay-calculator/", label: "Take-Home Pay Calculator", description: "See your net pay after all deductions" },
      { href: "/superannuation-calculator/", label: "Superannuation Calculator", description: "Calculate employer SG contributions at 12%" },
      { href: "/salary-sacrifice-calculator/", label: "Salary Sacrifice Calculator", description: "Compare pay before and after sacrifice" },
      { href: "/hecs-help-calculator/", label: "HECS-HELP Calculator", description: "Marginal repayment system, FY2026-27 thresholds" },
      { href: "/capital-gains-tax-calculator/", label: "Capital Gains Tax Calculator", description: "CGT with the 12-month 50% discount" },
    ],
  },
  {
    title: "Specialist Calculators",
    calculators: [
      { href: "/pay-rise-calculator/", label: "Pay Rise Calculator", description: "See how much extra you actually take home" },
      { href: "/redundancy-pay-calculator/", label: "Redundancy Pay Calculator", description: "Entitlements and tax on redundancy" },
      { href: "/contractor-vs-employee-calculator/", label: "Contractor vs Employee", description: "Side-by-side pay comparison" },
      { href: "/gross-pay-calculator/", label: "Gross Pay Calculator", description: "Gross to net and net to gross" },
      { href: "/salary-package-calculator/", label: "Salary Package Calculator", description: "Package including super → base salary and take-home" },
      { href: "/hourly-to-annual-salary-calculator/", label: "Hourly to Annual Converter", description: "Convert between any pay frequency" },
      { href: "/contractor-pay-calculator/", label: "Contractor Pay Calculator", description: "ABN workers, freelancers & gig economy rates" },
      { href: "/employer-cost-calculator/", label: "Employer Cost Calculator", description: "True cost beyond salary" },
      // --- T2 payroll tax cluster (23 Sep 2026) ---
      { href: "/payroll-tax-calculator/", label: "Payroll Tax Calculator", description: "State payroll tax on 2026-27 rates, all 8 states" },
      // --- end T2 ---
      { href: "/bonus-tax-calculator/", label: "Bonus Tax Calculator", description: "Tax on bonuses and lump sum payments" },
      { href: "/commission-tax-calculator/", label: "Commission Tax Calculator", description: "Tax on commission and Schedule 5 withholding" },
      { href: "/overtime-pay-calculator/", label: "Overtime Pay Calculator", description: "Overtime and penalty rate pay" },
      { href: "/leave-calculator/", label: "Leave Calculator", description: "Annual leave entitlements and payout" },
      { href: "/tax-return-calculator/", label: "Tax Return Calculator", description: "Estimate your tax refund" },
      { href: "/second-job-tax-calculator/", label: "Second Job Tax Calculator", description: "Tax on multiple jobs" },
      // --- T1 wave 3 (23 Sep 2026) ---
      { href: "/tax-withheld-calculator/", label: "Tax Withheld Calculator", description: "PAYG withheld per pay and your likely refund" },
      // --- end T1 ---
      { href: "/jobseeker-payment-calculator/", label: "JobSeeker Payment Calculator", description: "What you keep of JobSeeker when you work" },
      { href: "/austudy-youth-allowance-calculator/", label: "Austudy & Youth Allowance Calculator", description: "Student income test with current rates" },
      { href: "/age-pension-income-test-calculator/", label: "Age Pension Income Test Calculator", description: "Income test with the Work Bonus" },
      // C4 Centrelink family payments (added 2026-09-23)
      { href: "/parenting-payment-calculator/", label: "Parenting Payment Calculator", description: "Single and partnered, with the income test" },
      { href: "/family-tax-benefit-calculator/", label: "Family Tax Benefit Calculator", description: "FTB Part A and Part B on your family income" },
      { href: "/rent-assistance-calculator/", label: "Rent Assistance Calculator", description: "Centrelink Rent Assistance for your rent" },
      // end C4
      // W3 Centrelink wave 2 (added 2026-09-23)
      { href: "/carer-payment-calculator/", label: "Carer Payment Calculator", description: "Rates, income test and the 100-hour work rule" },
      { href: "/carer-allowance/", label: "Carer Allowance", description: "Fortnightly rate and the $250,000 income limit" },
      { href: "/centrelink-advance-payment/", label: "Centrelink Advance Payment", description: "Advance amounts and fortnightly repayment" },
      // end W3
      { href: "/final-pay-calculator/", label: "Final Pay Calculator", description: "End of employment payout" },
      { href: "/employment-type-calculator/", label: "Employment Type Calculator", description: "Compare FT vs PT vs casual" },
      { href: "/backpay-calculator/", label: "Backpay Calculator", description: "Underpayment and arrears" },
      { href: "/payslip-generator/", label: "Payslip Generator", description: "Create a compliant payslip free" },
      { href: "/ytd-income-calculator/", label: "YTD Income Calculator", description: "Year-to-date pay and annualised income" },
      { href: "/work-hours-calculator/", label: "Work Hours Calculator", description: "Timesheet, breaks, overnight shifts and overtime" },
      { href: "/long-service-leave-calculator/", label: "Long Service Leave Calculator", description: "Weeks accrued and payout value, all 8 states" },
      { href: "/novated-lease-calculator/", label: "Novated Lease Calculator", description: "Car packaging, FBT, the EV exemption and take-home" },
    ],
  },
  {
    title: "Pay Frequency",
    calculators: [
      { href: "/weekly-pay-calculator/", label: "Weekly Pay Calculator", description: "Take-home pay per week" },
      { href: "/fortnightly-pay-calculator/", label: "Fortnightly Pay Calculator", description: "Net pay every two weeks" },
      { href: "/monthly-pay-calculator/", label: "Monthly Pay Calculator", description: "Net salary per month" },
      { href: "/annual-pay-calculator/", label: "Annual Pay Calculator", description: "Yearly take-home pay summary" },
    ],
  },
] as const;

export const GUIDE_CATEGORIES = [
  {
    title: "Tax & Deductions",
    guides: [
      { href: "/tax-brackets/", label: "Tax Brackets", description: "Income tax rates and thresholds" },
      { href: "/medicare-levy/", label: "Medicare Levy Guide", description: "Rate, surcharge and exemptions" },
      { href: "/low-income-tax-offset/", label: "Low Income Tax Offset (LITO)", description: "Up to $700 tax reduction" },
      { href: "/payg-withholding-tables/", label: "PAYG Withholding Tables", description: "Weekly, fortnightly and monthly tables" },
      { href: "/weekly-tax-table/", label: "Weekly Tax Table", description: "ATO weekly withholding amounts" },
      { href: "/fortnightly-tax-table/", label: "Fortnightly Tax Table", description: "ATO fortnightly withholding amounts" },
      { href: "/tax-refund-guide/", label: "Tax Refund Guide", description: "Maximise your tax return" },
      { href: "/tax-calendar/", label: "Tax Calendar", description: "Key ATO dates and deadlines" },
      { href: "/fringe-benefits-tax/", label: "Fringe Benefits Tax (FBT)", description: "Employer-provided benefits tax" },
      // --- W2 wave 2 (23 Sep 2026) ---
      { href: "/tax-free-threshold/", label: "Tax-Free Threshold", description: "$18,200, and which job to claim it on" },
      { href: "/medicare-levy-surcharge-calculator/", label: "Medicare Levy Surcharge Calculator", description: "MLS tiers and cover vs surcharge" },
      // --- end W2 ---
    ],
  },
  {
    title: "Super & Salary",
    guides: [
      { href: "/superannuation-guide/", label: "Superannuation Guide", description: "How super works in Australia" },
      { href: "/novated-lease-guide/", label: "How a Novated Lease Works", description: "The agreement and running-cost budget, explained" },
      { href: "/super-guarantee-charge/", label: "Super Guarantee Charge", description: "Payday Super and what late super costs" },
      // --- W2 wave 2 (23 Sep 2026) ---
      { href: "/concessional-contributions-cap/", label: "Concessional Contributions Cap", description: "The cap, carry-forward and salary sacrifice" },
      { href: "/super-guarantee-rate-history/", label: "Super Guarantee Rate", description: "12% from 1 July 2025, and every rate since" },
      // --- end W2 ---
    ],
  },
  {
    title: "Employment & Pay",
    guides: [
      { href: "/understanding-your-payslip/", label: "Understanding Your Payslip", description: "What every deduction means" },
      { href: "/award-rates/", label: "Award Rates", description: "Minimum wage and penalty rates" },
      { href: "/overtime-penalty-rates-guide/", label: "Penalty Rates", description: "Weekend, evening and public holiday rates" },
      { href: "/annual-leave-guide/", label: "Annual Leave Guide", description: "Entitlements and loading" },
    ],
  },
  {
    // Per-award rate pages. The /award-rates/ hub is the parent; each child
    // owns one award's classification table so no two pages compete for the
    // same term. Rates derive from lib/constants/schads-award.ts,
    // hospitality-award.ts and junior-rates.ts — never hardcoded here.
    title: "Award Pay Rates",
    guides: [
      { href: "/award-rates/", label: "Award Rates Hub", description: "How modern awards set minimum pay" },
      { href: "/schads-award-pay-rates/", label: "SCHADS Award Pay Rates", description: "Social, community, home care & disability" },
      { href: "/hospitality-award-rates/", label: "Hospitality Award Rates", description: "Cafes, restaurants, pubs & hotels" },
      { href: "/retail-award-rates/", label: "Retail Award Rates", description: "General Retail Industry Award levels 1–8" },
      // --- Award cluster C3 (Sep 2026): additional per-award rate pages ---
      { href: "/fast-food-award-rates/", label: "Fast Food Award Rates", description: "Takeaway and food court staff, junior rates" },
      { href: "/pharmacy-award-rates/", label: "Pharmacy Award Rates", description: "Pharmacy assistants, interns & pharmacists" },
      { href: "/manufacturing-award-rates/", label: "Manufacturing Award Rates", description: "C14 to C2 classification rates" },
      { href: "/security-award-rates/", label: "Security Award Rates", description: "Security officer levels 1–5" },
      { href: "/clerks-award-rates/", label: "Clerks Award Rates", description: "Clerks—Private Sector levels 1–5" },
      // --- end award cluster C3 ---
      // --- T4: awards batch 3 (23 Sep 2026) ---
      { href: "/restaurant-award-rates/", label: "Restaurant Award Rates", description: "Restaurants, cafés, cooks and chefs" },
      { href: "/nurses-award-rates/", label: "Nurses Award Rates", description: "RN, EN and aged care nurse rates" },
      { href: "/aged-care-award-rates/", label: "Aged Care Award Rates", description: "Personal care workers and support staff" },
      { href: "/hair-and-beauty-award-rates/", label: "Hair & Beauty Award Rates", description: "Hairdressers and beauty therapists" },
      { href: "/cleaning-award-rates/", label: "Cleaning Award Rates", description: "Full-time, part-time and casual cleaners" },
      { href: "/road-transport-award-rates/", label: "Road Transport Award Rates", description: "Truck driver grades 1–10" },
      // --- end T4 ---
      { href: "/junior-pay-rates/", label: "Junior Pay Rates", description: "Minimum wage by age, 16 to 20" },
      { href: "/overtime-penalty-rates-guide/", label: "Penalty Rates by Award", description: "Weekend, evening and public holiday loadings" },
    ],
  },
  {
    title: "Special Situations",
    guides: [
      { href: "/working-holiday-tax/", label: "Working Holiday Tax", description: "Tax rates for 417 & 462 visa holders" },
      { href: "/non-resident-tax/", label: "Non-Resident Tax", description: "Foreign resident tax rates" },
      { href: "/centrelink-income-test/", label: "Centrelink Income Test", description: "Payment thresholds and taper rates" },
      { href: "/parental-leave-pay/", label: "Paid Parental Leave Calculator", description: "26 weeks, pay, income and work tests" },
      // W3 Centrelink wave 2 (added 2026-09-23)
      { href: "/centrelink-crisis-payment/", label: "Centrelink Crisis Payment", description: "Eligibility, amount and the 7-day rule" },
      { href: "/centrelink-debt/", label: "Centrelink Debt", description: "Overpayments, refunds and the apportionment scheme" },
      { href: "/cost-of-living-payment-2026/", label: "Cost of Living Payment 2026", description: "Is there one? What exists instead" },
      // end W3
      { href: "/zone-tax-offset/", label: "Zone Tax Offset", description: "Remote area tax concessions" },
      { href: "/sapto-calculator/", label: "SAPTO Calculator", description: "Seniors and pensioners tax offset" },
    ],
  },
  {
    title: "Money & Deductions",
    guides: [
      { href: "/tax-deductions-guide/", label: "Tax Deductions Guide", description: "Work-related deductions explained" },
      { href: "/work-from-home-deductions/", label: "WFH Deductions", description: "Fixed rate & actual cost methods" },
      { href: "/stage-3-tax-cuts/", label: "Stage 3 Tax Cuts", description: "Before & after comparison" },
      { href: "/private-health-insurance-medicare/", label: "PHI & Medicare", description: "Surcharge decision guide" },
      { href: "/division-293-tax/", label: "Division 293 Tax", description: "Extra super tax for high earners" },
      { href: "/salary-packaging-guide/", label: "Salary Packaging", description: "Beyond novated leases" },
    ],
  },
  {
    title: "Getting Started",
    guides: [
      { href: "/first-job-pay-guide/", label: "First Job Guide", description: "Tax, super & your first payslip" },
      { href: "/new-job-checklist/", label: "New Job Checklist", description: "TFN, super & pay setup" },
      { href: "/gig-economy-pay-guide/", label: "Gig Economy Guide", description: "Uber, delivery & freelancer tax" },
      { href: "/tax-file-number-declaration/", label: "TFN Declaration", description: "How to fill it in correctly" },
      { href: "/notice-of-assessment/", label: "Notice of Assessment", description: "Read your ATO assessment" },
      { href: "/employee-vs-sole-trader-vs-company/", label: "Business Structure", description: "Employee vs sole trader vs company" },
    ],
  },
  {
    title: "Industry Pay Guides",
    guides: [
      { href: "/average-salary-australia/", label: "Average Salary Australia", description: "By industry, state & experience" },
      { href: "/mining-fifo-pay-guide/", label: "Mining & FIFO Pay", description: "Salaries, rosters & allowances" },
      { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay", description: "Nurses, doctors & allied health" },
      { href: "/teacher-pay-australia/", label: "Teacher Pay", description: "Salary by state & classification" },
      // C1 employer pay rates (2026-09-23)
      { href: "/pay-rates/", label: "Pay Rates by Employer", description: "Coles, Woolworths, Bunnings & more" },
      // --- C2 occupation pay rates + C5 ADF pay scales (2026-09-23) ---
      { href: "/job-pay-rates/", label: "Pay Rates by Job", description: "Pharmacist, electrician, truck driver & more" },
      { href: "/adf-pay-scales/", label: "ADF Pay Scales", description: "Army, Navy & Air Force salary by rank" },
      { href: "/paramedic-pay/", label: "Paramedic Pay by State", description: "Ambulance service pay scales" },
      { href: "/police-pay/", label: "Police Pay by State", description: "Constable to senior sergeant" },
      { href: "/firefighter-pay/", label: "Firefighter Pay by State", description: "Recruit to station officer" },
      { href: "/air-traffic-controller-salary/", label: "Air Traffic Controller Salary", description: "Airservices pay levels" },
      { href: "/pilot-salary/", label: "Pilot Salary", description: "Air Pilots Award rates" },
      // --- end C2/C5 ---
      { href: "/retail-hospitality-pay-guide/", label: "Retail & Hospitality", description: "Award rates & penalties" },
      { href: "/tech-salary-guide-australia/", label: "IT & Tech Salaries", description: "Developer, engineer & PM pay" },
      { href: "/construction-trades-pay/", label: "Construction & Trades", description: "Apprentice & tradie rates" },
    ],
  },
  // --- Minimum wage cluster (C5 workstream, 23 Sep 2026) ---
  // Age spokes (/minimum-wage-by-age/[age]/) are listed on /site-directory/
  // and linked from /junior-pay-rates/; they are too many for the mega menu.
  {
    title: "Minimum Wage & Casual Pay",
    guides: [
      { href: "/minimum-wage-australia/", label: "Minimum Wage Australia", description: "Current national rate, weekly and after tax" },
      { href: "/minimum-wage-by-age/16/", label: "Minimum Wage for 16 Year Olds", description: "Award and no-award rates at 16" },
      { href: "/pro-rata-salary-calculator/", label: "Pro-Rata Salary Calculator", description: "Part-time pay from a full-time salary" },
      { href: "/casual-loading-calculator/", label: "Casual Loading Calculator", description: "25% casual rate vs permanent with leave" },
      { href: "/minimum-wage-history-australia/", label: "Minimum Wage History", description: "Every increase since 2010" },
    ],
  },
  // --- end minimum wage cluster ---
  // --- W1 timely pages (Wave 2, 23 Sep 2026) ---
  // GUIDE_CATEGORIES also feeds /site-directory/, so these three are listed
  // there automatically — no separate site-directory entry needed.
  {
    title: "Tax Time & Retirement 2026",
    guides: [
      { href: "/tax-return-2026/", label: "Tax Return 2026", description: "2025-26 deadline, refund estimate & tax rates" },
      { href: "/payday-super/", label: "Payday Super", description: "Super paid every payday from 1 July 2026" },
      { href: "/pension-age-australia/", label: "Pension Age Australia", description: "Age Pension and super access age by birth date" },
    ],
  },
  // --- end W1 ---
  // --- T3 workplace entitlement attributes (Wave 3, 23 Sep 2026) ---
  // GUIDE_CATEGORIES also feeds /site-directory/, so no separate entry there.
  {
    title: "Payslip Lines & Entitlements",
    guides: [
      { href: "/gross-vs-net-pay/", label: "Gross vs Net Pay", description: "What comes out between gross and net" },
      { href: "/leave-loading-calculator/", label: "Leave Loading Calculator", description: "17.5% or penalties, whichever is higher" },
      { href: "/time-in-lieu/", label: "Time in Lieu (TOIL)", description: "Time off instead of overtime pay" },
      { href: "/enterprise-agreement/", label: "Enterprise Agreements", description: "What an EBA is and how to find yours" },
      { href: "/travel-allowance/", label: "Travel Allowance 2026-27", description: "ATO reasonable amounts (TD 2026/4)" },
      { href: "/cents-per-km/", label: "Cents per km", description: "91c ATO rate and car allowances" },
      { href: "/centrelink-working-credit-calculator/", label: "Working Credit Calculator", description: "Keep more Centrelink when you start work" },
    ],
  },
  // --- end T3 ---
  // --- G3 wave 4 opportunities (24 Sep 2026) ---
  // GUIDE_CATEGORIES also feeds /site-directory/, so no separate entry there.
  {
    title: "Leave Entitlements",
    guides: [
      { href: "/sick-leave-calculator/", label: "Sick Leave Calculator", description: "Personal/carer's leave: 10 days, 1/26 of hours" },
      { href: "/compassionate-leave/", label: "Compassionate Leave", description: "2 days paid bereavement leave per occasion" },
    ],
  },
  {
    title: "Centrelink Payments",
    guides: [
      { href: "/disability-support-pension-calculator/", label: "Disability Support Pension", description: "DSP rates, income test and the 29-hour rule" },
    ],
  },
  // --- end G3 ---
] as const;

export const STATE_CATEGORIES = [
  {
    title: "Pay Calculator by State",
    states: [
      { href: "/pay-calculator-nsw/", label: "NSW", description: "Sydney & New South Wales" },
      { href: "/pay-calculator-vic/", label: "Victoria", description: "Melbourne & VIC" },
      { href: "/pay-calculator-qld/", label: "Queensland", description: "Brisbane & QLD" },
      { href: "/pay-calculator-wa/", label: "Western Australia", description: "Perth & WA" },
      { href: "/pay-calculator-sa/", label: "South Australia", description: "Adelaide & SA" },
      { href: "/pay-calculator-tas/", label: "Tasmania", description: "Hobart & TAS" },
      { href: "/pay-calculator-act/", label: "ACT", description: "Canberra & ACT" },
      { href: "/pay-calculator-nt/", label: "Northern Territory", description: "Darwin & NT" },
    ],
  },
] as const;

export const TAX_ON_SALARY_CATEGORIES = [
  {
    title: "$30K – $50K",
    salaries: [
      { href: "/tax-on/30000/", label: "Tax on $30,000", description: "Entry-level & part-time" },
      { href: "/tax-on/35000/", label: "Tax on $35,000" },
      { href: "/tax-on/40000/", label: "Tax on $40,000" },
      { href: "/tax-on/45000/", label: "Tax on $45,000" },
      { href: "/tax-on/50000/", label: "Tax on $50,000", description: "Median part-time salary" },
    ],
  },
  {
    title: "$55K – $75K",
    salaries: [
      { href: "/tax-on/55000/", label: "Tax on $55,000" },
      { href: "/tax-on/60000/", label: "Tax on $60,000" },
      { href: "/tax-on/65000/", label: "Tax on $65,000", description: "Near national median" },
      { href: "/tax-on/70000/", label: "Tax on $70,000" },
      { href: "/tax-on/75000/", label: "Tax on $75,000" },
    ],
  },
  {
    title: "$80K – $100K",
    salaries: [
      { href: "/tax-on/80000/", label: "Tax on $80,000" },
      { href: "/tax-on/85000/", label: "Tax on $85,000" },
      { href: "/tax-on/90000/", label: "Tax on $90,000" },
      { href: "/tax-on/95000/", label: "Tax on $95,000" },
      { href: "/tax-on/100000/", label: "Tax on $100,000", description: "Six-figure threshold" },
    ],
  },
  {
    title: "$105K – $130K",
    salaries: [
      { href: "/tax-on/105000/", label: "Tax on $105,000" },
      { href: "/tax-on/110000/", label: "Tax on $110,000" },
      { href: "/tax-on/115000/", label: "Tax on $115,000" },
      { href: "/tax-on/120000/", label: "Tax on $120,000" },
      { href: "/tax-on/125000/", label: "Tax on $125,000" },
      { href: "/tax-on/130000/", label: "Tax on $130,000" },
    ],
  },
  {
    title: "$135K – $165K",
    salaries: [
      { href: "/tax-on/135000/", label: "Tax on $135,000" },
      { href: "/tax-on/140000/", label: "Tax on $140,000" },
      { href: "/tax-on/145000/", label: "Tax on $145,000" },
      { href: "/tax-on/150000/", label: "Tax on $150,000" },
      { href: "/tax-on/155000/", label: "Tax on $155,000" },
      { href: "/tax-on/160000/", label: "Tax on $160,000" },
      { href: "/tax-on/165000/", label: "Tax on $165,000" },
    ],
  },
  {
    title: "$170K – $200K",
    salaries: [
      { href: "/tax-on/170000/", label: "Tax on $170,000" },
      { href: "/tax-on/175000/", label: "Tax on $175,000" },
      { href: "/tax-on/180000/", label: "Tax on $180,000", description: "Top tax bracket" },
      { href: "/tax-on/185000/", label: "Tax on $185,000" },
      { href: "/tax-on/190000/", label: "Tax on $190,000" },
      { href: "/tax-on/195000/", label: "Tax on $195,000" },
      { href: "/tax-on/200000/", label: "Tax on $200,000" },
    ],
  },
] as const;

// Footer links — organised in 3 columns
export const FOOTER_CALCULATORS = [
  { href: "/long-service-leave-calculator/", label: "Long Service Leave Calculator" },
  { href: "/novated-lease-calculator/", label: "Novated Lease Calculator" },
  { href: "/public-service-pay-scales/", label: "Public Service Pay Scales" },
  { href: "/income-tax-calculator/", label: "Income Tax Calculator" },
  { href: "/take-home-pay-calculator/", label: "Take-Home Pay Calculator" },
  { href: "/superannuation-calculator/", label: "Superannuation Calculator" },
  { href: "/salary-sacrifice-calculator/", label: "Salary Sacrifice Calculator" },
  { href: "/hecs-help-calculator/", label: "HECS-HELP Calculator" },
  { href: "/pay-rise-calculator/", label: "Pay Rise Calculator" },
  { href: "/redundancy-pay-calculator/", label: "Redundancy Pay Calculator" },
  { href: "/contractor-vs-employee-calculator/", label: "Contractor vs Employee" },
  { href: "/gross-pay-calculator/", label: "Gross Pay Calculator" },
  { href: "/salary-package-calculator/", label: "Salary Package Calculator" },
  { href: "/hourly-to-annual-salary-calculator/", label: "Hourly to Annual Converter" },
  { href: "/weekly-pay-calculator/", label: "Weekly Pay Calculator" },
  { href: "/fortnightly-pay-calculator/", label: "Fortnightly Pay Calculator" },
  { href: "/monthly-pay-calculator/", label: "Monthly Pay Calculator" },
  { href: "/annual-pay-calculator/", label: "Annual Pay Calculator" },
  { href: "/employer-cost-calculator/", label: "Employer Cost Calculator" },
  { href: "/contractor-pay-calculator/", label: "Contractor Pay Calculator" },
  { href: "/bonus-tax-calculator/", label: "Bonus Tax Calculator" },
  { href: "/commission-tax-calculator/", label: "Commission Tax Calculator" },
  { href: "/overtime-pay-calculator/", label: "Overtime Pay Calculator" },
  { href: "/leave-calculator/", label: "Leave Calculator" },
  { href: "/tax-return-calculator/", label: "Tax Return Calculator" },
  { href: "/second-job-tax-calculator/", label: "Second Job Tax Calculator" },
  { href: "/jobseeker-payment-calculator/", label: "JobSeeker Payment Calculator" },
  { href: "/austudy-youth-allowance-calculator/", label: "Austudy & Youth Allowance Calculator" },
  { href: "/age-pension-income-test-calculator/", label: "Age Pension Income Test Calculator" },
  { href: "/final-pay-calculator/", label: "Final Pay Calculator" },
  { href: "/employment-type-calculator/", label: "Employment Type Calculator" },
  { href: "/backpay-calculator/", label: "Backpay Calculator" },
  { href: "/payslip-generator/", label: "Payslip Generator" },
  { href: "/ytd-income-calculator/", label: "YTD Income Calculator" },
  { href: "/capital-gains-tax-calculator/", label: "Capital Gains Tax Calculator" },
  { href: "/work-hours-calculator/", label: "Work Hours Calculator" },
  // --- T1 wave 3 (23 Sep 2026) ---
  { href: "/tax-withheld-calculator/", label: "Tax Withheld Calculator" },
  // --- end T1 ---
] as const;

// Footer guides — split into logical groups for multi-column layout
export const FOOTER_GUIDES_TAX = [
  { href: "/tax-brackets/", label: "Tax Brackets" },
  { href: "/medicare-levy/", label: "Medicare Levy" },
  { href: "/low-income-tax-offset/", label: "Low Income Tax Offset" },
  { href: "/payg-withholding-tables/", label: "PAYG Withholding Tables" },
  { href: "/weekly-tax-table/", label: "Weekly Tax Table" },
  { href: "/fortnightly-tax-table/", label: "Fortnightly Tax Table" },
  { href: "/monthly-tax-table/", label: "Monthly Tax Table" },
  { href: "/schedule-5-tax-table/", label: "Schedule 5 Tax Table" },
  { href: "/tax-deductions-guide/", label: "Tax Deductions Guide" },
  { href: "/work-from-home-deductions/", label: "WFH Deductions" },
  { href: "/tax-refund-guide/", label: "Tax Refund Guide" },
  { href: "/stage-3-tax-cuts/", label: "Stage 3 Tax Cuts" },
  { href: "/tax-changes-2026-27/", label: "FY2026-27 Tax Changes" },
  { href: "/tax-bracket-history/", label: "Tax Bracket History" },
  { href: "/tax-calendar/", label: "Tax Calendar" },
  { href: "/tax-file-number-declaration/", label: "TFN Declaration" },
  { href: "/notice-of-assessment/", label: "Notice of Assessment" },
  { href: "/private-health-insurance-medicare/", label: "PHI & Medicare" },
  { href: "/fringe-benefits-tax/", label: "Fringe Benefits Tax" },
  // --- W2 wave 2 (23 Sep 2026) ---
  { href: "/tax-free-threshold/", label: "Tax-Free Threshold" },
  { href: "/medicare-levy-surcharge-calculator/", label: "Medicare Levy Surcharge" },
  // --- end W2 ---
] as const;

export const FOOTER_GUIDES_SUPER_PAY = [
  { href: "/superannuation-guide/", label: "Superannuation Guide" },
  { href: "/novated-lease-guide/", label: "How a Novated Lease Works" },
  { href: "/salary-packaging-guide/", label: "Salary Packaging" },
  { href: "/division-293-tax/", label: "Division 293 Tax" },
  { href: "/super-co-contribution/", label: "Super Co-Contribution" },
  { href: "/super-guarantee-rate-history/", label: "SG Rate History" },
  { href: "/super-guarantee-charge/", label: "Super Guarantee Charge" },
  // --- W2 wave 2 (23 Sep 2026) ---
  { href: "/concessional-contributions-cap/", label: "Concessional Cap" },
  // --- end W2 ---
  { href: "/salary-sacrifice-vs-mortgage/", label: "Sacrifice vs Mortgage" },
  { href: "/extra-super-vs-hecs-repayment/", label: "Super vs HECS" },
  { href: "/understanding-your-payslip/", label: "Understanding Your Payslip" },
  { href: "/stsl-on-payslip/", label: "STSL on Your Payslip" },
  { href: "/award-rates/", label: "Award Rates" },
  { href: "/schads-award-pay-rates/", label: "SCHADS Award Pay Rates" },
  { href: "/hospitality-award-rates/", label: "Hospitality Award Rates" },
  { href: "/retail-award-rates/", label: "Retail Award Rates" },
  // --- Award cluster C3 (Sep 2026) ---
  { href: "/fast-food-award-rates/", label: "Fast Food Award Rates" },
  { href: "/pharmacy-award-rates/", label: "Pharmacy Award Rates" },
  { href: "/manufacturing-award-rates/", label: "Manufacturing Award Rates" },
  { href: "/security-award-rates/", label: "Security Award Rates" },
  { href: "/clerks-award-rates/", label: "Clerks Award Rates" },
  // --- end award cluster C3 ---
  // --- T4: awards batch 3 (23 Sep 2026) ---
  { href: "/restaurant-award-rates/", label: "Restaurant Award Rates" },
  { href: "/nurses-award-rates/", label: "Nurses Award Rates" },
  { href: "/aged-care-award-rates/", label: "Aged Care Award Rates" },
  { href: "/hair-and-beauty-award-rates/", label: "Hair & Beauty Award Rates" },
  { href: "/cleaning-award-rates/", label: "Cleaning Award Rates" },
  { href: "/road-transport-award-rates/", label: "Road Transport Award Rates" },
  // --- end T4 ---
  { href: "/junior-pay-rates/", label: "Junior Pay Rates" },
  { href: "/overtime-penalty-rates-guide/", label: "Penalty Rates" },
  { href: "/annual-leave-guide/", label: "Annual Leave Guide" },
  { href: "/minimum-wage-history-australia/", label: "Minimum Wage History" },
] as const;

export const FOOTER_GUIDES_EMPLOYMENT = [
  { href: "/first-job-pay-guide/", label: "First Job Guide" },
  { href: "/new-job-checklist/", label: "New Job Checklist" },
  { href: "/gig-economy-pay-guide/", label: "Gig Economy Guide" },
  { href: "/employee-vs-sole-trader-vs-company/", label: "Business Structure" },
  { href: "/salary-vs-hourly/", label: "Salary vs Hourly" },
  { href: "/full-time-vs-part-time-vs-casual/", label: "FT vs PT vs Casual" },
  { href: "/working-holiday-tax/", label: "Working Holiday Tax" },
  { href: "/non-resident-tax/", label: "Non-Resident Tax" },
  { href: "/centrelink-income-test/", label: "Centrelink Income Test" },
  { href: "/parental-leave-pay/", label: "Paid Parental Leave" },
  { href: "/zone-tax-offset/", label: "Zone Tax Offset" },
  { href: "/sapto-calculator/", label: "SAPTO Calculator" },
  { href: "/hourly-to-salary/40/", label: "$40 an Hour Is How Much a Year" },
  { href: "/hourly-to-salary/35/", label: "$35 an Hour Is How Much a Year" },
  { href: "/average-salary-australia/", label: "Average Salary Australia" },
  { href: "/mining-fifo-pay-guide/", label: "Mining & FIFO Pay" },
  { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
  { href: "/teacher-pay-australia/", label: "Teacher Pay" },
  { href: "/retail-hospitality-pay-guide/", label: "Retail & Hospitality Pay" },
  { href: "/tech-salary-guide-australia/", label: "IT & Tech Salaries" },
  { href: "/construction-trades-pay/", label: "Construction & Trades" },
] as const;

/** @deprecated Use FOOTER_GUIDES_TAX, FOOTER_GUIDES_SUPER_PAY, FOOTER_GUIDES_EMPLOYMENT instead */
export const FOOTER_GUIDES = [
  ...FOOTER_GUIDES_TAX,
  ...FOOTER_GUIDES_SUPER_PAY,
  ...FOOTER_GUIDES_EMPLOYMENT,
] as const;

export const FOOTER_STATES_AND_LEGAL = [
  { href: "/pay-calculator-nsw/", label: "Pay Calculator NSW" },
  { href: "/pay-calculator-vic/", label: "Pay Calculator VIC" },
  { href: "/pay-calculator-qld/", label: "Pay Calculator QLD" },
  { href: "/pay-calculator-wa/", label: "Pay Calculator WA" },
  { href: "/pay-calculator-sa/", label: "Pay Calculator SA" },
  { href: "/pay-calculator-tas/", label: "Pay Calculator TAS" },
  { href: "/pay-calculator-act/", label: "Pay Calculator ACT" },
  { href: "/pay-calculator-nt/", label: "Pay Calculator NT" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
  { href: "/privacy/", label: "Privacy Policy" },
  { href: "/terms/", label: "Terms of Use" },
] as const;

export const FOOTER_TAX_ON_SALARY = [
  { href: "/tax-on/40000/", label: "Tax on $40K" },
  { href: "/tax-on/50000/", label: "Tax on $50K" },
  { href: "/tax-on/60000/", label: "Tax on $60K" },
  { href: "/tax-on/70000/", label: "Tax on $70K" },
  { href: "/tax-on/80000/", label: "Tax on $80K" },
  { href: "/tax-on/90000/", label: "Tax on $90K" },
  { href: "/tax-on/100000/", label: "Tax on $100K" },
  { href: "/tax-on/120000/", label: "Tax on $120K" },
  { href: "/tax-on/150000/", label: "Tax on $150K" },
  { href: "/tax-on/200000/", label: "Tax on $200K" },
] as const;

// Footer news links — hub + 8 curated articles. All hrefs verified against
// NEWS_ARTICLES in lib/news.ts (24 articles, Tasks 6–10 complete).
export const FOOTER_NEWS = [
  { href: "/news/", label: "Pay & Tax News" },
  { href: "/news/july-1-2026-money-changes/", label: "July 1 Money Changes" },
  { href: "/news/minimum-wage-increase-july-2026/", label: "Minimum Wage Increase 2026" },
  { href: "/news/payday-super-starts-july-2026/", label: "Payday Super" },
  { href: "/news/tax-cut-july-2026/", label: "July 2026 Tax Cut" },
  { href: "/news/hecs-indexation-2026/", label: "HECS Indexation 2026" },
  { href: "/news/super-contribution-caps-2026-27/", label: "Super Caps 2026-27" },
  { href: "/news/age-pension-increase-march-2026/", label: "Age Pension Increase" },
  { href: "/news/centrelink-changes-july-2026/", label: "Centrelink Changes July 2026" },
] as const;