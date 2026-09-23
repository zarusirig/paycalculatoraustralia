// Route helpers for the F5 emergency-service pay cluster. Each app/ route file
// is a thin wrapper around these so the three occupations cannot drift apart
// in metadata, schema or which states get built.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";
import {
  SERVICE_OCCUPATION_CONFIG,
  entrySalary,
  getServicePay,
  isVerified,
  occupationSummary,
  toIsoDate,
  topSalary,
  verifiedJurisdictions,
  type ServiceOccupation,
  type ServicePayJurisdiction,
} from "@/lib/data/service-pay";
import { serviceHubFaqs } from "@/lib/data/service-pay/hub";
import ServicePayHub, { serviceHubHeading } from "./service-pay-hub";
import ServicePayStatePage, { serviceStateHeading } from "./service-pay-state";

const BASE = SITE_CONFIG.baseUrl;

function faqSchema(faqs: { q: string; a: string }[]): WithContext<FAQPage> | null {
  if (faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question" as const,
      name: f.q,
      acceptedAnswer: { "@type": "Answer" as const, text: f.a },
    })),
  };
}

// ---------------------------------------------------------------------------
// Hub
// ---------------------------------------------------------------------------

function hubDescription(occupation: ServiceOccupation): string {
  const cfg = SERVICE_OCCUPATION_CONFIG[occupation];
  const s = occupationSummary(occupation);
  const codes = verifiedJurisdictions(occupation)
    .map((j) => j.code)
    .join(", ");
  if (!s) return `${cfg.singular} pay in every Australian state, from each state's own agreement.`;
  return `${cfg.singular} salaries by state: entry ${formatAUD(s.lowestEntry.entry)}–${formatAUD(
    s.highestEntry.entry,
  )}, top of scale ${formatAUD(s.lowestTop.top)}–${formatAUD(s.highestTop.top)}. ${codes} pay tables from each agreement, with take-home pay.`;
}

export function serviceHubMetadata(occupation: ServiceOccupation): Metadata {
  const cfg = SERVICE_OCCUPATION_CONFIG[occupation];
  const title = serviceHubHeading(occupation);
  const description = hubDescription(occupation);
  const url = `${BASE}${cfg.hubPath}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function ServiceHubRoute({ occupation }: { occupation: ServiceOccupation }) {
  const cfg = SERVICE_OCCUPATION_CONFIG[occupation];
  const url = `${BASE}${cfg.hubPath}`;
  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
      { "@type": "ListItem", position: 2, name: cfg.hubLabel, item: url },
    ],
  };
  const webPage: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name: serviceHubHeading(occupation),
    url,
    description: hubDescription(occupation),
    inLanguage: "en-AU",
    publisher: { "@type": "Organization", name: SITE_CONFIG.name },
  };
  const faq = faqSchema(serviceHubFaqs(occupation));
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, ...(faq ? [faq] : []), ORGANIZATION_SCHEMA]} />
      <ServicePayHub occupation={occupation} />
    </>
  );
}

// ---------------------------------------------------------------------------
// State pages — built only for verified jurisdictions.
// ---------------------------------------------------------------------------

export function serviceStateParams(occupation: ServiceOccupation) {
  return verifiedJurisdictions(occupation).map((j) => ({ state: j.slug }));
}

function stateDescription(j: ServicePayJurisdiction): string {
  const cfg = SERVICE_OCCUPATION_CONFIG[j.occupation];
  const entry = entrySalary(j);
  const top = topSalary(j);
  return `${j.employer} ${cfg.singular.toLowerCase()} pay: ${formatAUD(entry ?? 0)} at entry to ${formatAUD(
    top ?? 0,
  )} at the top of the scale, plus every classification, from the ${j.agreementName} (rates from ${
    j.ratesEffectiveFrom
  }). Each salary links to its take-home figure.`;
}

function verifiedOrNull(occupation: ServiceOccupation, slug: string): ServicePayJurisdiction | null {
  const j = getServicePay(occupation, slug);
  return j && isVerified(j) ? j : null;
}

export function serviceStateMetadata(occupation: ServiceOccupation, slug: string): Metadata {
  const j = verifiedOrNull(occupation, slug);
  if (!j) return {};
  const cfg = SERVICE_OCCUPATION_CONFIG[occupation];
  const title = serviceStateHeading(j);
  const description = stateDescription(j);
  const url = `${BASE}${cfg.hubPath}${j.slug}/`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function ServiceStateRoute({ occupation, slug }: { occupation: ServiceOccupation; slug: string }) {
  const j = verifiedOrNull(occupation, slug);
  if (!j) notFound();
  const cfg = SERVICE_OCCUPATION_CONFIG[occupation];
  const url = `${BASE}${cfg.hubPath}${j.slug}/`;
  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
      { "@type": "ListItem", position: 2, name: cfg.hubLabel, item: `${BASE}${cfg.hubPath}` },
      { "@type": "ListItem", position: 3, name: `${j.code} ${cfg.salaryNoun}`, item: url },
    ],
  };
  const webPage: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name: serviceStateHeading(j),
    url,
    description: stateDescription(j),
    inLanguage: "en-AU",
    ...(toIsoDate(j.verifiedOn) ? { dateModified: toIsoDate(j.verifiedOn)! } : {}),
    publisher: { "@type": "Organization", name: SITE_CONFIG.name },
  };
  const faq = faqSchema(j.faqs);
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, ...(faq ? [faq] : []), ORGANIZATION_SCHEMA]} />
      <ServicePayStatePage jurisdiction={j} />
    </>
  );
}
