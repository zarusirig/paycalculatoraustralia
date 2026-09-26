import type { Metadata } from "next";
import SalarySacrificeCalculatorPage from "@/modules/calculator/salary-sacrifice-calculator";
import WhatsNextInline from "@/components/common/whats-next-inline";
import SalarySacrificeCalculatorContent from "@/modules/calculator/salary-sacrifice-calculator-content";
import { faqPageSchema } from "@/lib/faq";
import { SALARY_SACRIFICE_FAQS } from "@/modules/calculator/salary-sacrifice-calculator-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG, calculatePayBreakdown, formatAUD } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { pageDateModified } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/salary-sacrifice-calculator/`;

const FY = SITE_CONFIG.financialYear;
// Previous: "Salary Sacrifice Calculator — How Much Will You Save?"
// seo-brain 25 Sep 2026 (Jev-ranked): keep tokens calculator/salary/sacrifice; adds "tax" and the FY.
const TITLE = `Salary Sacrifice Tax Calculator ${FY} — Pay Before and After`;
// The calculator's defaults (modules/calculator/salary-sacrifice-calculator:
// $100,000 salary, $10,000 sacrifice) through the same engine call it makes,
// so the description and the first render always agree.
const DEFAULT_SALARY = 100_000;
const DEFAULT_SACRIFICE = 10_000;
const withoutSacrifice = calculatePayBreakdown({ grossSalary: DEFAULT_SALARY });
const withSacrifice = calculatePayBreakdown({ grossSalary: DEFAULT_SALARY, salarySacrifice: DEFAULT_SACRIFICE });
const taxSavedAtDefaults = withoutSacrifice.totalDeductions - withSacrifice.totalDeductions;
const takeHomeCutAtDefaults = withoutSacrifice.takeHomePay - withSacrifice.takeHomePay;
// Previous: "Compare take-home pay before and after salary sacrifice. See your tax savings, super boost & actual benefit. Free Australian calculator updated for FY2026-27."
// seo-brain 25 Sep 2026 (Jev-ranked): a concrete tax-saved figure instead of a promise.
const DESCRIPTION = `On ${formatAUD(DEFAULT_SALARY)}, salary sacrificing ${formatAUD(DEFAULT_SACRIFICE)} to super saves ${formatAUD(taxSavedAtDefaults)} tax in ${FY} and cuts take-home by ${formatAUD(takeHomeCutAtDefaults)}. Compare pay before and after, plus how it is calculated.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: "Compare pay before and after sacrifice. See your tax savings.",
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Salary Sacrifice Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Salary Sacrifice Calculator Australia",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: pageDateModified("salary-sacrifice-calculator"),
  inLanguage: "en-AU",
};

const faq = faqPageSchema(SALARY_SACRIFICE_FAQS);

const howToSchema = calculatorHowTo({
  name: "How to Use the Salary Sacrifice Calculator",
  url: URL,
  description: "Calculate your salary sacrifice tax savings in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <SalarySacrificeCalculatorPage afterCalculator={<WhatsNextInline route="/salary-sacrifice-calculator/" />}>
        <SalarySacrificeCalculatorContent />
      </SalarySacrificeCalculatorPage>
    </>
  );
}

export default withPageEnd(Page, "/salary-sacrifice-calculator/");
