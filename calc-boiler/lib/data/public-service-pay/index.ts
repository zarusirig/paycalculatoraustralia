// =============================================================================
// Public service pay scales — registry.
//
// Adding a jurisdiction later (NSW, WA, SA, TAS, ACT, NT) is two steps and no
// refactor: write lib/data/public-service-pay/<slug>.ts exporting a
// `Jurisdiction`, register it in JURISDICTIONS below, and delete its entry from
// PLANNED_JURISDICTIONS. generateStaticParams, the hub, the spoke, the lookup
// and the tests all read from these two lists.
// =============================================================================

import { APS } from "./aps";
import { QLD } from "./qld";
import { VIC } from "./vic";
import {
  normaliseCode,
  type ClassificationBand,
  type Jurisdiction,
  type JurisdictionSlug,
  type PaySchedule,
  type PayFaq,
  type PlannedJurisdiction,
} from "./types";

export * from "./types";

/** Jurisdictions with verified data. Order is the order they render in. */
export const JURISDICTIONS: readonly Jurisdiction[] = [APS, VIC, QLD];

/** The slugs `generateStaticParams` builds. Nothing else resolves. */
export const JURISDICTION_SLUGS: readonly JurisdictionSlug[] = JURISDICTIONS.map((j) => j.slug);

/**
 * Services this cluster does not cover yet. They are listed on the hub so the
 * page says what it does not know, rather than implying the six are missing
 * because they do not exist. No figures, and no link unless the URL was checked.
 */
export const PLANNED_JURISDICTIONS: readonly PlannedJurisdiction[] = [
  {
    slug: "nsw",
    name: "NSW Public Service",
    shortName: "NSW",
    authority: "NSW Public Service Commission and the Crown Employees (Public Sector — Salaries) Award",
  },
  {
    slug: "wa",
    name: "WA public sector",
    shortName: "WA",
    authority: "WA Public Sector Commission and the Public Service Award 1992",
  },
  {
    slug: "sa",
    name: "SA public sector",
    shortName: "SA",
    authority: "SA Office of the Commissioner for Public Sector Employment and the SA Public Sector Salaried Employees Interim Award",
  },
  {
    slug: "tas",
    name: "Tasmanian State Service",
    shortName: "TAS",
    authority: "Tasmanian State Service Commissioner and the Tasmanian State Service Award",
  },
  {
    slug: "act",
    name: "ACT Public Service",
    shortName: "ACT",
    authority: "ACT Chief Minister, Treasury and Economic Development Directorate enterprise agreements",
  },
  {
    slug: "nt",
    name: "NT Public Sector",
    shortName: "NT",
    authority: "NT Office of the Commissioner for Public Employment enterprise agreements",
  },
];

/** Look up a built jurisdiction. Returns undefined for planned ones. */
export function getJurisdiction(slug: string): Jurisdiction | undefined {
  return JURISDICTIONS.find((j) => j.slug === slug);
}

export function isBuiltSlug(slug: string): slug is JurisdictionSlug {
  return JURISDICTIONS.some((j) => j.slug === slug);
}

/** Every band in a jurisdiction, flattened across schedules and streams. */
export function allBands(jurisdiction: Jurisdiction): ClassificationBand[] {
  return jurisdiction.schedules.flatMap((schedule) =>
    schedule.streams.flatMap((stream) => stream.bands),
  );
}

export interface BandMatch {
  jurisdiction: Jurisdiction;
  schedule: PaySchedule;
  band: ClassificationBand;
}

/**
 * Find a classification by code or alias — "aps6", "APS 6", "po4", "vps 3.1".
 * Searches the first schedule of each jurisdiction before later ones, so the
 * service-wide schedule wins over an example agency schedule.
 */
