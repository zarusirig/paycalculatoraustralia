import type { Metadata } from "next";
import HealthcareWorkerPayPage from "@/modules/guide/healthcare-worker-pay";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, ItemList, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { NURSING_PAY_BY_STATE, NURSING_PAY_STATES, registeredNurseRange } from "@/lib/data/nursing-pay";
import { NURSES_AWARD, NURSES_AWARD_GENERAL } from "@/lib/data/nursing-pay/nurses-award-2020";

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
const AWARD_RN1 = NURSES_AWARD_GENERAL.find((s) => s.classification === "Registered nurse — level 1")!;

const TITLE = "Healthcare Worker Pay — Nurse Pay by State, Doctors & Allied Health";
const DESCRIPTION = `Nurse and midwife pay scales for all six states, read from the actual enterprise agreements: registered nurses from ${formatAUD(
  RN_ENTRY_LOW,
)} to ${formatAUD(
  RN_ENTRY_HIGH,
)} at the entry step. Plus what the Nurses Award 2020 really is, shift penalties by state, doctor and allied health rates, and salary packaging for public hospital staff.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
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

/** Makes the six spokes discoverable as a set, not just as inline anchors. */
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

const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much do registered nurses earn in Australia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `It depends on the state, because each public health system has its own agreement and its own classification ladder. Across the six state pay scales published on this site, the entry step for a registered nurse or midwife runs from ${formatAUD(
          RN_ENTRY_LOW,
        )} to ${formatAUD(
          RN_ENTRY_HIGH,
        )}. Those are base rates before shift penalties, which for a nurse on a rotating roster add a substantial amount on top.`,
      },
    },
    {
      "@type": "Question",
      name: "What is the Nurses Award 2020 and does it apply to me?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `The Nurses Award 2020 (MA000034) is the federal modern award for nurses — a legal minimum, not a pay scale. Its registered nurse level 1 pay point 1 rate is ${formatAUD(
          AWARD_RN1.points[0].weekly,
          2,
        )} a week, or ${formatAUD(AWARD_RN1.points[0].hourly, 2)} an hour, from ${
          NURSES_AWARD.generalRatesFrom
        }. If you work in a state public hospital you are almost certainly paid under an enterprise or state agreement that sits well above that floor. The award governs private hospital, GP clinic, aged care and some agency work. It now carries two rate streams: aged care employees are on materially higher minimums than the general stream.`,
      },
    },
    {
      "@type": "Question",
      name: "What penalty rates do nurses receive?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "There is no single national answer. Weekday night shift is +20% in NSW and Queensland, +20.5% in South Australia, +35% in Western Australia, and a flat dollar allowance per shift in Victoria. Weekend ordinary hours are time and a half on Saturday in NSW, Victoria and Queensland and +50% in WA; Sunday is time and three quarters in NSW and Queensland, +75% in WA and time and a half in Victoria. Weekend rates normally replace the shift loading rather than adding to it.",
      },
    },
    {
      "@type": "Question",
      name: "What is salary packaging for healthcare workers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Public hospital employees can salary package up to $15,900 of living expenses free of fringe benefits tax, plus $2,650 for meal entertainment. It does not change your gross pay or your classification — it changes how much of your pay is taxed, and on a nursing salary it is worth several thousand dollars a year in extra take-home pay.",
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, stateList, faq]} />
      <HealthcareWorkerPayPage />
    </>
  );
}
