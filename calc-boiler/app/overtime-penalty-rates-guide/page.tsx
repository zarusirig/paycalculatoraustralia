import type { Metadata } from "next";
import OvertimePenaltyRatesGuidePage from "@/modules/guide/overtime-penalty-rates-guide";
import { JsonLd } from "@/modules/seo/json-ld";
import type { Article, BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";
import { HOSPITALITY_PENALTIES, RETAIL_PENALTIES, RETAIL_RATES } from "@/lib/constants/hospitality-award";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/overtime-penalty-rates-guide/`;

// Derived so the description cannot drift from the tables on the page.
const RETAIL_L1 = RETAIL_RATES.find((r) => r.level === "Level 1")!;

const TITLE = "Penalty Rates Australia — Weekend, Public Holiday & Overtime Loadings";
const DESCRIPTION = `What you must be paid for weekends, public holidays, evenings and overtime. Verified retail, hospitality and SCHADS penalty tables — Saturday ${(RETAIL_PENALTIES.saturday * 100).toFixed(0)}%, Sunday ${(RETAIL_PENALTIES.sunday * 100).toFixed(0)}%, public holidays ${(RETAIL_PENALTIES.publicHoliday * 100).toFixed(0)}%, and casual loadings that add rather than compound. Hospitality evening and night work adds flat cash, not a multiplier.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: "Penalty rate tables by award, casual vs permanent, and how loadings are taxed.", url: URL, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Award Rates", item: `${BASE}/award-rates/` }, { "@type": "ListItem", position: 3, name: "Penalty Rates", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: TITLE, url: URL, description: DESCRIPTION, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq: WithContext<FAQPage> = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
  { "@type": "Question", name: "What are the penalty rates in Australia?", acceptedAnswer: { "@type": "Answer", text: `Penalty rates are set by each modern award. Under the General Retail Industry Award a permanent employee receives ${(RETAIL_PENALTIES.saturday * 100).toFixed(0)}% of the ordinary rate on Saturday, ${(RETAIL_PENALTIES.sunday * 100).toFixed(0)}% on Sunday and ${(RETAIL_PENALTIES.publicHoliday * 100).toFixed(0)}% on a public holiday; casuals receive ${(RETAIL_PENALTIES.casualSaturday * 100).toFixed(0)}%, ${(RETAIL_PENALTIES.casualSunday * 100).toFixed(0)}% and ${(RETAIL_PENALTIES.casualPublicHoliday * 100).toFixed(0)}%. On the level 1 rate of ${formatAUD(RETAIL_L1.hourly, 2)} an hour, Sunday is ${formatAUD(RETAIL_L1.hourly * RETAIL_PENALTIES.sunday, 2)}. Other awards differ, and nursing weekend penalties in particular are higher.` } },
  { "@type": "Question", name: "Are casual penalty rates compounded on top of the casual loading?", acceptedAnswer: { "@type": "Answer", text: `No. Casual penalties are additive, not compounded. Casual Sunday in retail is ${(RETAIL_PENALTIES.casualSunday * 100).toFixed(0)}% of the base rate — the ${(RETAIL_PENALTIES.sunday * 100).toFixed(0)}% Sunday rate plus the 25% casual loading — not ${(RETAIL_PENALTIES.sunday * 100).toFixed(0)}% multiplied by 1.25, which would give ${(RETAIL_PENALTIES.sunday * 125).toFixed(1)}%. Compounding is one of the most common payroll errors.` } },
  { "@type": "Question", name: "How do hospitality evening and night rates work?", acceptedAnswer: { "@type": "Answer", text: `They are flat cash amounts per hour, not multipliers. The Hospitality Industry (General) Award adds ${formatAUD(HOSPITALITY_PENALTIES.eveningPerHour, 2)} an hour for evening work and ${formatAUD(HOSPITALITY_PENALTIES.nightPerHour, 2)} an hour at night on top of the ordinary rate. Guides that print a 1.15x multiplier for hospitality late-night work are wrong. The retail award does use a percentage for evening work after 6pm.` } },
  { "@type": "Question", name: "How is overtime taxed in Australia?", acceptedAnswer: { "@type": "Answer", text: "Overtime and penalty rate income is added to your regular income and taxed at your marginal rate. There is no separate rate for it. Income between $45,001 and $135,000 is taxed at 30% — the 32.5% bracket many guides still quote has not existed since the Stage 3 changes." } },
  { "@type": "Question", name: "Do I get super on overtime pay?", acceptedAnswer: { "@type": "Answer", text: "Generally no. Overtime is not Ordinary Time Earnings and does not attract the 12% superannuation guarantee, though some enterprise agreements include it. Penalty-loaded ordinary hours, unlike overtime, do count as ordinary time earnings and do attract super." } },
  { "@type": "Question", name: "Can penalty rates stack on top of each other?", acceptedAnswer: { "@type": "Answer", text: "Usually not. Most awards pay only the highest applicable penalty where more than one could apply to the same hours. Under SCHADS, weekend rates substitute for shift loadings rather than adding to them, and public holiday pay replaces both." } },
] };

const article: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS[GUIDE_AUTHORSHIP["overtime-penalty-rates-guide"].authorId].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/favicon.ico` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  isBasedOn: { "@type": "Legislation", name: "Fair Work Act 2009", url: "https://www.legislation.gov.au/Details/C2024C00301" },
};

export default function Page() {
  return (<><JsonLd code={[breadcrumb, webPage, article, faq]} /><OvertimePenaltyRatesGuidePage /></>);
}
