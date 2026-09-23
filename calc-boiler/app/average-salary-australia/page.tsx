import type { Metadata } from "next";
import AverageSalaryAustraliaPage from "@/modules/guide/average-salary-australia";
import { AVERAGE_SALARY_FAQS } from "@/modules/guide/average-salary-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { Article, BreadcrumbList, Dataset, FAQPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import {
  AVERAGE_SALARY_RELEASES,
  AVERAGE_SALARY_VERIFIED_ISO,
  averageSalaryDescription,
  averageSalaryTitle,
} from "@/lib/data/average-salary";
import { pageDatePublished } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/average-salary-australia/`;
// Title and description quote figures computed from the ABS data module, so a
// data refresh updates the SERP snippet with it.
const TITLE = averageSalaryTitle();
const DESCRIPTION = averageSalaryDescription();

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU", modifiedTime: AVERAGE_SALARY_VERIFIED_ISO, images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Average Salary Australia", item: URL },
  ],
};

const article: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  datePublished: pageDatePublished("average-salary-australia"),
  headline: TITLE,
  description: DESCRIPTION,
  dateModified: AVERAGE_SALARY_VERIFIED_ISO,
  inLanguage: "en-AU",
  author: AUTHORS["penny-ward"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  citation: AVERAGE_SALARY_RELEASES.map((r) => r.url),
};

const dataset: WithContext<Dataset> = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "Average and median salary in Australia — by state, industry, age and gender",
  description:
    "Australian average (mean) and median earnings compiled from Australian Bureau of Statistics releases: full-time adult average weekly ordinary time earnings from Average Weekly Earnings (May 2026) nationally and by state, industry, sector and sex; median weekly earnings and percentiles from Employee Earnings (August 2025) by state, industry, age and sex; and full-time quartiles from Employee Earnings and Hours (May 2025). Weekly figures as published, with yearly equivalents (weekly × 52).",
  url: URL,
  inLanguage: "en-AU",
  isAccessibleForFree: true,
  dateModified: AVERAGE_SALARY_VERIFIED_ISO,
  temporalCoverage: "2025-05/2026-05",
  spatialCoverage: { "@type": "Place", name: "Australia" },
  keywords: ["average salary Australia", "median income Australia", "average weekly earnings", "median salary Australia"],
  variableMeasured: ["Average weekly ordinary time earnings", "Median weekly earnings in main job", "Weekly earnings percentiles"],
  creator: { "@type": "Organization", name: SITE_CONFIG.name, url: BASE },
  isBasedOn: AVERAGE_SALARY_RELEASES.map((r) => r.url),
  license: "https://creativecommons.org/licenses/by/4.0/",
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: AVERAGE_SALARY_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, article, dataset, faq]} />
      <AverageSalaryAustraliaPage />
    </>
  );
}

export default withPageEnd(Page, "/average-salary-australia/");
