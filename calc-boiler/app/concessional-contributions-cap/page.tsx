import type { Metadata } from "next";
import ConcessionalContributionsCapPage from "@/modules/guide/concessional-contributions-cap";
import { CONCESSIONAL_CAP_FAQS } from "@/modules/guide/concessional-contributions-cap-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { Article, BreadcrumbList, FAQPage, WebApplication, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG, SUPER_GUARANTEE, formatAUD } from "@/lib/constants";
import { CARRY_FORWARD } from "@/lib/constants/super-contributions";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/concessional-contributions-cap/`;
const FY = SITE_CONFIG.financialYear;
const CAP = formatAUD(SUPER_GUARANTEE.concessionalCap);
const LAST = GUIDE_AUTHORSHIP["concessional-contributions-cap"].lastReviewed;

const TITLE = `Concessional Contributions Cap ${FY}: ${CAP} + Calculator`;
const DESCRIPTION = `The concessional contributions cap is ${CAP} from 1 July 2026. Check your super guarantee and salary sacrifice against it, carry forward unused cap (total super balance under ${formatAUD(CARRY_FORWARD.totalSuperBalanceLimit)}), and see the 15% contributions tax and Division 293.`;

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
    { "@type": "ListItem", position: 2, name: "Superannuation", item: `${BASE}/superannuation-guide/` },
    { "@type": "ListItem", position: 3, name: "Concessional Contributions Cap", item: URL },
  ],
};

const webPage: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: TITLE,
  description: DESCRIPTION,
  url: URL,
  inLanguage: "en-AU",
  publisher: { "@type": "Organization", name: SITE_CONFIG.name },
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Concessional Cap & Salary Sacrifice Calculator",
  description: `Checks employer super guarantee, salary sacrifice and deductible personal contributions against the ${FY} ${CAP} concessional cap, including carry-forward, and shows the tax saved by salary sacrificing.`,
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: LAST,
  inLanguage: "en-AU",
};

const article: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: `Concessional Contributions Cap ${FY}: ${CAP}`,
  description: DESCRIPTION,
  url: URL,
  datePublished: "2026-09-23",
  dateModified: LAST,
  author: AUTHORS["james-harrington"].jsonLd,
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    logo: { "@type": "ImageObject", url: `${BASE}/logo.png` },
  },
  mainEntityOfPage: URL,
  inLanguage: "en-AU",
};

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: CONCESSIONAL_CAP_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, webApp, article, faq]} />
      <ConcessionalContributionsCapPage />
    </>
  );
}
