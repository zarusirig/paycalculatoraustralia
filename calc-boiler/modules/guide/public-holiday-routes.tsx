// Route helpers for the G4 public holiday pay cluster. The app/ route files are
// thin wrappers so metadata, JSON-LD and which states get built cannot drift.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { JsonLd } from "@/modules/seo/json-ld";
import { SITE_CONFIG } from "@/lib/constants";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";
import { GUIDE_AUTHORSHIP } from "@/lib/authors";
import {
  PH_HUB_PATH,
  STATE_PUBLIC_HOLIDAYS,
  getStatePublicHolidays,
  pctLabel,
  publicHolidayRateRange,
  stateFaqs,
  stateHeading,
  statePath,
  statewideDays,
  yearOf,
  type StatePublicHolidays,
} from "@/lib/data/public-holidays";
import { PH_HUB_TITLE, hubFaqs } from "@/lib/data/public-holidays/hub";
import PublicHolidayHub from "./public-holiday-hub";
import PublicHolidayStatePage from "./public-holiday-state";

const BASE = SITE_CONFIG.baseUrl;
const HUB_URL = `${BASE}${PH_HUB_PATH}`;

function faqSchema(faqs: { q: string; a: string }[]): WithContext<FAQPage> {
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

function dateModified(): string | undefined {
  return GUIDE_AUTHORSHIP["public-holiday-pay"]?.lastReviewed;
}

// ---------------------------------------------------------------------------
// Hub
// ---------------------------------------------------------------------------

function hubDescription(): string {
  const r = publicHolidayRateRange();
  return `Public holiday pay rates for 14 modern awards: ${pctLabel(r.permanentMin)}–${pctLabel(r.permanentMax)} for permanent staff, ${pctLabel(
    r.casualMin,
  )}–${pctLabel(r.casualMax)} for casuals. Pay for not working, refusing a shift, substitute days, and a calculator. Dates for every state.`;
}

export function publicHolidayHubMetadata(): Metadata {
  const description = hubDescription();
  return {
    title: PH_HUB_TITLE,
    description,
    alternates: { canonical: HUB_URL },
    openGraph: { title: PH_HUB_TITLE, description, url: HUB_URL, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU", images: ["/og-image.png"] },
    twitter: { card: "summary_large_image", title: PH_HUB_TITLE, description },
  };
}

export function PublicHolidayHubRoute() {
  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
      { "@type": "ListItem", position: 2, name: "Public Holiday Pay", item: HUB_URL },
    ],
  };
  const modified = dateModified();
  const webPage: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${HUB_URL}#webpage`,
    name: PH_HUB_TITLE,
    url: HUB_URL,
    description: hubDescription(),
    inLanguage: "en-AU",
    ...(modified ? { dateModified: modified } : {}),
    publisher: { "@type": "Organization", name: SITE_CONFIG.name },
  };
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, faqSchema(hubFaqs()), ORGANIZATION_SCHEMA]} />
      <PublicHolidayHub />
    </>
  );
}

// ---------------------------------------------------------------------------
// State pages
// ---------------------------------------------------------------------------

export function publicHolidayStateParams() {
  return STATE_PUBLIC_HOLIDAYS.map((s) => ({ state: s.slug }));
}

function stateDescription(s: StatePublicHolidays): string {
  const n26 = statewideDays(yearOf(s, 2026)!).length;
  const n27 = statewideDays(yearOf(s, 2027)!).length;
  const r = publicHolidayRateRange();
  return `All ${n26} ${s.code} public holidays for 2026 and ${n27} for 2027 from the ${s.sources[0].publisher}, plus what you're paid: ${pctLabel(
    r.permanentMin,
  )}–${pctLabel(r.permanentMax)} under the main awards, base pay if you don't work. Public holiday pay calculator included.`;
}

export function publicHolidayStateMetadata(slug: string): Metadata {
  const s = getStatePublicHolidays(slug);
  if (!s) return {};
  const title = stateHeading(s);
  const description = stateDescription(s);
  const url = `${BASE}${statePath(s.slug)}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU", images: ["/og-image.png"] },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function PublicHolidayStateRoute({ slug }: { slug: string }) {
  const s = getStatePublicHolidays(slug);
  if (!s) notFound();
  const url = `${BASE}${statePath(s.slug)}`;
  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
      { "@type": "ListItem", position: 2, name: "Public Holiday Pay", item: HUB_URL },
      { "@type": "ListItem", position: 3, name: `${s.code} Public Holidays`, item: url },
    ],
  };
  const modified = dateModified();
  const webPage: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name: stateHeading(s),
    url,
    description: stateDescription(s),
    inLanguage: "en-AU",
    ...(modified ? { dateModified: modified } : {}),
    publisher: { "@type": "Organization", name: SITE_CONFIG.name },
  };
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, faqSchema(stateFaqs(s)), ORGANIZATION_SCHEMA]} />
      <PublicHolidayStatePage state={s} />
    </>
  );
}
