import type { Metadata } from "next";
import HealthcareWorkerPayPage from "@/modules/guide/healthcare-worker-pay";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, ItemList, WebPage, WithContext } from "schema-dts";
import { faqPageSchema } from "@/lib/faq";
import { HEALTHCARE_FAQS } from "@/modules/guide/healthcare-worker-pay-faqs";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { NURSING_PAY_BY_STATE, NURSING_PAY_STATES, registeredNurseRange } from "@/lib/data/nursing-pay";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/healthcare-worker-pay/`;

// Hub figures are derived from the same verified state data the spoke pages
// render, so the hub's structured data cannot drift from the spokes.
const STATES = NURSING_PAY_STATES.map((slug) => NURSING_PAY_BY_STATE[slug]).filter(
  (s): s is NonNullable<typeof s> => Boolean(s),
);
const ENTRIES = STATES.map((s) => registeredNurseRange(s)!.entry).sort((a, b) => a - b);
const RN_ENTRY_LOW = ENTRIES[0];
const RN_ENTRY_HIGH = ENTRIES[ENTRIES.length - 1];

const TITLE = "Healthcare Worker Pay — Nurses by State, Doctors & Allied Health";
const DESCRIPTION = `Nurse and midwife pay scales for every state and territory, from the agreements: registered nurses start on ${formatAUD(RN_ENTRY_LOW)} to ${formatAUD(
  RN_ENTRY_HIGH,
)}. Plus doctors and allied health.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Healthcare Worker Pay Guide", item: URL },
  ],
};

const webPage: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: TITLE,
  url: URL,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name },
};

/** Makes the eight spokes discoverable as a set, not just as inline anchors. */
const stateList: WithContext<ItemList> = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Nurse and midwife pay by state",
  itemListElement: STATES.map((state, i) => ({
    "@type": "ListItem" as const,
    position: i + 1,
    name: `Nurse and midwife pay in ${state.name}`,
    url: `${BASE}/healthcare-worker-pay/${state.slug}/`,
  })),
};

const faq = faqPageSchema(HEALTHCARE_FAQS);

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, stateList, faq]} />
      <HealthcareWorkerPayPage />
    </>
  );
}
