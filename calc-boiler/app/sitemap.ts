export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { ALL_RATES, hourlyRateSlug } from "@/modules/programmatic/hourly-to-salary";
import { NEWS_ARTICLES } from "@/lib/news";

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
    "final-pay-calculator",
    "employment-type-calculator",
    "backpay-calculator",
    "payslip-generator",
    "ytd-income-calculator",
    "capital-gains-tax-calculator",
    "work-hours-calculator",
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

  // 6. Programmatic /tax-on/ pages — priority 0.5
  for (let salary = 30000; salary <= 200000; salary += 5000) {
    allPages.push({
      slug: `tax-on/${salary}`,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  // 7. Programmatic /take-home-pay-on/ pages — priority 0.5
  for (let salary = 30000; salary <= 200000; salary += 5000) {
    allPages.push({
      slug: `take-home-pay-on/${salary}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    });
  }

  // 8. Programmatic /salary-to-hourly/ pages — priority 0.5
  const salaryToHourlySalaries = [30000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000, 80000, 85000, 90000, 95000, 100000, 110000, 120000, 130000, 140000, 150000, 200000];
  for (const salary of salaryToHourlySalaries) {
    allPages.push({
      slug: `salary-to-hourly/${salary}`,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    });
  }

  // 8b. Programmatic /hourly-to-salary/ pages — the reverse direction, which
  // carries more AU volume than salary→hourly (gap analysis §D1). Priority 0.5.
  for (const rate of ALL_RATES) {
    allPages.push({
      slug: `hourly-to-salary/${hourlyRateSlug(rate)}`,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    });
  }

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
