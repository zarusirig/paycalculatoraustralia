import type { Metadata } from "next";
import FortnightlyPayCalculatorPage from "@/modules/calculator/fortnightly-pay-calculator";
import WhatsNextInline from "@/components/common/whats-next-inline";
import FortnightlyPayCalculatorContent from "@/modules/calculator/fortnightly-pay-calculator-content";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { faqPageSchema } from "@/lib/faq";
import { FORTNIGHTLY_FAQS } from "@/modules/calculator/fortnightly-pay-calculator-faqs";
import { calculatePayBreakdown, formatAUD, SITE_CONFIG } from "@/lib/constants";
import { fitDescription } from "@/lib/seo-title";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { pageDateModified } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

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
// fitDescription: fuller form first; the shorter form keeps the figure, the FY
// and "fortnightly tax calculator".
// Meta pass 23 Oct 2026: the "26 fortnights a year, or 27" tail is gone. The
// answer query "how many fortnights in a year" (12,964 impr/28d split across
// this URL and /fortnights-in-a-year/) belongs to /fortnights-in-a-year/; this
// snippet now answers the calculator's own "$X a fortnight is how much a year".
// Previous: "$80,000 is $X a fortnight after tax in FY ($3,077 gross ÷ 26). Fortnightly
// tax calculator: enter fortnightly pay or salary. 26 fortnights a year, or 27."
const DESCRIPTION = fitDescription(
  `$80,000 is ${formatAUD(at80k.fortnightly)} a fortnight after tax in ${FY}, and $2,500 a fortnight is ${formatAUD(2_500 * 26)} a year before tax. Fortnightly tax calculator for any pay or salary.`,
  `$80,000 is ${formatAUD(at80k.fortnightly)} a fortnight after tax in ${FY}; $2,500 a fortnight is ${formatAUD(2_500 * 26)} a year. Fortnightly tax calculator for pay or salary.`,
);

export const metadata: Metadata = withFeaturedImage({
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
  },
  twitter: { card: "summary_large_image", title: TITLE, description: `Take-home pay every 2 weeks, ${FY} rates.` },
});

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
      <FortnightlyPayCalculatorPage afterCalculator={<WhatsNextInline route="/fortnightly-pay-calculator/" />}>
        <FortnightlyPayCalculatorContent />
      </FortnightlyPayCalculatorPage>
    </>
  );
}

export default withPageEnd(Page, "/fortnightly-pay-calculator/");
