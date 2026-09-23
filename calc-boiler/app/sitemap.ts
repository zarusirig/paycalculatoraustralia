export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { ALL_RATES, hourlyRateSlug } from "@/modules/programmatic/hourly-to-salary";
import { NEWS_ARTICLES } from "@/lib/news";
import { JURISDICTION_CODES } from "@/lib/constants/long-service-leave";
import { TEACHER_STATE_SLUGS } from "@/lib/data/teacher-pay/types";
// C1 employer pay rates (2026-09-23)
import { EMPLOYER_SLUGS } from "@/lib/data/employer-pay/types";
import { NURSING_PAY_STATES } from "@/lib/data/nursing-pay";
import { JURISDICTION_SLUGS as PUBLIC_SERVICE_SLUGS } from "@/lib/data/public-service-pay";
import { MIN_WAGE_AGES } from "@/lib/constants/minimum-wage"; // minimum wage cluster (C5)
// C2 occupation pay rates + C5 ADF pay scales (2026-09-23)
import { OCCUPATION_SLUGS } from "@/lib/data/job-pay-rates/types";
import { ADF_SERVICE_SLUGS } from "@/lib/data/adf-pay/types";
// --- T2 payroll tax cluster (23 Sep 2026) ---
import { PAYROLL_TAX_STATE_CODES } from "@/lib/constants/payroll-tax";
// --- end T2 ---
// T6 programmatic salary grid (2026-09-23)
import { SALARY_TO_HOURLY_SALARIES, TAKE_HOME_SALARIES, TAX_ON_SALARIES } from "@/lib/data/salary-pages";

/**
 * Dynamic sitemap generator — Pay Calculator Australia
 * Dates staggered across Feb 15 – Mar 15 2026 for natural crawl cadence.
 * Priorities per technical-seo-specification.md
 */

