import type { Metadata } from "next";
import STSLOnPayslipPage from "@/modules/guide/stsl-on-payslip";
import { faqPageSchema } from "@/lib/faq";
import { STSL_FAQS } from "@/modules/guide/stsl-on-payslip-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, Article, WithContext } from "schema-dts";
import { HECS_HELP, SITE_CONFIG, formatAUD } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { pageDatePublished } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/stsl-on-payslip/`;
const FY = SITE_CONFIG.financialYear;
// Previous: "What Is STSL on Your Payslip? STSL Tax Explained (2026-27)"
// seo-brain 25 Sep 2026 (Jev-ranked): keep tokens stsl/payslip/what; "what does STSL mean" is the
// query form, and HECS-HELP names what is withheld.
const TITLE = `What Does STSL Mean on a Payslip? HECS-HELP Withholding (${FY})`;
// Previous: "STSL on your payslip stands for Study and Training Support Loans — the extra tax withheld for your HECS-HELP repayment. How it's calculated and how to stop it."
// seo-brain 25 Sep 2026 (Jev-ranked): threshold from HECS_HELP.minimumThreshold; the weekly figure is
// the same /52 rounding the page body renders.
const DESCRIPTION = `STSL on a payslip is Study and Training Support Loans: the extra PAYG withheld for HECS-HELP, FEE-HELP and VET loans above ${formatAUD(HECS_HELP.minimumThreshold)} a year (${formatAUD(Math.round(HECS_HELP.minimumThreshold / 52))} a week) in ${FY}.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Understanding Your Payslip", item: `${BASE}/understanding-your-payslip/` },
    { "@type": "ListItem", position: 3, name: "STSL on Payslip", item: URL },
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
  datePublished: pageDatePublished("stsl-on-payslip", "2026-07-02"),
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  dateModified: "2026-07-02",
};

const faq = faqPageSchema(STSL_FAQS);

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <STSLOnPayslipPage />
    </>
  );
}

export default withPageEnd(Page, "/stsl-on-payslip/");
