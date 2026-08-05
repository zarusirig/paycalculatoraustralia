import type { Metadata } from "next";
import IncomeTaxCalculatorPage from "@/modules/calculator/income-tax-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import {
  calculateIncomeTax,
  calculateLITO,
  calculateMedicareLevy,
  formatAUD,
  formatPercent,
  LITO,
  MEDICARE_LEVY,
  SITE_CONFIG,
  SUPER_GUARANTEE,
  TAX_BRACKETS,
  TAX_BRACKETS_2025_26,
  TAX_FREE_THRESHOLD,
} from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE_URL = SITE_CONFIG.baseUrl;
const PAGE_URL = `${BASE_URL}/income-tax-calculator/`;
const FY = SITE_CONFIG.financialYear;
const PREV_FY = SITE_CONFIG.previousFinancialYear;

// ---------------------------------------------------------------------------
// Every figure on this page is computed from the engine at build time. Nothing
// below is a typed dollar amount, so the title, description, JSON-LD and the
// rendered module can never drift from lib/constants — the 16%-vs-15%
// contradiction that shipped in July 2026 came from hardcoded worked examples.
// ---------------------------------------------------------------------------

/** Net-of-LITO annual tax pipeline for a resident salary, current FY. */
function taxSummary(salary: number) {
  const gross = Math.round(calculateIncomeTax(salary));
  const net = Math.max(0, Math.round(calculateIncomeTax(salary) - calculateLITO(salary)));
  const medicare = calculateMedicareLevy(salary);
  const total = net + medicare;
  const takeHome = salary - total;
  return { gross, net, medicare, total, takeHome, weekly: Math.round(takeHome / 52), effective: total / salary };
}

/** FY2025-26 gross income tax from the historical bracket constant — comparison only. */
function taxIn2025_26(income: number): number {
  for (let i = TAX_BRACKETS_2025_26.length - 1; i >= 0; i--) {
    const b = TAX_BRACKETS_2025_26[i];
    if (income >= b.min) return Math.round(b.base + (income - (b.min - 1)) * b.rate);
  }
  return 0;
}

const S60 = taxSummary(60_000);
const S80 = taxSummary(80_000);
const S100 = taxSummary(100_000);

const RATE_2 = formatPercent(TAX_BRACKETS[1].rate, 0); // 15% in FY2026-27
const RATE_3 = formatPercent(TAX_BRACKETS[2].rate, 0);
const RATE_4 = formatPercent(TAX_BRACKETS[3].rate, 0);
const RATE_5 = formatPercent(TAX_BRACKETS[4].rate, 0);
const OLD_RATE_2 = formatPercent(TAX_BRACKETS_2025_26[1].rate, 0); // 16% in FY2025-26
const T1 = formatAUD(TAX_FREE_THRESHOLD);
const T2 = formatAUD(TAX_BRACKETS[1].max);
const T3 = formatAUD(TAX_BRACKETS[2].max);
const T4 = formatAUD(TAX_BRACKETS[3].max);
/** Maximum annual value of the 1 July 2026 rate cut: bracket-2 width × 1 point. */
const RATE_CUT_SAVING = Math.round(
  (TAX_BRACKETS[1].max - TAX_FREE_THRESHOLD) * (TAX_BRACKETS_2025_26[1].rate - TAX_BRACKETS[1].rate)
);

