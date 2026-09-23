// Metadata + schema wrapper for the two aviation pages (F5).

import type { Metadata } from "next";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";
import {
  AVIATION_PATHS,
  AVIATION_PAY,
  aviationEntrySalary,
  aviationRatesYear,
  aviationTopSalary,
  type AviationPageSlug,
} from "@/lib/data/aviation-pay";
import { toIsoDate } from "@/lib/data/service-pay";
import AviationPayPageView, { AVIATION_COPY } from "./aviation-pay";
import { fitDescription, fitTitle } from "@/lib/seo-title";

const BASE = SITE_CONFIG.baseUrl;

function description(slug: AviationPageSlug): string {
  const page = AVIATION_PAY[slug];
  const entry = aviationEntrySalary(page);
  const top = aviationTopSalary(page);
  const range = entry !== null && top !== null ? `${formatAUD(entry)} to ${formatAUD(top)}` : "";
  if (slug === "pilot") {
    const base = `Pilot minimum pay under the Air Pilots Award [MA000046]${range ? `: ${range} a year` : ""}, every award salary table, how casual pilots are paid, and take-home pay.`;
    return fitDescription(`${base} Verified ${page.verifiedOn}.`, base);
  }
  return fitDescription(
    `Air traffic controller pay under the Airservices Australia enterprise agreement${range ? `: ${range} a year base` : ""}, trainee pay, scheduled increases and take-home pay. Verified ${page.verifiedOn}.`,
    `Air traffic controller salary in Australia${range ? `: ${range} a year base` : ""} under the Airservices agreement, plus trainee pay, scheduled increases and take-home pay.`,
  );
}

export function aviationMetadata(slug: AviationPageSlug): Metadata {
  const page = AVIATION_PAY[slug];
  const heading = AVIATION_COPY[slug].heading(aviationRatesYear(page));
  // The H1 keeps "ATC Pay Scale"; the <title> shortens it if it won't fit.
  const title = fitTitle(heading, heading.replace(/ ATC Pay Scale$/, " Pay Scale"), heading.replace(/ ATC Pay Scale$/, " Pay"));
  const desc = description(slug);
  const url = `${BASE}${AVIATION_PATHS[slug]}`;
  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: { title, description: desc, url, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU", images: ["/og-image.png"] },
    twitter: { card: "summary_large_image", title, description: desc },
  };
}

export function AviationRoute({ slug }: { slug: AviationPageSlug }) {
  const page = AVIATION_PAY[slug];
  const copy = AVIATION_COPY[slug];
  const url = `${BASE}${AVIATION_PATHS[slug]}`;
  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
      { "@type": "ListItem", position: 2, name: "Pay Rates by Job", item: `${BASE}/job-pay-rates/` },
      { "@type": "ListItem", position: 3, name: copy.crumb, item: url },
    ],
  };
  const iso = toIsoDate(page.verifiedOn);
  const webPage: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name: copy.heading(aviationRatesYear(page)),
    url,
    description: description(slug),
    inLanguage: "en-AU",
    ...(iso ? { dateModified: iso } : {}),
    publisher: { "@type": "Organization", name: SITE_CONFIG.name },
  };
  const faq: WithContext<FAQPage> | null =
    page.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: page.faqs.map((f) => ({
            "@type": "Question" as const,
            name: f.q,
            acceptedAnswer: { "@type": "Answer" as const, text: f.a },
          })),
        }
      : null;
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, ...(faq ? [faq] : []), ORGANIZATION_SCHEMA]} />
      <AviationPayPageView page={page} />
    </>
  );
}
