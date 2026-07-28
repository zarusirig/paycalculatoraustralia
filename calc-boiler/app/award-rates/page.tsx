import type { Metadata } from "next";
import AwardRatesGuidePage from "@/modules/guide/award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, Article, WithContext } from "schema-dts";
import { SITE_CONFIG, EMPLOYMENT, formatAUD } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";
import { AWR_2026_FLOORS, HOSPITALITY_RATES, RETAIL_RATES } from "@/lib/constants/hospitality-award";
import { SCHADS_SACS } from "@/lib/constants/schads-award";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/award-rates/`;
const TITLE = "Award Rates Australia — Minimum Pay by Industry & Level";
const DESCRIPTION = `Current minimum award pay rates for FY${SITE_CONFIG.financialYear}. Verified classification tables for the SCHADS, hospitality and retail awards, junior rates by age, penalty rates and how to find the award that covers you. National minimum wage ${formatAUD(EMPLOYMENT.minimumWageHourly, 2)}/hr.`;

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
  author: AUTHORS[GUIDE_AUTHORSHIP["award-rates"].authorId].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/favicon.ico` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  isBasedOn: { "@type": "Legislation", name: "Fair Work Act 2009", url: "https://www.legislation.gov.au/Details/C2024C00301" },
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is an award in Australia?", acceptedAnswer: { "@type": "Answer", text: "A modern award is a legally binding document issued by the Fair Work Commission that sets the minimum pay rates, penalty rates, allowances, overtime, and leave entitlements for employees in a specific industry or occupation. More than 120 modern awards cover approximately 2.9 million Australian workers." } },
    { "@type": "Question", name: "How often do award rates change?", acceptedAnswer: { "@type": "Answer", text: `Award rates change annually following the Fair Work Commission's Annual Wage Review. The decision is announced each June, and new minimum rates take effect from the first full pay period on or after 1 July — not universally 1 July. The FY${SITE_CONFIG.financialYear} increase was ${(AWR_2026_FLOORS.increase * 100).toFixed(2)}%, but it was not applied uniformly: it was subject to a floor of ${formatAUD(AWR_2026_FLOORS.ongoingWeekly, 2)} a week, so the lowest classifications in some awards were lifted to that floor rather than escalated by the headline percentage.` } },
    { "@type": "Question", name: "What is the current minimum wage in Australia?", acceptedAnswer: { "@type": "Answer", text: `The national minimum wage for FY${SITE_CONFIG.financialYear} is ${formatAUD(EMPLOYMENT.minimumWageHourly, 2)} per hour, or ${formatAUD(EMPLOYMENT.minimumWageWeekly, 2)} per week for a standard ${EMPLOYMENT.standardWeeklyHours}-hour week. Most employees are covered by a modern award. Entry-level award classifications now sit very close to that floor — hospitality Level 1 is ${formatAUD(HOSPITALITY_RATES[1].hourly, 2)} and retail level 1 is ${formatAUD(RETAIL_RATES[0].hourly, 2)} — with the real difference appearing at higher classifications, up to ${formatAUD(SCHADS_SACS[SCHADS_SACS.length - 1].hourly, 2)} an hour at the top of the SCHADS social and community services stream.` } },
    { "@type": "Question", name: "Do award rates differ by state?", acceptedAnswer: { "@type": "Answer", text: "No. Modern award rates are set federally by the Fair Work Commission and apply uniformly across NSW, VIC, QLD, WA, SA, TAS, ACT and NT for national-system employees. Only state public-sector employees (covered by separate state industrial instruments) see differences." } },
    { "@type": "Question", name: "Are award rates higher than the national minimum wage?", acceptedAnswer: { "@type": "Answer", text: `Usually, though not always at the entry level. The national minimum wage of ${formatAUD(EMPLOYMENT.minimumWageHourly, 2)}/hr is the floor for award-free employees, and because the Annual Wage Review applies a floor to award rates too, several awards now open at almost exactly that figure. The gap appears higher up the classification scale, where rates recognise qualifications and responsibility.` } },
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
