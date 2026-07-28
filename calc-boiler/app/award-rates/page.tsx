import type { Metadata } from "next";
import AwardRatesGuidePage from "@/modules/guide/award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/award-rates/`;
const TITLE = "Award Rates Australia — Minimum Pay by Industry & Level";
const DESCRIPTION = "Find current minimum award pay rates in Australia for FY2026-27. Hospitality, retail, building & construction, nurses, teachers — covered by industry, with overtime, penalty rate & allowance calculations.";

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
    { "@type": "ListItem", position: 2, name: "Award Rates Guide", item: URL },
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
  author: AUTHORS["penny-ward"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/favicon.ico` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  isBasedOn: { "@type": "Legislation", name: "Fair Work Act 2009", url: "https://www.legislation.gov.au/Details/C2024C00301" },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is an award in Australia?", acceptedAnswer: { "@type": "Answer", text: "A modern award is a legally binding document issued by the Fair Work Commission that sets the minimum pay rates, penalty rates, allowances, overtime, and leave entitlements for employees in a specific industry or occupation. More than 120 modern awards cover approximately 2.9 million Australian workers." } },
    { "@type": "Question", name: "How often do award rates change?", acceptedAnswer: { "@type": "Answer", text: "Award rates change annually following the Fair Work Commission's Annual Wage Review. The decision is announced each June, and new minimum rates take effect from the first full pay period on or after 1 July. The FY2026-27 increase was 3.75%." } },
    { "@type": "Question", name: "What is the current minimum wage in Australia?", acceptedAnswer: { "@type": "Answer", text: "The national minimum wage for FY2026-27 is $26.44 per hour, or $1,004.90 per week for a standard 38-hour week. Most employees are covered by a modern award with a higher minimum rate (typically $25.44/hr or above for entry-level classifications)." } },
    { "@type": "Question", name: "Do award rates differ by state?", acceptedAnswer: { "@type": "Answer", text: "No. Modern award rates are set federally by the Fair Work Commission and apply uniformly across NSW, VIC, QLD, WA, SA, TAS, ACT and NT for national-system employees. Only state public-sector employees (covered by separate state industrial instruments) see differences." } },
    { "@type": "Question", name: "Are award rates higher than the national minimum wage?", acceptedAnswer: { "@type": "Answer", text: "Yes, in almost every case. The national minimum wage of $26.44/hr is the floor for award-free employees. Award classification rates for specific industries are higher because they recognise qualifications and experience — entry rates start at $25.44/hr or above, and higher classifications reach $30+/hr." } },
    { "@type": "Question", name: "How do I find out which award applies to me?", acceptedAnswer: { "@type": "Answer", text: "Use the Fair Work Ombudsman 'Find My Award' tool at calculate.fairwork.gov.au/FindYourAward. Enter your industry, occupation, and employer type, and the tool identifies your applicable modern award and classification level within 2 minutes." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <AwardRatesGuidePage />
    </>
  );
}
