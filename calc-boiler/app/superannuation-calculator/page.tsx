import type { Metadata } from "next";
import SuperannuationCalculatorPage from "@/modules/calculator/superannuation-calculator";
import SuperannuationCalculatorContent, {
  SuperannuationCalculatorIntro,
  SuperannuationCalculatorMiddle,
} from "@/modules/calculator/superannuation-calculator-content";
import { SUPERANNUATION_FAQS } from "@/modules/calculator/superannuation-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { calculateSuper, formatAUD, SITE_CONFIG, SUPER_GUARANTEE } from "@/lib/constants";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { pageDateModified } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/superannuation-calculator/`;

const FY = SITE_CONFIG.financialYear;
const SG = `${Math.round(SUPER_GUARANTEE.rate * 100)}%`;
const SUPER_80K = calculateSuper(80_000);

// 15k impr at 0.31% CTR (pos 6.2) under "Super Guarantee Calculator — 12% SG
// on Your Salary". DataForSEO shows the demand is plain-English: "calculate
// super on salary", "superannuation calculator for employers", "how much
// employer super contribution", "sg calculator". Title answers that; the
// description leads with a computed figure and the Payday Super change.
const TITLE = `Super Calculator ${FY}: How Much Super Your Employer Pays`;
const DESCRIPTION = `Your employer pays ${SG} super on top of salary: ${formatAUD(SUPER_80K)} a year on $80,000, paid with every pay from ${SUPER_GUARANTEE.paydaySuperStart}. Total package and ${formatAUD(SUPER_GUARANTEE.concessionalCap)} cap space for ${FY}.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: TITLE, description: `Employer super at ${SG} for ${FY}.` },
};

const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
  { "@type": "ListItem", position: 2, name: "Superannuation Calculator", item: URL },
]};

const webApp: WithContext<WebApplication> = { "@context": "https://schema.org", "@type": "WebApplication", name: "Superannuation Calculator Australia", url: URL, applicationCategory: "FinanceApplication", operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" }, creator: { "@type": "Organization", name: SITE_CONFIG.name }, dateModified: pageDateModified("superannuation-calculator"), inLanguage: "en-AU" };

// Built from the same array the on-page accordion renders, so the structured
// data cannot drift from the visible answers.
const faq: WithContext<FAQPage> = { "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: SUPERANNUATION_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Superannuation Calculator",
  url: URL,
  description: "Calculate your superannuation contributions in under a minute.",
  steps: PAY_CALCULATOR_STEPS,
});

function Page() {
  return (<><JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} /><SuperannuationCalculatorPage intro={<SuperannuationCalculatorIntro />} middle={<SuperannuationCalculatorMiddle />}><SuperannuationCalculatorContent /></SuperannuationCalculatorPage></>);
}

export default withPageEnd(Page, "/superannuation-calculator/");
