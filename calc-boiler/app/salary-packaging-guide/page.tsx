import type { Metadata } from "next";
import SalaryPackagingGuidePage from "@/modules/guide/salary-packaging-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/salary-packaging-guide/`;
const TITLE = "Salary Packaging Guide Australia — FBT-Exempt Benefits Beyond Novated Leases";
const DESCRIPTION = "Complete salary packaging guide: meal entertainment, LAFHA, portable devices, and other FBT-exempt items. How salary packaging works for not-for-profit and public hospital employees.";

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
    { "@type": "ListItem", position: 2, name: "Salary Packaging Guide", item: URL },
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
  isBasedOn: { "@type": "Legislation", name: "Fringe Benefits Tax Assessment Act 1986", url: "https://www.legislation.gov.au/Details/C2024C00340" },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is the difference between salary packaging and salary sacrifice?", acceptedAnswer: { "@type": "Answer", text: "Salary packaging and salary sacrifice are often used interchangeably. Technically, salary sacrifice refers to redirecting pre-tax salary into superannuation, while salary packaging is the broader term covering all pre-tax benefits including living expenses, meal entertainment, novated leases, and portable devices." } },
    { "@type": "Question", name: "Who is eligible for the $15,900 FBT-exempt cap?", acceptedAnswer: { "@type": "Answer", text: "Employees of public benevolent institutions (PBIs), health promotion charities, and public and not-for-profit hospitals can salary package everyday living expenses up to $15,900 per FBT year without incurring fringe benefits tax." } },
    { "@type": "Question", name: "Does salary packaging affect my Centrelink payments?", acceptedAnswer: { "@type": "Answer", text: "It can. Services Australia uses adjusted taxable income (ATI) for income testing, which includes reportable fringe benefits amounts (RFBA). The grossed-up RFBA from salary packaging is added back to your taxable income when assessing eligibility for payments like Family Tax Benefit and childcare subsidies." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <SalaryPackagingGuidePage />
    </>
  );
}
