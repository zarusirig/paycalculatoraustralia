// Search <title> and meta description for the emergency-service pay pages
// (23 Oct 2026 intent pass). Metadata only: the H1, breadcrumb and WebPage
// schema keep serviceStateHeading / the original descriptions in
// modules/guide/service-pay-routes.tsx. Every figure is read from the state
// data, never typed here.
//
// Why (GSC 24 Sep to 21 Oct 2026): police searches name the rank ("nsw police
// salary by rank and pay", "victoria police salary by rank", "queensland
// police ranks and pay"); firefighter searches ask for pay rates ("frnsw pay
// rates 2026", "frv pay rates", "mfs pay rates"); paramedic searches use "pay
// scale" and "award". The old titles used an em dash separator and led the
// description with the employer instead of "{state} police salary".

import { formatAUD } from "../../constants/australian-tax";
import { fitDescription, fitTitle } from "../../seo-title";
import {
  SERVICE_OCCUPATION_CONFIG,
  entrySalary,
  occupationSummary,
  ratesYear,
  topSalary,
  verifiedJurisdictions,
  type ServiceOccupation,
  type ServicePayJurisdiction,
} from "./index";

const TITLE_SUFFIX: Readonly<Record<ServiceOccupation, string>> = {
  police: "Pay by Rank",
  firefighter: "Pay Rates",
  paramedic: "Pay Scale",
  "prison-officer": "Pay Scale",
};

/** What one row of the scale is called in the description. */
const ROW_WORD: Readonly<Record<ServiceOccupation, string>> = {
  police: "rank",
  firefighter: "rank",
  paramedic: "classification",
  "prison-officer": "classification",
};

/** Hub title noun: "Police Pay by State", not "Police officer Pay by State". */
const HUB_NOUN: Readonly<Record<ServiceOccupation, string>> = {
  police: "Police",
  firefighter: "Firefighter",
  paramedic: "Paramedic",
  "prison-officer": "Prison Officer",
};

export function serviceStateSearchTitle(j: ServicePayJurisdiction): string {
  const cfg = SERVICE_OCCUPATION_CONFIG[j.occupation];
  const head = `${j.code} ${cfg.salaryNoun} ${ratesYear(j)}`;
  const suffix = TITLE_SUFFIX[j.occupation];
  return fitTitle(`${head} - ${j.employer} ${suffix}`, `${head} - ${j.employer}`, `${head} - ${suffix}`);
}

export function serviceStateSearchDescription(j: ServicePayJurisdiction): string {
  const cfg = SERVICE_OCCUPATION_CONFIG[j.occupation];
  const head = `${j.code} ${cfg.salaryNoun.toLowerCase()} ${ratesYear(j)}`;
  // Police topSalary is the top of the constable ranks (sergeant and above sit higher).
  const scale = j.occupation === "police" ? "the constable scale" : "the scale";
  const span = `${formatAUD(entrySalary(j) ?? 0)} at entry to ${formatAUD(topSalary(j) ?? 0)} at the top of ${scale}`;
  const row = ROW_WORD[j.occupation];
  return fitDescription(
    `${head}: ${span}, rates from ${j.ratesEffectiveFrom}. Every ${row} at ${j.employer}, with take-home pay.`,
    `${head}: ${span}, rates from ${j.ratesEffectiveFrom}. Every ${row}, with take-home pay.`,
    // ratesEffectiveFrom can carry a long caveat in brackets: drop it rather than cut it.
    `${head}: ${span}. Every ${row} at ${j.employer}, with take-home pay.`,
    `${head}: ${span}. Every ${row}, with take-home pay.`,
  );
}

export function serviceHubSearchTitle(occupation: ServiceOccupation): string {
  const cfg = SERVICE_OCCUPATION_CONFIG[occupation];
  const year = occupationSummary(occupation)?.year ?? "2026";
  const full = `${cfg.salaryNoun} Australia ${year} - ${HUB_NOUN[occupation]} Pay by State`;
  return full.length <= 60 ? full : fitTitle(`${cfg.salaryNoun} Australia ${year} - Pay by State`, full);
}

export function serviceHubSearchDescription(occupation: ServiceOccupation): string {
  const cfg = SERVICE_OCCUPATION_CONFIG[occupation];
  const s = occupationSummary(occupation);
  if (!s) return `${cfg.singular} pay in every Australian state, from each state's own agreement.`;
  const codes = verifiedJurisdictions(occupation)
    .map((j) => j.code)
    .join(", ");
  const noun = cfg.salaryNoun.toLowerCase();
  const lead = `${noun.charAt(0).toUpperCase()}${noun.slice(1)} in Australia: ${formatAUD(s.lowestEntry.entry)} to ${formatAUD(
    s.highestEntry.entry,
  )} at entry and ${formatAUD(s.lowestTop.top)} to ${formatAUD(s.highestTop.top)} at the top of the scale.`;
  return fitDescription(
    `${lead} ${codes} pay tables with take-home pay.`,
    `${lead} Pay tables for every state, with take-home pay.`,
  );
}
