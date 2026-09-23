// =============================================================================
// A–Z directory of the modern awards this site publishes verified rate tables
// for. Drives the /award-rates/ hub list and each award page's sidebar, so a
// new award page appears everywhere by adding one entry here.
//
// The headline rate is the adult Level 1 (or equivalent first) classification
// in each award — the rate a new adult starter is most likely to be on. It is
// always read from the award's own constants, never typed in here.
// =============================================================================

import { HOSPITALITY_AWARD, HOSPITALITY_RATES, RETAIL_AWARD, RETAIL_RATES } from "./hospitality-award";
import { SCHADS_AWARD, SCHADS_SACS } from "./schads-award";
import { MODERN_AWARDS, findAwardRate } from "./modern-awards";

export interface AwardDirectoryEntry {
  /** A–Z sort key and display name. */
  name: string;
  code: string;
  href: string;
  /** Who the award typically covers, in a few words. */
  covers: string;
  /** The classification the headline rate belongs to. */
  headlineLevel: string;
  headlineHourly: number;
  headlineWeekly: number;
}

function levelOf<T extends { hourly: number; weekly: number }>(rows: readonly T[], pick: (r: T) => boolean, label: string): T {
  const r = rows.find(pick);
  if (!r) throw new Error(`award directory: missing ${label}`);
  return r;
}

const hospitalityL1 = levelOf(HOSPITALITY_RATES, (r) => r.level === "Level 1", "hospitality Level 1");
const retailL1 = levelOf(RETAIL_RATES, (r) => r.level === "Level 1", "retail Level 1");
const schadsL1 = levelOf(SCHADS_SACS, (r) => r.classification === "Level 1 pay point 1", "SCHADS L1 pp1");

const COVERS: Record<string, string> = {
  "fast-food": "Takeaway outlets and food courts",
  pharmacy: "Community pharmacies — assistants, students, interns and pharmacists",
  manufacturing: "Metal, engineering and manufacturing workers and tradespeople",
  security: "Security officers and guards",
  clerks: "Office, administration and call-centre staff",
  // --- T4 awards batch 3 ---
  restaurant: "Restaurants, cafés, reception centres and roadhouses",
  nurses: "Nursing assistants, enrolled and registered nurses",
  "aged-care": "Personal care and support staff in residential aged care",
  "hair-and-beauty": "Hairdressers, barbers and beauty therapists",
  cleaning: "Commercial cleaners and trolley collectors",
  "road-transport": "Truck, forklift and delivery drivers, couriers and loaders",
};

const modern: AwardDirectoryEntry[] = Object.values(MODERN_AWARDS).map((a) => {
  const r = findAwardRate(a, a.entryLevel);
  return {
    name: a.meta.name,
    code: a.meta.code,
    href: a.meta.href,
    covers: COVERS[a.key] ?? "",
    headlineLevel: a.entryLevel,
    headlineHourly: r.hourly,
    headlineWeekly: r.weekly,
  };
});

export const AWARD_DIRECTORY: readonly AwardDirectoryEntry[] = [
  ...modern,
  {
    name: RETAIL_AWARD.name,
    code: RETAIL_AWARD.code,
    href: "/retail-award-rates/",
    covers: "Shops, supermarkets and retail stores",
    headlineLevel: "Level 1",
    headlineHourly: retailL1.hourly,
    headlineWeekly: retailL1.weekly,
  },
  {
    name: HOSPITALITY_AWARD.name,
    code: HOSPITALITY_AWARD.code,
    href: "/hospitality-award-rates/",
    covers: "Cafes, restaurants, pubs, clubs and hotels",
    headlineLevel: "Level 1",
    headlineHourly: hospitalityL1.hourly,
    headlineWeekly: hospitalityL1.weekly,
  },
  {
    name: SCHADS_AWARD.name,
    code: SCHADS_AWARD.code,
    href: "/schads-award-pay-rates/",
    covers: "Social and community services, disability and home care",
    headlineLevel: "SACS Level 1 pay point 1",
    headlineHourly: schadsL1.hourly,
    headlineWeekly: schadsL1.weekly,
  },
].sort((a, b) => a.name.localeCompare(b.name, "en-AU"));
