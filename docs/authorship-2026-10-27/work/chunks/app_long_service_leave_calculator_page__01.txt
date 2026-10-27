import type { Metadata } from "next";
import { LongServiceLeaveHub } from "@/modules/calculator/long-service-leave-content";
// FAQs come from the non-client module: importing a value across a "use client"
// boundary gives a client-reference proxy, not the array.
import { LSL_HUB_FAQS } from "@/modules/calculator/long-service-leave-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { JURISDICTION_CODES, LSL_JURISDICTIONS } from "@/lib/constants/long-service-leave";
import { ORGANIZATION_SCHEMA, calculatorHowTo } from "@/lib/schema";
import { pageDateModified } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/long-service-leave-calculator/`;
const TITLE = "Long Service Leave Calculator Australia - NSW, VIC, QLD & More";
// Meta pass 23 Oct 2026: answer-first description built from the
// jurisdiction table (weeks at the qualifying years, grouped by rule), so the
// snippet answers "how much long service leave do I get" for every state.
// Previous: "Work out your long service leave: weeks accrued, what you can
// take, what's paid out if you resign and the tax on it, with every state and
// territory Act compared."
const LSL_GROUPS = (() => {
  const groups = new Map<string, { weeks: number; years: number; abbrs: string[] }>();
  for (const code of JURISDICTION_CODES) {
    const j = LSL_JURISDICTIONS[code];
    const weeks = Number(j.weeksAtQualifying.toFixed(2));
    const key = `${weeks}|${j.takeAfterYears}`;
    const g = groups.get(key) ?? { weeks, years: j.takeAfterYears, abbrs: [] };
    g.abbrs.push(j.abbr);
    groups.set(key, g);
  }
  const list = (a: string[]) => (a.length > 1 ? `${a.slice(0, -1).join(", ")} and ${a[a.length - 1]}` : a[0]);
  // Longest qualifying period first; "after N years" only when N changes.
  const sorted = [...groups.values()].sort((x, y) => y.years - x.years || x.weeks - y.weeks);
  return sorted.map((g, i) => `${g.weeks} weeks${i > 0 && sorted[i - 1].years === g.years ? "" : ` after ${g.years} years`} in ${list(g.abbrs)}`);
})();
const DESCRIPTION = `Long service leave: ${LSL_GROUPS.join(", ")}. Work out your payout.`;

export const metadata: Metadata = withFeaturedImage({
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
});

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Long Service Leave Calculator", item: URL },
  ],
};

const webApp: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Long Service Leave Calculator",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  creator: { "@type": "Organization", name: SITE_CONFIG.name },
  dateModified: pageDateModified("long-service-leave-calculator"),
  inLanguage: "en-AU",
};

// Built from the same array the on-page accordion renders, so the structured
// data cannot drift from the visible answers.
const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: LSL_HUB_FAQS.map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

const howToSchema = calculatorHowTo({
  name: "How to Use the Long Service Leave Calculator",
  url: URL,
  description:
    "Enter your state, your first day of continuous service and your ordinary weekly pay to see the long service leave you have accrued and what it is worth.",
  steps: [
    {
      name: "Choose your state or territory",
      text: "Long service leave comes from a separate Act in each state and territory, so the qualifying period and accrual rate depend on where you work.",
    },
    {
      name: "Enter your first day of continuous service",
      text: "Use the date you started with this employer, including service carried over if the business changed hands.",
    },
    {
      name: "Enter your ordinary weekly pay",
      text: "Ordinary time only, before tax and excluding overtime. Part-time and casual employees enter their own actual weekly pay.",
    },
    {
      name: "Say whether you are still employed",
      text: "Still employed shows the weeks you can take as leave. Leaving shows what is paid out, and asks why the job ended because the answer changes what is owed.",
    },
    {
      name: "Read the weeks and the payout",
      text: "The calculator shows weeks accrued, weeks takeable, the gross payout at your rate, and the tax the ATO withholds from an unused balance.",
    },
  ],
});

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webApp, faq, ORGANIZATION_SCHEMA, howToSchema]} />
      <LongServiceLeaveHub />
    </>
  );
}

export default withPageEnd(Page, "/long-service-leave-calculator/");
