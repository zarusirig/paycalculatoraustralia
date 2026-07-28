import type { Metadata } from "next";
import type { Article, BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import HecsHelpGuidePage, { type GuideFaq } from "@/modules/guide/hecs-help-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import { HECS_HELP, SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/hecs-help-guide/`;

// Deliberately not a threshold title. /hecs-repayment-threshold/ owns
// "hecs repayment threshold" and "hecs threshold"; this page owns how the loan
// behaves. The previous title — "HECS Repayment 2026-27 — Thresholds, Rates &
// What You Pay" — competed with both of the other two HECS pages.
const TITLE = "HECS-HELP Explained: How the Loan Actually Works";
const DESCRIPTION = `How a HECS-HELP debt behaves: ${HECS_HELP.indexationRate * 100}% indexation on 1 June, when a voluntary repayment is actually worth making, what you must report if you move overseas, and why the STSL on your payslip never matches your assessment.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

/**
 * Single source of FAQ copy for this page. Passed to the client component for
 * the accordion and its sr-only mirror, and mapped into the FAQPage JSON-LD
 * below, so the structured data can never disagree with the rendered page.
 * Threshold-shaped questions belong on /hecs-repayment-threshold/.
 */
const FAQS: readonly GuideFaq[] = [
  {
    q: "Does a HECS-HELP debt charge interest?",
    a: "No. The government charges no interest on study and training support loans. The balance is adjusted once a year by indexation instead, at the lower of CPI or the Wage Price Index, which keeps its real value steady rather than growing it.",
  },
  {
    q: "When is HECS debt indexed?",
    a: `On 1 June each year, and only to the part of the balance that has been unpaid for more than 11 months. The rate applied on ${HECS_HELP.indexationDate} was ${HECS_HELP.indexationRate * 100}%.`,
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
    q: "Do I still repay HECS if I live overseas?",
    a: "Yes, for HELP, VSL and AASL debts. If you reside outside Australia for 183 days or more in any 12-month period you must lodge an overseas travel notification within 7 days of leaving, then report your worldwide income by 31 October each year. Below 25% of the minimum repayment threshold you lodge a non-lodgment advice instead. Indexation continues on 1 June wherever you live.",
  },
  {
    q: "Does salary sacrifice reduce my HECS repayment?",
    a: "No. Salary sacrificing into super lowers your taxable income, but reportable super contributions are added straight back when the ATO works out your repayment income. The repayment income test exists precisely to close that gap.",
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

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "HECS-HELP Guide", item: URL },
  ],
};

const webPage: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: TITLE,
  url: URL,
  description: DESCRIPTION,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name },
};

const article: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/favicon.ico` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  isBasedOn: { "@type": "Legislation", name: "Higher Education Support Act 2003", url: "https://www.legislation.gov.au/Details/C2024C00410" },
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

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <HecsHelpGuidePage faqs={FAQS} />
    </>
  );
}
