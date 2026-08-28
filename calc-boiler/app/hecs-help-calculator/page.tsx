import type { Metadata } from "next";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import HECSHelpCalculatorPage, { type CalculatorFaq } from "@/modules/calculator/hecs-help-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import { HECS_HELP, SITE_CONFIG, annualToWeekly, calculateHECS, formatAUD } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/hecs-help-calculator/`;

const T = HECS_HELP.minimumThreshold;
const B2 = HECS_HELP.bands[2];
const B3 = HECS_HELP.bands[3];

const TITLE = `HECS Repayment Calculator ${SITE_CONFIG.financialYear} — ${formatAUD(T)} Threshold & Rates`;
const DESCRIPTION = `Work out your compulsory HECS-HELP repayment for ${SITE_CONFIG.financialYear}: the ${formatAUD(T)} threshold, the marginal rate table, repayment at common incomes, indexation history, voluntary repayments and the overseas rules — one page for every study and training loan.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: `HECS Repayment Calculator Australia ${SITE_CONFIG.financialYear}`,
    description: `Free calculator on the marginal repayment system. ${SITE_CONFIG.financialYear} threshold ${formatAUD(T)}, covering every study and training support loan.`,
    url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: `HECS Repayment Calculator Australia ${SITE_CONFIG.financialYear}`,
    description: `Marginal system calculator, ${SITE_CONFIG.financialYear} thresholds, all six study loan schemes.`,
  },
};

/**
 * The former /hecs-help-calculator/ and /hecs-help-calculator/#threshold pages were merged
 * into this one on 2026-08-28 (both 301 here): GSC showed the guide taking half
 * the HECS impressions at 0.18% CTR and the threshold page at 0 clicks, while
 * this page converted at 1.1%. Their distinct FAQs live below.
 *
 * Single source of FAQ copy for this page. Passed to the client component for
 * the accordion and its sr-only mirror, and mapped into the FAQPage JSON-LD
 * below, so the structured data can never disagree with the rendered page.
 */
const FAQS: readonly CalculatorFaq[] = [
  {
    q: "How much is my HECS repayment on $80,000?",
    a: `On repayment income of ${formatAUD(80_000)} the compulsory repayment is ${formatAUD(calculateHECS(80_000))} for the year, about ${formatAUD(annualToWeekly(calculateHECS(80_000)), 2)} a week, in ${SITE_CONFIG.financialYear}. It is 15c for each $1 of the ${formatAUD(80_000 - T)} above the ${formatAUD(T)} threshold.`,
  },
  {
    q: "Which student loans does this calculator cover?",
    a: "All of them. The ATO applies one set of thresholds and rates to HELP (including HECS-HELP, FEE-HELP, OS-HELP and SA-HELP), VET Student Loans, the Student Financial Supplement Scheme, Student Start-up Loans, ABSTUDY SSL and the Australian Apprenticeship Support Loan. If you hold more than one, a single repayment is applied to them in that order.",
  },
  {
    q: `What are the HECS repayment rates for ${SITE_CONFIG.financialYear}?`,
    a: `Nil up to ${formatAUD(T)}; 15c for each $1 over ${formatAUD(T)} up to ${formatAUD(B2.min - 1)}; ${formatAUD(B2.base)} plus 17c for each $1 over ${formatAUD(B2.min - 1)} up to ${formatAUD(B2.max)}; and ${B3.marginalRate * 100}% of total repayment income from ${formatAUD(B3.min)}.`,
  },
  {
    q: "Do HECS repayments come out of my pay?",
    a: "Yes, if you told your employer about the loan on your tax file number declaration. The employer withholds an extra PAYG amount that appears as STSL on your payslip. It is an estimate; your actual repayment is assessed on full-year repayment income when you lodge.",
  },
  {
    q: "Why is the STSL on my payslip different from this calculator?",
    a: "STSL withholding is worked out from each pay period's earnings using the ATO withholding schedules, as though you earned that amount all year. Your assessed repayment uses full-year repayment income, which also adds back reportable fringe benefits, net investment losses and reportable super. The difference is settled in your refund or tax bill.",
  },
  {
    q: "What counts as repayment income?",
    a: `Taxable income plus reportable fringe benefits, total net investment loss, reportable super contributions and exempt foreign employment income. It is wider than salary, so a wage below ${formatAUD(T)} can still produce a compulsory repayment.`,
  },
  {
    q: "Can salary sacrifice reduce my HECS repayment?",
    a: "Barely. Salary sacrificing into super cuts taxable income, but reportable super contributions are added straight back when repayment income is worked out. The repayment income test was designed to close that gap.",
  },
  {
    q: "Do I repay if I move overseas?",
    a: "Yes, for HELP, VSL and AASL debts. If you reside overseas for 183 days or more in any 12 months you must lodge an overseas travel notification within 7 days of leaving, and report your worldwide income by 31 October each year. If your worldwide income is at or below 25% of the minimum repayment threshold you lodge a non-lodgment advice instead.",
  },
  {
    q: "What was the indexation rate in 2026?",
    a: `${HECS_HELP.indexationRate * 100}%, applied on ${HECS_HELP.indexationDate} to the part of the balance unpaid for more than 11 months. Indexation is the lower of CPI or the Wage Price Index, so a study loan cannot grow faster than wages.`,
  },
  {
    q: `What is the HECS repayment threshold for ${SITE_CONFIG.financialYear}?`,
    a: `${formatAUD(T)}. Repayment income at or below ${formatAUD(T)} attracts no compulsory repayment. Above it you repay 15c for each $1 over ${formatAUD(T)}, rising to ${formatAUD(B2.base)} plus 17c per $1 over ${formatAUD(B2.min - 1)}, then ${B3.marginalRate * 100}% of total repayment income from ${formatAUD(B3.min)}.`,
  },
  {
    q: "How much do I repay just over the threshold?",
    a: `Very little. At ${formatAUD(75_000)} the repayment is ${formatAUD(calculateHECS(75_000))} for the year. The marginal system charges 15c only on income above ${formatAUD(T)}, so crossing the line no longer triggers a repayment on your whole income.`,
  },
  {
    q: "Does a HECS-HELP debt charge interest?",
    a: "No. The government charges no interest on study and training support loans. The balance is adjusted once a year by indexation instead, at the lower of CPI or the Wage Price Index, which keeps its real value steady rather than growing it.",
  },
  {
    q: "Why did my balance go up even though I made repayments all year?",
    a: "Compulsory repayments withheld through PAYG are not credited to your loan until your tax return is assessed, which is usually after 1 June. So the balance indexed on 1 June can be higher than the balance you expected. Voluntary repayments, by contrast, are applied when the ATO processes them.",
  },
  {
    q: "Is it worth paying off HECS early?",
    a: `There is no discount or bonus for voluntary repayments, so it is purely a rate comparison: ${HECS_HELP.indexationRate * 100}% indexation against what the money would earn or save elsewhere. Higher-cost debt like credit cards and car loans should come first. The strongest cases for paying early are an imminent mortgage application, a nearly-cleared balance, or moving overseas.`,
  },
  {
    q: "Are HECS repayments tax-deductible?",
    a: "No. The ATO specifically excludes repayments under HELP (including HECS-HELP and FEE-HELP), SFSS, SSL, AASL and VET Student Loans from work-related self-education deductions. Other self-education costs such as textbooks or course fees you pay yourself may still be deductible.",
  },
  {
    q: "What is the difference between HECS-HELP and FEE-HELP?",
    a: "HECS-HELP covers the student contribution for a Commonwealth-supported place. FEE-HELP covers tuition for full fee-paying students who do not receive Commonwealth support. Both sit under the HELP umbrella and are repaid under identical thresholds and rates. Loan fees and lifetime limits differ and are set by the Department of Education, not the ATO.",
  },
  {
    q: "How do I check my HELP balance?",
    a: "Sign in to ATO online services through myGov, or use the ATO app, and open your study and training loan account. It shows the current balance, repayments credited and indexation applied. The balance updates after each year's assessment, not during the year.",
  },
];

const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
  { "@type": "ListItem", position: 2, name: "HECS Repayment Calculator", item: URL },
]};

const webApp: WithContext<WebApplication> = { "@context": "https://schema.org", "@type": "WebApplication",
  name: `HECS Repayment Calculator Australia ${SITE_CONFIG.financialYear}`, url: URL, applicationCategory: "FinanceApplication", operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: new Date().toISOString().split("T")[0], inLanguage: "en-AU",
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

const howToSchema = calculatorHowTo({
  name: "How to Use the HECS Repayment Calculator",
  url: URL,
  description: "Calculate your compulsory study and training loan repayment in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <HECSHelpCalculatorPage faqs={FAQS} />
    </>
  );
}
