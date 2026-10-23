import type { Metadata } from "next";
import UnderstandingYourPayslipPage from "@/modules/guide/understanding-your-payslip";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG, SUPER_GUARANTEE, formatPercent } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { pageDateModified, pageDatePublished } from "@/lib/page-dates";
import { faqPageSchema } from "@/lib/faq";
import { PAYSLIP_FAQS } from "@/modules/guide/understanding-your-payslip-faqs";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/understanding-your-payslip/`;
const TITLE = "Understanding Your Payslip in Australia - A Complete Guide";
const DESCRIPTION = "How to read your Australian payslip: gross pay, net pay, PAYG withholding, superannuation contributions, and your rights under the Fair Work Ombudsman.";

// Meta pass 23 Oct 2026: "understanding your payslip" is 1,183 impr/28d at
// pos 6.2 with 0.2% CTR. "A Complete Guide" said nothing; the SERP rewards
// line-by-line explainers ("Every Field Explained"). TITLE/DESCRIPTION above
// still feed the WebPage and Article JSON-LD unchanged.
const META_TITLE = "Understanding Your Payslip Australia: Every Line Explained";
const META_DESCRIPTION = `Read your payslip line by line: gross and net pay, PAYG tax, Medicare, ${formatPercent(SUPER_GUARANTEE.rate, 0)} super and YTD totals, what it must show by law and how to spot an underpayment.`;

export const metadata: Metadata = withFeaturedImage({
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: META_TITLE, description: META_DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: META_TITLE, description: META_DESCRIPTION },
});

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Understanding Your Payslip", item: URL },
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
  datePublished: pageDatePublished("understanding-your-payslip"),
  dateModified: pageDateModified("understanding-your-payslip"),
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["anita-bell"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  isBasedOn: { "@type": "Legislation", name: "Fair Work Act 2009", url: "https://www.legislation.gov.au/Details/C2024C00301" },
};

const faq = faqPageSchema(PAYSLIP_FAQS);

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <UnderstandingYourPayslipPage />
    </>
  );
}

export default withPageEnd(Page, "/understanding-your-payslip/");
