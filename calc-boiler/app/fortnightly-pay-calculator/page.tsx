import type { Metadata } from "next";
import FortnightlyPayCalculatorPage from "@/modules/calculator/fortnightly-pay-calculator";
import FortnightlyPayCalculatorContent from "@/modules/calculator/fortnightly-pay-calculator-content";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { faqPageSchema } from "@/lib/faq";
import { FORTNIGHTLY_FAQS } from "@/modules/calculator/fortnightly-pay-calculator-faqs";
import { calculatePayBreakdown, formatAUD, SITE_CONFIG } from "@/lib/constants";
import { FORTNIGHTLY_EXTRA_PAY } from "@/modules/tax-tables/ato-schedules";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { pageDateModified } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/fortnightly-pay-calculator/`;

const FY = SITE_CONFIG.financialYear;
// Figures computed from the tax engine at build time, never hardcoded.
const at80k = calculatePayBreakdown({ grossSalary: 80_000, includeHECS: false, hasPrivateHealth: true });

// GSC/DataForSEO: "fortnightly" 12.1k (we're #6), "fortnightly tax calculator"
// 5.4k, "fortnights in a year" 2.4k. Title carries the FY so it reads current
// and rolls over with SITE_CONFIG; description leads with a real figure.
// Head-term intent map (docs/seo/2026-09-23-head-term-intent-map.md): the ONE
// primary for "fortnightly tax calculator" (5.4k, we're #34 with this URL).
// "& Tax" joins the title (every existing token kept — this is our top page
// by impressions, 53.5k/28d at pos 5.4) and the calculator now takes
// fortnightly pay as well as salary. /fortnightly-tax-table/ keeps the
// "fortnightly tax table" terms.
// Previous: "Fortnightly Pay Calculator Australia ${FY}: Take-Home Pay".
const TITLE = `Fortnightly Pay & Tax Calculator Australia ${FY}: Take-Home Pay`;
const DESCRIPTION = `$80,000 is ${formatAUD(at80k.fortnightly)} a fortnight after tax in ${FY} (${formatAUD(80_000 / 26)} gross ÷ 26). Fortnightly tax calculator: enter fortnightly pay or salary. 26 fortnights a year, sometimes ${FORTNIGHTLY_EXTRA_PAY.extraPayCount}.`;

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
  name: `Fortnightly Pay & Tax Calculator Australia ${FY}`,
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: pageDateModified("fortnightly-pay-calculator"),
  inLanguage: "en-AU"
};

const faq = faqPageSchema(FORTNIGHTLY_FAQS);

const howToSchema = calculatorHowTo({
  name: "How to Use the Fortnightly Pay Calculator",
  url: URL,
  description: "Calculate your fortnightly take-home pay in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <FortnightlyPayCalculatorPage>
        <FortnightlyPayCalculatorContent />
      </FortnightlyPayCalculatorPage>
    </>
  );
}

export default withPageEnd(Page, "/fortnightly-pay-calculator/");
