import type { Metadata } from "next";
import SalaryPackageCalculatorPage from "@/modules/calculator/salary-package-calculator";
import WhatsNextInline from "@/components/common/whats-next-inline";
import SalaryPackageCalculatorContent from "@/modules/calculator/salary-package-calculator-content";
import { SALARY_PACKAGE_FAQS } from "@/modules/calculator/salary-package-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG, SUPER_GUARANTEE, formatAUD, formatPercent } from "@/lib/constants";
import { packageFromBase, splitPackage } from "@/lib/constants/salary-package";
import { fitDescription } from "@/lib/seo-title";
import { ORGANIZATION_SCHEMA, calculatorHowTo, PAY_CALCULATOR_STEPS } from "@/lib/schema";
import { pageDateModified } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/salary-package-calculator/`;
// Meta pass 23 Oct 2026: GSC queries are "100k plus super", "170k plus super",
// "how to calculate base salary from package including super" (pos 6 to 11),
// so the title puts "Plus Super" first and carries the FY like the SERP
// (paycal, industrysuper), and the description answers both directions with
// engine figures. Previous title: "Salary Package Calculator - Including Super
// or Plus Super"; previous description listed inputs with "$50k–$300k".
const FY = SITE_CONFIG.financialYear;
const plus100k = packageFromBase(100_000);
const incl100k = splitPackage(100_000);
const TITLE = `Salary Package Calculator ${FY}: Plus Super or Including Super`;
const DESCRIPTION = fitDescription(
  `$100,000 plus super is a ${formatAUD(plus100k.total)} package; $100,000 including super is ${formatAUD(incl100k.base)} base and ${formatAUD(incl100k.superAmount)} super at ${formatPercent(SUPER_GUARANTEE.rate, 0)}. Split any package and see ${FY} take-home pay.`,
  `$100,000 plus super is a ${formatAUD(plus100k.total)} package; $100,000 including super is ${formatAUD(incl100k.base)} base. Split any package and see ${FY} take-home pay.`,
);

export const metadata: Metadata = withFeaturedImage({
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: TITLE, description: "Package including super → base salary, super and take-home. Plus super → total package." },
});

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Salary Package Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Salary Package Calculator Australia",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: pageDateModified("salary-package-calculator"),
  inLanguage: "en-AU",
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: SALARY_PACKAGE_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

const howToSchema = calculatorHowTo({
  name: "How to Split a Salary Package Into Base and Super",
  url: URL,
  description: "Find the base salary inside a package, or the package a base plus super adds up to.",
  steps: PAY_CALCULATOR_STEPS,
});

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <SalaryPackageCalculatorPage afterCalculator={<WhatsNextInline route="/salary-package-calculator/" />}><SalaryPackageCalculatorContent /></SalaryPackageCalculatorPage>
    </>
  );
}

export default withPageEnd(Page, "/salary-package-calculator/");
