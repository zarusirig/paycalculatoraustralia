import type { Metadata } from "next";
import SalaryPackagingGuidePage from "@/modules/guide/salary-packaging-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG, formatAUD, formatPercent } from "@/lib/constants";
import { FBT, FBT_CAPS, capFaceValue, reportableFringeBenefitsAmount } from "@/lib/constants/novated-lease";
import { AUTHORS } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/salary-packaging-guide/`;
const TITLE = "Salary Packaging Guide Australia — FBT-Exempt Benefits";
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
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  isBasedOn: { "@type": "Legislation", name: "Fringe Benefits Tax Assessment Act 1986", url: "https://www.legislation.gov.au/Details/C2024C00340" },
};

const PBI_CAP = FBT_CAPS.pbiAndHealthPromotionCharity;
const HOSPITAL_CAP = FBT_CAPS.hospitalAndAmbulance;
const ENT_CAP = FBT_CAPS.salaryPackagedEntertainment;
const PBI_RFBA = reportableFringeBenefitsAmount(capFaceValue(PBI_CAP));

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is the difference between salary packaging and salary sacrifice?", acceptedAnswer: { "@type": "Answer", text: "Salary packaging and salary sacrifice are often used interchangeably. Technically, salary sacrifice refers to redirecting pre-tax salary into superannuation, while salary packaging is the broader term covering all pre-tax benefits including living expenses, meal entertainment, novated leases, and portable devices." } },
    { "@type": "Question", name: "Who can package living expenses free of FBT, and how much?", acceptedAnswer: { "@type": "Answer", text: `Employees of public benevolent institutions (PBIs) and health promotion charities have a ${formatAUD(PBI_CAP)} grossed-up FBT exemption cap per FBT year, about ${formatAUD(capFaceValue(PBI_CAP))} of rent, mortgage or other GST-free expenses. Employees of public and not-for-profit hospitals and public ambulance services have a ${formatAUD(HOSPITAL_CAP)} grossed-up cap, about ${formatAUD(capFaceValue(HOSPITAL_CAP))}. Both can add a separate ${formatAUD(ENT_CAP)} grossed-up cap (about ${formatAUD(capFaceValue(ENT_CAP))} face value) for salary-packaged meal entertainment and entertainment facility leasing. The caps are not pro-rated for part-year employment.` } },
    { "@type": "Question", name: "Does salary packaging affect my Centrelink payments?", acceptedAnswer: { "@type": "Answer", text: `It can. Services Australia adds your reportable fringe benefits amount (RFBA) to adjusted taxable income for Family Tax Benefit, Child Care Subsidy and Parental Leave Pay. RFBA from a PBI, health promotion charity, public or not-for-profit hospital or public ambulance service is counted at ${formatPercent(1 - FBT.rate, 0)} (1 minus the FBT rate), so a PBI employee's RFBA of about ${formatAUD(PBI_RFBA)} is counted as about ${formatAUD(Math.round(PBI_RFBA * (1 - FBT.rate)))}, roughly the amount packaged.` } },
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
