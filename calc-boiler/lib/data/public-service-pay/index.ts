// =============================================================================
// Public service pay scales — registry.
//
// Adding a jurisdiction is two steps and no refactor: write lib/data/public-service-pay/<slug>.ts exporting a
// `Jurisdiction`, register it in JURISDICTIONS below, and delete its entry from
// PLANNED_JURISDICTIONS. generateStaticParams, the hub, the spoke, the lookup
// and the tests all read from these two lists.
// =============================================================================

import { APS } from "./aps";
import { NSW } from "./nsw";
import { QLD } from "./qld";
import { SA } from "./sa";
import { VIC } from "./vic";
import { WA } from "./wa";
// H2 (24 Sep 2026): Tasmania, ACT and NT built.
import { TAS } from "./tas";
import { ACT } from "./act";
import { NT } from "./nt";
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
export const JURISDICTIONS: readonly Jurisdiction[] = [APS, VIC, QLD, NSW, WA, SA, TAS, ACT, NT];

/** The slugs `generateStaticParams` builds. Nothing else resolves. */
export const JURISDICTION_SLUGS: readonly JurisdictionSlug[] = JURISDICTIONS.map((j) => j.slug);

/**
 * Services this cluster does not cover yet, listed on the hub so the page says
 * what it does not know. Empty since H2 (24 Sep 2026) added TAS, ACT and NT;
 * kept so the hub and tests need no change if a service is ever withdrawn.
 */
export const PLANNED_JURISDICTIONS: readonly PlannedJurisdiction[] = [];

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

// ---------- salary-by-level sections ----------

export interface LevelSection {
  /** Anchor id, e.g. "vps-4", "aps-6", "el-1", "ao5". Unique within the page. */
  id: string;
  /** Short level name as searched, e.g. "VPS 4", "APS 6", "AO5". */
  label: string;
  /** "VPS 4 salary 2026". */
  heading: string;
  /** The bands in this level (two for a VPS grade with value ranges 5.1 and 5.2). */
  bands: ClassificationBand[];
  /** Lowest min to highest max across `bands`. */
  range: { min: number; max: number };
  schedule: PaySchedule;
  /** The same classification in each comparison schedule that has it. */
  compare: { label: string; schedule: PaySchedule; band: ClassificationBand }[];
}

/** "VPS Grade 4" -> "VPS 4"; anything else is returned unchanged. */
export function shortLevelLabel(groupLabel: string): string {
  return groupLabel.replace(/\s+Grade\s+/i, " ").trim();
}

/** "VPS 4" -> "vps-4", "EL 1" -> "el-1", "SES Band 1" -> "ses-band-1", "AO5" -> "ao5". */
export function levelAnchor(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * One section per classification level for the spoke page, built from the
 * schedule the jurisdiction's `levelGuide` names. Every figure comes from that
 * schedule — this only regroups it — so the sections cannot drift from the
 * full tables further down the page. Returns [] when there is no guide.
 */
export function levelSections(jurisdiction: Jurisdiction): LevelSection[] {
  const guide = jurisdiction.levelGuide;
  if (!guide) return [];
  const schedule = jurisdiction.schedules.find((s) => s.id === guide.scheduleId);
  if (!schedule) return [];
  const compareSchedules = (guide.compare ?? [])
    .map((c) => ({ label: c.label, schedule: jurisdiction.schedules.find((s) => s.id === c.scheduleId) }))
    .filter((c): c is { label: string; schedule: PaySchedule } => c.schedule !== undefined);

  const firstStreams = guide.streamIds
    ? guide.streamIds
        .map((id) => schedule.streams.find((s) => s.id === id))
        .filter((s): s is NonNullable<typeof s> => s !== undefined)
    : [...schedule.streams];

  const parts: { schedule: PaySchedule; streams: PaySchedule["streams"][number][] }[] = [
    { schedule, streams: firstStreams },
  ];
  for (const id of guide.extraScheduleIds ?? []) {
    const extra = jurisdiction.schedules.find((s) => s.id === id);
    if (extra) parts.push({ schedule: extra, streams: [...extra.streams] });
  }

  const template = guide.headingTemplate ?? "{label} salary {year}";
  const sections: LevelSection[] = [];
  for (const part of parts) {
    for (const stream of part.streams) {
      for (const group of groupBands(stream.bands)) {
        const label = shortLevelLabel(group.label);
        // Only the first schedule is compared: an extra schedule is a different
        // workforce, not a second rate for the same classification.
        const compare =
          part.schedule === schedule && group.bands.length === 1
            ? compareSchedules.flatMap((c) => {
                const band = c.schedule.streams
                  .flatMap((s) => s.bands)
                  .find((b) => normaliseCode(b.code) === normaliseCode(group.bands[0].code));
                return band ? [{ label: c.label, schedule: c.schedule, band }] : [];
              })
            : [];
        sections.push({
          id: levelAnchor(label),
          label,
          heading: template.replace("{label}", label).replace("{year}", guide.year),
          bands: group.bands,
          range: groupRange(group.bands),
          schedule: part.schedule,
          compare,
        });
      }
    }
  }
  return sections;
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
    a: "They are different classification systems and there is no official mapping between them, so we do not publish one. What can be compared is money: the median APS 6 base salary of $108,092 sits near VPS pay point 4.1.4 ($107,681) and Queensland's AO5/1 award rate from 1 September 2026 ($109,704), while the median EL 1 of $135,701 sits between Queensland's AO6/4 award rate ($134,019) and VPS 5.2.4 ($139,100).",
  },
  {
    q: "How often do public service pay rates change?",
    a: "On dates fixed by the relevant agreement. APS agencies moved on the first full pay period after 1 March in 2024, 2025 and 2026; Victorian Public Service rates move on 1 May each year to 2027; Queensland award rates move on 1 September when the state wage case decides (4.75% from 1 September 2026); NSW Crown Employees rates moved 3% from the first full pay period on or after 1 July 2026; WA rates moved on 13 June 2026; South Australian salaried rates moved from the first full pay period on or after 1 July 2026; Tasmanian State Service rates move from the first full pay period on or after 1 December (2025 and 2026, then 1 September 2027); Northern Territory rates moved 3% on 13 August 2026; and ACT rates last moved on 4 December 2025, with no rise scheduled until a replacement agreement is made. Between those dates, movement within a band comes from increments, not from a service-wide rise.",
  },
  {
    q: "Do public servants get more superannuation?",
    a: "It depends on the service, and the difference is worth real money. The median employer superannuation contribution in the APS was 15.4% of base salary at every classification in 2025, and the Queensland Government contributes 12.75% for employees under 75. The ACT Public Service pays 12.5% from 1 January 2026, plus 1% more if you contribute 3% yourself. The Victorian Public Service and Northern Territory agreements set no above-guarantee rate, so the Superannuation Guarantee applies.",
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
