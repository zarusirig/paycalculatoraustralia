// Search <title> and meta description for /adf-pay-scales/ and its three
// service pages (23 Oct 2026 intent pass). Metadata only: the WebPage schema
// keeps the route's own titleFor/descriptionFor and hub DESCRIPTION. Every
// figure is read from the PACMAN tables in this folder.
//
// Why (GSC 24 Sep to 21 Oct 2026): "adf pay scales" 1,932 impressions at 5.2
// with a 2.2% click rate under a title that led with "ADF Ranks &";
// "australian army salary" 316 impressions landed on the hub while the Army
// page sat at 7 with a title leading "Army Pay Scales"; the Navy page's top
// query is "australian navy ranks and pay", the Air Force page's "australian
// air force salary".

import { formatAUD } from "../../constants/australian-tax";
import { fitDescription, fitTitle } from "../../seo-title";
import { ADF_PAY_EFFECTIVE, OFFICER_SALARIES, OTHER_RANK_SALARIES, TRAINEE_SALARIES, salaryRange } from "./index";
import type { AdfService } from "./types";

/** "Army", "Navy", "RAAF": the short form searchers pair with "ranks and pay". */
const SHORT: Readonly<Record<AdfService["key"], string>> = { army: "Army", navy: "Navy", airForce: "RAAF" };

function privateRange() {
  return salaryRange(OTHER_RANK_SALARIES.find((t) => t.id === "pte")!);
}

function officerStart(): number {
  return Math.min(...OFFICER_SALARIES.map((t) => salaryRange(t).min));
}

export function adfServiceSearchTitle(s: AdfService): string {
  return fitTitle(
    `Australian ${s.name} Salary 2026 - ${SHORT[s.key]} Ranks and Pay Scales`,
    `Australian ${s.name} Salary 2026 - ${SHORT[s.key]} Pay Scales`,
  );
}

export function adfServiceSearchDescription(s: AdfService): string {
  const pte = OTHER_RANK_SALARIES.find((t) => t.id === "pte")!;
  const r = privateRange();
  const lead = `${s.fullName} salary from ${ADF_PAY_EFFECTIVE}: ${pte.names[s.key]} ${formatAUD(r.min)} to ${formatAUD(r.max)}, officers from ${formatAUD(officerStart())}`;
  return fitDescription(
    `${lead}. Every rank and increment from PACMAN, each job's pay grade and take-home pay.`,
    `${lead}. Every rank and increment from PACMAN, with take-home pay.`,
    `${lead}. Every rank, with take-home pay.`,
  );
}

export const ADF_HUB_SEARCH_TITLE = "ADF Pay Scales 2026: Army, Navy and RAAF Salary by Rank";

export function adfHubSearchDescription(): string {
  const r = privateRange();
  const recruit = TRAINEE_SALARIES[0].salary;
  return fitDescription(
    `ADF pay scales from ${ADF_PAY_EFFECTIVE}: Private ${formatAUD(r.min)} to ${formatAUD(r.max)}, officers from ${formatAUD(officerStart())}, recruits ${formatAUD(recruit)}. Every Army, Navy and RAAF rank and take-home pay.`,
    `ADF pay scales from ${ADF_PAY_EFFECTIVE}: Private ${formatAUD(r.min)} to ${formatAUD(r.max)}, officers from ${formatAUD(officerStart())}, recruits ${formatAUD(recruit)}. Every rank, with take-home pay.`,
  );
}