/** Deterministic date between start and end based on index / total */
function staggeredDate(index: number, total: number): Date {
  const start = new Date("2026-02-15T00:00:00+11:00").getTime();
  const end = new Date("2026-03-15T23:59:59+11:00").getTime();
  const range = end - start;

  // Spread evenly, then add a small per-slug offset so times vary
  const base = start + (range * index) / Math.max(total - 1, 1);
  // Deterministic jitter: shift hours based on index
  const jitterMs = ((index * 7) % 24) * 60 * 60 * 1000;
  return new Date(base + jitterMs);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://pay-calculator-australia.com";

  // Collect every page in publish order so we can stagger dates
  const allPages: {
    slug: string;
    changeFrequency: "weekly" | "monthly" | "yearly";
    priority: number;
  }[] = [];

  // 1. Homepage — published first
  allPages.push({ slug: "", changeFrequency: "weekly", priority: 1.0 });

  // 2. Core Calculators — priority 0.9
  const coreCalculators = [
    "income-tax-calculator",
    "take-home-pay-calculator",
    "superannuation-calculator",
    "salary-sacrifice-calculator",
    "hecs-help-calculator",
    "pay-rise-calculator",
    "redundancy-pay-calculator",
    "contractor-vs-employee-calculator",
    "gross-pay-calculator",
    "salary-package-calculator",
    "hourly-to-annual-salary-calculator",
    "contractor-pay-calculator",
    "bonus-tax-calculator",
    "commission-tax-calculator",
    "overtime-pay-calculator",
    "leave-calculator",
    "tax-return-calculator",
    "second-job-tax-calculator",
    "jobseeker-payment-calculator",
    "austudy-youth-allowance-calculator",
    "age-pension-income-test-calculator",
    // C4 Centrelink family payments (added 2026-09-23)
    "parenting-payment-calculator",
    "family-tax-benefit-calculator",
    "rent-assistance-calculator",
    // end C4
    // W3 Centrelink wave 2 (added 2026-09-23)
    "carer-payment-calculator",
    "carer-allowance",
    "centrelink-advance-payment",
    // end W3
    "final-pay-calculator",
    "employment-type-calculator",
    "backpay-calculator",
    "payslip-generator",
    "ytd-income-calculator",
    "capital-gains-tax-calculator",
    "work-hours-calculator",
    "novated-lease-calculator",
  ];
  for (const slug of coreCalculators) {
    allPages.push({ slug, changeFrequency: "monthly", priority: 0.9 });
  }

  // 3. Pay Frequency Pages — priority 0.7
  const frequencyPages = [
    "weekly-pay-calculator",
    "fortnightly-pay-calculator",
    "monthly-pay-calculator",
    "annual-pay-calculator",
  ];
  for (const slug of frequencyPages) {
    allPages.push({ slug, changeFrequency: "monthly", priority: 0.7 });
  }

  // 4. State Pages — priority 0.7
  const statePages = [
    "pay-calculator-nsw",
    "pay-calculator-qld",
    "pay-calculator-vic",
    "pay-calculator-wa",
    "pay-calculator-sa",
    "pay-calculator-tas",
    "pay-calculator-act",
    "pay-calculator-nt",
  ];
  for (const slug of statePages) {
    allPages.push({ slug, changeFrequency: "monthly", priority: 0.7 });
  }

  // 5. Guide Pages — priority 0.8
  const guidePages = [
    "tax-brackets",
    "superannuation-guide",
    "medicare-levy",
    "payg-withholding-tables",
    "weekly-tax-table",
    "fortnightly-tax-table",
    "monthly-tax-table",
    "schedule-5-tax-table",
    "low-income-tax-offset",
    "understanding-your-payslip",
    "stsl-on-payslip",
    "award-rates",
    "schads-award-pay-rates",
    "hospitality-award-rates",
    "retail-award-rates",
    // --- Award cluster C3 (Sep 2026): additional per-award rate pages ---
    "fast-food-award-rates",
    "pharmacy-award-rates",
    "manufacturing-award-rates",
    "security-award-rates",
    "clerks-award-rates",
    // --- end award cluster C3 ---
    // --- T4: awards batch 3 (23 Sep 2026) ---
    "restaurant-award-rates",
    "nurses-award-rates",
    "aged-care-award-rates",
    "hair-and-beauty-award-rates",
    "cleaning-award-rates",
    "road-transport-award-rates",
    // --- end T4 ---
    "junior-pay-rates",
    "employer-cost-calculator",
    "overtime-penalty-rates-guide",
    "annual-leave-guide",
    "tax-refund-guide",
    "working-holiday-tax",
    "non-resident-tax",
    "novated-lease-guide",
    "centrelink-income-test",
    "fringe-benefits-tax",
    "parental-leave-pay",
    // W3 Centrelink wave 2 (added 2026-09-23)
    "centrelink-crisis-payment",
    "centrelink-debt",
    "cost-of-living-payment-2026",
    // end W3
    "zone-tax-offset",
    "sapto-calculator",
    "tax-calendar",
    "tax-deductions-guide",
    "work-from-home-deductions",
    "first-job-pay-guide",
    "new-job-checklist",
    "gig-economy-pay-guide",
    "stage-3-tax-cuts",
    "tax-changes-2026-27",
    "average-salary-australia",
    "private-health-insurance-medicare",
    "division-293-tax",
    "tax-file-number-declaration",
    "notice-of-assessment",
    "salary-packaging-guide",
    "salary-vs-hourly",
    "employee-vs-sole-trader-vs-company",
    "super-co-contribution",
    "super-guarantee-charge",
    "mining-fifo-pay-guide",
    "healthcare-worker-pay",
    "teacher-pay-australia",
    "retail-hospitality-pay-guide",
    "tech-salary-guide-australia",
    "construction-trades-pay",
    "tax-bracket-history",
    "super-guarantee-rate-history",
    "minimum-wage-history-australia",
    "full-time-vs-part-time-vs-casual",
    "salary-sacrifice-vs-mortgage",
    "extra-super-vs-hecs-repayment",
  ];
  for (const slug of guidePages) {
    allPages.push({ slug, changeFrequency: "monthly", priority: 0.8 });
  }

  // --- T6: programmatic salary grid (2026-09-23) ---
  // Hubs + every page, read from the same lists the routes' generateStaticParams
  // use (lib/data/salary-pages), so the sitemap cannot drift from the build.
  for (const hub of ["take-home-pay-on", "tax-on", "salary-to-hourly"]) {
    allPages.push({ slug: hub, changeFrequency: "monthly" as const, priority: 0.6 });
  }
  // 6. Programmatic /tax-on/ pages — priority 0.5
  for (const salary of TAX_ON_SALARIES) {
    allPages.push({ slug: `tax-on/${salary}`, changeFrequency: "monthly" as const, priority: 0.5 });
  }
  // 7. Programmatic /take-home-pay-on/ pages — priority 0.5
  for (const salary of TAKE_HOME_SALARIES) {
    allPages.push({ slug: `take-home-pay-on/${salary}`, changeFrequency: "monthly" as const, priority: 0.5 });
  }
  // 8. Programmatic /salary-to-hourly/ pages — priority 0.5
  for (const salary of SALARY_TO_HOURLY_SALARIES) {
    allPages.push({ slug: `salary-to-hourly/${salary}`, changeFrequency: "yearly" as const, priority: 0.5 });
  }
  // --- end T6 ---

  // 8b. Programmatic /hourly-to-salary/ pages — the reverse direction, which
  // carries more AU volume than salary→hourly (gap analysis §D1). Priority 0.5.
  for (const rate of ALL_RATES) {
    allPages.push({
      slug: `hourly-to-salary/${hourlyRateSlug(rate)}`,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    });
  }

  // 8c. Pay-scale and entitlement spokes (competitor gap analysis, 28 Aug 2026).
  // Each list is imported from the same data module the pages render from, so a
  // state added there appears here automatically and the two cannot drift.

  // Long service leave: hub is a core calculator, spokes carry per-Act rules.
  allPages.push({ slug: "long-service-leave-calculator", changeFrequency: "monthly" as const, priority: 0.9 });
  for (const state of JURISDICTION_CODES) {
    allPages.push({
      slug: `long-service-leave-calculator/${state}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    });
  }

  // Teacher pay by state — rates change on each agreement's scheduled date.
  for (const state of TEACHER_STATE_SLUGS) {
    allPages.push({
      slug: `teacher-pay-australia/${state}`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    });
  }

  // Nurse and midwife pay by state.
  for (const state of NURSING_PAY_STATES) {
    allPages.push({
      slug: `healthcare-worker-pay/${state}`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    });
  }

  // Public service classification pay scales: hub + built jurisdictions.
  allPages.push({ slug: "public-service-pay-scales", changeFrequency: "monthly" as const, priority: 0.8 });
  for (const j of PUBLIC_SERVICE_SLUGS) {
    allPages.push({
      slug: `public-service-pay-scales/${j}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    });
  }

  // --- C1: employer pay-rate pages (/pay-rates/ hub + one per employer), 2026-09-23 ---
  allPages.push({ slug: "pay-rates", changeFrequency: "monthly" as const, priority: 0.8 });
  for (const employer of EMPLOYER_SLUGS) {
    allPages.push({ slug: `pay-rates/${employer}`, changeFrequency: "monthly" as const, priority: 0.7 });
  }
  // --- end C1 ---
  // --- Minimum wage cluster (C5 workstream, 23 Sep 2026) ---
  // Current-rate hub, age spokes (list shared with generateStaticParams),
  // and the pro-rata and casual loading calculators.
  allPages.push({ slug: "minimum-wage-australia", changeFrequency: "monthly" as const, priority: 0.8 });
  for (const age of MIN_WAGE_AGES) {
    allPages.push({ slug: `minimum-wage-by-age/${age}`, changeFrequency: "monthly" as const, priority: 0.7 });
  }
  allPages.push({ slug: "pro-rata-salary-calculator", changeFrequency: "monthly" as const, priority: 0.9 });
  allPages.push({ slug: "casual-loading-calculator", changeFrequency: "monthly" as const, priority: 0.9 });
  // --- end minimum wage cluster ---
  // --- C2 occupation pay rates + C5 ADF pay scales (23 Sep 2026) ---
  allPages.push({ slug: "job-pay-rates", changeFrequency: "monthly" as const, priority: 0.8 });
  for (const occupation of OCCUPATION_SLUGS) {
    allPages.push({ slug: `job-pay-rates/${occupation}`, changeFrequency: "monthly" as const, priority: 0.7 });
  }
  allPages.push({ slug: "adf-pay-scales", changeFrequency: "monthly" as const, priority: 0.8 });
  for (const service of ADF_SERVICE_SLUGS) {
    allPages.push({ slug: `adf-pay-scales/${service}`, changeFrequency: "monthly" as const, priority: 0.7 });
  }
  // --- end C2/C5 ---
  // --- W2 wave 2: tax-free threshold, MLS calculator, concessional cap (23 Sep 2026) ---
  allPages.push({ slug: "tax-free-threshold", changeFrequency: "monthly" as const, priority: 0.8 });
  allPages.push({ slug: "medicare-levy-surcharge-calculator", changeFrequency: "monthly" as const, priority: 0.8 });
  allPages.push({ slug: "concessional-contributions-cap", changeFrequency: "monthly" as const, priority: 0.8 });
  // --- end W2 ---
  // --- W1 timely pages (Wave 2, 23 Sep 2026) ---
  allPages.push({ slug: "payday-super", changeFrequency: "monthly" as const, priority: 0.8 });
  allPages.push({ slug: "tax-return-2026", changeFrequency: "weekly" as const, priority: 0.8 });
  allPages.push({ slug: "pension-age-australia", changeFrequency: "monthly" as const, priority: 0.8 });
  // --- end W1 ---
  // --- T3 workplace entitlement attributes (Wave 3, 23 Sep 2026) ---
  for (const slug of [
    "time-in-lieu",
    "leave-loading-calculator",
    "enterprise-agreement",
    "travel-allowance",
    "cents-per-km",
    "gross-vs-net-pay",
    "centrelink-working-credit-calculator",
  ]) {
    allPages.push({ slug, changeFrequency: "monthly" as const, priority: 0.8 });
  }
  // --- end T3 ---
  // --- T2 payroll tax cluster (23 Sep 2026): calculator, hub, 8 state pages ---
  allPages.push({ slug: "payroll-tax-calculator", changeFrequency: "monthly" as const, priority: 0.9 });
  allPages.push({ slug: "payroll-tax", changeFrequency: "monthly" as const, priority: 0.8 });
  for (const state of PAYROLL_TAX_STATE_CODES) {
    allPages.push({ slug: `payroll-tax/${state}`, changeFrequency: "monthly" as const, priority: 0.8 });
  }
  // --- end T2 ---
  // --- T1 wave 3 tax core (23 Sep 2026) ---
  allPages.push({ slug: "tax-withheld-calculator", changeFrequency: "monthly" as const, priority: 0.9 });
  // --- end T1 ---
  // --- F8 Lever D linkable assets (24 Sep 2026): data study + embed instructions.
  // /embed/take-home-pay/ is deliberately absent: it is noindex (widget document).
  allPages.push({ slug: "australian-pay-report-2026", changeFrequency: "monthly" as const, priority: 0.8 });
  allPages.push({ slug: "embed", changeFrequency: "yearly" as const, priority: 0.5 });
  // --- end F8 ---

  // 9. E-E-A-T Compliance Pages — priority 0.3 (published last)
  const compliancePages = ["about", "contact", "privacy", "terms", "site-directory"];
  for (const slug of compliancePages) {
    allPages.push({ slug, changeFrequency: "yearly", priority: 0.3 });
  }

  // Build sitemap with staggered dates
  const total = allPages.length;

  // lastModified reflects build time so each deploy signals freshness to Google.
  const buildDate = new Date();

  // 10. News — hub weekly/0.7, articles monthly/0.6, real dates
  const newsEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/news/`,
      lastModified: buildDate,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...NEWS_ARTICLES.map((a) => ({
      url: `${baseUrl}/news/${a.slug}/`,
      lastModified: new Date(`${a.dateModified}T09:00:00+10:00`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return [
    ...allPages.map((page, index) => ({
      url: page.slug ? `${baseUrl}/${page.slug}/` : `${baseUrl}/`,
      lastModified: page.priority >= 0.7 ? buildDate : staggeredDate(index, total),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...newsEntries,
  ];
}