export function findBand(query: string, slug?: JurisdictionSlug): BandMatch | undefined {
  const target = normaliseCode(query);
  if (target === "") return undefined;

  const pool = slug ? JURISDICTIONS.filter((j) => j.slug === slug) : JURISDICTIONS;
  for (const jurisdiction of pool) {
    for (const schedule of jurisdiction.schedules) {
      for (const stream of schedule.streams) {
        for (const band of stream.bands) {
          if (normaliseCode(band.code) === target) {
            return { jurisdiction, schedule, band };
          }
          if (band.aliases.some((alias) => normaliseCode(alias) === target)) {
            return { jurisdiction, schedule, band };
          }
        }
      }
    }
  }
  return undefined;
}

/**
 * Bands grouped by their `group` label, preserving order. Value ranges that
 * belong to the same VPS grade come back under one heading; anything without a
 * group gets its own single-entry group keyed by its code.
 */
export function groupBands(
  bands: readonly ClassificationBand[],
): { label: string; bands: ClassificationBand[] }[] {
  const out: { label: string; bands: ClassificationBand[] }[] = [];
  for (const band of bands) {
    const label = band.group ?? band.code;
    const last = out[out.length - 1];
    if (last && last.label === label) last.bands.push(band);
    else out.push({ label, bands: [band] });
  }
  return out;
}

/** The full span of a group of bands: lowest min to highest max. */
export function groupRange(bands: readonly ClassificationBand[]): { min: number; max: number } {
  return {
    min: Math.min(...bands.map((b) => b.min)),
    max: Math.max(...bands.map((b) => b.max)),
  };
}

/**
 * Hub-level questions, shaped from the queries this cluster targets. Kept in the
 * data layer so the server page and the client component read the same array
 * and the FAQPage structured data cannot drift from the visible answers.
 */
export const PUBLIC_SERVICE_PAY_FAQS: readonly PayFaq[] = [
  {
    q: "Is there one public service pay scale in Australia?",
    a: "No. Each service publishes its own, and the federal service does not publish a single scale at all — every APS agency bargains its own enterprise agreement, so an APS 6 salary is a range across agencies rather than one number. Victoria does publish a single table in Schedule C of the Victorian Public Service Enterprise Agreement 2024, and Queensland has an award floor with agency certified agreements sitting at or above it.",
  },
  {
    q: "How do APS levels compare with VPS grades and Queensland AO levels?",
    a: "They are different classification systems and there is no official mapping between them, so we do not publish one. What can be compared is money: the median APS 6 base salary of $108,092 sits near VPS pay point 4.1.4 ($107,681) and Queensland's AO5/2 award rate ($107,721), while the median EL 1 of $135,701 sits between VPS 5.2.4 ($139,100) and Queensland's AO7/2 award rate ($136,837).",
  },
  {
    q: "How often do public service pay rates change?",
    a: "On dates fixed by the relevant agreement. APS agencies moved on the first full pay period after 1 March in 2024, 2025 and 2026; Victorian Public Service rates move on 1 May each year to 2027; Queensland award rates move on 1 September when the state wage case decides. Between those dates, movement within a band comes from increments, not from a service-wide rise.",
  },
  {
    q: "Do public servants get more superannuation?",
    a: "It depends on the service, and the difference is worth real money. The median employer superannuation contribution in the APS was 15.4% of base salary at every classification in 2025, and the Queensland Government contributes 12.75% for employees under 75. The Victorian Public Service agreement sets no above-guarantee rate, so the Superannuation Guarantee applies.",
  },
  {
    q: "Why does the same classification pay different amounts at different agencies?",
    a: "Because pay is bargained at the agency or entity level in both the APS and Queensland. The APSC calls the resulting spread pay fragmentation and has been narrowing it through service-wide bargaining since 2023; around 70 APS agencies made further adjustments of 0.1% to 1% to their minimum and maximum ranges in 2025. In Queensland, an entity's certified agreement can pay above the award but never below it.",
  },
  {
    q: "What does a public service band pay after tax?",
    a: "Every band on the jurisdiction pages links to the nearest take-home page, which shows income tax, the Medicare levy and net pay at that salary. As a worked example, the median APS 6 base salary of $108,092 is the gross figure; superannuation of 15.4% sits on top of it and is not part of take-home pay.",
  },
];
