import type { Metadata } from "next";
import EmployerCostCalculatorPage from "@/modules/guide/employer-cost-calculator";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/employer-cost-calculator/`;
const TITLE = "True Cost of an Employee Calculator Australia";
const DESCRIPTION = "Calculate the true cost of hiring an employee in Australia. Learn about superannuation, payroll tax, workers compensation, and leave provisions loaded onto a base salary.";

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
    { "@type": "ListItem", position: 2, name: "Employer Cost Calculator", item: URL },
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
  isBasedOn: { "@type": "Legislation", name: "Superannuation Guarantee (Administration) Act 1992", url: "https://www.legislation.gov.au/Details/C2024C00199" },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How much does an employee actually cost an employer?", acceptedAnswer: { "@type": "Answer", text: "As a general rule of thumb in Australia, the true cost of a full-time employee is typically 1.3 to 1.4 times their base salary. For a $100,000 salary, the business actually spends closer to $130,000-$140,000 once super, payroll tax, WorkCover, and leave liabilities are factored in." } },
    { "@type": "Question", name: "What is Payroll Tax?", acceptedAnswer: { "@type": "Answer", text: "Payroll tax is a state government tax levied on employers when their total wage bill exceeds a certain threshold (e.g. $1.2M in NSW). It is usually calculated at around 4.5% to 5.5% of the total wages paid." } },
    { "@type": "Question", name: "What are Leave Provisions?", acceptedAnswer: { "@type": "Answer", text: "Leave provisions are an accounting liability. Even though a worker on a $100k salary receives $100k for working 52 weeks, they only actually work 48 weeks (because of 4 weeks annual leave). The employer is paying for 52 weeks of wages but only extracting 48 weeks of productive labour." } },
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <EmployerCostCalculatorPage />
    </>
  );
}
