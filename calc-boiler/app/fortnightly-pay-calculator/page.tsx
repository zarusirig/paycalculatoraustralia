import type { Metadata } from "next";
import FortnightlyPayCalculatorPage from "@/modules/calculator/fortnightly-pay-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { calculatePayBreakdown, formatAUD, SITE_CONFIG } from "@/lib/constants";
import { FORTNIGHTLY_EXTRA_PAY } from "@/modules/tax-tables/ato-schedules";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/fortnightly-pay-calculator/`;

const FY = SITE_CONFIG.financialYear;
// Figures computed from the tax engine at build time, never hardcoded.
const at80k = calculatePayBreakdown({ grossSalary: 80_000, includeHECS: false, hasPrivateHealth: true });
const at85k = calculatePayBreakdown({ grossSalary: 85_000, includeHECS: false, hasPrivateHealth: true });

// GSC/DataForSEO: "fortnightly" 12.1k (we're #6), "fortnightly tax calculator"
// 5.4k, "fortnights in a year" 2.4k. Title carries the FY so it reads current
// and rolls over with SITE_CONFIG; description leads with a real figure.
const TITLE = `Fortnightly Pay Calculator Australia ${FY}: Take-Home Pay`;
const DESCRIPTION = `$80,000 is ${formatAUD(at80k.fortnightly)} a fortnight after tax in ${FY} (${formatAUD(80_000 / 26)} gross ÷ 26). See your fortnightly tax, super and take-home pay. 26 fortnights a year, sometimes ${FORTNIGHTLY_EXTRA_PAY.extraPayCount}.`;

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
  twitter: { card: "summary_large_image", title: TITLE, description: `Take-home pay every 2 weeks — ${FY} rates.` },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Fortnightly Pay Calculator", item: URL },
  ]
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Fortnightly Pay Calculator Australia",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en-AU"
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How much is an $85,000 salary fortnightly after tax?", acceptedAnswer: { "@type": "Answer", text: `An $85,000 annual salary equals ${formatAUD(85_000 / 26, 2)} gross per fortnight before tax. After income tax and the 2% Medicare levy for FY${FY}, the net fortnightly take-home is ${formatAUD(at85k.fortnightly, 2)} (for a resident claiming the tax-free threshold, no HECS-HELP, with private hospital cover).` } },
    { "@type": "Question", name: "How many fortnights are in a year?", acceptedAnswer: { "@type": "Answer", text: `There are 26 fortnights in a year (52 weeks ÷ 2), so fortnightly pay is annual salary ÷ 26. Because 26 fortnights cover only 364 days, about every 11 to 12 years a financial year contains ${FORTNIGHTLY_EXTRA_PAY.extraPayCount} fortnightly pay days.` } },
    { "@type": "Question", name: "How is fortnightly tax calculated in Australia?", acceptedAnswer: { "@type": "Answer", text: "Fortnightly tax in Australia is calculated by dividing your gross annual salary by 26 (the number of fortnights in a year), then applying the ATO PAYG fortnightly tax table. The table accounts for the 5 income tax brackets, the 2% Medicare levy, and the Low Income Tax Offset (LITO) so the correct amount reaches the ATO across the financial year." } },
    { "@type": "Question", name: "Why is my fortnightly pay different from monthly divided by 2?", acceptedAnswer: { "@type": "Answer", text: "Because a year has 26 fortnights but 12 months. Fortnightly pay = annual salary ÷ 26 ($3,269.23 on $85,000). Monthly pay = annual salary ÷ 12 ($7,083.33 on $85,000). Dividing monthly by 2 gives $3,541.67 — which is $272.44 higher than the real fortnightly amount. Two months each year contain 3 fortnightly pays instead of 2." } },
    { "@type": "Question", name: "Is super deducted from my fortnightly pay?", acceptedAnswer: { "@type": "Answer", text: "No. Your employer pays the 12% Superannuation Guarantee on top of your gross salary. It is not deducted from your fortnightly take-home pay unless your contract specifies a 'total package inclusive of super'." } },
    { "@type": "Question", name: "Are there 26 or 27 pays in a year?", acceptedAnswer: { "@type": "Answer", text: "Usually 26 fortnightly pays in a year (26 × 14 = 364 days). Every 11 to 12 years, a financial year contains 27 fortnightly pay days, which changes PAYG withholding slightly and can result in a small tax shortfall at year-end." } },
  ]
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Fortnightly Pay Calculator",
  url: URL,
  description: "Calculate your fortnightly take-home pay in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <FortnightlyPayCalculatorPage />
    </>
  );
}
