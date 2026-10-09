// Route helpers for the eight holiday-specific pay pages. The app/<slug>/page.tsx
// files are thin wrappers so metadata, JSON-LD and the visible FAQ cannot drift.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";
import { GUIDE_AUTHORSHIP } from "@/lib/authors";
import { PH_HUB_PATH } from "@/lib/data/public-holidays";
import { getSeasonalPage, seasonalPath } from "@/lib/data/public-holidays/seasonal-pages";
import { fitDescription, fitTitle } from "@/lib/seo-title";
import SeasonalHolidayPage from "./seasonal-holiday-page";

const BASE = SITE_CONFIG.baseUrl;

export function seasonalMetadata(slug: string): Metadata {
  const page = getSeasonalPage(slug);
  if (!page) return {};
  const title = fitTitle(...page.titles);
  const description = fitDescription(...page.descriptions);
  const url = `${BASE}${seasonalPath(slug)}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function SeasonalRoute({ slug }: { slug: string }) {
  const page = getSeasonalPage(slug);
  if (!page) notFound();
  const url = `${BASE}${seasonalPath(slug)}`;
  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
      { "@type": "ListItem", position: 2, name: "Public Holiday Pay", item: `${BASE}${PH_HUB_PATH}` },
      { "@type": "ListItem", position: 3, name: page.shortName, item: url },
    ],
  };
  const modified = GUIDE_AUTHORSHIP[page.guideKey]?.lastReviewed;
  const webPage: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name: page.h1,
    url,
    description: fitDescription(...page.descriptions),
    inLanguage: "en-AU",
    ...(modified ? { dateModified: modified } : {}),
    publisher: { "@type": "Organization", name: SITE_CONFIG.name },
  };
  const faq: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({
      "@type": "Question" as const,
      name: f.q,
      acceptedAnswer: { "@type": "Answer" as const, text: f.a },
    })),
  };
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, faq, ORGANIZATION_SCHEMA]} />
      <SeasonalHolidayPage page={page} />
    </>
  );
}