// Shared FAQ copy. The sr-only mirror + accordion in the module and the
// FAQPage JSON-LD below both render from this one array, so structured data
// always covers 100% of the visible questions with identical text.
const FAQS: readonly { q: string; a: string }[] = [
  {
    q: "How much income tax do I pay in Australia?",
    a: `Australian residents pay income tax on a progressive scale in FY${FY}: 0% up to ${T1}, ${RATE_2} from ${formatAUD(TAX_BRACKETS[1].min)} to ${T2}, ${RATE_3} to ${T3}, ${RATE_4} to ${T4}, and ${RATE_5} above that. On an ${formatAUD(80_000)} salary you pay ${formatAUD(S80.net)} in income tax plus ${formatAUD(S80.medicare)} Medicare levy — ${formatAUD(S80.total)} in total, leaving take-home pay of ${formatAUD(S80.takeHome)}.`,
  },
  {
    q: "How much tax do I pay on $60,000?",
    a: `On a ${formatAUD(60_000)} salary you pay ${formatAUD(S60.net)} in income tax for FY${FY} after the Low Income Tax Offset, plus ${formatAUD(S60.medicare)} Medicare levy — ${formatAUD(S60.total)} in total, an effective rate of ${formatPercent(S60.effective)}. Take-home pay is ${formatAUD(S60.takeHome)} a year, about ${formatAUD(S60.weekly)} a week.`,
  },
  {
    q: "How much tax do I pay on $80,000?",
    a: `On ${formatAUD(80_000)} you pay ${formatAUD(S80.net)} in income tax for FY${FY} — down from ${formatAUD(taxIn2025_26(80_000))} in ${PREV_FY} thanks to the new ${RATE_2} rate. Adding the ${formatAUD(S80.medicare)} Medicare levy brings total tax to ${formatAUD(S80.total)}, for take-home pay of ${formatAUD(S80.takeHome)} a year (${formatAUD(S80.weekly)} a week).`,
  },
  {
    q: "How much tax do I pay on $100,000?",
    a: `On ${formatAUD(100_000)} you pay ${formatAUD(S100.net)} in income tax for FY${FY}, plus ${formatAUD(S100.medicare)} Medicare levy — ${formatAUD(S100.total)} in total. Take-home pay is ${formatAUD(S100.takeHome)} a year, about ${formatAUD(S100.weekly)} a week, and every extra dollar you earn is taxed at your ${RATE_3} marginal rate.`,
  },
  {
    q: `What are the ${FY} tax brackets in Australia?`,
    a: `The ATO resident brackets for FY${FY} are: ${T1} tax-free, then ${RATE_2} to ${T2}, ${RATE_3} to ${T3}, ${RATE_4} to ${T4}, and ${RATE_5} above ${T4}. The only change from ${PREV_FY} is the second rate falling from ${OLD_RATE_2} to ${RATE_2} on 1 July 2026 — a cut worth up to ${formatAUD(RATE_CUT_SAVING)} a year.`,
  },
  {
    q: "What is the tax-free threshold in Australia?",
    a: `The first ${T1} you earn each year is tax-free if you claim the threshold with your main employer. Because the Low Income Tax Offset refunds up to ${formatAUD(LITO.maxOffset)} of tax, you effectively pay no income tax until your income passes ${formatAUD(LITO.effectiveTaxFreeThreshold)} in FY${FY}. Claim the threshold with one employer only — claiming it twice creates a tax debt.`,
  },
  {
    q: "What is the difference between marginal and effective tax rates?",
    a: `Your marginal rate is the tax on your next dollar of income; your effective rate is total tax divided by total income. On ${formatAUD(100_000)} the marginal rate is ${RATE_3}, but the effective rate is only ${formatPercent(S100.effective)} including the Medicare levy, because the first ${T1} is tax-free and income up to ${T2} is taxed at just ${RATE_2}.`,
  },
  {
    q: "How much tax will I get back?",
    a: `Your refund equals the PAYG tax your employer withheld minus your actual annual liability. Refunds are common when you worked only part of the year, had tax withheld at no-threshold second-job rates, or claim work-related deductions that reduce your taxable income. Calculate your FY${FY} liability here, then compare it against the tax-withheld total on your income statement.`,
  },
  {
    q: "How is income tax collected from my pay?",
    a: `Through PAYG (Pay As You Go) withholding: your employer deducts an estimate of tax from every pay using the ATO withholding schedules and sends it to the ATO. When you lodge your return — by 31 October, or later through a registered tax agent — the ATO compares the total withheld with your actual liability and refunds or bills the difference.`,
  },
  {
    q: "Why does my payslip show more tax than this calculator?",
    a: `This calculator shows your annual tax liability. Your employer withholds using ATO schedules that annualise each individual pay and cannot see your deductions, offsets, or income changes across the year, so the withheld total usually lands slightly above the true liability. Anything over-withheld comes back as a refund after you lodge your return.`,
  },
  {
    q: "How is income tax calculated if I have two jobs?",
    a: `You claim the ${T1} tax-free threshold on one job only. Your second employer withholds with no tax-free threshold, starting at roughly ${RATE_2} from the first dollar under the FY${FY} schedules. At tax time the ATO combines all income and applies the normal brackets to the total — you are never taxed twice, but claiming the threshold on both jobs will leave you with a debt.`,
  },
  {
    q: "Do I pay the Medicare levy on top of income tax?",
    a: `Most taxpayers pay a Medicare levy of ${formatPercent(MEDICARE_LEVY.rate, 0)} of taxable income on top of income tax — ${formatAUD(S80.medicare)} on ${formatAUD(80_000)}. Low-income earners pay a reduced levy or none at all, and a Medicare Levy Surcharge of 1–1.5% applies above ${formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1)} if you do not hold private hospital cover.`,
  },
  {
    q: "Is superannuation included in taxable income?",
    a: `No. The ${formatPercent(SUPER_GUARANTEE.rate, 0)} superannuation guarantee your employer pays goes to your fund on top of your salary and is not part of your assessable income. Concessional contributions, including salary sacrifice, are taxed at 15% inside the fund instead of at your marginal rate — which is why salary sacrificing can cut your income tax.`,
  },
  {
    q: "What happens if I don't lodge a tax return?",
    a: `The ATO can charge failure-to-lodge penalties, hold back any refund you are owed, and eventually issue a default assessment based on the income it already knows about. Lodge by 31 October, or register with a tax agent before that date for an extended deadline. If you earned under the tax-free threshold you may only need to submit a non-lodgment advice.`,
  },
  {
    q: `Can I still calculate my ${PREV_FY} tax?`,
    a: `Yes. Tax returns lodged between July and October 2026 cover FY${PREV_FY}, when the second bracket rate was ${OLD_RATE_2} — so income tax on ${formatAUD(80_000)} was ${formatAUD(taxIn2025_26(80_000))} rather than ${formatAUD(S80.net)}. The brackets were otherwise identical. Use our tax return calculator to estimate your ${PREV_FY} refund before you lodge.`,
  },
];

