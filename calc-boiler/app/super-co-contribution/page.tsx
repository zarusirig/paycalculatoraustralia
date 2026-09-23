import type { Metadata } from "next";
import SuperCoContributionPage from "@/modules/guide/super-co-contribution";
import { faqPageSchema } from "@/lib/faq";
import { SUPER_CO_CONTRIBUTION_FAQS } from "@/modules/guide/super-co-contribution-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { pageDateModified, pageDatePublished } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/super-co-contribution/`;
const TITLE = "Super Co-Contribution & Spouse Tax Offset Explained";
const DESCRIPTION = "Government super co-contribution: up to $500 matched for low-income earners, plus the spouse contribution tax offset up to $540. Eligibility, thresholds, claiming.";

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
    { "@type": "ListItem", position: 2, name: "Super Co-Contribution", item: URL },
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
  datePublished: pageDatePublished("super-co-contribution"),
  dateModified: pageDateModified("super-co-contribution"),
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  isBasedOn: { "@type": "Legislation", name: "Superannuation (Government Co-contribution for Low Income Earners) Act 2003", url: "https://www.legislation.gov.au/Details/C2024C00123" },
};

const faq = faqPageSchema(SUPER_CO_CONTRIBUTION_FAQS);

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <SuperCoContributionPage />
    </>
  );
}

export default withPageEnd(Page, "/super-co-contribution/");
