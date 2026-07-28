import type { Metadata } from "next";
import Schedule5TaxTablePage from "@/modules/tax-tables/schedule-5-tax-table";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/schedule-5-tax-table/`;
const TITLE = "Schedule 5 Tax Table — PAYG on Bonuses & Back Pay";
const DESCRIPTION = "How PAYG Schedule 5 (NAT 3348) works for back payments, commissions and bonuses: Method A vs Method B explained with a 2026-27 calculator showing the tax withheld from your bonus.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "PAYG Withholding Tables", item: `${BASE}/payg-withholding-tables/` },
    { "@type": "ListItem", position: 3, name: "Schedule 5 Tax Table", item: URL },
  ]
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
  dateModified: "2026-07-01",
  isBasedOn: { "@type": "CreativeWork", name: "ATO Schedule 5 — Tax table for back payments, commissions, bonuses and similar payments (NAT 3348)", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-table-back-payments-commissions-bonuses-and-similar-payments" },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is PAYG Schedule 5?", acceptedAnswer: { "@type": "Answer", text: "Schedule 5 (NAT 3348) is the ATO withholding schedule for back payments, commissions, bonuses and similar lump-sum payments. It spreads the payment across the year's pay periods so withholding matches your real marginal rate instead of over-taxing the lump sum." } },
    { "@type": "Question", name: "Is there a flat tax rate on bonuses in Australia?", acceptedAnswer: { "@type": "Answer", text: "No. Bonuses are ordinary assessable income taxed at your marginal rate. Schedule 5 only controls how much is withheld when the bonus is paid — your final tax is settled in your annual return." } },
    { "@type": "Question", name: "What is the difference between Method A and Method B?", acceptedAnswer: { "@type": "Answer", text: "Method A apportions the additional payment across the current year's pay periods for payments relating to the current period. Method B(ii), the payroll software default, spreads the payment evenly across all pay periods in the year and withholds the per-period difference multiplied by the number of periods." } },
    { "@type": "Question", name: "Does HECS-HELP (STSL) apply to Schedule 5 payments?", acceptedAnswer: { "@type": "Answer", text: "Yes. If you have a study or training support loan, the STSL component is calculated on the combined earnings in the same Method A/B steps, so a bonus increases the loan repayment withheld for that pay." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <Schedule5TaxTablePage />
    </>
  );
}