const TITLE = `Income Tax Calculator Australia ${FY} — ATO Tax Brackets`;
const DESCRIPTION = `See how much income tax you pay in FY${FY}. ATO resident brackets with the new ${RATE_2} rate, LITO and Medicare levy — tax on ${formatAUD(80_000)} is ${formatAUD(S80.net)}, take-home ${formatAUD(S80.takeHome)}.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: `Income Tax Calculator Australia ${FY}`,
    description: `Calculate your income tax with a bracket-by-bracket breakdown. Free, accurate, updated for FY${FY}.`,
    url: PAGE_URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: `Income Tax Calculator Australia ${FY}`,
    description: `Free income tax calculator with bracket breakdown. ATO rates for FY${FY}.`,
  },
};

const breadcrumbSchema: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Income Tax Calculator", item: PAGE_URL },
  ],
};

const webAppSchema: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: `Income Tax Calculator Australia ${FY}`,
  url: PAGE_URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en-AU",
};

const faqSchema: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Income Tax Calculator",
  url: PAGE_URL,
  description: "Calculate your Australian income tax in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumbSchema, webAppSchema, faqSchema, ORGANIZATION_SCHEMA, howToSchema]} />
      <IncomeTaxCalculatorPage faqs={FAQS} />
    </>
  );
}
